'use strict';

/* 這段在做什麼：評分、能力項目和老師可以標記的問題 */
const RATINGS = [
  { v: 1, zh: '再練練', en: 'Try again' },
  { v: 2, zh: '不錯', en: 'Good' },
  { v: 3, zh: '很棒', en: 'Excellent' }
];
const DIMS = [
  { id: 'vocab', zh: '字彙', en: 'Vocabulary' },
  { id: 'pron', zh: '發音', en: 'Pronunciation' },
  { id: 'grammar', zh: '文法', en: 'Grammar' },
  { id: 'fluency', zh: '流暢與互動', en: 'Fluency' },
  { id: 'ideas', zh: '表達內容', en: 'Ideas' },
  { id: 'listening', zh: '聽力理解', en: 'Listening' },
  { id: 'reading', zh: '閱讀理解', en: 'Reading' }
];
const FLAGS = {
  pron: { zh: '發音', dim: 'pron' },
  grammar: { zh: '文法', dim: 'grammar' },
  word: { zh: '用字', dim: 'vocab' },
  stuck: { zh: '卡住', dim: 'fluency' }
};
const MAT_KINDS = ['影片', '動畫', '繪本', 'Twinkl', '學習單', '遊戲', '其他'];

/* ==========================================================
   這段在做什麼：小工具
   ========================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'value') el.value = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return el;
}
function svg(markup) { const t = document.createElement('template'); t.innerHTML = markup.trim(); return t.content.firstChild; }
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const pad = n => String(n).padStart(2, '0');
const fmtDate = ts => { const d = new Date(ts); return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}（${'日一二三四五六'[d.getDay()]}）`; };
const fmtTime = ts => { const d = new Date(ts); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const fmtClock = ms => { const s = Math.floor((ms || 0) / 1000); return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; };
const fmtMin = ms => Math.max(1, Math.round((ms || 0) / 60000)) + ' 分鐘';
const ymd = () => { const d = new Date(); return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`; };
const clip = (t, n) => (t.length > n ? t.slice(0, n - 1) + '…' : t);

const ICON = {
  candy: '<svg viewBox="0 0 34 22" aria-hidden="true"><path d="M9 11 1 4v14z" fill="currentColor"/><path d="M25 11l8-7v14z" fill="currentColor"/><circle cx="17" cy="11" r="9" fill="currentColor"/><path d="M12 7c3 2 7 6 10 8" stroke="var(--pumpkin-ink)" stroke-width="2" fill="none" opacity=".35"/></svg>',
  mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="2" width="8" height="13" rx="4" fill="currentColor"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
  stop: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>',
  speaker: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" fill="currentColor"/></svg>',
  mark: '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="var(--sea-deep)"/><path d="M6 25c3-9 10-13 16-12 7 1 12 5 12 11-4 5-24 6-28 1z" fill="var(--grass)" stroke="var(--sand)" stroke-width="3"/><circle cx="29" cy="11" r="4" fill="var(--moon)"/></svg>'
};
const candyRow = n => h('span', { class: 'rb-c' }, Array.from({ length: n }, () => svg(ICON.candy)));

/* ==========================================================
   這段在做什麼：把資料存在這台電腦的瀏覽器裡
   （同一台電腦、同一個瀏覽器打開，資料都會在）
   ========================================================== */
/* 這段在做什麼：測試版（網址有 /beta/）的瀏覽器資料跟正式版分開存，音檔共用正式版那一份 */
const IS_BETA = /\/beta\//.test(location.pathname);
const LS_PREFIX = IS_BETA ? 'isle-beta:' : 'isle:';
const ASSET_BASE = IS_BETA ? '../' : '';
const LS = {
  ok: true,
  get(k, d) { try { const v = localStorage.getItem(LS_PREFIX + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  getLive(k, d) { try { const v = localStorage.getItem('isle:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(LS_PREFIX + k, JSON.stringify(v)); return true; } catch (e) { LS.ok = false; return false; } },
  del(k) { try { localStorage.removeItem(LS_PREFIX + k); } catch (e) { /* 忽略 */ } }
};
(function testStorage() { try { localStorage.setItem('isle:test', '1'); localStorage.removeItem('isle:test'); } catch (e) { LS.ok = false; } })();

/* 這段在做什麼：整個 App 目前的狀態 */
const state = {
  mode: 'teacher',                // teacher 老師後台；student 學生用專屬連結打開
  settings: Object.assign({ custom: {}, hidden: {}, shadow: {}, video: {}, slow: false }, LS.get('settings', {})),
  students: [], student: null, view: 'loading', tab: null, error: '',
  session: null, stageIdx: 0, itemIdx: 0,
  practice: null,                 // 學生練習中：{ kind, hwId, title, list: [{stageId, itemId}], idx }
  reportSession: null, drawer: false, lastDone: null, unsubs: [], zoneOpen: 'festival',
  detail: { sid: null, loaded: false, sessions: [], homework: [], practice: [], logs: [] },
  me: { student: null, sessions: [], homework: [], practice: {} }
};
function saveSettings() { LS.set('settings', state.settings); if (state.mode === 'teacher' && Cloud.isTeacher) Cloud.saveConfigSoon(); }
function saveDraft() {
  if (state.view === 'practice') { Practice.saveSoon(); return; }
  if (!state.session) return;
  LS.set('draft:' + state.session.studentId, { session: state.session, stageIdx: state.stageIdx, itemIdx: state.itemIdx });
}
let draftTimer = null;
function saveDraftSoon() { clearTimeout(draftTimer); draftTimer = setTimeout(saveDraft, 600); }

/* ==========================================================
   這段在做什麼：電腦語音（唸題目、示範句）
   ========================================================== */
const TTS = {
  ok: 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined',
  voice: null,
  pick() {
    try {
      const vs = speechSynthesis.getVoices();
      this.voice = vs.find(v => /en[-_]US/i.test(v.lang) && /Google US|Samantha|Aria|Jenny|Ava/i.test(v.name))
        || vs.find(v => /en[-_]US/i.test(v.lang)) || vs.find(v => /^en/i.test(v.lang)) || null;
    } catch (e) { this.voice = null; }
  },
  say(text) {
    if (!this.ok) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text).replace(/_{2,}/g, 'blank'));
      if (!this.voice) this.pick();
      if (this.voice) u.voice = this.voice;
      u.lang = 'en-US';
      u.rate = state.settings.slow ? 0.72 : 0.95;
      speechSynthesis.speak(u);
    } catch (e) { /* 忽略 */ }
  }
};
if (TTS.ok) { try { speechSynthesis.onvoiceschanged = () => TTS.pick(); } catch (e) { /* 忽略 */ } }
/* 這段在做什麼：播放語音。有預錄的 Google 語音（audio 資料夾）就播音檔，沒有才用電腦內建語音 */
const VOICE = {
  manifest: {}, audio: null,
  key: (role, text) => role + '|' + text,
  async load() {
    try { const r = await fetch(ASSET_BASE + 'audio/manifest.json', { cache: 'no-cache' }); if (r.ok) this.manifest = await r.json(); }
    catch (e) { /* 直接打開檔案時讀不到音檔清單，就用電腦語音 */ }
  },
  stop() {
    if (this.audio) { try { this.audio.pause(); } catch (e) { /* 忽略 */ } }
    if (TTS.ok) { try { speechSynthesis.cancel(); } catch (e) { /* 忽略 */ } }
  },
  say(text, role) {
    this.stop();
    const file = this.manifest[this.key(role || 'teacher', text)];
    if (!file) { TTS.say(text); return; }
    const a = this.audio || (this.audio = new Audio());
    a.src = ASSET_BASE + file;
    a.preservesPitch = true;
    a.defaultPlaybackRate = a.playbackRate = state.settings.slow ? 0.8 : 1;
    a.play().catch(() => TTS.say(text));
  }
};
function speakBtn(text, label, role) {
  return h('button', { class: 'btn small', type: 'button', onclick: () => VOICE.say(text, role) }, svg(ICON.speaker), label || '聽');
}
/* 要預錄的句子清單（speechCatalog、audioRole）放在 lessons.js，錄音程式不用開瀏覽器就讀得到 */

/* ==========================================================
   這段在做什麼：語音辨識（學生按麥克風說話，電腦把聲音轉成文字）
   需要 Chrome 和網路。聲音會送到 Google 處理。
   ========================================================== */
const Speech = {
  SR: window.SpeechRecognition || window.webkitSpeechRecognition || null,
  rec: null, owner: null,
  supported() { return !!this.SR; },
  start(opts) {
    this.abort();
    let rec;
    try { rec = new this.SR(); } catch (e) { opts.onError && opts.onError('start-failed'); return false; }
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.maxAlternatives = 5;
    // 一律用連續模式，自己判斷「說完了沒」：學生想一下、停一下也不會被切掉
    rec.continuous = true;
    const finals = [], alts = [];
    let interim = '', ended = false, errorCode = null, heardAt = 0, readyAt = 0, stopping = false;
    const began = Date.now();
    const silenceMs = opts.silenceMs || 1800, waitMs = opts.waitMs || 9000, maxMs = opts.maxMs || 30000;
    const stopNow = () => { if (stopping) return; stopping = true; try { rec.stop(); } catch (e) { /* 忽略 */ } };
    const markReady = () => { if (readyAt) return; readyAt = Date.now(); opts.onReady && opts.onReady(); };
    rec.onaudiostart = markReady; rec.onsoundstart = markReady; rec.onspeechstart = markReady;
    rec.onresult = e => {
      markReady();
      heardAt = Date.now();
      interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) { finals[i] = r[0].transcript; alts[i] = Array.from(r).map(a => a.transcript); }
        else interim += r[0].transcript;
      }
      opts.onInterim && opts.onInterim([...finals.filter(Boolean), interim].join(' ').trim());
    };
    rec.onerror = e => { errorCode = e.error; };
    rec.onend = () => {
      if (ended) return;
      ended = true;
      clearInterval(watch);
      if (this.rec === rec) { this.rec = null; this.owner = null; }
      const text = [...finals.filter(Boolean), interim].join(' ').replace(/\s+/g, ' ').trim();
      if (text) opts.onDone && opts.onDone({ text, alts: alts.filter(Boolean) });
      else if (errorCode !== 'aborted') opts.onError && opts.onError(errorCode || 'no-speech');
      opts.onEnd && opts.onEnd();
    };
    // 這段在做什麼：每 0.25 秒檢查一次——說完停頓夠久、一直沒開口、或講太久，就收音結束
    const watch = setInterval(() => {
      const now = Date.now();
      if (heardAt && now - heardAt > silenceMs) stopNow();
      else if (!heardAt && now - (readyAt || began) > waitMs) stopNow();
      else if (now - began > maxMs) stopNow();
    }, 250);
    try { rec.start(); } catch (e) { clearInterval(watch); opts.onError && opts.onError('start-failed'); return false; }
    this.rec = rec; this.owner = opts.owner || null;
    return true;
  },
  stop() { if (this.rec) { try { this.rec.stop(); } catch (e) { /* 忽略 */ } } },
  abort() { if (this.rec) { const r = this.rec; this.rec = null; this.owner = null; try { r.abort(); } catch (e) { /* 忽略 */ } } }
};
const MIC_ERRORS = {
  'not-allowed': '麥克風被擋住了。點網址列左邊的圖示，把「麥克風」改成允許，再重新整理。',
  'service-not-allowed': '瀏覽器不讓這個檔案用語音辨識。請改用 Chrome 打開。',
  'no-speech': '沒聽到聲音。等按鈕出現「請說話」再開口，說大聲一點。一直這樣的話，回第一頁按「測試麥克風」檢查。',
  'audio-capture': '找不到麥克風。檢查耳機或麥克風有沒有接好。',
  'network': '語音辨識需要網路。檢查網路後再試一次。',
  'language-not-supported': '這個瀏覽器不支援英文辨識，請改用 Chrome。',
  'start-failed': '麥克風啟動失敗。等一秒再按一次。'
};

/* 這段在做什麼：做出一顆麥克風按鈕，說完會把文字交給 onDone */
function micControl({ owner, silenceMs, maxMs, small, label, onDone, onReady, onFinish }) {
  const wrap = h('div', { class: 'mic' });
  const live = h('p', { class: 'live', 'aria-live': 'polite' });
  const err = h('p', { class: 'mic-err', 'aria-live': 'polite' });
  const btn = h('button', { class: 'mic-btn' + (small ? ' sm' : ''), type: 'button', 'data-mic': owner });
  const idleLabel = label || '按我開始說';
  // 這段在做什麼：按鈕三種狀態——平常、準備中（還不能說）、請說話（開始收音）
  const setIdle = () => { btn.classList.remove('on', 'wait'); btn.replaceChildren(h('span', { class: 'mi' }, svg(ICON.mic)), idleLabel); };
  const setWait = () => { btn.classList.remove('on'); btn.classList.add('wait'); btn.replaceChildren(h('span', { class: 'mi' }, svg(ICON.mic)), '準備中，先不要說…'); };
  const setOn = () => { btn.classList.remove('wait'); btn.classList.add('on'); btn.replaceChildren(h('span', { class: 'mi' }, svg(ICON.stop)), small ? '請說話' : '請說話…說完會自動停'); };
  setIdle();
  if (!Speech.supported()) {
    btn.disabled = true;
    err.textContent = '這個瀏覽器不支援語音辨識。請用 Chrome 打開，或由老師直接評分。';
    wrap.append(btn, err);
    return wrap;
  }
  btn.addEventListener('click', () => {
    if (Speech.rec && Speech.owner === owner) { Speech.stop(); return; }
    err.textContent = '';
    live.textContent = '';
    VOICE.stop();
    const ok = Speech.start({
      owner, silenceMs, maxMs,
      onReady: () => { if (btn.isConnected) setOn(); onReady && onReady(); },
      onInterim: t => { live.textContent = t; },
      onDone: r => { live.textContent = ''; onDone(r); },
      onError: code => { err.textContent = MIC_ERRORS[code] || '沒有辨識成功，再按一次試試。'; },
      onEnd: () => { if (btn.isConnected) setIdle(); onFinish && onFinish(); }
    });
    if (ok) setWait();
  });
  wrap.append(btn, live, err);
  return wrap;
}

/* ==========================================================
   這段在做什麼：比對學生說的話，給建議分數
   ========================================================== */
const ONES = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const TENS = ['', '', 'twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
function numWords(n) {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '');
  if (n < 1000) return ONES[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + numWords(n % 100) : '');
  if (n < 10000) return ONES[Math.floor(n / 1000)] + ' thousand' + (n % 1000 ? ' ' + numWords(n % 1000) : '');
  return String(n);
}
function norm(t) {
  return String(t || '').toLowerCase()
    .replace(/(\d),(\d)/g, '$1$2')
    .replace(/\b(\d{1,4})(st|nd|rd|th)?\b/g, (m, d) => numWords(parseInt(d, 10)))
    .replace(/[’‘`]/g, "'").replace(/'/g, '')
    .replace(/[-–—]/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}
const toks = t => { const n = norm(t); return n ? n.split(' ') : []; };
function stem(w) {
  if (w.length > 5 && w.endsWith('ing')) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith('ed')) return w.slice(0, -2);
  if (w.length > 4 && w.endsWith('es')) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith('s')) return w.slice(0, -1);
  return w;
}
function lev(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
function wordMatch(a, b) {
  if (a === b) return true;
  if (a.length < 4 || b.length < 4) return stem(a) === stem(b);
  const x = stem(a), y = stem(b);
  return x === y || 1 - lev(x, y) / Math.max(x.length, y.length) >= 0.8;
}
function hasPhrase(t, phrase) {
  const p = toks(phrase);
  if (!p.length) return false;
  if (p.join('').length >= 6 && t.join('').includes(p.join(''))) return true;
  for (let i = 0; i + p.length <= t.length; i++) {
    if (p.every((w, j) => wordMatch(w, t[i + j]))) return true;
  }
  return false;
}
/* 一個字一個字比（不把字黏起來比），he 才不會被 she 算進去；exact 代表一字不差 */
function hasSeq(t, phrase, exact) {
  const p = toks(phrase);
  for (let i = 0; p.length && i + p.length <= t.length; i++) if (p.every((w, j) => (exact ? w === t[i + j] : wordMatch(w, t[i + j])))) return true;
  return false;
}
const hasExact = (t, phrase) => hasSeq(t, phrase, true);
const findHits = (t, list) => [...new Set(list.filter(w => hasPhrase(t, w)))];
const hasAny = (t, list) => list.some(w => hasPhrase(t, w));
const PAST_IRR = new Set('went wore ate saw had was were made got did came took gave ran found thought told said bought brought began became felt knew left met put sat won wrote heard flew fell drank sang swam threw caught taught kept slept built sent spent lost stood hid held could rode woke'.split(' '));
const NOT_PAST = new Set('need feed seed speed bed red shed weed indeed hundred'.split(' '));
const pastVerbs = t => [...new Set(t.filter(w => PAST_IRR.has(w) || (w.length >= 5 && w.endsWith('ed') && !NOT_PAST.has(w))))];
const BECAUSE = ['because', 'cause', 'so', 'since'];
const FUTURE = ['going to', 'gonna', 'will', 'ill', 'im going'];
const WOULD = ['would', 'id'];

function evalOpen(ex, text) {
  const t = toks(text), wc = t.length, chips = [];
  let pass = 0, total = 0;
  const minW = ex.minWords || 8;
  total++;
  if (wc >= minW) { pass++; chips.push({ ok: true, text: `說了 ${wc} 個字` }); }
  else chips.push({ ok: false, text: `說了 ${wc} 個字，試著說到 ${minW} 個以上` });
  if (ex.keywords) {
    const hits = findHits(t, ex.keywords), need = ex.needHits || 1;
    total++;
    if (hits.length >= need) { pass++; chips.push({ ok: true, text: '提到：' + hits.join('、') }); }
    else if (hits.length) { pass += 0.5; chips.push({ ok: false, text: `提到：${hits.join('、')}（再多說 ${need - hits.length} 個重點）` }); }
    else chips.push({ ok: false, text: '還沒說到重點' });
  }
  if (ex.because) { total++; if (hasAny(t, BECAUSE)) { pass++; chips.push({ ok: true, text: '有說原因（because / so）' }); } else chips.push({ ok: false, text: '加上 because 說原因' }); }
  if (ex.past) { total++; const p = pastVerbs(t); if (p.length) { pass++; chips.push({ ok: true, text: '過去式：' + p.join('、') }); } else chips.push({ ok: false, text: '試著用過去式（went、saw、wore）' }); }
  if (ex.future) { total++; if (hasAny(t, FUTURE)) { pass++; chips.push({ ok: true, text: '用了未來式（going to / will）' }); } else chips.push({ ok: false, text: "試著用 I'm going to …" }); }
  if (ex.would) { total++; if (hasAny(t, WOULD)) { pass++; chips.push({ ok: true, text: '用了 would' }); } else chips.push({ ok: false, text: '試著用 I would …' }); }
  // 這段在做什麼：段考句型——每一組都要說到（groups），常見錯誤要避開（avoid，一字不差才算）
  (ex.groups || []).forEach(g => {
    total++;
    const hit = g.any.filter(p => hasSeq(t, p, g.exact));
    if (hit.length) { pass++; chips.push({ ok: true, text: '說到：' + hit[0] }); }
    else chips.push({ ok: false, text: g.miss || '試著說 ' + g.any[0] });
  });
  (ex.avoid || []).forEach(a => {
    if (a.any.some(p => hasExact(t, p))) { total++; chips.push({ ok: false, text: a.tip }); }
  });
  const ratio = pass / total;
  const rating = wc < Math.min(3, minW) ? 1 : ratio >= 0.99 ? 3 : ratio >= 0.5 ? 2 : 1;
  return { rating, chips, wc };
}
function evalWord(it, text, alts) {
  const targets = [it.word, ...(it.alt || [])];
  const cands = [text, ...(alts || []).flat()];
  const found = cands.some(c => { const t = toks(c); return targets.some(w => hasPhrase(t, w)); });
  const wc = toks(text).length, chips = [];
  chips.push(found ? { ok: true, text: `聽到 ${it.word}` } : { ok: false, text: `沒聽到 ${it.word}，再唸清楚一點` });
  const sentence = wc >= 5;
  chips.push(sentence ? { ok: true, text: `造了一個 ${wc} 個字的句子` } : { ok: false, text: '再用這個字造一個句子' });
  return { rating: found && sentence ? 3 : found ? 2 : 1, chips, wc };
}
function evalShadow(target, text) {
  const words = target.split(/\s+/).filter(Boolean);
  const T = [], owner = [];
  words.forEach((w, i) => toks(w).forEach(tk => { T.push(tk); owner.push(i); }));
  const S = toks(text), n = T.length, m = S.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
    dp[i][j] = wordMatch(T[i], S[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const hit = new Array(n).fill(false);
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (wordMatch(T[i], S[j])) { hit[i] = true; i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++;
  }
  const pct = n ? Math.round(dp[0][0] / n * 100) : 0;
  const diff = words.map((w, wi) => {
    const idx = owner.map((o, k) => (o === wi ? k : -1)).filter(k => k >= 0);
    return { w, hit: idx.length === 0 || idx.every(k => hit[k]) };
  });
  return { rating: pct >= 85 ? 3 : pct >= 60 ? 2 : 1, chips: [{ ok: pct >= 85, text: `跟讀相似度 ${pct}%` }], diff, pct, wc: m };
}
function evalLine(line, text) {
  const t = toks(text), groups = line.expect || [];
  if (!groups.length) return { ratio: t.length >= 2 ? 1 : 0, missing: [] };
  const missing = groups.filter(g => !hasAny(t, g));
  return { ratio: (groups.length - missing.length) / groups.length, missing: missing.map(g => g[0]) };
}
function evalPanel(it, text) {
  const t = toks(text), wc = t.length, hits = findHits(t, it.keywords), p = pastVerbs(t), chips = [];
  let pass = 0;
  if (hits.length >= 2) { pass++; chips.push({ ok: true, text: '用到：' + hits.join('、') }); }
  else chips.push({ ok: false, text: hits.length ? `用到：${hits.join('、')}（再多用一個關鍵字）` : '試著用上面的關鍵字' });
  if (p.length) { pass++; chips.push({ ok: true, text: '過去式：' + p.join('、') }); } else chips.push({ ok: false, text: '故事要用過去式' });
  if (wc >= 8) { pass++; chips.push({ ok: true, text: `說了 ${wc} 個字` }); } else chips.push({ ok: false, text: `說了 ${wc} 個字，再多說一點` });
  return { rating: pass === 3 ? 3 : pass >= 2 ? 2 : 1, chips, wc, hits };
}

/* ==========================================================
   這段在做什麼：取得目前的課、關卡、題目
   ========================================================== */
const kindOf = (st, it) => it.kind || st.kind;
const keyOf = (st, it) => st.id + '__' + it.id;
const lessonOf = s => LESSONS[s.lessonId];
function itemsOf(st, s) {
  if (!st.video || !s || !s.extra || !s.extra.length) return st.items;
  const idx = st.items.findIndex(i => i.id === 'v9');
  const extra = s.extra.map(x => ({ id: x.id, kind: 'shadow', text: x.text, custom: true, skills: ['pron', 'listening'] }));
  return idx < 0 ? [...st.items, ...extra] : [...st.items.slice(0, idx), ...extra, ...st.items.slice(idx)];
}
const inPractice = () => state.view === 'practice';
function refItem(s, ref) {
  const st = lessonOf(s).stages.find(x => x.id === ref.stageId);
  const it = st && itemsOf(st, s).find(x => x.id === ref.itemId);
  return { st, it };
}
function curRef() {
  if (inPractice()) return state.practice.list[state.practice.idx];
  const st = lessonOf(state.session).stages[state.stageIdx];
  return { stageId: st.id, itemId: itemsOf(st, state.session)[state.itemIdx].id };
}
const curStage = () => refItem(state.session, curRef()).st;
const curItem = () => refItem(state.session, curRef()).it;
const curItems = () => inPractice() ? state.practice.list.map(r => refItem(state.session, r).it) : itemsOf(curStage(), state.session);
const curPos = () => inPractice() ? state.practice.idx : state.itemIdx;
const curKey = () => keyOf(curStage(), curItem());
function itemLabel(st, it, idx) {
  const k = kindOf(st, it);
  if (k === 'word') return it.word;
  if (k === 'shadow') return '跟讀：' + clip(it.text, 48);
  if (k === 'dialogue') return '敲門：' + it.who;
  if (k === 'panel') return `故事第 ${idx + 1} 格`;
  if (k === 'catch') return '影片抓單字';
  if (k === 'order') return '句子重組：' + it.zh;
  if (k === 'spell') return '看圖拼字：' + it.zh;
  if (k === 'choice') return it.show ? `${it.tag}：${it.show}` : it.audio ? `${it.tag} 第 ${idx + 1} 題` : `${it.tag}：${clip(it.prompt, 48)}`;
  return clip(it.prompt, 60);
}

/* 這段在做什麼：麥克風測試（音量條＋電腦聽到什麼＋排除問題清單） */
async function startMeter(bar, devLabel, onLevel) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    const an = ctx.createAnalyser(); an.fftSize = 1024;
    ctx.createMediaStreamSource(stream).connect(an);
    const data = new Uint8Array(an.fftSize);
    const track = stream.getAudioTracks()[0];
    devLabel.textContent = '正在使用的麥克風：' + ((track && track.label) || '電腦預設的麥克風');
    let raf = 0;
    const loop = () => {
      an.getByteTimeDomainData(data);
      let sum = 0; for (const v of data) { const x = (v - 128) / 128; sum += x * x; }
      const rms = Math.sqrt(sum / data.length);
      bar.style.width = Math.min(100, rms * 500) + '%';
      onLevel && onLevel(rms);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); stream.getTracks().forEach(t => t.stop()); try { ctx.close(); } catch (e) { /* 忽略 */ } bar.style.width = '0%'; };
  } catch (e) {
    devLabel.textContent = e && e.name === 'NotAllowedError' ? '麥克風權限被拒絕：點網址列左邊的圖示，把麥克風改成允許。'
      : e && e.name === 'NotFoundError' ? '找不到麥克風，檢查有沒有接好。' : '拿不到麥克風：' + ((e && e.message) || '');
    return () => {};
  }
}
function micTestPanel() {
  const bar = h('i');
  const devLabel = h('p', { class: 'muted sm' }, '按下去之後，這裡會顯示正在用哪一支麥克風。');
  const res = h('div', { class: 'mic-test-res', 'aria-live': 'polite' });
  let stopMeter = null, peak = 0;
  const copyBtn = h('button', { class: 'btn small', type: 'button' }, '複製這個網址');
  copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('chrome://settings/content/microphone'); copyBtn.textContent = '已複製，貼到網址列'; }
    catch (e) { copyBtn.textContent = '請手動複製'; }
  });
  return h('div', { class: 'mic-test' },
    h('p', { class: 'label' }, '上課前先測試麥克風'),
    h('p', { class: 'muted sm' }, '按下按鈕，等它變紅、出現「請說話」，再說：I like Halloween because I can eat candy.'),
    micControl({ owner: 'test', silenceMs: 1800, maxMs: 12000, label: '測試麥克風',
      onReady: async () => { peak = 0; res.replaceChildren(); stopMeter = await startMeter(bar, devLabel, v => { if (v > peak) peak = v; }); },
      onFinish: () => {
        if (stopMeter) { stopMeter(); stopMeter = null; }
        if (peak > 0 && peak < 0.015) res.append(h('p', { class: 'mic-err' }, '音量條幾乎沒有動，麥克風收不到聲音。可能是 Chrome 選錯麥克風，請看下面的檢查清單第 3、4 點。'));
      },
      onDone: r => {
        const others = [...new Set((r.alts || []).flat().map(x => x.trim()))].filter(x => x && x.toLowerCase() !== r.text.toLowerCase()).slice(0, 3);
        res.replaceChildren(
          h('p', { class: 'heard' }, '電腦聽到：' + r.text),
          others.length ? h('p', { class: 'alts' }, '其他可能：' + others.join(' / ')) : null);
      } }),
    h('div', { class: 'meter', 'aria-hidden': 'true' }, bar),
    devLabel, res,
    h('details', { class: 'help' },
      h('summary', null, '一直說「沒聽到」或聽錯？照這個順序檢查'),
      h('ol', null,
        h('li', null, '等按鈕變紅、出現「請說話」再開口。太早說，前面幾個字會被切掉。'),
        h('li', null, '說話時看音量條有沒有跳動。有跳代表麥克風正常，只是沒聽清楚：說慢一點、說完整一句。'),
        h('li', null, '音量條不動，代表 Chrome 用錯麥克風。在網址列貼上 ', h('code', null, 'chrome://settings/content/microphone'), '，把最上面的麥克風改成筆電內建的。 ', copyBtn),
        h('li', null, 'Mac：系統設定 → 隱私權與安全性 → 麥克風，打開 Google Chrome，再把 Chrome 整個關掉重開。Windows：設定 → 隱私權 → 麥克風，允許桌面應用程式使用。'),
        h('li', null, '不要用藍牙耳機（像 AirPods）的麥克風，最容易聽錯。用筆電內建或有線耳麥。'),
        h('li', null, '只說一個字最容易聽錯，用完整句子會準很多。'),
        h('li', null, '請用 Google Chrome。Safari、LINE 裡面直接開、Brave 都常常不能用。'))));
}

/* ---------- 島嶼地圖 ---------- */
const ISLAND_SVG = `
<svg viewBox="0 0 1000 620" aria-hidden="true">
  <defs><radialGradient id="moonGlow"><stop offset="0" class="stop-moon" stop-opacity=".45"/><stop offset="1" class="stop-moon" stop-opacity="0"/></radialGradient></defs>
  <rect class="f-sea" width="1000" height="620"/>
  <circle cx="110" cy="92" r="120" fill="url(#moonGlow)"/>
  <circle class="f-moon" cx="110" cy="92" r="36"/>
  <circle class="f-sea" cx="126" cy="80" r="31"/>
  <g class="f-moon" opacity=".75">
    <circle cx="250" cy="58" r="2.2"/><circle cx="330" cy="96" r="1.6"/><circle cx="470" cy="44" r="2"/><circle cx="600" cy="62" r="1.5"/>
    <circle cx="760" cy="40" r="2.2"/><circle cx="880" cy="88" r="1.7"/><circle cx="950" cy="30" r="1.5"/><circle cx="40" cy="200" r="1.6"/>
  </g>
  <g class="s-wave">
    <path d="M50 530q20-12 40 0t40 0"/><path d="M860 560q20-12 40 0t40 0"/><path d="M640 595q20-12 40 0t40 0"/>
    <path d="M60 300q20-12 40 0t40 0"/><path d="M905 170q20-12 40 0t40 0"/><path d="M230 585q20-12 40 0t40 0"/>
  </g>
  <path class="island" d="M170 330C150 220 260 140 400 150C470 100 600 90 690 140C800 130 900 210 880 320C930 400 860 500 740 500C640 560 480 560 380 510C250 520 140 450 170 330Z"/>
  <path class="s-path" d="M240 360Q320 280 400 210M400 210Q540 230 580 320M580 320Q650 240 700 200M580 320Q720 360 838 372M580 320Q480 420 420 480"/>
  <ellipse class="f-lagoon" cx="240" cy="362" rx="58" ry="38"/>
  <g><rect class="f-sandc" x="366" y="214" width="6" height="16"/><circle class="f-tree" cx="369" cy="204" r="20"/>
     <rect class="f-sandc" x="407" y="200" width="6" height="18"/><circle class="f-tree" cx="410" cy="186" r="25"/>
     <rect class="f-sandc" x="442" y="222" width="6" height="14"/><circle class="f-tree" cx="445" cy="212" r="18"/>
     <rect class="f-sandc" x="392" y="240" width="5" height="12"/><circle class="f-tree" cx="395" cy="232" r="15"/></g>
  <path class="f-mtn" d="M610 236L700 104L790 236Z"/><path class="f-snow" d="M676 140L700 104L724 140L712 134L700 146L688 134Z"/>
  <polygon class="f-beam" points="840,318 1000,270 1000,366"/>
  <rect class="f-light" x="832" y="326" width="16" height="56"/><rect class="f-stripe" x="832" y="340" width="16" height="8"/><rect class="f-stripe" x="832" y="360" width="16" height="8"/>
  <polygon class="f-stripe" points="826,327 854,327 840,308"/>
  <circle class="f-sandc" cx="580" cy="320" r="48"/>
  <g><circle class="f-pumpkin" cx="552" cy="300" r="10"/><circle class="f-pumpkin" cx="608" cy="300" r="10"/><circle class="f-pumpkin" cx="580" cy="352" r="10"/>
     <rect class="f-tree" x="550" y="286" width="4" height="6"/><rect class="f-tree" x="606" y="286" width="4" height="6"/><rect class="f-tree" x="578" y="338" width="4" height="6"/></g>
  <rect class="f-sandc" x="412" y="496" width="16" height="68"/>
  <path class="f-light" d="M446 566h56l-10 14h-36z"/><polygon class="f-sandc" points="474,526 474,562 498,562"/>
  <path class="s-path" d="M580 320Q670 380 716 424"/>
  <g><rect class="f-sandc" x="700" y="426" width="40" height="30"/>
     <rect class="f-sandc" x="700" y="420" width="7" height="8"/><rect class="f-sandc" x="716" y="420" width="8" height="8"/><rect class="f-sandc" x="733" y="420" width="7" height="8"/>
     <rect class="f-sandc" x="688" y="412" width="16" height="44"/><rect class="f-sandc" x="736" y="412" width="16" height="44"/>
     <polygon class="f-stripe" points="685,413 707,413 696,394"/><polygon class="f-stripe" points="733,413 755,413 744,394"/>
     <path class="f-sea" d="M713 456v-11a7 7 0 0 1 14 0v11z"/>
     <rect class="f-light" x="719" y="396" width="2" height="26"/><polygon class="f-stripe" points="721,396 734,401 721,406"/></g>
</svg>`;
function islandMap(interactive) {
  const map = h('div', { class: 'map' + (interactive ? '' : ' static'), role: interactive ? null : 'img', 'aria-label': interactive ? null : '英語島地圖' });
  map.append(svg(ISLAND_SVG));
  ZONES.forEach(z => {
    const label = h('span', { class: 'label' }, z.zh, h('small', null, z.name));
    const attrs = { class: 'pin' + (z.open ? ' open' : ''), style: `left:${z.x}%;top:${z.y}%` };
    if (interactive) {
      map.append(h('button', Object.assign(attrs, { type: 'button', 'aria-pressed': String(state.zoneOpen === z.id), onclick: () => openZone(z) }), h('span', { class: 'dot' }), label));
    } else {
      map.append(h('span', attrs, h('span', { class: 'dot' }), label));
    }
  });
  return map;
}
function lessonCard(L) {
  const draft = LS.get('draft:' + state.student.id, null);
  const hasDraft = draft && draft.session && draft.session.lessonId === L.id;
  const done = hasDraft ? Object.keys(draft.session.ratings || {}).length : 0;
  // 這位學生上過這堂課的紀錄（雲端）
  const D = state.detail, mine = D && D.loaded && D.sid === state.student.id ? D.sessions.filter(x => x.lessonId === L.id) : [];
  const weak = mine.length ? computeReport(mine[0]).work.slice(0, 4).map(x => x.label) : [];
  return h('article', { class: 'lesson-card' },
    h('div', null,
      h('p', { class: 'eyebrow' }, `${L.level}・約 ${L.minutes} 分鐘`),
      h('h3', { class: 'lc-title' }, L.title, h('span', null, L.zh)),
      mine.length ? h('p', { class: 'lc-hist' }, `${state.student.name} 上過 ${mine.length} 次・最好 ${Math.max(...mine.map(x => sumOf(x).pct))}%・上次 ${fmtShort(mine[0].startedAt)} ${sumOf(mine[0]).pct}%`)
        : D && D.loaded ? h('p', { class: 'lc-hist muted' }, `${state.student.name} 還沒上過這堂課`) : null,
      weak.length ? h('p', { class: 'record-work' }, h('span', { class: 'tag' }, '上次要加強'), weak.join('、')) : null),
    h('div', { class: 'lc-grid' },
      L.scope ? h('div', null, h('h3', null, '段考範圍'), h('ul', null, L.scope.map(x => h('li', null, x)))) : null,
      h('div', null, h('h3', null, '學習目標'), h('ul', null, L.goals.map(g => h('li', null, g)))),
      h('div', null, h('h3', null, '課程流程'), h('ol', { class: 'flow' }, L.stages.map(st => h('li', null, `${st.zh} ${st.title} `, h('span', null, `${st.minutes} 分`))))),
      h('div', null, h('h3', null, '評量方式'), h('p', null, L.assess)),
      h('div', null, h('h3', null, 'AI 整合點'), h('p', null, L.aiPoint))),
    h('div', { class: 'lc-actions' },
      hasDraft ? h('button', { class: 'btn primary', type: 'button', onclick: () => startLesson(L.id, true) }, `繼續上次的課（已評 ${done} 題）`) : null,
      h('button', { class: hasDraft ? 'btn' : 'btn primary', type: 'button', onclick: () => startLesson(L.id, false) }, hasDraft ? '重新開始' : '開始上課'),
      L.video && L.video.url ? h('a', { class: 'btn ghost', href: L.video.url, target: '_blank', rel: 'noopener noreferrer' }, svg(ICON.play), '先看影片') : null)
  );
}

/* ==========================================================
   這段在做什麼：上課畫面
   ========================================================== */
function newSession(lessonId) {
  return {
    id: 'ses_' + newId(), studentId: state.student.id, studentName: state.student.name, lessonId,
    startedAt: Date.now(), activeMs: 0,
    ratings: {}, manual: {}, bonus: {}, flags: {}, notes: {}, hints: {}, said: {}, evals: {}, caught: {},
    extra: (state.settings.shadow[lessonId] || []).map(x => ({ id: x.id, text: x.text })),
    stats: { attempts: 0, words: 0 }, teacherNote: ''
  };
}
function startLesson(lessonId, resume) {
  const d = LS.get('draft:' + state.student.id, null);
  if (resume && d && d.session && d.session.lessonId === lessonId) {
    state.session = Object.assign(newSession(lessonId), d.session);
    state.stageIdx = d.stageIdx || 0; state.itemIdx = d.itemIdx || 0;
  } else {
    state.session = newSession(lessonId); state.stageIdx = 0; state.itemIdx = 0;
  }
  saveDraft(); go('lesson');
}
function viewLesson() {
  const L = lessonOf(state.session);
  return h('div', null,
    h('div', { class: 'lesson-head' },
      h('div', { class: 'lh-left' },
        h('button', { class: 'btn small ghost', type: 'button', onclick: () => { saveDraft(); go('map'); } }, '← 回島上'),
        h('div', null,
          h('p', { class: 'eyebrow' }, `${state.student.name}・${L.level}`),
          h('h1', { class: 'lesson-title' }, L.title + ' ', h('span', { class: 'zh' }, L.zh)))),
      h('div', { class: 'lh-right' },
        h('div', { class: 'counter', id: 'counter', 'aria-label': '糖果數' }, svg(ICON.candy), h('span', { id: 'candy-n' }, '0')),
        h('span', { class: 'timer', id: 'timer', title: '上課時間' }, '00:00'),
        h('button', { class: 'btn small', type: 'button', id: 'slow-btn', 'aria-pressed': String(!!state.settings.slow), onclick: toggleSlow }, state.settings.slow ? '慢速語音：開' : '慢速語音：關'),
        h('button', { class: 'btn small', type: 'button', onclick: () => { state.drawer = true; paintDrawer(); } }, '教材'),
        confirmBtn('結束課程', '確定結束？產生報告', 'btn small', endLesson))),
    h('nav', { class: 'tabs', id: 'tabs', 'aria-label': '課程關卡' }),
    h('section', { class: 'stage', id: 'stage' }),
    h('section', { class: 'tutor', id: 'tutor', 'aria-label': '老師評分區' }));
}
function toggleSlow() {
  state.settings.slow = !state.settings.slow; saveSettings();
  const b = $('#slow-btn'); if (b) { b.textContent = state.settings.slow ? '慢速語音：開' : '慢速語音：關'; b.setAttribute('aria-pressed', String(state.settings.slow)); }
}
function paintLesson() { paintCounter(false); paintTabs(); paintStage(); paintTutor(); }
function candyTotal(s) {
  return Object.values(s.ratings).reduce((a, b) => a + (b || 0), 0) + Object.values(s.bonus).reduce((a, b) => a + (b || 0), 0);
}
function paintCounter(pop) {
  const n = $('#candy-n'); if (!n) return;
  n.textContent = candyTotal(state.session);
  if (pop) { const c = $('#counter'); c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); }
}
function paintTabs() {
  const el = $('#tabs'); if (!el) return;
  const s = state.session;
  el.replaceChildren(...lessonOf(s).stages.map((st, i) => {
    const its = itemsOf(st, s);
    const done = its.filter(it => s.ratings[keyOf(st, it)]).length;
    return h('button', { class: 'tab' + (done === its.length ? ' done' : ''), type: 'button', 'aria-current': String(i === state.stageIdx),
      onclick: () => { state.stageIdx = i; state.itemIdx = 0; Speech.abort(); saveDraft(); paintTabs(); paintStage(); paintTutor(); } },
      h('span', { class: 'tab-n' }, String(i + 1)),
      h('span', { class: 'tab-t' }, h('b', null, st.zh), h('span', { class: 'prog' }, `${st.title}・${done}/${its.length}`)));
  }));
  const cur = el.children[state.stageIdx]; if (cur) el.scrollLeft = Math.max(0, cur.offsetLeft - el.offsetLeft - 16);
}
function paintDots() {
  const el = $('#dots'); if (!el) return;
  const s = state.session;
  const refs = inPractice() ? state.practice.list : curItems().map(it => ({ stageId: curStage().id, itemId: it.id }));
  el.replaceChildren(...refs.map((ref, i) => {
    const { st, it } = refItem(s, ref), r = s.ratings[keyOf(st, it)] || 0;
    return h('button', { class: 'dotb r' + r, type: 'button', 'aria-current': String(i === curPos()), 'aria-label': `第 ${i + 1} 題`, onclick: () => goItem(i) }, String(i + 1));
  }));
}
function goItem(i) {
  if (inPractice()) state.practice.idx = i; else state.itemIdx = i;
  Speech.abort(); saveDraft(); paintStage(); paintTutor();
}
function paintStage() {
  const st = curStage(), it = curItem(), k = keyOf(st, it), kind = kindOf(st, it);
  const head = h('div', { class: 'stage-head' },
    h('div', null,
      h('p', { class: 'eyebrow' }, inPractice() ? st.title : `Stage ${state.stageIdx + 1}・${st.title}・${st.minutes} min`),
      h('h2', { class: 'stage-title' }, st.zh),
      h('p', { class: 'stage-intro' }, st.intro)),
    h('div', { class: 'dots', id: 'dots' }));
  let body;
  if (kind === 'word') body = renderWord(st, it, k);
  else if (kind === 'catch') body = renderCatch(st, it, k);
  else if (kind === 'shadow') body = renderShadow(st, it, k);
  else if (kind === 'dialogue') body = renderDialogue(st, it, k);
  else if (kind === 'panel') body = renderPanel(st, it, k);
  else if (kind === 'choice') body = renderChoice(st, it, k);
  else if (kind === 'order') body = renderOrder(st, it, k);
  else if (kind === 'spell') body = renderSpell(st, it, k);
  else body = renderQuestion(st, it, k);
  const parts = [head];
  if (st.video && kind !== 'catch') parts.push(videoCard(lessonOf(state.session)));
  parts.push(body);
  $('#stage').replaceChildren(...parts);
  paintDots();
}

/* 這段在做什麼：點了才顯示的提示（點了會記錄「有看提示」） */
function reveal(label, content, k) {
  content.hidden = true;
  const btn = h('button', { class: 'btn small', type: 'button', 'aria-expanded': 'false' }, label);
  btn.addEventListener('click', () => {
    content.hidden = !content.hidden;
    btn.setAttribute('aria-expanded', String(!content.hidden));
    if (!content.hidden && k && !state.session.hints[k]) { state.session.hints[k] = true; saveDraft(); paintTutor(); }
  });
  return { btn, content };
}

/* 這段在做什麼：電腦聽完之後，顯示結果、自動給糖 */
function handleSpeech(k, text, alts, evaluate) {
  const s = state.session;
  const r = evaluate(text, alts);
  s.said[k] = text;
  s.evals[k] = r;
  s.stats.attempts++; s.stats.words += r.wc || 0;
  applyRating(k, r.rating);
}
function applyRating(k, rating) {
  const s = state.session, before = s.ratings[k] || 0;
  if (!s.manual[k]) s.ratings[k] = rating;
  saveDraft();
  if (inPractice()) Practice.onRated(k);
  paintCounter((s.ratings[k] || 0) > before);
  paintTabs(); paintDots(); paintTutor();
  const box = $('#res-' + CSS.escape(k)); if (box) box.replaceWith(resultBox(k));
}
function resultBox(k, opts = {}) {
  const s = state.session, said = s.said[k], ev = s.evals[k];
  const box = h('div', { class: 'result', id: 'res-' + k, hidden: !said && !opts.alwaysShow });
  if (!said || !ev) return box;
  box.append(h('p', { class: 'heard-label' }, '電腦聽到'));
  if (ev.diff) box.append(h('p', { class: 'diff' }, ev.diff.map(d => [h('span', { class: 'w ' + (d.hit ? 'hit' : 'miss') }, d.w), ' '])));
  else box.append(h('p', { class: 'heard' }, said));
  box.append(h('div', { class: 'checks' }, ev.chips.map(c => h('span', { class: 'ck ' + (c.ok ? 'ok' : 'no') }, (c.ok ? '✓ ' : '△ ') + c.text))));
  const r = s.ratings[k] || 0;
  if (r) box.append(h('p', { class: 'earn' }, candyRow(r), r === 3 ? 'Excellent! 拿到 3 顆糖' : r === 2 ? 'Good job! 拿到 2 顆糖' : 'Nice try! 再試一次可以拿更多'));
  return box;
}

/* ---------- 開放題 ---------- */
function renderQuestion(st, it, k) {
  const hint = reveal('看句型提示', h('p', { class: 'hint' }, it.hint), k);
  const main = h('div', null,
    h('p', { class: 'eyebrow' }, `Question ${curPos() + 1} of ${curItems().length}`),
    it.pic ? h('div', { class: 'q-cue' }, h('span', { class: 'q-pic', 'aria-hidden': 'true' }, it.pic), it.cue ? h('span', { class: 'q-cue-t' }, it.cue) : null) : null,
    h('p', { class: 'prompt' }, it.prompt),
    h('div', { class: 'tools' }, speakBtn(it.prompt, '聽題目'), hint.btn),
    hint.content,
    micControl({ owner: k, silenceMs: 3000, maxMs: 45000, onDone: r => handleSpeech(k, r.text, r.alts, t => evalOpen(it.expect || {}, t)) }),
    resultBox(k),
    it.follow && !inPractice() ? h('p', { class: 'follow' }, h('span', { class: 'tag' }, '老師'), it.follow) : null);
  if (!st.scene) return main;
  return h('div', { class: 'two' }, scene(), main);
}
function scene() {
  const items = [['🏚️', 18, 44, 'xl'], ['👻', 22, 38, 's'], ['🕸️', 5, 14, 'm'], ['🦇', 42, 14, 'm'], ['🦇', 54, 24, 's'],
    ['🎃', 34, 74, 'm'], ['🎃', 8, 80, 's'], ['🧙‍♀️', 58, 62, 'l'], ['🧛‍♂️', 72, 62, 'l'], ['🐈‍⬛', 88, 80, 'm'], ['🍬', 64, 86, 's'], ['🌳', 92, 44, 'l']];
  return h('div', { class: 'scene', role: 'img', 'aria-label': '萬聖夜街景：月亮、老房子、南瓜燈、蝙蝠、穿變裝的兩個小孩和一隻黑貓' },
    h('span', { class: 'moon' }), h('span', { class: 'ground' }),
    items.map(([e, x, y, sz]) => h('span', { class: 'se ' + sz, style: `left:${x}%;top:${y}%` }, e)));
}

/* ---------- 單字 ---------- */
function renderWord(st, it, k) {
  const ex = reveal('看例句', h('p', { class: 'hint' }, it.ex, ' ', speakBtn(it.ex, '聽例句')), k);
  const zh = reveal('看中文', h('p', { class: 'zh-gloss' }, it.zh), k);
  return h('div', { class: 'word' },
    h('div', { class: 'word-pic', 'aria-hidden': 'true' }, it.pic),
    h('div', null,
      h('p', { class: 'eyebrow' }, `Word ${curPos() + 1} of ${curItems().length}・${it.pos}`),
      h('h3', { class: 'word-w' }, it.word),
      h('p', { class: 'word-def' }, it.def),
      h('div', { class: 'tools' }, speakBtn(it.word, '聽發音', 'word'), ex.btn, zh.btn),
      ex.content, zh.content,
      h('p', { class: 'task' }, 'Say the word. Then make your own sentence.'),
      micControl({ owner: k, silenceMs: 2000, maxMs: 15000, onDone: r => handleSpeech(k, r.text, r.alts, (t, a) => evalWord(it, t, a)) }),
      resultBox(k)));
}

/* ---------- 影片卡（影片練習每一題上方都會出現） ---------- */
function videoCard(L) {
  return h('div', { class: 'video-card' },
    h('div', null, h('p', { class: 'eyebrow' }, L.video.source), h('b', null, L.video.title)),
    h('div', { class: 'tools', style: 'margin:0' },
      h('a', { class: 'btn primary', href: L.video.url, target: '_blank', rel: 'noopener noreferrer' }, svg(ICON.play), '在新分頁播放影片'),
      inPractice() ? null : h('button', { class: 'btn small ghost', type: 'button', onclick: () => { state.drawer = true; paintDrawer(); } }, '換一支影片')));
}

/* ---------- 抓單字 ---------- */
function renderCatch(st, it, k) {
  const s = state.session;
  const caught = new Set(s.caught[k] || []);
  const status = h('p', { class: 'earn' });
  const paintStatus = () => {
    const r = s.ratings[k] || 0;
    status.replaceChildren(`抓到 ${caught.size} / ${it.words.length} 個字`, r ? candyRow(r) : '');
  };
  const grid = h('div', { class: 'catch' }, it.words.map((w, i) => {
    const b = h('button', { type: 'button', 'aria-pressed': String(caught.has(i)) }, w);
    b.addEventListener('click', () => {
      if (caught.has(i)) caught.delete(i); else caught.add(i);
      b.setAttribute('aria-pressed', String(caught.has(i)));
      s.caught[k] = [...caught];
      const ratio = caught.size / it.words.length;
      s.evals[k] = { rating: ratio >= 0.7 ? 3 : ratio >= 0.4 ? 2 : 1, chips: [{ ok: ratio >= 0.7, text: `抓到 ${caught.size} / ${it.words.length} 個字` }], wc: 0 };
      if (caught.size) applyRating(k, s.evals[k].rating);
      else { if (!s.manual[k]) delete s.ratings[k]; saveDraft(); paintCounter(false); paintTabs(); paintDots(); paintTutor(); }
      paintStatus();
    });
    return b;
  }));
  paintStatus();
  return h('div', null,
    videoCard(lessonOf(s)),
    h('p', { class: 'eyebrow' }, it.title),
    h('p', { class: 'prompt sm' }, it.prompt),
    grid, status,
    h('p', { class: 'follow' }, inPractice() ? '一邊看影片，一邊點你聽到的字。抓到 7 個以上就是 3 顆糖。' : [h('span', { class: 'tag' }, '老師'), '影片裡沒出現的字可以跳過。抓到 7 個以上就是 3 顆糖。']));
}

/* ---------- 跟讀 ---------- */
function renderShadow(st, it, k) {
  const add = h('textarea', { id: 'shadow-add', placeholder: '從影片逐字稿複製句子貼在這裡，一行一句' });
  const addMsg = h('p', { class: 'form-msg' });
  const addBox = h('div', { class: 'add-lines', hidden: true },
    h('label', { for: 'shadow-add' }, '加入影片裡的句子（會存起來，下次上這課也會出現）'), add,
    h('div', { class: 'tools' }, h('button', { class: 'btn small primary', type: 'button', onclick: () => addShadowLines(add.value, addMsg) }, '加入跟讀'), addMsg));
  return h('div', null,
    h('p', { class: 'eyebrow' }, `Shadowing 跟讀${it.custom ? '・影片句子' : '・示範句'}`),
    h('p', { class: 'shadow-text' }, it.text),
    h('div', { class: 'tools' },
      speakBtn(it.text, '聽一次'),
      h('span', { class: 'muted sm' }, '先聽，再跟著說一次。也可以回影片重播這一句。')),
    micControl({ owner: k, silenceMs: 2000, maxMs: 15000, label: '按我開始跟讀', onDone: r => handleSpeech(k, r.text, r.alts, t => evalShadow(it.text, t)) }),
    resultBox(k),
    inPractice() ? null : h('div', { class: 'tools', style: 'margin-top:14px' },
      h('button', { class: 'linkish', type: 'button', onclick: () => { addBox.hidden = !addBox.hidden; if (!addBox.hidden) add.focus(); } }, '＋ 貼上影片逐字稿的句子'),
      it.custom ? h('button', { class: 'linkish', type: 'button', onclick: () => removeShadowLine(it.id) }, '刪掉這一句') : null),
    inPractice() ? null : addBox);
}
function addShadowLines(raw, msg) {
  const lines = String(raw || '').split(/\n+/).map(x => x.trim()).filter(x => x.length >= 3);
  if (!lines.length) { msg.textContent = '請先貼上句子。'; return; }
  const s = state.session, lid = s.lessonId;
  const store = state.settings.shadow[lid] || (state.settings.shadow[lid] = []);
  const firstNew = s.extra.length;
  lines.forEach(t => {
    if (s.extra.some(x => x.text === t)) return;
    const x = { id: 'x_' + newId(), text: t };
    s.extra.push(x);
    if (!store.some(y => y.text === t)) store.push({ id: x.id, text: t });
  });
  saveSettings(); saveDraft();
  const its = curItems();
  const idx = its.findIndex(i => s.extra[firstNew] && i.id === s.extra[firstNew].id);
  if (idx >= 0) state.itemIdx = idx;
  paintTabs(); paintStage(); paintTutor();
}
function removeShadowLine(id) {
  const s = state.session, lid = s.lessonId;
  s.extra = s.extra.filter(x => x.id !== id);
  state.settings.shadow[lid] = (state.settings.shadow[lid] || []).filter(x => x.id !== id);
  Object.keys(s.ratings).forEach(k => { if (k.endsWith('__' + id)) delete s.ratings[k]; });
  saveSettings(); saveDraft();
  state.itemIdx = Math.min(state.itemIdx, curItems().length - 1);
  paintLesson();
}

/* ---------- 角色扮演 ---------- */
function doorRating(it, k) {
  const s = state.session, lines = it.lines.map((l, i) => ({ l, i })).filter(x => x.l.s === 's');
  const tried = lines.filter(x => s.said[k + '#' + x.i]);
  if (!tried.length) return 0;
  const avg = tried.reduce((a, x) => a + (s.evals[k + '#' + x.i]?.ratio || 0), 0) / tried.length;
  return avg >= 0.85 && tried.length === lines.length ? 3 : avg >= 0.5 ? 2 : 1;
}
function renderDialogue(st, it, k) {
  const s = state.session;
  const shown = !!s.hints[k];
  const hintBtn = h('button', { class: 'btn small', type: 'button', disabled: shown }, shown ? '已顯示學生台詞' : '顯示學生台詞提示');
  hintBtn.addEventListener('click', () => {
    s.hints[k] = true; saveDraft();
    $$('.s-hint').forEach(n => { n.hidden = false; });
    hintBtn.disabled = true; hintBtn.textContent = '已顯示學生台詞'; paintTutor();
  });
  const lines = it.lines.map((l, i) => {
    if (l.s === 'n') return h('div', { class: 'bubble n' }, h('span', { class: 'who-l' }, it.who), h('p', null, l.t), h('div', { class: 'bubble-row' }, speakBtn(l.t, '播放', it.voice)));
    const lk = k + '#' + i;
    const res = h('p', { class: 'line-res', id: 'line-' + lk });
    const paintRes = () => {
      const said = s.said[lk], ev = s.evals[lk];
      res.className = 'line-res' + (ev ? (ev.ratio >= 0.99 ? ' ok' : ' no') : '');
      res.textContent = said ? `${ev && ev.ratio >= 0.99 ? '✓' : '△'} 「${said}」${ev && ev.missing.length ? `（還少：${ev.missing.join('、')}）` : ''}` : '';
    };
    paintRes();
    return h('div', { class: 'bubble s' },
      h('span', { class: 'who-l' }, 'You'),
      h('p', { class: 's-hint', hidden: !shown }, l.t),
      h('div', { class: 'bubble-row' }, micControl({ owner: lk, small: true, silenceMs: 2000, maxMs: 15000, label: '換你說', onDone: r => {
        s.said[lk] = r.text;
        const e = evalLine(l, r.text);
        s.evals[lk] = e;
        s.stats.attempts++; s.stats.words += toks(r.text).length;
        s.said[k] = r.text;
        s.evals[k] = { rating: doorRating(it, k), chips: [], wc: 0 };
        paintRes();
        applyRating(k, doorRating(it, k));
      } })),
      res);
  });
  return h('div', null,
    h('div', { class: 'door-head' },
      h('div', { class: 'door-pic', 'aria-hidden': 'true' }, it.pic),
      h('div', null, h('p', { class: 'eyebrow' }, `Door ${curPos() + 1} of ${curItems().length}`), h('h3', { class: 'door-who' }, it.who), h('p', { class: 'muted' }, it.mood))),
    h('div', { class: 'tools' }, hintBtn, h('span', { class: 'muted sm' }, inPractice() ? '先按「播放」聽鄰居說話，再按「換你說」回答。' : '老師唸鄰居的台詞，學生按「換你說」回答。')),
    h('div', { class: 'chat' }, lines));
}

/* ---------- 說故事 ---------- */
function renderPanel(st, it, k) {
  const s = state.session;
  const hits = new Set((s.evals[k] && s.evals[k].hits) || []);
  const model = reveal('看示範句', h('p', { class: 'hint' }, it.model, ' ', speakBtn(it.model, '聽示範')), k);
  return h('div', null,
    h('p', { class: 'story-title' }, st.storyTitle),
    h('div', { class: 'strip' }, itemsOf(st, state.session).map((p, i) => h('button', { class: 'panel-mini', type: 'button', 'aria-current': String(p.id === it.id), disabled: inPractice(), onclick: inPractice() ? null : () => goItem(i), 'aria-label': `第 ${i + 1} 格` },
      h('span', { class: 'pm-n' }, String(i + 1)), h('span', { 'aria-hidden': 'true' }, p.scene)))),
    h('div', { class: 'panel-big' },
      h('div', { class: 'pb-scene', 'aria-hidden': 'true' }, it.scene),
      h('div', null,
        h('p', { class: 'eyebrow' }, `Picture ${curPos() + 1} of ${curItems().length}`),
        h('p', { class: 'prompt sm' }, it.prompt),
        h('div', { class: 'kw' }, it.keywords.map(w => h('span', { class: 'kw-chip' + (hits.has(w) ? ' hit' : '') }, w))),
        h('div', { class: 'tools' }, speakBtn(it.prompt, '聽題目'), model.btn),
        model.content,
        micControl({ owner: k, silenceMs: 3000, maxMs: 45000, onDone: r => { handleSpeech(k, r.text, r.alts, t => evalPanel(it, t)); paintStage(); } }),
        resultBox(k))));
}

/* ==========================================================
   這段在做什麼：段考題型（選擇、重組、拼字）
   電腦直接改：第一次就對 3 顆糖，第二次對 2 顆，之後才對 1 顆
   ========================================================== */
const TEST_KINDS = ['choice', 'order', 'spell'];
const triesRating = n => (n <= 1 ? 3 : n === 2 ? 2 : 1);
/* 這段在做什麼：記下學生這次的答案；答對才給糖。s.said 記「答題過程」，例如 is → am → are */
function testTry(k, answer, ok, gaveUp) {
  const s = state.session, prev = s.evals[k] && !s.evals[k].solved ? s.evals[k] : null;
  const tries = [...(prev ? prev.tries : []), String(answer)];
  const ev = { tries, solved: ok, gaveUp: !!gaveUp, rating: 0, wc: 0, chips: [] };
  s.said[k] = gaveUp ? `看了答案（之前答：${tries.slice(0, -1).join(' → ')}）` : tries.join(' → ');
  s.evals[k] = ev;
  if (ok) {
    ev.rating = gaveUp ? 1 : triesRating(tries.length);
    ev.chips = [{ ok: !gaveUp && tries.length === 1, text: gaveUp ? '看了答案' : tries.length === 1 ? '第一次就答對' : `第 ${tries.length} 次才答對` }];
    applyRating(k, ev.rating);
  } else {
    ev.chips = [{ ok: false, text: `答錯 ${tries.length} 次` }];
    saveDraft(); paintTutor();
  }
  paintStage();
  const inp = $('#stage .spell-in:not(:disabled)'); if (inp) inp.focus();
}
function testRedo(k) {
  const s = state.session;
  delete s.evals[k]; delete s.said[k]; delete orderWork[k];
  saveDraft(); paintStage();
}
function testResult(k, wrongMsg, solvedExtra) {
  const s = state.session, ev = s.evals[k];
  if (!ev) return null;
  if (!ev.solved) return h('p', { class: 'mic-err', 'aria-live': 'polite' }, wrongMsg || '不是這個，再試一次！');
  const r = s.ratings[k] || 0;
  return h('div', { class: 'result', 'aria-live': 'polite' },
    h('div', { class: 'checks' }, ev.chips.map(c => h('span', { class: 'ck ' + (c.ok ? 'ok' : 'no') }, (c.ok ? '✓ ' : '△ ') + c.text))),
    solvedExtra,
    r ? h('p', { class: 'earn' }, candyRow(r), r === 3 ? 'Excellent! 拿到 3 顆糖' : r === 2 ? 'Good job! 拿到 2 顆糖' : '拿到 1 顆糖，按「重做這題」可以再挑戰') : null,
    h('div', null, h('button', { class: 'linkish', type: 'button', onclick: () => testRedo(k) }, '重做這題')));
}
const testHead = (it) => h('p', { class: 'eyebrow' }, `${it.tag || ''}・Question ${curPos() + 1} of ${curItems().length}`);

/* ---------- 選擇題（聽力、文法、閱讀） ---------- */
function renderChoice(st, it, k) {
  const s = state.session, ev = s.evals[k], solved = !!(ev && ev.solved);
  const picked = new Set((ev && ev.tries) || []);
  const L = lessonOf(s), passage = it.passage && L.passages ? L.passages[it.passage] : null;
  const opts = h('div', { class: 'opts', role: 'group', 'aria-label': '選項' }, it.options.map((o, i) => {
    const right = i === it.answer;
    return h('button', { class: 'opt' + (picked.has(o) && !right ? ' no' : '') + (solved && right ? ' ok' : ''), type: 'button',
      disabled: solved || picked.has(o), onclick: () => testTry(k, o, right) },
      h('span', { class: 'opt-n' }, 'ABCD'[i]), h('span', null, o));
  }));
  return h('div', null,
    passage ? h('div', { class: 'passage' }, h('p', null, passage), h('div', { class: 'tools', style: 'margin:10px 0 0' }, speakBtn(passage, '聽文章'))) : null,
    testHead(it),
    it.audio ? h('div', { class: 'tools' },
      h('button', { class: 'btn primary', type: 'button', onclick: () => VOICE.say(it.audio, audioRole(it.audio)) }, svg(ICON.play), '播放'),
      h('span', { class: 'muted sm' }, '可以重聽。開了慢速語音會唸慢一點。')) : null,
    it.show ? h('p', { class: 'mask' }, it.show) : null,
    h('p', { class: 'prompt sm' }, it.prompt),
    opts,
    testResult(k, null, [
      it.audio ? h('p', { class: 'heard' }, '播放的是：' + it.audio) : null,
      it.explain ? h('p', { class: 'explain' }, it.explain) : null]));
}

/* ---------- 句子重組 ---------- */
const orderWork = {};  // 正在排的字，換題再回來還在
function shuffled(n, seed) {
  let x = 7;
  for (const ch of seed) x = (x * 31 + ch.charCodeAt(0)) >>> 0;
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) { x = (Math.imul(x, 1103515245) + 12345) >>> 0; const j = x % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  if (n > 1 && a.every((v, i) => v === i)) a.push(a.shift());
  return a;
}
function renderOrder(st, it, k) {
  const s = state.session, ev = s.evals[k], solved = !!(ev && ev.solved);
  const m = it.answer.match(/^(.*?)([.?!]?)$/), body = m[1], end = m[2];
  const words = body.split(' ');
  const cur = solved ? words.map((_, i) => i) : (orderWork[k] || (orderWork[k] = []));
  const full = cur.length === words.length;
  const build = h('div', { class: 'build' + (solved ? ' ok' : ''), 'aria-label': '你排的句子' },
    cur.length ? cur.map((wi, pos) => h('button', { class: 'tile', type: 'button', disabled: solved, 'aria-label': `拿掉 ${words[wi]}`,
      onclick: () => { cur.splice(pos, 1); paintStage(); } }, words[wi])) : h('span', { class: 'build-ph' }, '點下面的字，排成一個句子'),
    full ? h('span', { class: 'end' }, end) : null);
  const bank = h('div', { class: 'tiles' }, shuffled(words.length, it.id + it.answer).map(wi =>
    h('button', { class: 'tile' + (cur.includes(wi) ? ' used' : ''), type: 'button', disabled: solved || cur.includes(wi),
      onclick: () => { cur.push(wi); paintStage(); } }, words[wi])));
  const check = () => {
    const built = cur.map(i => words[i]).join(' ');
    testTry(k, built + end, built === body);
  };
  const tries = (ev && ev.tries) || [];
  let wrongMsg = null;
  if (ev && !ev.solved) {
    const last = tries[tries.length - 1].replace(/[.?!]$/, '').split(' ');
    let n = 0; while (n < words.length && last[n] === words[n]) n++;
    wrongMsg = n ? `還不對。前 ${n} 個字排對了，後面再想想。` : '還不對。先想想第一個字是什麼，句子第一個字的字首是大寫。';
  }
  return h('div', null,
    testHead(it),
    h('p', { class: 'zh-gloss' }, it.zh),
    build,
    solved ? null : bank,
    solved ? null : h('div', { class: 'tools' },
      h('button', { class: 'btn primary', type: 'button', disabled: !full, onclick: check }, '檢查'),
      cur.length ? h('button', { class: 'btn small ghost', type: 'button', onclick: () => { cur.length = 0; paintStage(); } }, '全部拿掉') : null,
      tries.length >= 3 ? h('button', { class: 'linkish', type: 'button', onclick: () => { orderWork[k] = words.map((_, i) => i); testTry(k, '看答案', true, true); } }, '看答案') : null),
    testResult(k, wrongMsg, h('div', { class: 'tools', style: 'margin:0' }, speakBtn(it.answer, '聽一次'), h('span', { class: 'muted sm' }, '聽完跟著唸一次。'))));
}

/* ---------- 看圖拼字 ---------- */
function renderSpell(st, it, k) {
  const s = state.session, ev = s.evals[k], solved = !!(ev && ev.solved);
  const input = h('input', { type: 'text', class: 'spell-in', autocomplete: 'off', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false',
    'aria-label': '拼出這個字', disabled: solved, value: solved ? it.word : '' });
  const check = () => {
    const v = input.value.trim().replace(/\s+/g, ' ');
    if (!v) { input.focus(); return; }
    testTry(k, v, it.caps ? v === it.word : v.toLowerCase() === it.word.toLowerCase());
  };
  input.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
  const tries = (ev && ev.tries) || [];
  const last = tries[tries.length - 1] || '';
  const wrongMsg = last.toLowerCase() === it.word.toLowerCase() ? '字母都對了！國家名字的第一個字母要大寫。' : '還不對。按「聽發音」再聽一次，一個一個字母對對看。';
  return h('div', { class: 'word' },
    h('div', { class: 'word-pic', 'aria-hidden': 'true' }, it.pic),
    h('div', null,
      testHead(it),
      h('p', { class: 'zh-gloss' }, it.zh),
      h('p', { class: 'mask' }, solved ? it.word : it.show),
      h('div', { class: 'tools' }, speakBtn(it.word, '聽發音', 'word')),
      h('div', { class: 'spell-row' }, input,
        h('button', { class: 'btn primary', type: 'button', disabled: solved, onclick: check }, '檢查'),
        !solved && tries.length >= 3 ? h('button', { class: 'linkish', type: 'button', onclick: () => testTry(k, '看答案', true, true) }, '看答案') : null),
      testResult(k, wrongMsg, null)));
}

/* ---------- 老師評分區 ---------- */
function paintTutor() { if (inPractice()) paintStudentPanel(); else paintTutorPanel(); }
function paintTutorPanel() {
  const el = $('#tutor'); if (!el) return;
  const st = curStage(), it = curItem(), k = keyOf(st, it), s = state.session;
  const r = s.ratings[k] || 0, fl = s.flags[k] || [], b = s.bonus[k] || 0;
  const ev = s.evals[k];
  const note = h('input', { id: 'note-input', type: 'text', placeholder: '老師筆記：學生的好句子或常犯的錯（選填，會放進報告）', value: s.notes[k] || '' });
  note.addEventListener('input', () => { s.notes[k] = note.value; saveDraftSoon(); });
  const items = curItems(), last = state.stageIdx === lessonOf(s).stages.length - 1 && state.itemIdx === items.length - 1;
  const first = state.stageIdx === 0 && state.itemIdx === 0;
  // 這段在做什麼：同一堂課上次上的時候，這一題拿幾顆糖、說了什麼
  const D = state.detail, prev = D && D.loaded && D.sid === s.studentId ? D.sessions.find(x => x.lessonId === s.lessonId && x.id !== s.id) : null;
  const pr = prev && prev.ratings && prev.ratings[k], psaid = prev && prev.said && prev.said[k];
  el.replaceChildren(
    h('div', { class: 'tutor-head' },
      h('h2', null, '老師評分區'),
      h('span', { class: 'suggest' },
        ev && ev.rating ? (s.manual[k] ? `電腦建議 ${ev.rating} 顆，已用老師的分數` : `目前是電腦建議的分數，按下面可以改`) : '學生說完會自動給建議分數；也可以直接按',
        '・鍵盤：1 / 2 / 3 評分、M 開麥克風、← → 換題')),
    prev ? h('p', { class: 'prev-line' }, h('span', { class: 'tag' }, `上次 ${fmtShort(prev.startedAt)}`),
      pr ? [candyRow(pr), `${pr} 顆糖`] : '這題沒做到',
      psaid ? `・${TEST_KINDS.includes(kindOf(st, it)) ? '作答' : '說了'}「${clip(psaid, 70)}」` : '') : null,
    h('div', { class: 'rate' }, RATINGS.map(R => h('button', { class: 'rate-btn r' + R.v, type: 'button', 'aria-pressed': String(r === R.v), onclick: () => setManual(k, R.v) },
      h('span', { class: 'rb-zh' }, R.zh), h('span', { class: 'rb-en' }, `${R.en}・按 ${R.v}`), candyRow(R.v)))),
    h('div', { class: 'flags' }, h('span', { class: 'label' }, '要加強'),
      Object.entries(FLAGS).map(([id, F]) => h('button', { class: 'flag', type: 'button', 'aria-pressed': String(fl.includes(id)), onclick: () => toggleFlag(k, id) }, F.zh))),
    note,
    h('div', { class: 'tnav' },
      h('button', { class: 'btn small', type: 'button', onclick: () => addBonus(k) }, b ? `+1 加分（已加 ${b}）` : '+1 加分'),
      s.hints[k] ? h('span', { class: 'pill' }, '有看提示') : null,
      h('span', { class: 'spacer' }),
      h('button', { class: 'btn small', type: 'button', disabled: first, onclick: prevItem }, '← 上一題'),
      last ? confirmBtn('完成，產生報告', '確定結束？', 'btn primary', endLesson)
           : h('button', { class: 'btn primary', type: 'button', onclick: nextItem }, '下一題 →')));
}
function setManual(k, v) {
  const s = state.session, before = s.ratings[k] || 0;
  if (s.ratings[k] === v && s.manual[k]) { delete s.ratings[k]; delete s.manual[k]; }
  else { s.ratings[k] = v; s.manual[k] = true; }
  saveDraft(); paintCounter((s.ratings[k] || 0) > before); paintTabs(); paintDots(); paintTutor();
  const box = $('#res-' + CSS.escape(k)); if (box) box.replaceWith(resultBox(k));
}
function toggleFlag(k, id) {
  const s = state.session, fl = new Set(s.flags[k] || []);
  if (fl.has(id)) fl.delete(id); else fl.add(id);
  s.flags[k] = [...fl]; if (!fl.size) delete s.flags[k];
  saveDraft(); paintTutor();
}
function addBonus(k) {
  const s = state.session; s.bonus[k] = Math.min(3, (s.bonus[k] || 0) + 1);
  saveDraft(); paintCounter(true); paintTutor();
}
function nextItem() {
  const items = curItems(), stages = lessonOf(state.session).stages;
  if (state.itemIdx < items.length - 1) state.itemIdx++;
  else if (state.stageIdx < stages.length - 1) { state.stageIdx++; state.itemIdx = 0; }
  else return;
  Speech.abort(); saveDraft(); paintTabs(); paintStage(); paintTutor(); $('#stage').scrollIntoView({ block: 'start', behavior: 'smooth' });
}
function prevItem() {
  if (state.itemIdx > 0) state.itemIdx--;
  else if (state.stageIdx > 0) { state.stageIdx--; state.itemIdx = curItems().length - 1; }
  else return;
  Speech.abort(); saveDraft(); paintTabs(); paintStage(); paintTutor();
}
function confirmBtn(label, armedLabel, cls, onConfirm) {
  const b = h('button', { class: cls, type: 'button' }, label);
  let armed = false, t = null;
  b.addEventListener('click', () => {
    if (!armed) {
      armed = true; b.textContent = armedLabel; b.classList.add('armed');
      t = setTimeout(() => { armed = false; b.textContent = label; b.classList.remove('armed'); }, 4000);
    } else { clearTimeout(t); onConfirm(); }
  });
  return b;
}

/* 這段在做什麼：上課計時（只算畫面開著的時間） */
function startTimer() { stopTimer(); lastTick = Date.now(); timerId = setInterval(tick, 1000); tick(); }
function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
function tick() {
  const now = Date.now(), dt = now - lastTick; lastTick = now;
  if (state.session && dt < 60000) { state.session.activeMs = (state.session.activeMs || 0) + dt; if (inPractice()) Practice.onTick(dt); }
  const t = $('#timer'); if (t && state.session) t.textContent = fmtClock(state.session.activeMs);
  if (++tickCount % 15 === 0) saveDraft();
}

/* 這段在做什麼：鍵盤快捷鍵（方便老師用筆電操作） */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && state.drawer) { state.drawer = false; paintDrawer(); return; }
  if ((state.view !== 'lesson' && state.view !== 'practice') || state.drawer) return;
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  if (['1', '2', '3'].includes(e.key) && state.view === 'lesson') { setManual(curKey(), Number(e.key)); e.preventDefault(); }
  else if (e.key === 'ArrowRight') { if (inPractice()) Practice.move(1); else nextItem(); e.preventDefault(); }
  else if (e.key === 'ArrowLeft') { if (inPractice()) Practice.move(-1); else prevItem(); e.preventDefault(); }
  else if (e.key === 'm' || e.key === 'M') { const b = $('#stage .mic-btn:not(:disabled)'); if (b) { b.click(); e.preventDefault(); } }
});

/* ==========================================================
   這段在做什麼：教材面板（影片、Twinkl、自己加的連結）
   ========================================================== */
function lessonMaterials(lid) {
  const L = LESSONS[lid], hidden = new Set(state.settings.hidden[lid] || []);
  return [
    ...L.materials.filter(m => !hidden.has(m.id)).map(m => Object.assign({ builtin: true }, m)),
    ...(state.settings.custom[lid] || []).map(m => Object.assign({ builtin: false }, m))
  ];
}
function paintDrawer() {
  const old = $('#drawer'); if (old) old.remove();
  if (!state.drawer || state.view !== 'lesson' || !state.session) return;
  const lid = state.session.lessonId, L = LESSONS[lid], list = lessonMaterials(lid);
  const hiddenN = (state.settings.hidden[lid] || []).length;
  const kind = h('select', { id: 'mat-kind' }, MAT_KINDS.map(k => h('option', { value: k }, k)));
  const title = h('input', { id: 'mat-title', type: 'text', placeholder: '例如：Room on the Broom 動畫' });
  const url = h('input', { id: 'mat-url', type: 'url', placeholder: 'https://' });
  const msg = h('p', { class: 'form-msg', 'aria-live': 'polite' });
  const add = () => {
    const t = title.value.trim(), u = url.value.trim();
    if (!t) { msg.textContent = '請填標題。'; title.focus(); return; }
    if (!/^https?:\/\/\S+$/i.test(u)) { msg.textContent = '網址要以 https:// 開頭。'; url.focus(); return; }
    (state.settings.custom[lid] || (state.settings.custom[lid] = [])).push({ id: 'c_' + newId(), kind: kind.value, title: t, url: u, note: '' });
    saveSettings(); paintDrawer();
  };
  const remove = m => {
    if (m.builtin) (state.settings.hidden[lid] || (state.settings.hidden[lid] = [])).push(m.id);
    else state.settings.custom[lid] = (state.settings.custom[lid] || []).filter(x => x.id !== m.id);
    saveSettings(); paintDrawer();
  };
  const useAsVideo = m => { L.video = { title: m.title, source: m.kind, url: m.url }; state.settings.video = state.settings.video || {}; state.settings.video[lid] = L.video; saveSettings(); state.drawer = false; paintDrawer(); paintStage(); };
  const panel = h('aside', { class: 'drawer-panel', role: 'dialog', 'aria-modal': 'true', 'aria-label': '上課教材' },
    h('div', { class: 'dp-head' }, h('h2', null, '上課教材'), h('button', { class: 'btn small ghost', type: 'button', onclick: () => { state.drawer = false; paintDrawer(); } }, '關閉')),
    h('p', { class: 'muted sm' }, `${L.title}：點標題會在新分頁打開。按「設為影片練習」可以換掉影片練習用的影片。`),
    h('ul', { class: 'mats' }, list.map(m => h('li', { class: 'mat' },
      h('span', { class: 'mat-kind' }, m.kind),
      h('div', null,
        h('a', { href: m.url, target: '_blank', rel: 'noopener noreferrer' }, m.title),
        m.note ? h('p', { class: 'muted sm' }, m.note) : null,
        /影片|動畫/.test(m.kind) ? h('button', { class: 'linkish', type: 'button', onclick: () => useAsVideo(m) }, L.video.url === m.url ? '目前的影片練習' : '設為影片練習') : null),
      h('button', { class: 'btn small ghost', type: 'button', 'aria-label': `移除 ${m.title}`, onclick: () => remove(m) }, '移除')))),
    hiddenN ? h('button', { class: 'linkish', type: 'button', onclick: () => { state.settings.hidden[lid] = []; saveSettings(); paintDrawer(); } }, `還原 ${hiddenN} 個預設教材`) : null,
    h('div', { class: 'mat-form' },
      h('p', { class: 'eyebrow' }, '新增教材'),
      h('label', { for: 'mat-kind' }, '類型'), kind,
      h('label', { for: 'mat-title' }, '標題'), title,
      h('label', { for: 'mat-url' }, '網址'), url,
      h('button', { class: 'btn primary', type: 'button', onclick: add }, '加入'), msg));
  document.body.append(h('div', { class: 'drawer', id: 'drawer' }, h('div', { class: 'drawer-bg', onclick: () => { state.drawer = false; paintDrawer(); } }), panel));
  title.focus();
}

/* ==========================================================
   這段在做什麼：下課，算分數、產生報告
   ========================================================== */
function levelTitle(pct, rated, L) {
  if (!rated) return '尚未評分';
  if (L && L.ranks) return (L.ranks.find(([min]) => pct >= min) || L.ranks[L.ranks.length - 1])[1];
  if (pct >= 90) return 'Halloween Legend 萬聖傳奇';
  if (pct >= 75) return 'Spooky Star 驚喜之星';
  if (pct >= 60) return 'Brave Explorer 勇敢探險家';
  return 'Little Ghost 小幽靈，繼續加油';
}
function computeReport(s) {
  const L = lessonOf(s), dims = {};
  DIMS.forEach(d => { dims[d.id] = { sum: 0, n: 0 }; });
  let earned = 0, max = 0, bonus = 0, rated = 0, total = 0, hints = 0;
  const highlights = [], work = [];
  const stages = L.stages.map(st => {
    let e = 0, m = 0, b = 0, r = 0;
    const its = itemsOf(st, s);
    its.forEach((it, idx) => {
      total++;
      const k = keyOf(st, it), v = s.ratings[k], fl = s.flags[k] || [];
      b += s.bonus[k] || 0;
      if (s.hints[k]) hints++;
      const skills = it.skills || st.skills;
      if (v) { e += v; m += 3; r++; skills.forEach(d => { dims[d].sum += v; dims[d].n++; }); }
      fl.forEach(f => { const d = FLAGS[f].dim; dims[d].sum += 1; dims[d].n++; });
      const entry = { label: itemLabel(st, it, idx), stage: st.zh, said: s.said[k] || '', note: (s.notes[k] || '').trim(), flags: fl.map(f => FLAGS[f].zh), test: TEST_KINDS.includes(kindOf(st, it)) };
      if (v === 3) highlights.push(entry);
      if (v === 1 || fl.length) work.push(entry);
    });
    earned += e; max += m; bonus += b; rated += r;
    return { id: st.id, title: st.title, zh: st.zh, earned: e, max: m, bonus: b, rated: r, count: its.length };
  });
  const pct = max ? Math.round(earned / max * 100) : 0;
  return {
    earned, max, bonus, candies: earned + bonus, pct, rated, total, hints, stages, highlights, work,
    dims: DIMS.map(d => ({ id: d.id, zh: d.zh, en: d.en, score: dims[d.id].n ? Math.round(dims[d.id].sum / dims[d.id].n / 3 * 50) / 10 : null })),
    title: levelTitle(pct, rated, L),
    attempts: (s.stats && s.stats.attempts) || 0, words: (s.stats && s.stats.words) || 0
  };
}
function summarize(s) { const R = computeReport(s); return { pct: R.pct, candies: R.earned, bonus: R.bonus, max: R.max, title: R.title, rated: R.rated, total: R.total }; }

async function copyText(text, statusEl, host, okMsg) {
  try { await navigator.clipboard.writeText(text); statusEl.textContent = okMsg; host.replaceChildren(); }
  catch (e) {
    const ta = h('textarea', { class: 'copy-fallback', id: 'copy-fallback', readonly: true }); ta.value = text;
    host.replaceChildren(ta); ta.focus(); ta.select();
    statusEl.textContent = '沒辦法自動複製。文字已經選好了，請按 Ctrl+C（Mac 按 ⌘C）。';
  }
}
function reportText(s, R) {
  const L = lessonOf(s);
  const out = [
    `【English Isle 上課報告】`,
    `${s.studentName}｜${fmtDate(s.startedAt)}｜${L.title} ${L.zh}｜${fmtMin(s.activeMs)}`,
    '',
    `糖果：${R.earned} / ${R.max}（${R.pct}%）${R.bonus ? `＋加分 ${R.bonus} 顆` : ''}・${R.title}`,
    `開口說了 ${R.attempts} 次，共 ${R.words} 個英文字`,
    '',
    '能力分數（滿分 5）',
    R.dims.filter(d => d.score != null).map(d => `${d.zh} ${d.score.toFixed(1)}`).join('｜')
  ];
  if (R.highlights.length) { out.push('', '做得好'); R.highlights.slice(0, 4).forEach(x => out.push(`・${x.label}${x.said ? `：「${x.said}」` : ''}`)); }
  if (R.work.length) { out.push('', '下次加強'); R.work.slice(0, 4).forEach(x => out.push(`・${x.label}${x.flags.length ? `（${x.flags.join('、')}）` : ''}`)); }
  if ((s.teacherNote || '').trim()) out.push('', '老師的話', s.teacherNote.trim());
  if ((s.nextNote || '').trim()) out.push('', '下次上課', s.nextNote.trim());
  return out.join('\n');
}
function claudePrompt(s, R) {
  const L = lessonOf(s), lines = [];
  L.stages.forEach(st => {
    lines.push(`## ${st.title}（${st.zh}）`);
    itemsOf(st, s).forEach((it, idx) => {
      const k = keyOf(st, it), r = s.ratings[k], fl = s.flags[k] || [], said = s.said[k], note = (s.notes[k] || '').trim();
      if (!r && !said && !note && !fl.length) return;
      const saidLabel = TEST_KINDS.includes(kindOf(st, it)) ? '學生的答案' : '學生說';
      lines.push(`- ${itemLabel(st, it, idx)}｜分數 ${r || '未評'}${fl.length ? `｜要加強：${fl.map(f => FLAGS[f].zh).join('、')}` : ''}${s.hints[k] ? '｜看了提示' : ''}${said ? `｜${saidLabel}：「${said}」` : ''}${note ? `｜老師筆記：${note}` : ''}`);
    });
  });
  return `<role>你是台灣的英語家教助理，幫老師寫下課後給家長的評語。</role>

<task>根據下面的上課紀錄，寫三段文字：給家長的中文評語、給學生的英文鼓勵、下次上課建議。</task>

<context>
學生：${s.studentName}，小學五年級，${L.audience || '程度中上（有上全英文補習班）。'}
課程：${L.title}（${L.zh}），${L.format || '口說課'}，程度 ${L.level}，上課 ${fmtMin(s.activeMs)}。
分數：每題 1–3 顆糖（1 再練練、2 不錯、3 很棒）。學生說的話是電腦語音辨識聽寫的，可能有辨識錯誤。${L.scope ? '\n選擇、重組、拼字題是電腦直接改的：第一次答對 3 顆、第二次 2 顆、之後 1 顆；「學生的答案」用 → 記下每一次的作答。' : ''}
總分：${R.earned} / ${R.max}（${R.pct}%），完成 ${R.rated} / ${R.total} 題，看提示 ${R.hints} 次，開口 ${R.attempts} 次、共 ${R.words} 個英文字。
能力分數（滿分 5）：${R.dims.map(d => `${d.zh} ${d.score ?? '無資料'}`).join('、')}
老師已經寫的評語：${(s.teacherNote || '').trim() || '（無）'}

上課紀錄：
${lines.join('\n')}
</context>

<constraint>
- 中文用繁體、台灣用語，語氣溫暖專業，不浮誇，不要堆驚嘆號。
- 要具體：引用 1–2 句學生真的說過的英文。
- 只提 1 個最重要的改進點，不要列一長串缺點。
- 電腦聽寫可能有誤，不要因為單一個字辨識錯就判斷發音有問題。
</constraint>

<output_format>
【給家長】90–140 字
【To ${s.studentName}】2–3 句簡單英文（A2 程度）
【下次上課】3 點，每點 25 字以內
</output_format>`;
}


/* ==========================================================
   這段在做什麼：雲端資料庫設定（Firebase）
   FIREBASE_CONFIG 貼 Firebase 給的設定；TEACHERS 是能進後台的 Gmail
   （真正的權限由 Firestore 規則決定，這裡只是畫面判斷）
   ========================================================== */
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyB3jwNuOWZEa1OvDlIz7ZcHbbhH-iXyGzU',
  authDomain: 'english-isle.firebaseapp.com',
  projectId: 'english-isle',
  storageBucket: 'english-isle.firebasestorage.app',
  messagingSenderId: '837870704801',
  appId: '1:837870704801:web:ce49c18fb4227b9d6db8e0'
};
const EMU = /[?&]emu=1/.test(location.search);
const TEACHERS = EMU ? ['teacher@example.com'] : ['johannetsai@gmail.com', 'taffydavid7177@gmail.com'];
const FB_VER = '10.12.2';
const dayKey = (ts = Date.now()) => { const d = new Date(ts); return 'd' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()); };
const plain = o => JSON.parse(JSON.stringify(o));
function token(n = 20) {
  const abc = 'abcdefghjkmnpqrstuvwxyz23456789', a = new Uint32Array(n);
  crypto.getRandomValues(a);
  return Array.from(a, x => abc[x % abc.length]).join('');
}
const errText = e => (e && (e.code || e.message)) || '未知的錯誤';

const Cloud = {
  fb: null, db: null, auth: null, user: null, isTeacher: false, _cfgT: null,
  configured() { return EMU || !!FIREBASE_CONFIG; },
  async init() {
    const base = `https://www.gstatic.com/firebasejs/${FB_VER}/`;
    const [app, auth, fs] = await Promise.all(['firebase-app.js', 'firebase-auth.js', 'firebase-firestore.js'].map(f => import(base + f)));
    this.fb = Object.assign({}, app, auth, fs);
    const a = app.initializeApp(EMU ? { apiKey: 'demo-key', authDomain: 'demo-isle.firebaseapp.com', projectId: 'demo-isle' } : FIREBASE_CONFIG);
    this.auth = auth.getAuth(a);
    if (EMU) {
      this.db = fs.getFirestore(a);
      fs.connectFirestoreEmulator(this.db, '127.0.0.1', 8080);
      auth.connectAuthEmulator(this.auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    } else {
      // 網路不穩時，資料先存在瀏覽器，連上線再自動同步
      try { this.db = fs.initializeFirestore(a, { localCache: fs.persistentLocalCache({ tabManager: fs.persistentMultipleTabManager() }) }); }
      catch (e) { this.db = fs.getFirestore(a); }
    }
  },
  waitUser() { return new Promise(res => { const off = this.fb.onAuthStateChanged(this.auth, u => { off(); res(u); }); }); },
  setUser(u) { this.user = u || null; this.isTeacher = !!(u && !u.isAnonymous && u.email && TEACHERS.includes(u.email.toLowerCase())); },
  async signInTeacher() {
    const p = new this.fb.GoogleAuthProvider();
    p.setCustomParameters({ prompt: 'select_account' });
    const r = await this.fb.signInWithPopup(this.auth, p);
    this.setUser(r.user);
  },
  async signInStudent() {
    if (this.auth.currentUser) { this.setUser(this.auth.currentUser); return; }
    const r = await this.fb.signInAnonymously(this.auth);
    this.setUser(r.user);
  },
  async signOut() { await this.fb.signOut(this.auth); this.setUser(null); },
  d(...p) { return this.fb.doc(this.db, ...p); },
  c(...p) { return this.fb.collection(this.db, ...p); },

  // 這段在做什麼：學生名單（老師用）
  watchStudents(cb, onErr) {
    return this.fb.onSnapshot(this.c('students'), snap => cb(snap.docs.map(x => Object.assign({ id: x.id }, x.data()))), onErr);
  },
  async addStudent(name) {
    const sid = token();
    await this.fb.setDoc(this.d('students', sid), {
      name, createdAt: Date.now(), createdBy: this.user.email, archived: false,
      practiceMs: 0, daily: {}, lastSeenAt: null, lastClass: null, homeworkActive: null, hwProgress: null
    });
    return sid;
  },
  updateStudent(sid, patch) { return this.fb.updateDoc(this.d('students', sid), plain(patch)); },
  async getStudent(sid) {
    const s = await this.fb.getDoc(this.d('students', sid));
    return s.exists() ? Object.assign({ id: s.id }, s.data()) : null;
  },
  async list(sid, sub, field, n) {
    const q = this.fb.query(this.c('students', sid, sub), this.fb.orderBy(field, 'desc'), this.fb.limit(n || 100));
    const s = await this.fb.getDocs(q);
    return s.docs.map(x => Object.assign({ id: x.id }, x.data()));
  },
  saveSession(sid, s) { return this.fb.setDoc(this.d('students', sid, 'sessions', s.id), plain(s)); },
  patchSession(sid, id, patch) { return this.fb.setDoc(this.d('students', sid, 'sessions', id), plain(patch), { merge: true }); },
  saveHomework(sid, hw) { return this.fb.setDoc(this.d('students', sid, 'homework', hw.id), plain(hw)); },
  savePractice(sid, p) { return this.fb.setDoc(this.d('students', sid, 'practice', p.id), plain(p), { merge: true }); },
  log(sid, ev) { return this.fb.addDoc(this.c('students', sid, 'logs'), plain(Object.assign({ at: Date.now() }, ev))).catch(() => {}); },
  // 這段在做什麼：記錄學生最後上線時間和練習分鐘數
  touch(sid, deltaMs) {
    const f = this.fb, u = { lastSeenAt: Date.now() };
    if (deltaMs > 0) { u.practiceMs = f.increment(deltaMs); u['daily.' + dayKey()] = f.increment(deltaMs); }
    return f.updateDoc(this.d('students', sid), u).catch(() => {});
  },
  // 這段在做什麼：兩位老師共用的設定（教材連結、影片、跟讀句子）
  watchConfig(cb) { return this.fb.onSnapshot(this.d('config', 'shared'), s => cb(s.exists() ? s.data() : null), () => {}); },
  async getConfig() { try { const s = await this.fb.getDoc(this.d('config', 'shared')); return s.exists() ? s.data() : null; } catch (e) { return null; } },
  saveConfigSoon() {
    clearTimeout(this._cfgT);
    this._cfgT = setTimeout(() => {
      const { custom, hidden, shadow, video } = state.settings;
      this.fb.setDoc(this.d('config', 'shared'), plain({ custom, hidden, shadow, video: video || {} })).catch(() => {});
    }, 800);
  }
};
const DEFAULT_VIDEO = {};
Object.values(LESSONS).forEach(L => { DEFAULT_VIDEO[L.id] = Object.assign({}, L.video); });
function applyConfig(cfg) {
  if (!cfg) return;
  ['custom', 'hidden', 'shadow', 'video'].forEach(k => { state.settings[k] = cfg[k] || {}; });
  Object.values(LESSONS).forEach(L => { L.video = (state.settings.video[L.id] && state.settings.video[L.id].url) ? state.settings.video[L.id] : DEFAULT_VIDEO[L.id]; });
}

/* ==========================================================
   這段在做什麼：時間顯示的小工具
   ========================================================== */
const fmtShort = ts => { const d = new Date(ts); return `${d.getMonth() + 1}/${d.getDate()}（${'日一二三四五六'[d.getDay()]}）`; };
function ago(ts) {
  if (!ts) return '還沒用過';
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return '剛剛';
  if (m < 60) return `${m} 分鐘前`;
  const d = new Date(ts), now = new Date();
  if (d.toDateString() === now.toDateString()) return '今天 ' + fmtTime(ts);
  const y = new Date(now); y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return '昨天 ' + fmtTime(ts);
  return fmtShort(ts) + ' ' + fmtTime(ts);
}
function weekMs(s) {
  let t = 0;
  for (let i = 0; i < 7; i++) { const d = new Date(); d.setDate(d.getDate() - i); t += ((s.daily || {})[dayKey(d.getTime())] || 0); }
  return t;
}
const mins = ms => Math.round((ms || 0) / 60000);
const toDateInput = ts => { const d = new Date(ts); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const endOfDay = v => new Date(v + 'T23:59:59').getTime();
const studentLink = sid => location.href.split('#')[0] + '#s=' + sid;

/* ==========================================================
   這段在做什麼：畫面切換（老師後台、學生頁面共用）
   ========================================================== */
let timerId = null, lastTick = 0, tickCount = 0;
function go(view, tab) { state.view = view; if (tab !== undefined) state.tab = tab; render(); window.scrollTo(0, 0); }
function render() {
  stopTimer();
  Speech.abort();
  const V = {
    loading: viewLoading, setup: viewSetup, error: viewError, tsignin: viewSignIn, pick: viewPick, map: viewMap, dash: viewDash, tstudent: viewTStudent,
    lesson: viewLesson, report: viewReport, shome: viewSHome, sreport: viewReport, practice: viewPractice, pdone: viewPracticeDone
  };
  const view = (V[state.view] || viewLoading)();
  $('#app').replaceChildren(topbar(), warnings(), view);
  if (state.view === 'lesson') { paintLesson(); startTimer(); }
  if (state.view === 'practice') { paintPractice(); startTimer(); }
  paintDrawer();
}
function topbar() {
  const right = [], busy = state.view === 'lesson' || state.view === 'practice';
  const tbtn = (label, fn) => h('button', { class: 'btn small ghost', type: 'button', onclick: fn }, label);
  if (state.mode === 'teacher' && Cloud.isTeacher) {
    const backstage = state.view === 'dash' || state.view === 'tstudent';
    if (state.student && !backstage && state.view !== 'pick') right.push(h('span', { class: 'who' }, h('span', { class: 'who-dot' }), state.student.name));
    if (!busy) {
      if (backstage) right.push(tbtn('回到島上', () => go(state.student ? 'map' : 'pick')));
      else right.push(tbtn('後台', () => go('dash')));
      if (state.student && (state.view === 'map' || state.view === 'report')) right.push(tbtn('換學生', () => { state.student = null; go('pick'); }));
    }
    right.push(h('span', { class: 'muted sm' }, Cloud.user.email));
    if (!busy) right.push(tbtn('登出', async () => { await Cloud.signOut(); state.student = null; go('tsignin'); }));
  }
  if (state.mode === 'student' && state.student) right.push(h('span', { class: 'who' }, h('span', { class: 'who-dot' }), state.student.name));
  return h('header', { class: 'topbar' },
    h('button', { class: 'brand', type: 'button', 'aria-label': '回首頁', onclick: () => {
      if (busy) return;
      if (state.mode === 'student') go('shome');
      else if (Cloud.isTeacher) go(state.student ? 'map' : 'pick');
      else go('tsignin');
    } }, svg(ICON.mark), h('span', null, 'English Isle'), h('small', null, '英語島'),
      IS_BETA ? h('span', { class: 'beta-badge' }, '測試版') : null),
    h('div', { class: 'tb-right' }, right));
}
function warnings() {
  const box = h('div');
  if (!Speech.supported() && state.view !== 'tsignin') box.append(h('div', { class: 'banner', role: 'status' }, h('b', null, '注意'), h('span', null, '這個瀏覽器不能語音辨識。請用 Google Chrome 打開。')));
  return box;
}
function viewLoading() { return h('div', { class: 'empty' }, '載入中…'); }
function viewError() {
  return h('div', { class: 'empty' }, h('p', null, state.error || '出了一點問題。'), h('p', { style: 'margin-top:12px' }, h('button', { class: 'btn', type: 'button', onclick: () => location.reload() }, '重新整理')));
}
function viewSetup() {
  return h('div', { class: 'empty' }, '雲端資料庫還沒設定好。請把 Firebase 的設定交給 Claude。');
}

/* ==========================================================
   這段在做什麼：老師登入
   ========================================================== */
function viewSignIn() {
  const msg = h('p', { class: 'form-msg', 'aria-live': 'polite' });
  const btn = h('button', { class: 'btn primary', type: 'button' }, '用 Google 帳號登入');
  btn.addEventListener('click', async () => {
    btn.disabled = true; msg.textContent = '';
    try {
      await Cloud.signInTeacher();
      if (Cloud.isTeacher) await startTeacher(); else render();
    } catch (e) { msg.textContent = '登入沒有成功：' + errText(e); }
    btn.disabled = false;
  });
  const wrong = Cloud.user && !Cloud.user.isAnonymous && !Cloud.isTeacher;
  return h('div', { class: 'login' },
    h('div', null,
      h('p', { class: 'eyebrow' }, 'English Isle・老師'),
      h('h1', null, '老師請登入'),
      h('p', { class: 'lede' }, '登入後選學生、進到島上就能上課。右上角的「後台」可以派回家任務、看學生的練習紀錄。'),
      wrong ? h('p', { class: 'banner' }, h('b', null, '沒有權限'), h('span', null, `${Cloud.user.email} 不是老師帳號。請換一個帳號登入。`)) : null,
      h('div', { class: 'field' }, btn), msg,
      h('p', { class: 'muted sm', style: 'margin-top:18px' }, '學生不用登入，請用老師給的專屬連結打開。')),
    h('div', null, islandMap(false)));
}
async function startTeacher() {
  state.view = 'loading'; render();
  if (state.unsubs) state.unsubs.forEach(f => f && f());
  state.unsubs = [];
  await new Promise(res => {
    let first = true;
    state.unsubs.push(Cloud.watchStudents(list => {
      state.students = list;
      if (first) { first = false; res(); return; }
      if (state.view === 'dash' || state.view === 'pick') render();
    }, e => { state.error = '讀不到學生名單：' + errText(e); go('error'); res(); }));
  });
  state.unsubs.push(Cloud.watchConfig(cfg => applyConfig(cfg)));
  if (state.view !== 'error') go('pick');
}

/* ==========================================================
   這段在做什麼：前台・選學生 → 島嶼地圖 → 節慶廣場 → 上課（跟舊版一樣的流程）
   ========================================================== */
function viewPick() {
  const active = state.students.filter(s => !s.archived).sort((a, b) => a.name.localeCompare(b.name));
  const input = h('input', { id: 'student-name', type: 'text', placeholder: '學生英文名，例如 Amy', maxlength: '30', autocomplete: 'off' });
  const msg = h('p', { class: 'form-msg', 'aria-live': 'polite' });
  const btn = h('button', { class: 'btn primary', type: 'button' }, '上島');
  const go1 = async () => {
    const name = input.value.trim();
    if (!name) { input.focus(); return; }
    const found = active.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (found) { pickStudent(found); return; }
    btn.disabled = true;
    try { const sid = await Cloud.addStudent(name); pickStudent({ id: sid, name }); }
    catch (e) { msg.textContent = '新增失敗：' + errText(e); btn.disabled = false; }
  };
  btn.addEventListener('click', go1);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') go1(); });
  return h('div', null,
    migrateBanner(),
    h('div', { class: 'login' },
      h('div', null,
        h('p', { class: 'eyebrow' }, 'English Isle・上課'),
        h('h1', null, '今天誰要上島？'),
        h('p', { class: 'lede' }, '點學生的名字開始上課。新學生輸入英文名字，按「上島」。'),
        h('div', { class: 'field' }, input, btn), msg,
        active.length ? h('div', { class: 'roster' },
          h('p', { class: 'label' }, '學生'),
          h('div', { class: 'chips' }, active.map(s => h('button', { class: 'chip-btn', type: 'button', onclick: () => pickStudent(s) }, s.name)))) : null,
        micTestPanel()),
      h('div', null, islandMap(false))));
}
/* 這段在做什麼：選了學生，就讀他的學習紀錄，地圖直接打開他上次上課的區域 */
function pickStudent(s) {
  const full = state.students.find(x => x.id === s.id) || s;
  const lastL = full.lastClass && Object.values(LESSONS).find(L => L.title === full.lastClass.title);
  state.student = { id: s.id, name: s.name };
  state.zoneOpen = lastL ? lastL.zone : 'festival';
  state.detail = { sid: s.id, loaded: false, sessions: [], homework: [], practice: [], logs: [] };
  go('map');
  loadDetail(s.id);
}
function openZone(z) {
  if (state.mode === 'student') { go('shome', z.action === 'history' ? 'report' : 'class'); return; }
  if (z.action === 'history') { openStudent(state.student.id, 'class'); return; }
  state.zoneOpen = z.id; render();
  const p = $('#zone-panel'); if (p) p.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function viewMap() {
  const z = ZONES.find(x => x.id === state.zoneOpen) || ZONES[0];
  return h('div', null,
    h('div', { class: 'page-head' },
      h('div', null, h('p', { class: 'eyebrow' }, '島嶼地圖'), h('h1', { class: 'h1' }, `${state.student.name} 的英語島`)),
      h('p', { class: 'muted' }, '點地圖上的區域。橘色的區域已經開放。')),
    studentRecord(),
    islandMap(true),
    zonePanel(z),
    h('div', { class: 'zones' }, ZONES.map(x => h('button', { class: 'zone-card', type: 'button', 'aria-pressed': String(x.id === z.id), onclick: () => openZone(x) },
      h('span', { class: 'status' + (x.open ? ' on' : '') }, x.open ? '開放中' : '即將開放'),
      h('b', null, x.zh), h('span', { class: 'muted sm' }, x.name + '・' + x.desc)))));
}
/* 這段在做什麼：島上最上面的「學習紀錄」（上次上課、回家任務、自己練習、上次要加強） */
const sumOf = se => se.summary || summarize(se);
function studentRecord() {
  const s = state.students.find(x => x.id === state.student.id) || state.student, D = state.detail;
  const hw = s.homeworkActive, prog = s.hwProgress && hw && s.hwProgress.hwId === hw.hwId ? s.hwProgress : null;
  const last = D.loaded && D.sid === s.id ? D.sessions.find(x => LESSONS[x.lessonId]) : null;
  const work = last ? computeReport(last).work.slice(0, 4).map(x => x.label) : [];
  return h('section', { class: 'record', 'aria-label': '學習紀錄' },
    h('div', { class: 'record-head' },
      h('h2', null, '學習紀錄'),
      h('div', { class: 'tools', style: 'margin:0' },
        last ? h('button', { class: 'btn small', type: 'button', onclick: () => { state.reportSession = last; go('report'); } }, '看上次的報告') : null,
        h('button', { class: 'btn small ghost', type: 'button', onclick: () => openStudent(s.id, 'class') }, '看全部紀錄'))),
    h('div', { class: 'stat-row' },
      statBox('上次上課', s.lastClass ? `${fmtShort(s.lastClass.at)}・${s.lastClass.title}・${s.lastClass.pct}%` : '還沒上過課'),
      statBox('回家任務', hw ? `完成 ${prog ? prog.done : 0} / ${hw.total}・${fmtShort(hw.dueAt)} 截止` : '沒有回家任務'),
      statBox('自己練習', `今天 ${mins((s.daily || {})[dayKey()])} 分・近 7 天 ${mins(weekMs(s))} 分`)),
    !D.loaded ? h('p', { class: 'muted sm' }, '正在讀取上課紀錄…')
      : D.error ? h('p', { class: 'mic-err' }, '讀不到上課紀錄：' + D.error)
      : work.length ? h('p', { class: 'record-work' }, h('span', { class: 'tag' }, '上次要加強'), work.join('、')) : null);
}
function zonePanel(z) {
  const panel = h('section', { class: 'zone-panel', id: 'zone-panel' },
    h('div', { class: 'zp-head' },
      h('div', null, h('p', { class: 'eyebrow' }, z.name), h('h2', null, z.zh)),
      h('span', { class: 'status' + (z.open ? ' on' : '') }, z.open ? '開放中' : '即將開放')),
    h('p', { class: 'muted', style: 'margin-bottom:16px' }, z.desc));
  if (z.lessons) z.lessons.forEach(id => panel.append(lessonCard(LESSONS[id])));
  if (z.plan) panel.append(h('div', { style: 'margin-top:18px' },
    h('p', { class: 'eyebrow' }, z.open ? '接下來的檔期' : '預計會有'),
    h('ul', { class: 'plan-list' }, z.plan.map(p => h('li', null, p)))));
  return panel;
}

/* ==========================================================
   這段在做什麼：老師後台・學生總覽
   ========================================================== */
function viewDash() {
  const active = state.students.filter(s => !s.archived).sort((a, b) => a.name.localeCompare(b.name));
  const input = h('input', { id: 'new-student', type: 'text', placeholder: '學生英文名，例如 Amy', maxlength: '30', autocomplete: 'off' });
  const msg = h('p', { class: 'form-msg', 'aria-live': 'polite' });
  const btn = h('button', { class: 'btn primary', type: 'button' }, '新增學生');
  const add = async () => {
    const name = input.value.trim();
    if (!name) { input.focus(); return; }
    if (active.some(s => s.name.toLowerCase() === name.toLowerCase())) { msg.textContent = '已經有這個名字了。'; return; }
    btn.disabled = true;
    try { await Cloud.addStudent(name); input.value = ''; msg.textContent = ''; }
    catch (e) { msg.textContent = '新增失敗：' + errText(e); }
    btn.disabled = false;
  };
  btn.addEventListener('click', add);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });
  return h('div', null,
    h('div', { class: 'page-head' },
      h('div', null, h('p', { class: 'eyebrow' }, '老師後台'), h('h1', { class: 'h1' }, '學生總覽')),
      h('p', { class: 'muted' }, `${active.length} 位學生・資料即時更新`)),
    migrateBanner(),
    active.length ? h('div', { class: 'roster-list' }, active.map(studentRow)) : h('div', { class: 'empty' }, '還沒有學生，從下面新增第一位。'),
    h('div', { class: 'add-student' },
      h('label', { for: 'new-student' }, '新增學生（新增後會產生學生的專屬連結）'),
      h('div', { class: 'field' }, input, btn), msg),
    h('details', { class: 'help', style: 'margin-top:22px' }, h('summary', null, '麥克風測試'), micTestPanel()));
}
function studentRow(s) {
  const hw = s.homeworkActive, prog = s.hwProgress && hw && s.hwProgress.hwId === hw.hwId ? s.hwProgress : null;
  const done = prog ? prog.done : 0, total = hw ? hw.total : 0;
  return h('article', { class: 'srow' },
    h('div', { class: 'srow-main' }, h('b', null, s.name), h('span', { class: 'muted sm' }, '最後上線：' + ago(s.lastSeenAt))),
    h('div', { class: 'srow-stat' }, h('span', { class: 'k' }, '今天練習'), h('b', null, mins((s.daily || {})[dayKey()]) + ' 分')),
    h('div', { class: 'srow-stat' }, h('span', { class: 'k' }, '近 7 天'), h('b', null, mins(weekMs(s)) + ' 分')),
    h('div', { class: 'srow-hw' }, hw
      ? [h('span', { class: 'k' }, `回家任務・${fmtShort(hw.dueAt)} 截止`), h('span', { class: 'bar' }, h('i', { style: `width:${total ? done / total * 100 : 0}%` })), h('span', { class: 'sm' }, `完成 ${done} / ${total}`)]
      : h('span', { class: 'muted sm' }, '沒有回家任務')),
    h('div', { class: 'srow-stat' }, h('span', { class: 'k' }, '上次上課'), h('b', null, s.lastClass ? `${fmtShort(s.lastClass.at)}・${s.lastClass.pct}%` : '—')),
    h('div', { class: 'srow-actions' },
      h('button', { class: 'btn small primary', type: 'button', onclick: () => pickStudent(s) }, '上島上課'),
      h('button', { class: 'btn small', type: 'button', onclick: () => openStudent(s.id) }, '查看'),
      copyBtn('複製連結', () => studentLink(s.id))));
}
function copyBtn(label, getText, done) {
  const b = h('button', { class: 'btn small', type: 'button' }, label);
  b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(getText()); b.textContent = done || '已複製'; }
    catch (e) { b.textContent = '請手動複製'; }
    setTimeout(() => { b.textContent = label; }, 2500);
  });
  return b;
}
function lineMessage(s, hw) {
  const link = studentLink(s.id);
  return hw
    ? `${s.name} 的英語島回家任務：請在 ${fmtShort(hw.dueAt)} 前完成（共 ${hw.total} 題）。請用 Chrome 打開這個專屬連結：\n${link}`
    : `${s.name} 的英語島專屬連結（請用 Chrome 打開，可以練習、看上課報告）：\n${link}`;
}

/* 這段在做什麼：把這台電腦上舊版（還沒有雲端時）的上課紀錄搬上雲端 */
function migrateBanner() {
  const seen = new Set(), local = [...LS.getLive('sessions', []), ...LS.get('sessions', [])].filter(x => x && x.id && !seen.has(x.id) && seen.add(x.id));
  const done = new Set(LS.get('migrated', []));
  const todo = local.filter(s => !done.has(s.id));
  if (!todo.length) return null;
  const msg = h('span', { class: 'sm' });
  const btn = h('button', { class: 'btn small primary', type: 'button' }, '上傳到雲端');
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    const made = {};
    try {
      for (const s of todo) {
        const name = (s.studentName || 'Student').trim();
        const st = state.students.find(x => x.name.toLowerCase() === name.toLowerCase());
        const sid = st ? st.id : (made[name.toLowerCase()] || (made[name.toLowerCase()] = await Cloud.addStudent(name)));
        const copy = Object.assign({}, s, { studentId: sid });
        copy.summary = copy.summary || summarize(copy);
        await Cloud.saveSession(sid, copy);
        if (!st || !st.lastClass || st.lastClass.at < s.startedAt) await Cloud.updateStudent(sid, { lastClass: { at: s.startedAt, pct: copy.summary.pct, title: lessonOf(s).title, sessionId: s.id } });
        done.add(s.id); LS.set('migrated', [...done]);
        msg.textContent = `已上傳 ${done.size} 份…`;
      }
      msg.textContent = '全部上傳完成。';
    } catch (e) { msg.textContent = '上傳失敗：' + errText(e); btn.disabled = false; }
  });
  return h('div', { class: 'banner' }, h('b', null, '舊紀錄'), h('span', null, `這台電腦有 ${todo.length} 份還沒上傳的上課紀錄。`), btn, msg);
}

/* ==========================================================
   這段在做什麼：老師後台・單一學生
   ========================================================== */
function openStudent(sid, tab) {
  const s = state.students.find(x => x.id === sid);
  state.student = { id: sid, name: s ? s.name : '' };
  state.detail = { sid, loaded: false, sessions: [], homework: [], practice: [], logs: [] };
  go('tstudent', tab && tab !== 'start' ? tab : 'hw');
  loadDetail(sid);
}
async function loadDetail(sid) {
  try {
    const [sessions, homework, practice, logs] = await Promise.all([
      Cloud.list(sid, 'sessions', 'startedAt', 60), Cloud.list(sid, 'homework', 'createdAt', 40),
      Cloud.list(sid, 'practice', 'updatedAt', 80), Cloud.list(sid, 'logs', 'at', 500)]);
    if (state.detail.sid !== sid) return;
    Object.assign(state.detail, { loaded: true, sessions, homework, practice, logs });
  } catch (e) {
    Object.assign(state.detail, { loaded: true, error: errText(e) });
  }
  if (!state.student || state.student.id !== sid) return;
  if (state.view === 'tstudent' || state.view === 'map') render();
  else if (state.view === 'lesson') paintTutor();
}
function viewTStudent() {
  const s = state.students.find(x => x.id === state.student.id) || state.student;
  const D = state.detail, tab = state.tab || 'hw';
  const hwActive = s.homeworkActive;
  const tabs = [['hw', '回家任務'], ['class', '課堂報告'], ['log', '練習時間軸']];
  let body;
  if (!D.loaded) body = h('div', { class: 'empty' }, '載入中…');
  else if (D.error) body = h('div', { class: 'empty' }, '讀取失敗：' + D.error);
  else if (tab === 'hw') body = tHomework(s);
  else if (tab === 'class') body = tClasses(s);
  else if (tab === 'log') body = tLog(s);
  return h('div', null,
    h('div', { class: 'page-head' },
      h('div', null, h('p', { class: 'eyebrow' }, '學生'), h('h1', { class: 'h1' }, s.name)),
      h('div', { class: 'tools', style: 'margin:0' },
        h('button', { class: 'btn small primary', type: 'button', onclick: () => pickStudent(s) }, '帶這位學生上島上課'),
        copyBtn('複製學生連結', () => studentLink(s.id)),
        copyBtn('複製 LINE 訊息', () => lineMessage(s, hwActive)),
        h('a', { class: 'btn small ghost', href: studentLink(s.id), target: '_blank', rel: 'noopener' }, '用學生畫面打開'))),
    h('div', { class: 'stat-row' },
      statBox('最後上線', ago(s.lastSeenAt)),
      statBox('今天練習', mins((s.daily || {})[dayKey()]) + ' 分'),
      statBox('近 7 天', mins(weekMs(s)) + ' 分'),
      statBox('累計練習', mins(s.practiceMs) + ' 分')),
    h('nav', { class: 'tabs', 'aria-label': '學生資料' }, tabs.map(([id, label], i) =>
      h('button', { class: 'tab', type: 'button', 'aria-current': String(tab === id), onclick: () => go('tstudent', id) },
        h('span', { class: 'tab-n' }, String(i + 1)), h('span', { class: 'tab-t' }, h('b', null, label))))),
    body,
    h('p', { style: 'margin-top:28px' }, confirmBtn(s.archived ? '取消封存' : '封存這位學生', s.archived ? '確定取消封存？' : '確定封存？（會從總覽隱藏）', 'btn small ghost',
      async () => { await Cloud.updateStudent(s.id, { archived: !s.archived }); go('dash'); })));
}
const statBox = (k, v) => h('div', { class: 'stat' }, h('span', { class: 'k' }, k), h('b', null, v));

function hwProgressOf(hw, p) {
  const ctx = Object.assign({ lessonId: hw.lessonId, extra: hw.extra || [] }, p || {});
  const items = hw.items.map(ref => Object.assign({ ref }, refItem(ctx, ref))).filter(x => x.it);
  const done = items.filter(x => p && p.ratings && p.ratings[keyOf(x.st, x.it)]).length;
  return { ctx, items, done, total: items.length };
}
function tHomework(s) {
  const D = state.detail;
  if (!D.homework.length) return h('div', { class: 'empty' }, '還沒有派過回家任務。上完課後，在報告最下面就能派任務。');
  return h('div', { class: 'hw-cards' }, D.homework.map(hw => {
    const p = D.practice.find(x => x.id === hw.id);
    const { ctx, items, done, total } = hwProgressOf(hw, p);
    const active = s.homeworkActive && s.homeworkActive.hwId === hw.id;
    return h('section', { class: 's-card' },
      h('div', { class: 'zp-head' },
        h('div', null, h('p', { class: 'eyebrow' }, `派出 ${fmtShort(hw.createdAt)}・${fmtShort(hw.dueAt)} 截止`), h('h2', null, hw.title)),
        h('span', { class: 'status' + (active ? ' on' : '') }, active ? '進行中' : '已結束')),
      h('div', { class: 'p-progress' }, h('span', { class: 'bar' }, h('i', { style: `width:${total ? done / total * 100 : 0}%` })),
        h('span', { class: 'sm' }, `完成 ${done} / ${total}・練習 ${mins(p && p.activeMs)} 分鐘${p && p.updatedAt ? '・最後練習 ' + ago(p.updatedAt) : ''}`)),
      h('div', { class: 'tbl-wrap' }, h('table', { class: 'tbl dark' },
        h('thead', null, h('tr', null, h('th', null, '題目'), h('th', null, '原因'), h('th', null, '結果'), h('th', null, '學生說的'))),
        h('tbody', null, items.map(x => {
          const k = keyOf(x.st, x.it), r = p && p.ratings && p.ratings[k];
          return h('tr', null,
            h('td', null, itemLabel(x.st, x.it, itemsOf(x.st, ctx).indexOf(x.it))),
            h('td', null, h('span', { class: 'pill' }, x.ref.reason || '')),
            h('td', null, r ? candyRow(r) : h('span', { class: 'muted sm' }, '還沒做')),
            h('td', { class: 'said-cell' }, (p && p.said && p.said[k]) || ''));
        })))));
  }));
}
function tClasses() {
  const D = state.detail;
  if (!D.sessions.length) return h('div', { class: 'empty' }, '還沒有上課紀錄。到「開始上課」開始第一堂課。');
  return h('div', { class: 'hist' }, D.sessions.map(se => {
    const sm = se.summary || summarize(se), L = LESSONS[se.lessonId];
    return h('div', { class: 'hist-row' },
      h('div', null, h('b', null, L ? L.title : se.lessonId), h('p', { class: 'muted sm' }, `${fmtDate(se.startedAt)} ${fmtTime(se.startedAt)}・${fmtMin(se.activeMs)}・${sm.title}`)),
      h('div', { class: 'hist-pct' }, h('span', null, `${sm.candies} / ${sm.max} 顆糖・${sm.pct}%`), h('span', { class: 'bar' }, h('i', { style: `width:${sm.pct}%` }))),
      h('div', { class: 'hist-actions' }, h('button', { class: 'btn small primary', type: 'button', onclick: () => { state.reportSession = se; go('report'); } }, '看報告')));
  }));
}
const LOG_TEXT = {
  open: () => '打開專屬連結',
  start: e => e.hwId ? '開始回家任務' : `開始自由練習${e.stage ? '：' + e.stage : ''}`,
  pause: e => `離開練習（這次 ${mins(e.activeMs)} 分鐘）`,
  finish: e => `完成練習：${e.done} / ${e.total} 題，拿到 ${e.candies} 顆糖`,
  answer: e => e.label
};
function tLog(s) {
  const D = state.detail;
  if (!D.logs.length) return h('div', { class: 'empty' }, '學生還沒有練習紀錄。把專屬連結傳給學生後，這裡會出現每一次的練習。');
  const days = new Map();
  D.logs.forEach(e => { const k = dayKey(e.at); if (!days.has(k)) days.set(k, []); days.get(k).push(e); });
  return h('div', { class: 'log' }, [...days.entries()].map(([k, list]) => h('section', { class: 'log-day' },
    h('h3', null, fmtDate(list[0].at), h('span', { class: 'muted sm' }, `・練習 ${mins((s.daily || {})[k])} 分鐘・${list.filter(e => e.type === 'answer').length} 次作答`)),
    h('ol', { class: 'log-list' }, list.map(e => h('li', { class: 'log-row ' + e.type },
      h('span', { class: 'log-t' }, fmtTime(e.at)),
      h('span', { class: 'log-x' }, (LOG_TEXT[e.type] || (() => e.type))(e)),
      e.type === 'answer' ? h('span', { class: 'log-r' }, e.rating ? candyRow(e.rating) : '') : null,
      e.type === 'answer' && e.said ? h('span', { class: 'log-said' }, '「' + e.said + '」') : null))))));
}

/* ==========================================================
   這段在做什麼：下課，存到雲端、產生報告
   ========================================================== */
async function endLesson() {
  const s = state.session; if (!s) return;
  Speech.abort();
  s.endedAt = Date.now();
  s.summary = summarize(s);
  s.updatedAt = Date.now();
  LS.del('draft:' + s.studentId);
  state.reportSession = s; state.session = null; state.drawer = false;
  state.detail.sessions = [s, ...(state.detail.sessions || []).filter(x => x.id !== s.id)];
  go('report');
  try {
    await Cloud.saveSession(s.studentId, s);
    await Cloud.updateStudent(s.studentId, { lastClass: { at: s.startedAt, pct: s.summary.pct, title: lessonOf(s).title, sessionId: s.id } });
  } catch (e) {
    const local = LS.get('sessions', []); local.push(s); LS.set('sessions', local);
    const st = $('#save-status'); if (st) st.textContent = '雲端儲存失敗，已先存在這台電腦。到學生總覽可以重新上傳。';
  }
}

/* ---------- 報告（老師可以編輯、派任務；學生只能看） ---------- */
function viewReport() {
  const s = state.reportSession;
  if (!s) return h('div', { class: 'empty' }, '找不到這份報告。');
  const teacher = state.mode === 'teacher';
  const L = lessonOf(s), R = computeReport(s);
  const paper = h('article', { class: 'paper' },
    h('header', null,
      h('p', { class: 'eyebrow' }, 'English Isle 上課報告'),
      h('h1', null, `${s.studentName}・${L.title} ${L.zh}`),
      h('div', { class: 'meta' },
        h('span', null, fmtDate(s.startedAt) + ' ' + fmtTime(s.startedAt)),
        h('span', null, '上課 ' + fmtMin(s.activeMs)),
        h('span', null, L.level))),
    h('section', { class: 'score' },
      h('p', { class: 'big' }, String(R.earned), h('small', null, `/ ${R.max} 顆糖`)),
      h('div', { class: 'score-meta' },
        h('span', { class: 'badge' }, R.title),
        h('span', null, `得分率 ${R.pct}%・完成 ${R.rated} / ${R.total} 題・加分 ${R.bonus} 顆`),
        h('span', null, `開口說了 ${R.attempts} 次，共 ${R.words} 個英文字・看提示 ${R.hints} 次`))),
    h('section', null, h('h3', null, '能力分數（滿分 5）'),
      R.rated ? null : h('p', { class: 'empty-note' }, '還沒有評分。'),
      h('div', { class: 'bars' }, R.dims.filter(d => d.score != null).map(d => h('div', { class: 'bar-row' },
        h('span', null, d.zh),
        h('span', { class: 'bar' }, h('i', { style: `width:${d.score ? d.score / 5 * 100 : 0}%` })),
        h('b', null, d.score == null ? '—' : d.score.toFixed(1)))))),
    h('section', null, h('h3', null, '各關卡'),
      h('div', { class: 'tbl-wrap' }, h('table', { class: 'tbl' },
        h('thead', null, h('tr', null, h('th', null, '關卡'), h('th', { class: 'num' }, '完成'), h('th', { class: 'num' }, '得分'), h('th', { class: 'num' }, '加分'))),
        h('tbody', null, R.stages.map(x => h('tr', null,
          h('td', null, `${x.zh} ${x.title}`),
          h('td', { class: 'num' }, `${x.rated} / ${x.count}`),
          h('td', { class: 'num' }, x.max ? `${x.earned} / ${x.max}` : '—'),
          h('td', { class: 'num' }, x.bonus ? '+' + x.bonus : '—'))))))),
    h('section', null, h('h3', null, '做得好的地方'),
      R.highlights.length ? h('ul', { class: 'list' }, R.highlights.slice(0, 6).map(x => h('li', null,
        h('b', null, x.label), h('span', { class: 'empty-note' }, '・' + x.stage),
        x.said ? h('p', { class: 'said' }, '「' + x.said + '」') : null,
        x.note ? h('p', { class: 'empty-note' }, '老師筆記：' + x.note) : null)))
        : h('p', { class: 'empty-note' }, '這堂課還沒有 3 顆糖的題目。')),
    h('section', null, h('h3', null, '下次要加強'),
      R.work.length ? h('ul', { class: 'list' }, R.work.slice(0, 8).map(x => h('li', null,
        h('b', null, x.label), x.flags.map(f => h('span', { class: 'fl' }, f)),
        x.said ? h('p', { class: 'said' }, (x.test ? '作答：「' : '電腦聽到：「') + x.said + '」') : null,
        x.note ? h('p', { class: 'empty-note' }, '老師筆記：' + x.note) : null)))
        : h('p', { class: 'empty-note' }, '沒有需要特別加強的題目。')));
  if (teacher) {
    const sid = s.studentId;
    const save = (field, el) => {
      el.addEventListener('input', () => { s[field] = el.value; });
      el.addEventListener('change', () => { s[field] = el.value; s.updatedAt = Date.now(); Cloud.patchSession(sid, s.id, { [field]: el.value, updatedAt: s.updatedAt }).catch(() => {}); });
      return el;
    };
    const note = save('teacherNote', h('textarea', { id: 'teacher-note', placeholder: '寫給家長的話。也可以按下面「複製給 Claude 寫評語」，再把 Claude 寫好的貼回來。', value: s.teacherNote || '' }));
    const nextNote = save('nextNote', h('textarea', { id: 'next-note', placeholder: '下次上課要練什麼（選填）', value: s.nextNote || '' }));
    const status = h('p', { class: 'copy-status', 'aria-live': 'polite' });
    const fallback = h('div');
    paper.append(
      h('section', null, h('h3', null, '老師評語（學生和家長看得到）'), note),
      h('section', null, h('h3', null, '下次上課'), nextNote),
      h('section', { class: 'copy-row' },
        h('button', { class: 'btn primary', type: 'button', onclick: () => copyText(reportText(s, R), status, fallback, '已複製，可以直接貼到 LINE。') }, '複製給家長（LINE）'),
        h('button', { class: 'btn', type: 'button', onclick: () => copyText(claudePrompt(s, R), status, fallback, '已複製。打開 Claude 貼上，把它寫的評語貼回「老師評語」。') }, '複製給 Claude 寫評語'),
        status),
      fallback,
      h('p', { class: 'copy-status', id: 'save-status' }),
      homeworkBuilder(s));
  } else {
    if ((s.teacherNote || '').trim()) paper.append(h('section', null, h('h3', null, '老師的話'), h('p', { class: 'note-text' }, s.teacherNote)));
    if ((s.nextNote || '').trim()) paper.append(h('section', null, h('h3', null, '下次上課'), h('p', { class: 'note-text' }, s.nextNote)));
  }
  return h('div', null,
    h('div', { class: 'report-tools' },
      teacher ? [h('button', { class: 'btn small ghost', type: 'button', onclick: () => { state.student = { id: s.studentId, name: s.studentName }; go('map'); } }, '← 回島上'),
        h('button', { class: 'btn small ghost', type: 'button', onclick: () => openStudent(s.studentId, 'class') }, '看這位學生的後台')]
              : h('button', { class: 'btn small ghost', type: 'button', onclick: () => go('shome', 'report') }, '← 回我的島')),
    paper);
}

/* ==========================================================
   這段在做什麼：派回家任務（從這堂課的表現自動挑題，老師可以改）
   ========================================================== */
function suggestHomework(s) {
  const L = lessonOf(s), out = [];
  L.stages.forEach(st => itemsOf(st, s).forEach(it => {
    const k = keyOf(st, it), r = s.ratings[k], fl = (s.flags[k] || []).length, kind = kindOf(st, it);
    let reason = null, pri = 9;
    if (r === 1 || fl) { reason = '再練一次'; pri = 1; }
    else if (kind === 'shadow') { reason = '跟讀'; pri = 2; }
    else if (r === 2 && kind !== 'catch') { reason = '可以更好'; pri = 3; }
    else if (!r && kind !== 'catch') { reason = '課堂沒做到'; pri = 4; }
    if (reason) out.push({ k, reason, pri });
  }));
  out.sort((a, b) => a.pri - b.pri);
  const pick = out.slice(0, 12);
  if (pick.length < 6) {
    L.stages.forEach(st => itemsOf(st, s).forEach(it => {
      const k = keyOf(st, it);
      if (pick.length < 6 && kindOf(st, it) === 'panel' && !pick.some(x => x.k === k)) pick.push({ k, reason: '說故事複習' });
    }));
  }
  return new Map(pick.map(x => [x.k, x.reason]));
}
function homeworkBuilder(s) {
  const sid = s.studentId, hwId = 'hw_' + s.id, L = lessonOf(s);
  const existing = (state.detail.homework || []).find(x => x.id === hwId);
  const sugg = suggestHomework(s);
  const chosen = new Map(existing ? existing.items.map(x => [x.stageId + '__' + x.itemId, x.reason]) : sugg);
  const due = h('input', { type: 'date', id: 'hw-due', value: toDateInput(existing ? existing.dueAt : Date.now() + 7 * 864e5) });
  const note = h('textarea', { id: 'hw-note', value: existing ? existing.note : '下次上課前，每天練 10 分鐘。每一題先按「聽」，再開口說。' });
  const count = h('span', { class: 'empty-note' });
  const paintCount = () => { count.textContent = `已選 ${chosen.size} 題`; };
  const groups = L.stages.map(st => h('div', { class: 'hw-group' },
    h('p', { class: 'eyebrow' }, `${st.zh} ${st.title}`),
    itemsOf(st, s).map((it, idx) => {
      const k = keyOf(st, it), id = 'hwc-' + k.replace(/[^\w-]/g, '_');
      const cb = h('input', { type: 'checkbox', id, checked: chosen.has(k) });
      cb.addEventListener('change', () => { if (cb.checked) chosen.set(k, sugg.get(k) || '老師加的'); else chosen.delete(k); paintCount(); });
      const r = s.ratings[k];
      return h('label', { class: 'hw-item', for: id }, cb,
        h('span', { class: 'hw-label' }, itemLabel(st, it, idx)),
        sugg.has(k) ? h('span', { class: 'fl' }, sugg.get(k)) : null,
        r ? h('span', { class: 'empty-note' }, `課堂 ${r} 顆`) : null);
    })));
  const status = h('p', { class: 'copy-status', 'aria-live': 'polite' });
  const after = h('div', { class: 'copy-row' });
  const send = h('button', { class: 'btn primary', type: 'button' }, existing ? '更新回家任務' : '派出回家任務');
  send.addEventListener('click', async () => {
    if (!chosen.size) { status.textContent = '至少要選一題。'; return; }
    if (!due.value) { status.textContent = '請選截止日期。'; return; }
    const items = [];
    L.stages.forEach(st => itemsOf(st, s).forEach(it => { const k = keyOf(st, it); if (chosen.has(k)) items.push({ stageId: st.id, itemId: it.id, reason: chosen.get(k) }); }));
    const hw = {
      id: hwId, sessionId: s.id, lessonId: s.lessonId, title: `${L.title} 回家任務`,
      createdAt: existing ? existing.createdAt : Date.now(), updatedAt: Date.now(), createdBy: Cloud.user.email,
      dueAt: endOfDay(due.value), note: note.value.trim(), items, extra: s.extra || []
    };
    send.disabled = true; status.textContent = '派送中…';
    try {
      await Cloud.saveHomework(sid, hw);
      await Cloud.updateStudent(sid, { homeworkActive: { hwId, dueAt: hw.dueAt, total: items.length, title: hw.title } });
      state.detail.homework = [hw, ...(state.detail.homework || []).filter(x => x.id !== hwId)];
      status.textContent = '已派出。把下面的訊息傳給家長就可以了。';
      send.textContent = '更新回家任務';
      const st = { id: sid, name: s.studentName };
      after.replaceChildren(copyBtn('複製 LINE 訊息', () => lineMessage(st, { dueAt: hw.dueAt, total: items.length })), copyBtn('複製學生連結', () => studentLink(sid)));
    } catch (e) { status.textContent = '派送失敗：' + errText(e); }
    send.disabled = false;
  });
  paintCount();
  return h('section', { class: 'hw-builder' },
    h('h3', null, existing ? '回家任務（已派出，可以修改）' : '派回家任務'),
    h('p', { class: 'empty-note' }, '已經依照這堂課的表現先勾好：拿 1 顆糖或被標記的題目、跟讀句子、課堂沒做到的題目。可以自己增減。'),
    h('div', { class: 'hw-meta' },
      h('label', { for: 'hw-due' }, '截止日（下次上課那天）'), due,
      h('label', { for: 'hw-note' }, '給學生的話'), note),
    h('div', { class: 'hw-groups' }, groups),
    h('div', { class: 'copy-row' }, send, count),
    status, after);
}

/* ==========================================================
   這段在做什麼：學生頁面（用專屬連結打開）
   ========================================================== */
async function startStudent(sid) {
  state.mode = 'student';
  state.view = 'loading'; render();
  try {
    await Cloud.signInStudent();
    const st = await Cloud.getStudent(sid);
    if (!st) { state.error = '這個連結找不到學生資料。請跟老師確認連結是否完整。'; go('error'); return; }
    state.student = { id: sid, name: st.name };
    state.me.student = st;
    const [sessions, homework, practice, cfg] = await Promise.all([
      Cloud.list(sid, 'sessions', 'startedAt', 60), Cloud.list(sid, 'homework', 'createdAt', 20),
      Cloud.list(sid, 'practice', 'updatedAt', 80), Cloud.getConfig()]);
    applyConfig(cfg);
    state.me.sessions = sessions; state.me.homework = homework;
    state.me.practice = {}; practice.forEach(p => { state.me.practice[p.id] = p; });
    Cloud.log(sid, { type: 'open' });
    Cloud.touch(sid, 0);
    go('shome', activeHomework() ? 'hw' : 'class');
  } catch (e) {
    state.error = '連不上雲端：' + errText(e) + '。請確認網路，再重新整理。';
    go('error');
  }
}
function activeHomework() {
  const a = state.me.student && state.me.student.homeworkActive;
  return (a && state.me.homework.find(x => x.id === a.hwId)) || null;
}
function viewSHome() {
  const st = state.student, hw = activeHomework(), tab = state.tab || 'hw';
  const tabs = [['hw', '回家任務'], ['class', '上課內容'], ['report', '我的報告']];
  return h('div', null,
    h('div', { class: 's-hero' },
      h('div', null,
        h('p', { class: 'eyebrow' }, 'English Isle'),
        h('h1', { class: 'h1' }, `${st.name} 的英語島`),
        h('p', { class: 'lede' }, hw ? `下次上課前要完成「${hw.title}」，${fmtShort(hw.dueAt)} 截止。` : '目前沒有回家任務，可以到「上課內容」挑一關自由練習。')),
      h('div', { class: 's-map' }, islandMap(false))),
    h('nav', { class: 'tabs', 'aria-label': '我的島' }, tabs.map(([id, label], i) =>
      h('button', { class: 'tab', type: 'button', 'aria-current': String(tab === id), onclick: () => go('shome', id) },
        h('span', { class: 'tab-n' }, String(i + 1)), h('span', { class: 'tab-t' }, h('b', null, label))))),
    tab === 'hw' ? sHomework(hw) : tab === 'class' ? sClasses() : sReports(),
    h('details', { class: 'help', style: 'margin-top:22px' }, h('summary', null, '麥克風測試（第一次練習前先試一次）'), micTestPanel()));
}
function sHomework(hw) {
  if (!hw) return h('div', { class: 'empty' }, '目前沒有回家任務。可以到「上課內容」挑一關自由練習。');
  const p = state.me.practice[hw.id];
  const { ctx, items, done, total } = hwProgressOf(hw, p);
  const day0 = new Date(); day0.setHours(0, 0, 0, 0);
  const dueDay = new Date(hw.dueAt); dueDay.setHours(0, 0, 0, 0);
  const days = Math.round((dueDay - day0) / 864e5);
  const dueText = done === total ? '全部完成' : days < 0 ? `已過截止日（${fmtShort(hw.dueAt)}）` : days === 0 ? '今天截止' : `還有 ${days} 天`;
  return h('section', { class: 's-card' },
    h('div', { class: 'zp-head' },
      h('div', null, h('p', { class: 'eyebrow' }, `${fmtShort(hw.dueAt)} 前完成`), h('h2', null, hw.title)),
      h('span', { class: 'status' + (done === total ? ' on' : '') }, dueText)),
    hw.note ? h('p', { class: 'hw-note' }, h('span', { class: 'tag' }, '老師說'), hw.note) : null,
    h('div', { class: 'p-progress' }, h('span', { class: 'bar' }, h('i', { style: `width:${total ? done / total * 100 : 0}%` })), h('span', { class: 'sm' }, `完成 ${done} / ${total} 題`)),
    h('ol', { class: 'hw-list' }, items.map(x => {
      const k = keyOf(x.st, x.it), r = p && p.ratings && p.ratings[k];
      return h('li', { class: r ? 'done' : '' },
        h('span', { class: 'hw-check', 'aria-hidden': 'true' }, r ? '✓' : ''),
        h('span', { class: 'hw-label' }, itemLabel(x.st, x.it, itemsOf(x.st, ctx).indexOf(x.it))),
        x.ref.reason ? h('span', { class: 'pill' }, x.ref.reason) : null,
        h('span', { class: 'muted sm' }, x.st.zh),
        r ? candyRow(r) : null);
    })),
    h('div', { class: 'lc-actions' }, h('button', { class: 'btn primary', type: 'button', onclick: () => startHomework(hw) },
      done === 0 ? '開始練習' : done === total ? '再練一次' : `繼續練習（還有 ${total - done} 題）`)));
}
function sClasses() {
  const list = state.me.sessions;
  if (!list.length) return h('div', { class: 'empty' }, '還沒有上課紀錄。上完第一堂課，這裡會出現上課的內容。');
  return h('div', { class: 'hw-cards' }, list.map(se => {
    const L = LESSONS[se.lessonId]; if (!L) return null;
    return h('section', { class: 's-card' },
      h('div', { class: 'zp-head' },
        h('div', null, h('p', { class: 'eyebrow' }, fmtDate(se.startedAt)), h('h2', null, `${L.title} ${L.zh}`)),
        h('button', { class: 'btn small', type: 'button', onclick: () => { state.reportSession = se; go('sreport'); } }, '看報告')),
      h('div', { class: 'stage-list' }, L.stages.map(st => h('div', { class: 'stage-li' },
        h('div', null, h('b', null, st.zh), h('span', { class: 'muted sm' }, ` ${st.title}・${itemsOf(st, se).length} 題`)),
        h('button', { class: 'btn small primary', type: 'button', onclick: () => startFree(se, st) }, '練習這一關')))));
  }));
}
function sReports() {
  const list = state.me.sessions;
  if (!list.length) return h('div', { class: 'empty' }, '還沒有報告。');
  return h('div', { class: 'hist' }, list.map(se => {
    const sm = se.summary || summarize(se), L = LESSONS[se.lessonId];
    return h('div', { class: 'hist-row' },
      h('div', null, h('b', null, L ? L.title : se.lessonId), h('p', { class: 'muted sm' }, `${fmtDate(se.startedAt)}・${sm.title}`)),
      h('div', { class: 'hist-pct' }, h('span', null, `${sm.candies} / ${sm.max} 顆糖・${sm.pct}%`), h('span', { class: 'bar' }, h('i', { style: `width:${sm.pct}%` }))),
      h('div', { class: 'hist-actions' }, h('button', { class: 'btn small primary', type: 'button', onclick: () => { state.reportSession = se; go('sreport'); } }, '看報告')));
  }));
}

/* ==========================================================
   這段在做什麼：學生練習（回家任務、自由練習）
   電腦自動給分，每次作答都記到時間軸，老師後台看得到
   ========================================================== */
function blankPractice(id, extra) {
  return { id, startedAt: Date.now(), updatedAt: Date.now(), activeMs: 0, ratings: {}, manual: {}, bonus: {}, flags: {}, notes: {},
    hints: {}, said: {}, evals: {}, caught: {}, stats: { attempts: 0, words: 0 }, extra: extra || [] };
}
function startHomework(hw) {
  const old = state.me.practice[hw.id];
  const doc = Object.assign(blankPractice(hw.id, hw.extra), old ? plain(old) : {}, { kind: 'hw', hwId: hw.id, lessonId: hw.lessonId, extra: hw.extra || [] });
  const list = hw.items.map(r => ({ stageId: r.stageId, itemId: r.itemId })).filter(r => refItem(doc, r).it);
  if (!list.length) return;
  const first = list.findIndex(r => { const x = refItem(doc, r); return !doc.ratings[keyOf(x.st, x.it)]; });
  state.session = doc;
  state.practice = { kind: 'hw', hwId: hw.id, title: hw.title, list, idx: first < 0 ? 0 : first, startCandies: practiceCandies(doc, list) };
  Practice.reset();
  Cloud.log(state.student.id, { type: 'start', pid: doc.id, hwId: hw.id });
  go('practice');
}
function startFree(se, st) {
  const doc = Object.assign(blankPractice('free_' + newId(), se.extra), { kind: 'free', lessonId: se.lessonId, stageId: st.id });
  const list = itemsOf(st, doc).map(it => ({ stageId: st.id, itemId: it.id }));
  state.session = doc;
  state.practice = { kind: 'free', hwId: null, title: `${st.zh} ${st.title}`, list, idx: 0, startCandies: 0 };
  Practice.reset();
  Cloud.log(state.student.id, { type: 'start', pid: doc.id, stage: st.zh });
  go('practice');
}
function practiceCandies(s, list) {
  return list.reduce((a, r) => { const x = refItem(s, r); return a + ((x.it && s.ratings[keyOf(x.st, x.it)]) || 0); }, 0);
}
function viewPractice() {
  const P = state.practice;
  return h('div', null,
    h('div', { class: 'lesson-head' },
      h('div', { class: 'lh-left' },
        h('button', { class: 'btn small ghost', type: 'button', onclick: () => Practice.leave() }, '← 回我的島'),
        h('div', null,
          h('p', { class: 'eyebrow' }, P.kind === 'hw' ? '回家任務' : '自由練習'),
          h('h1', { class: 'lesson-title' }, P.title))),
      h('div', { class: 'lh-right' },
        h('div', { class: 'counter', id: 'counter', 'aria-label': '糖果數' }, svg(ICON.candy), h('span', { id: 'candy-n' }, '0')),
        h('span', { class: 'timer', id: 'timer', title: '練習時間' }, '00:00'),
        h('button', { class: 'btn small', type: 'button', id: 'slow-btn', 'aria-pressed': String(!!state.settings.slow), onclick: toggleSlow }, state.settings.slow ? '慢速語音：開' : '慢速語音：關'))),
    h('div', { class: 'p-progress top' }, h('span', { class: 'bar' }, h('i', { id: 'p-bar' })), h('span', { class: 'sm', id: 'p-count' })),
    h('section', { class: 'stage', id: 'stage' }),
    h('section', { class: 'tutor', id: 'tutor', 'aria-label': '練習區' }));
}
function paintPractice() { paintCounter(false); paintStage(); paintTutor(); }
function paintProgress() {
  const P = state.practice, s = state.session; if (!P) return;
  const done = P.list.filter(r => { const x = refItem(s, r); return x.it && s.ratings[keyOf(x.st, x.it)]; }).length;
  const bar = $('#p-bar'), c = $('#p-count');
  if (bar) bar.style.width = (P.list.length ? done / P.list.length * 100 : 0) + '%';
  if (c) c.textContent = `完成 ${done} / ${P.list.length} 題`;
}
function paintStudentPanel() {
  const el = $('#tutor'); if (!el) return;
  const P = state.practice, s = state.session, k = curKey(), r = s.ratings[k] || 0;
  const last = P.idx === P.list.length - 1;
  el.replaceChildren(
    h('div', { class: 'tutor-head' },
      h('h2', null, `第 ${P.idx + 1} / ${P.list.length} 題`),
      h('span', { class: 'suggest' }, TEST_KINDS.includes(kindOf(curStage(), curItem()))
        ? (r ? `這題拿到 ${r} 顆糖${r < 3 ? '。想拿更多，可以按「重做這題」' : '，太棒了'}` : '作答之後，電腦會馬上改，答對就有糖果')
        : (r ? `這題拿到 ${r} 顆糖${r < 3 ? '。想拿更多，可以再說一次' : '，太棒了'}` : '先按「聽」，再按麥克風說說看，電腦會給你糖果'))),
    h('div', { class: 'tnav' },
      h('button', { class: 'btn small', type: 'button', disabled: P.idx === 0, onclick: () => Practice.move(-1) }, '← 上一題'),
      h('span', { class: 'spacer' }),
      last ? h('button', { class: 'btn primary', type: 'button', onclick: () => Practice.finish() }, '完成練習')
           : h('button', { class: 'btn primary', type: 'button', onclick: () => Practice.move(1) }, r ? '下一題 →' : '先跳過 →')));
  paintProgress();
}
const Practice = {
  saveT: null, pendingMs: 0, logged: {},
  reset() { this.pendingMs = 0; this.logged = {}; clearTimeout(this.saveT); },
  saveSoon() { clearTimeout(this.saveT); this.saveT = setTimeout(() => this.save(), 1500); },
  async save() {
    clearTimeout(this.saveT);
    const s = state.session, P = state.practice; if (!s || !P || !state.student) return;
    s.updatedAt = Date.now();
    state.me.practice[s.id] = plain(s);
    try {
      await Cloud.savePractice(state.student.id, s);
      if (P.kind === 'hw') {
        const done = P.list.filter(r => { const x = refItem(s, r); return x.it && s.ratings[keyOf(x.st, x.it)]; }).length;
        await Cloud.updateStudent(state.student.id, { hwProgress: { hwId: P.hwId, done, total: P.list.length, updatedAt: Date.now() } });
      }
    } catch (e) { /* 離線時 Firebase 會自動排隊，連線後再送 */ }
  },
  onRated(k) {
    const s = state.session, r = s.ratings[k] || 0, sig = r + '|' + (s.said[k] || '');
    if (this.logged[k] === sig) return;
    this.logged[k] = sig;
    const st = curStage(), it = curItem();
    Cloud.log(state.student.id, {
      type: 'answer', pid: s.id, hwId: state.practice.hwId || null, itemKey: k,
      label: itemLabel(st, it, itemsOf(st, s).indexOf(it)), rating: r,
      said: clip(s.said[k] || '', 140), words: (s.evals[k] && s.evals[k].wc) || 0
    });
    this.saveSoon();
  },
  onTick(dt) { this.pendingMs += dt; if (this.pendingMs >= 30000) this.flushTime(); },
  flushTime() { const ms = this.pendingMs; this.pendingMs = 0; if (ms > 0 && state.student) Cloud.touch(state.student.id, ms); },
  move(d) {
    const P = state.practice;
    P.idx = Math.max(0, Math.min(P.list.length - 1, P.idx + d));
    Speech.abort(); VOICE.stop();
    paintStage(); paintTutor();
    $('#stage').scrollIntoView({ block: 'start', behavior: 'smooth' });
  },
  async finish() {
    const s = state.session, P = state.practice; if (!s || !P) return;
    Speech.abort(); VOICE.stop();
    s.finishedAt = Date.now();
    this.flushTime();
    const done = P.list.filter(r => { const x = refItem(s, r); return x.it && s.ratings[keyOf(x.st, x.it)]; }).length;
    const candies = practiceCandies(s, P.list);
    state.lastDone = { title: P.title, kind: P.kind, done, total: P.list.length, candies, gained: Math.max(0, candies - (P.startCandies || 0)), ms: s.activeMs };
    Cloud.log(state.student.id, { type: 'finish', pid: s.id, hwId: P.hwId || null, done, total: P.list.length, candies, activeMs: s.activeMs });
    await this.save();
    state.practice = null; state.session = null;
    go('pdone');
  },
  leave() {
    const s = state.session, P = state.practice;
    if (s && P) {
      this.flushTime();
      this.save();
      Cloud.log(state.student.id, { type: 'pause', pid: s.id, hwId: P.hwId || null, activeMs: s.activeMs });
    }
    state.practice = null; state.session = null;
    go('shome');
  }
};
function viewPracticeDone() {
  const D = state.lastDone || { done: 0, total: 0, candies: 0, ms: 0 };
  const all = D.done === D.total;
  return h('div', { class: 's-card done-card' },
    h('p', { class: 'eyebrow' }, D.kind === 'hw' ? '回家任務' : '自由練習'),
    h('h1', { class: 'h1' }, all ? 'Great job! 全部完成了' : `完成 ${D.done} / ${D.total} 題`),
    h('p', { class: 'earn' }, candyRow(3), `這次練習拿到 ${D.gained} 顆糖，總共 ${D.candies} 顆`),
    h('p', { class: 'lede' }, `練習了 ${fmtMin(D.ms)}。${all ? '老師會看到你的練習紀錄。' : '還沒做完的題目，下次打開會從那裡繼續。'}`),
    h('div', { class: 'lc-actions' }, h('button', { class: 'btn primary', type: 'button', onclick: () => go('shome', 'hw') }, '回我的島')));
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && state.view === 'practice') { Practice.flushTime(); Practice.save(); }
});

/* ==========================================================
   這段在做什麼：開始（看網址決定是老師後台還是學生頁面）
   ========================================================== */
(async function boot() {
  const m = location.hash.match(/s=([a-z0-9]{12,40})/);
  state.mode = m ? 'student' : 'teacher';
  render();
  VOICE.load();
  if (!Cloud.configured()) { go('setup'); return; }
  try { await Cloud.init(); }
  catch (e) { state.error = '連不上雲端：' + errText(e) + '。請確認網路，再重新整理。'; go('error'); return; }
  if (m) { startStudent(m[1]); return; }
  const u = await Cloud.waitUser();
  Cloud.setUser(u);
  if (Cloud.isTeacher) startTeacher(); else go('tsignin');
})();
window.addEventListener('hashchange', () => location.reload());

/* 測試用：模擬學生說了一句話（不影響正常使用） */
window.isleDebug = {
  state, Cloud,
  say(text) {
    const st = curStage(), it = curItem(), k = keyOf(st, it), kind = kindOf(st, it);
    const ev = kind === 'word' ? (t, a) => evalWord(it, t, a) : kind === 'shadow' ? t => evalShadow(it.text, t) : kind === 'panel' ? t => evalPanel(it, t) : t => evalOpen(it.expect || {}, t);
    handleSpeech(k, text, [], ev); if (kind === 'panel') paintStage();
  },
  async emuTeacher(email) {
    const f = Cloud.fb;
    const cred = f.GoogleAuthProvider.credential(JSON.stringify({ sub: 'emu-' + email, email, email_verified: true }));
    const r = await f.signInWithCredential(Cloud.auth, cred);
    Cloud.setUser(r.user);
    if (Cloud.isTeacher) await startTeacher(); else render();
  }
};
