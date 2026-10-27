// 這段在做什麼：用 Google AI Studio（Gemini TTS）把課程裡要唸的句子先錄成 mp3，放進 audio 資料夾
// 用法：在 dashboard 分支執行 GEMINI_API_KEY=你的金鑰 node tools/make-audio.js（需要 Node 和 ffmpeg）
// 錄好之後，把 audio 資料夾複製到 main 分支（正式版和測試版共用 main 的 audio）
// 免費方案是限制「每天叫幾次」，所以一次請它唸很多句，錄好再依停頓切開。
// 已經錄好的會跳過，新增課程後再跑一次，只會錄新的句子。金鑰只從環境變數讀，不會寫進任何檔案。
// Gemini 額度用完時，剩下的句子自動改用微軟 Edge 的免費語音（edge-tts，不用金鑰、沒有每日上限）一句一句錄。
// 只想用 edge-tts：node tools/make-audio.js --edge（安裝：uv tool install edge-tts）
// edge-tts 錄的句子記在 audio/edge.json；下次用 Gemini 金鑰執行時，會自動換成 Gemini 版本（Gemini 的聲音比較自然）。
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
const USE_EDGE = process.argv.includes('--edge');
const EDGE = process.env.EDGE_TTS || 'edge-tts';

// 這段在做什麼：每個角色用哪個聲音、什麼語氣（寫成「導演筆記」，模型才不會把說明唸出來）
// edge 是改用 edge-tts 時的聲音
const ROLES = {
  teacher: { voice: 'Kore', edge: 'en-US-AvaNeural', who: 'Ms. Kore, a friendly American English teacher.', style: 'warm, clear, natural pace, talking to a 10-year-old English learner.' },
  word: { voice: 'Kore', edge: 'en-US-AvaNeural', who: 'Ms. Kore, a friendly American English teacher.', style: 'clear and natural, modeling the pronunciation of single words for a 10-year-old learner.' },
  green: { voice: 'Sulafat', edge: 'en-US-JennyNeural', who: 'Mrs. Green, a kind neighbor greeting a child in a Halloween costume.', style: 'warm, cheerful and friendly.' },
  bones: { voice: 'Algenib', edge: 'en-US-RogerNeural', who: 'Mr. Bones, a playful, curious old grandpa teasing a trick-or-treater.', style: 'playful, a little gravelly, amused.' },
  haunted: { voice: 'Enceladus', edge: 'en-US-GuyNeural', edgeRate: '-20%', edgePitch: '-12Hz', who: 'The Haunted House, a spooky voice behind an old door.', style: 'slow, whispery and spooky, but fun and not too scary for children.' },
  // 段考城堡的情境對話
  camp: { voice: 'Puck', edge: 'en-US-AndrewNeural', who: 'Coach Max, a cheerful leader at an English summer camp.', style: 'upbeat, friendly and clear, welcoming a 10-year-old.' },
  nurse: { voice: 'Achernar', edge: 'en-US-MichelleNeural', edgeRate: '-8%', who: 'Nurse Lin, a gentle school nurse.', style: 'calm, kind and caring, speaking slowly to a sick child.' },
  waiter: { voice: 'Iapetus', edge: 'en-US-BrianNeural', who: 'A polite restaurant waiter.', style: 'polite, clear and friendly.' },
  grandma: { voice: 'Gacrux', edge: 'en-US-AriaNeural', edgeRate: '-12%', edgePitch: '-6Hz', who: 'A loving grandma calling her grandchild on the phone.', style: 'warm, gentle and a little slow.' }
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
function saveClip(wav, seg, file, pre = '') {
  ff(['-ss', seg.a.toFixed(3), '-to', seg.b.toFixed(3), '-i', wav,
    '-af', pre + 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,apad=pad_dur=0.25',
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
    edgeKeys.delete(c.role + '|' + c.text);
  });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
  saveEdgeKeys();
  return { ok: true, model };
}

// 這段在做什麼：用 edge-tts 錄一句（一句一個檔，不用切）
function hasEdge() { try { execFileSync(EDGE, ['--version'], { stdio: 'ignore' }); return true; } catch (e) { return false; } }
const edgePath = path.join(OUT, 'edge.json');
const edgeKeys = new Set(fs.existsSync(edgePath) ? JSON.parse(fs.readFileSync(edgePath, 'utf8')) : []);
function saveEdgeKeys() {
  if (edgeKeys.size) fs.writeFileSync(edgePath, JSON.stringify([...edgeKeys].sort(), null, 1));
  else fs.rmSync(edgePath, { force: true });
}
function recordEdge(c, manifest, manifestPath) {
  const r = ROLES[c.role] || ROLES.teacher;
  fs.mkdirSync(TMP, { recursive: true });
  const tmp = path.join(TMP, 'edge.mp3'), rel = relOf(c);
  execFileSync(EDGE, ['--voice', r.edge || ROLES.teacher.edge, `--rate=${r.edgeRate || '-5%'}`, `--pitch=${r.edgePitch || '+0Hz'}`, '--text', c.text, '--write-media', tmp], { stdio: 'ignore' });
  // edge-tts 比 Gemini 小聲，調到差不多的音量（Gemini 平均約 -17.5 LUFS）
  saveClip(tmp, { a: 0, b: dur(tmp) }, path.join(ROOT, rel), 'loudnorm=I=-17.5:TP=-1.5:LRA=11,aresample=24000,');
  manifest[c.role + '|' + c.text] = rel;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
  edgeKeys.add(c.role + '|' + c.text); saveEdgeKeys();
  console.log(`    ${dur(path.join(ROOT, rel)).toFixed(1)}s  ${c.text.slice(0, 60)}（edge-tts）`);
}
function recordAllEdge(items, manifest, manifestPath) {
  items.forEach(c => { try { recordEdge(c, manifest, manifestPath); } catch (e) { console.log(`  edge-tts 錄不了這句，跳過：${c.text.slice(0, 40)}`); } });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  // 這段在做什麼：讀課程檔 lessons.js 和題庫 bank.js，拿到所有要唸的句子（不用開瀏覽器）
  if (!fs.existsSync(path.join(ROOT, 'lessons.js'))) { console.error('找不到 lessons.js。請切到 dashboard 分支再執行，錄好再把 audio 資料夾複製到 main。'); process.exit(1); }
  const bankFile = path.join(ROOT, 'bank.js');
  const catalog = vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'lessons.js'), 'utf8') + '\n;' + (fs.existsSync(bankFile) ? fs.readFileSync(bankFile, 'utf8') : '') + '\n;speechCatalog();');

  const manifestPath = path.join(OUT, 'manifest.json');
  const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
  const done = c => manifest[c.role + '|' + c.text] === relOf(c) && fs.existsSync(path.join(ROOT, relOf(c)));
  // 用 Gemini 錄的時候，之前 edge-tts 錄的句子也重錄一次
  const todo = catalog.filter(c => !done(c) || (!USE_EDGE && edgeKeys.has(c.role + '|' + c.text)));
  // 一句裡有兩個以上短句（例如 Yes, please. 前面還有一句）會被切錯，所以這種句子單獨錄
  const solo = c => /[.?!]\s+\S/.test(c.text);
  const batches = todo.filter(solo).length + Object.values(todo.filter(c => !solo(c)).reduce((a, c) => { a[c.role] = (a[c.role] || 0) + 1; return a; }, {})).reduce((a, n) => a + Math.ceil(n / BATCH), 0);
  console.log(`共 ${catalog.length} 句，要錄 ${todo.length} 句${USE_EDGE ? '（用 edge-tts）' : `（大約要叫 Google ${batches} 次）`}`);
  if (!todo.length) return;
  if (USE_EDGE) {
    if (!hasEdge()) { console.error('找不到 edge-tts。安裝：uv tool install edge-tts'); process.exit(1); }
    recordAllEdge(todo, manifest, manifestPath);
    fs.rmSync(TMP, { recursive: true, force: true });
    console.log(`\n已錄好 ${catalog.filter(c => manifest[c.role + '|' + c.text]).length} / ${catalog.length} 句`);
    return;
  }
  if (!KEY) { console.error('請先設定 GEMINI_API_KEY，或加 --edge 改用 edge-tts（不用金鑰）'); process.exit(1); }

  // 這段在做什麼：同一個角色的句子分組，一組一次錄
  const queue = [];
  const byRole = {};
  todo.filter(c => !solo(c)).forEach(c => (byRole[c.role] = byRole[c.role] || []).push(c));
  Object.entries(byRole).forEach(([role, list]) => { for (let i = 0; i < list.length; i += BATCH) queue.push({ role, items: list.slice(i, i + BATCH) }); });
  todo.filter(solo).forEach(c => queue.push({ role: c.role, items: [c] }));

  let first = true, job = null;
  try {
    while (queue.length) {
      job = queue.shift();
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
    const rest = [...(job ? job.items : []), ...queue.flatMap(q => q.items)].filter(c => !done(c));
    if (e.exhausted && rest.length && hasEdge()) {
      console.log(`剩下 ${rest.length} 句改用 edge-tts 錄`);
      recordAllEdge(rest, manifest, manifestPath);
    } else process.exitCode = 2;
  }
  const valid = new Set(catalog.map(c => c.role + '|' + c.text));
  Object.keys(manifest).forEach(k => { if (!valid.has(k)) delete manifest[k]; });
  [...edgeKeys].forEach(k => { if (!valid.has(k)) edgeKeys.delete(k); }); saveEdgeKeys();
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log(`\n已錄好 ${Object.keys(manifest).length} / ${catalog.length} 句`);
})();
