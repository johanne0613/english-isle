// 這段在做什麼：用 Google AI Studio（Gemini TTS）把課程裡要唸的句子先錄成 mp3，放進 audio 資料夾
// 用法：在 dashboard 分支執行 GEMINI_API_KEY=你的金鑰 node tools/make-audio.js（需要 Node 和 ffmpeg）
// 錄好之後，把 audio 資料夾複製到 main 分支（正式版和測試版共用 main 的 audio）
// 免費方案是限制「每天叫幾次」，所以一次請它唸很多句，錄好再依停頓切開。
// 已經錄好的會跳過，新增課程後再跑一次，只會錄新的句子。金鑰只從環境變數讀，不會寫進任何檔案。
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync, spawnSync } = require('child_process');

const KEY = process.env.GEMINI_API_KEY;
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'audio');
const TMP = path.join(OUT, '.tmp');
const API = 'https://generativelanguage.googleapis.com/v1beta';
const MODELS = (process.env.TTS_MODELS || 'gemini-3.8-flash-tts,gemini-3.1-flash-tts-preview,gemini-2.5-flash-preview-tts').split(',');
const BATCH = Number(process.env.TTS_BATCH || 10);
const GAP_MS = Number(process.env.TTS_GAP_MS || 21000);

// 這段在做什麼：每個角色用哪個聲音、什麼語氣（寫成「導演筆記」，模型才不會把說明唸出來）
const ROLES = {
  teacher: { voice: 'Kore', who: 'Ms. Kore, a friendly American English teacher.', style: 'warm, clear, natural pace, talking to a 10-year-old English learner.' },
  word: { voice: 'Kore', who: 'Ms. Kore, a friendly American English teacher.', style: 'clear and natural, modeling the pronunciation of single words for a 10-year-old learner.' },
  green: { voice: 'Sulafat', who: 'Mrs. Green, a kind neighbor greeting a child in a Halloween costume.', style: 'warm, cheerful and friendly.' },
  bones: { voice: 'Algenib', who: 'Mr. Bones, a playful, curious old grandpa teasing a trick-or-treater.', style: 'playful, a little gravelly, amused.' },
  haunted: { voice: 'Enceladus', who: 'The Haunted House, a spooky voice behind an old door.', style: 'slow, whispery and spooky, but fun and not too scary for children.' },
  // 段考城堡的情境對話
  camp: { voice: 'Puck', who: 'Coach Max, a cheerful leader at an English summer camp.', style: 'upbeat, friendly and clear, welcoming a 10-year-old.' },
  nurse: { voice: 'Achernar', who: 'Nurse Lin, a gentle school nurse.', style: 'calm, kind and caring, speaking slowly to a sick child.' },
  waiter: { voice: 'Iapetus', who: 'A polite restaurant waiter.', style: 'polite, clear and friendly.' },
  grandma: { voice: 'Gacrux', who: 'A loving grandma calling her grandchild on the phone.', style: 'warm, gentle and a little slow.' }
};

function fnv(str) {
  let h = 0x811c9dc5;
  for (const ch of Buffer.from(str, 'utf8')) { h ^= ch; h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
const relOf = c => `audio/${c.role}-${fnv(c.role + '|' + c.text)}.mp3`;
const ff = args => execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args]);
const dur = f => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim());

function prompt(role, lines) {
  const r = ROLES[role] || ROLES.teacher;
  return `# AUDIO PROFILE: ${r.who}
### DIRECTOR'S NOTES
Style: ${r.style}
The transcript has ${lines.length} separate lines. Read each line exactly as written, as its own separate utterance.
After each line, stay completely silent for two full seconds before starting the next line.
Do not read these notes, any numbers, or any labels aloud.
#### TRANSCRIPT
${lines.join('\n')}`;
}

// 這段在做什麼：呼叫 Google。遇到「每分鐘太多次」就等；「今天額度用完」就換下一個模型
let modelIdx = 0;
async function speak(role, lines) {
  const r = ROLES[role] || ROLES.teacher;
  while (modelIdx < MODELS.length) {
    const model = MODELS[modelIdx];
    const res = await fetch(`${API}/models/${model}:generateContent`, {
      method: 'POST', headers: { 'x-goog-api-key': KEY, 'content-type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt(role, lines) }] }],
        generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: r.voice } } } } })
    });
    const j = await res.json().catch(() => ({}));
    if (res.status === 200) {
      const part = (j.candidates?.[0]?.content?.parts || []).find(p => p.inlineData);
      if (!part) throw new Error('沒有拿到聲音：' + JSON.stringify(j).slice(0, 200));
      return { buf: Buffer.from(part.inlineData.data, 'base64'), mime: part.inlineData.mimeType || '', model };
    }
    const quota = (j.error?.details || []).flatMap(d => d.violations || []).map(v => v.quotaId || '').join(',');
    if (res.status === 429 && /PerDay/i.test(quota)) { console.log(`  ${model} 今天額度用完，換下一個模型`); modelIdx++; continue; }
    if (res.status === 429 || res.status >= 500) { console.log(`  太快了（${res.status}），等 30 秒`); await sleep(30000); continue; }
    if (res.status === 404 || res.status === 400) { console.log(`  ${model} 不能用（${res.status}），換下一個`); modelIdx++; continue; }
    throw new Error(`錄音失敗（${res.status}）：` + JSON.stringify(j).slice(0, 300));
  }
  throw Object.assign(new Error('所有模型今天的額度都用完了'), { exhausted: true });
}

// 這段在做什麼：把一整段錄音，依「最長的幾段停頓」切成一句一句
function splitWav(wav, n) {
  const total = dur(wav);
  const log = spawnSync('ffmpeg', ['-hide_banner', '-i', wav, '-af', 'silencedetect=noise=-42dB:d=0.3', '-f', 'null', '-']).stderr.toString();
  const sil = [];
  let start = null;
  for (const line of log.split('\n')) {
    const s = line.match(/silence_start: ([\d.]+)/); if (s) start = Number(s[1]);
    const e = line.match(/silence_end: ([\d.]+)/); if (e && start != null) { sil.push({ a: start, b: Number(e[1]) }); start = null; }
  }
  const inner = sil.filter(x => x.a > 0.05 && x.b < total - 0.05);
  if (inner.length < n - 1) return null;
  const cuts = inner.sort((x, y) => (y.b - y.a) - (x.b - x.a)).slice(0, n - 1).map(x => (x.a + x.b) / 2).sort((x, y) => x - y);
  const bounds = [0, ...cuts, total];
  return bounds.slice(0, -1).map((a, i) => ({ a, b: bounds[i + 1] }));
}
function saveClip(wav, seg, file) {
  ff(['-ss', seg.a.toFixed(3), '-to', seg.b.toFixed(3), '-i', wav,
    '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,apad=pad_dur=0.25',
    '-codec:a', 'libmp3lame', '-b:a', '64k', file]);
}

async function recordBatch(role, items, manifest, manifestPath) {
  const { buf, mime, model } = await speak(role, items.map(c => c.text));
  fs.mkdirSync(TMP, { recursive: true });
  const raw = path.join(TMP, 'batch.raw'), wav = path.join(TMP, 'batch.wav');
  fs.writeFileSync(raw, buf);
  if (/wav/i.test(mime) || buf.slice(0, 4).toString() === 'RIFF') ff(['-i', raw, '-ac', '1', wav]);
  else ff(['-f', 's16le', '-ar', (mime.match(/rate=(\d+)/) || [])[1] || '24000', '-ac', '1', '-i', raw, wav]);
  const segs = splitWav(wav, items.length);
  if (!segs) return { ok: false, model };
  items.forEach((c, i) => {
    const rel = relOf(c);
    saveClip(wav, segs[i], path.join(ROOT, rel));
    const d = dur(path.join(ROOT, rel)), words = c.text.split(/\s+/).length;
    const expect = words * 0.36 + 0.5;
    const flag = d < expect * 0.4 || d > expect * 2.6 ? '  ← 長度怪怪的，請試聽' : '';
    console.log(`    ${d.toFixed(1)}s  ${c.text.slice(0, 60)}${flag}`);
    manifest[c.role + '|' + c.text] = rel;
  });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
  return { ok: true, model };
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  // 這段在做什麼：讀課程檔 lessons.js，拿到所有要唸的句子（不用開瀏覽器）
  if (!fs.existsSync(path.join(ROOT, 'lessons.js'))) { console.error('找不到 lessons.js。請切到 dashboard 分支再執行，錄好再把 audio 資料夾複製到 main。'); process.exit(1); }
  const catalog =vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'lessons.js'), 'utf8') + '\n;speechCatalog();');

  const manifestPath = path.join(OUT, 'manifest.json');
  const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
  const todo = catalog.filter(c => !(manifest[c.role + '|' + c.text] === relOf(c) && fs.existsSync(path.join(ROOT, relOf(c)))));
  const batches = Object.values(todo.reduce((a, c) => { a[c.role] = (a[c.role] || 0) + 1; return a; }, {})).reduce((a, n) => a + Math.ceil(n / BATCH), 0);
  console.log(`共 ${catalog.length} 句，要錄 ${todo.length} 句（大約要叫 Google ${batches} 次）`);
  if (!todo.length) return;
  if (!KEY) { console.error('請先設定 GEMINI_API_KEY'); process.exit(1); }

  // 這段在做什麼：同一個角色的句子分組，一組一次錄
  const queue = [];
  const byRole = {};
  todo.forEach(c => (byRole[c.role] = byRole[c.role] || []).push(c));
  Object.entries(byRole).forEach(([role, list]) => { for (let i = 0; i < list.length; i += BATCH) queue.push({ role, items: list.slice(i, i + BATCH) }); });

  let first = true;
  try {
    while (queue.length) {
      const job = queue.shift();
      if (!first) await sleep(GAP_MS);
      first = false;
      console.log(`[${job.role}] 一次錄 ${job.items.length} 句（剩 ${queue.length} 組）`);
      const r = await recordBatch(job.role, job.items, manifest, manifestPath);
      if (r.ok) { console.log(`  完成（${r.model}）`); continue; }
      if (job.items.length === 1) { console.log('  切不開，跳過這句'); continue; }
      const half = Math.ceil(job.items.length / 2);
      console.log('  停頓不夠清楚、切不開，分成兩半重錄');
      queue.unshift({ role: job.role, items: job.items.slice(half) }, ); queue.unshift({ role: job.role, items: job.items.slice(0, half) });
    }
  } catch (e) {
    console.error('\n停下來了：' + e.message);
    process.exitCode = 2;
  }
  const valid = new Set(catalog.map(c => c.role + '|' + c.text));
  Object.keys(manifest).forEach(k => { if (!valid.has(k)) delete manifest[k]; });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log(`\n已錄好 ${Object.keys(manifest).length} / ${catalog.length} 句`);
})();
