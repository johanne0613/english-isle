// 這段在做什麼：用 Google AI Studio（Gemini TTS）把課程裡要唸的句子先錄成 mp3，放進 audio 資料夾
// 用法：GEMINI_API_KEY=你的金鑰 node tools/make-audio.js
// 已經錄好的會跳過，所以新增課程後再跑一次，只會錄新的句子。
// 金鑰只從環境變數讀，不會寫進任何檔案。
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');

const KEY = process.env.GEMINI_API_KEY;
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'audio');
const API = 'https://generativelanguage.googleapis.com/v1beta';

// 這段在做什麼：每個角色用哪個聲音、用什麼語氣唸
const ROLES = {
  teacher: { voice: 'Kore', style: 'Read this aloud clearly and warmly, like a friendly American English teacher talking to a 10-year-old learner, at a natural pace' },
  word: { voice: 'Kore', style: 'Say this English word once, clearly and naturally, the way a teacher models pronunciation' },
  green: { voice: 'Sulafat', style: 'Say this warmly and cheerfully, like a kind neighbor greeting a child in a costume on Halloween night' },
  bones: { voice: 'Algenib', style: 'Say this like a playful, curious old grandpa teasing a trick-or-treater' },
  haunted: { voice: 'Enceladus', style: 'Say this in a slow, spooky, whispery Halloween voice that is fun and not too scary for children' }
};

// 這段在做什麼：檔名用「角色＋句子」算出來的短代碼，句子改了就會重錄
function fnv(str) {
  let h = 0x811c9dc5;
  for (const ch of Buffer.from(str, 'utf8')) { h ^= ch; h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function api(url, body) {
  const res = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: { 'x-goog-api-key': KEY, 'content-type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

// 這段在做什麼：找出目前可以用的 TTS 模型（名字裡有 tts 的）
async function pickModel() {
  if (process.env.TTS_MODEL) return process.env.TTS_MODEL;
  const { status, json } = await api(`${API}/models?pageSize=1000`);
  if (status !== 200) throw new Error('讀不到模型清單：' + JSON.stringify(json).slice(0, 300));
  const names = (json.models || []).map(m => m.name.replace('models/', '')).filter(n => /tts/i.test(n));
  console.log('可用的 TTS 模型：', names.join(', ') || '（沒有）');
  const pick = names.find(n => /flash/.test(n) && !/preview/.test(n)) || names.find(n => /flash/.test(n)) || names[0];
  if (!pick) throw new Error('這把金鑰沒有可用的 TTS 模型');
  return pick;
}

// 這段在做什麼：錄一句。Google 回傳的是原始聲音資料，用 ffmpeg 轉成 mp3、修掉前後空白
async function record(model, role, text, file) {
  const r = ROLES[role] || ROLES.teacher;
  const body = {
    contents: [{ parts: [{ text: `${r.style}: ${text}` }] }],
    generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: r.voice } } } }
  };
  for (let attempt = 1; attempt <= 6; attempt++) {
    const { status, json } = await api(`${API}/models/${model}:generateContent`, body);
    if (status === 200) {
      const part = (json.candidates?.[0]?.content?.parts || []).find(p => p.inlineData);
      if (!part) throw new Error('沒有拿到聲音：' + JSON.stringify(json).slice(0, 200));
      const mime = part.inlineData.mimeType || '';
      const rate = (mime.match(/rate=(\d+)/) || [])[1] || '24000';
      const pcm = file.replace(/\.mp3$/, '.pcm');
      fs.writeFileSync(pcm, Buffer.from(part.inlineData.data, 'base64'));
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 's16le', '-ar', rate, '-ac', '1', '-i', pcm,
        '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,adelay=120',
        '-codec:a', 'libmp3lame', '-b:a', '64k', file]);
      fs.unlinkSync(pcm);
      return;
    }
    if (status === 429 || status >= 500) {
      const retry = JSON.stringify(json).match(/"retryDelay":\s*"(\d+)s"/);
      const wait = retry ? Number(retry[1]) * 1000 + 1000 : 15000 * attempt;
      const daily = /PerDay|per day/i.test(JSON.stringify(json));
      if (daily) throw Object.assign(new Error('今天的免費額度用完了'), { daily: true });
      console.log(`  太快了，等 ${Math.round(wait / 1000)} 秒再試（第 ${attempt} 次）`);
      await sleep(wait);
      continue;
    }
    throw new Error(`錄音失敗（${status}）：` + JSON.stringify(json).slice(0, 300));
  }
  throw new Error('重試太多次，先停下來');
}

(async () => {
  if (!KEY) { console.error('請先設定 GEMINI_API_KEY'); process.exit(1); }
  fs.mkdirSync(OUT, { recursive: true });

  // 這段在做什麼：打開網頁，拿到所有要唸的句子
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.route(/^https?:/, r => r.abort());
  await page.goto('file://' + path.join(ROOT, 'index.html'));
  const catalog = await page.evaluate(() => speechCatalog());
  await browser.close();

  const manifestPath = path.join(OUT, 'manifest.json');
  const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : {};
  const todo = catalog.filter(c => {
    const rel = `audio/${c.role}-${fnv(c.role + '|' + c.text)}.mp3`;
    return !(manifest[c.role + '|' + c.text] === rel && fs.existsSync(path.join(ROOT, rel)));
  });
  console.log(`共 ${catalog.length} 句，要錄 ${todo.length} 句`);
  if (!todo.length) return;

  const model = await pickModel();
  console.log('使用模型：', model);
  let done = 0;
  try {
    for (const c of todo) {
      const rel = `audio/${c.role}-${fnv(c.role + '|' + c.text)}.mp3`;
      process.stdout.write(`[${++done}/${todo.length}] ${c.role}：${c.text.slice(0, 50)}\n`);
      await record(model, c.role, c.text, path.join(ROOT, rel));
      manifest[c.role + '|' + c.text] = rel;
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
      await sleep(Number(process.env.TTS_GAP_MS || 2500));
    }
  } catch (e) {
    console.error('\n停下來了：' + e.message);
    console.error(`已錄好 ${Object.keys(manifest).length} 句，之後再跑一次會接著錄。`);
    process.exitCode = 2;
  }
  // 這段在做什麼：清掉已經不用的舊音檔紀錄
  const valid = new Set(catalog.map(c => c.role + '|' + c.text));
  Object.keys(manifest).forEach(k => { if (!valid.has(k)) delete manifest[k]; });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
})();
