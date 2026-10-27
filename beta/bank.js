'use strict';

/* ==========================================================
   這段在做什麼：段考題庫（學生刷題、老師挑題上課、印學習單都用這裡）
   每一份題庫標好年級、版本、冊次、第幾次段考。之後加國中、會考，只要再加一份。
   題目照課本單字和句型自己出（source 是「英語島自命題」）。
   收進學校公開的真實考題時，source 寫「學校＋學年＋段考」，圖片換成我們自己的。
   題型 type：choice 選擇（有 audio 是聽力、有 passage 是閱讀）、order 句子重組、spell 拼字
   choice 的 answer 是 options 裡正確答案的位置（從 0 開始）。畫面上的選項順序會打亂，但每題固定。
   ========================================================== */
const BANKS = {};
(() => {  // 題庫的小工具只在這個檔案裡用，不會跟 app.js 的名字撞到
const OWN = '英語島自命題';
function addBank(meta, build) {
  const qs = [];
  const add = (q, unit) => qs.push(Object.assign({ type: 'choice', source: OWN, unit }, q));
  build(add);
  const ids = new Set();
  qs.forEach(q => { if (ids.has(q.id)) throw new Error('題號重複：' + q.id); ids.add(q.id); });
  BANKS[meta.id] = Object.assign(meta, { questions: qs });
}
/* 小工具：從清單裡挑出不是 x 的前 n 個，當干擾選項 */
const others = (list, x, n, key) => list.filter(y => (key ? y[key] : y) !== (key ? x[key] : x)).slice(0, n);
const rotate = (list, i) => list.slice(i).concat(list.slice(0, i));
/* 發音題：把字裡的字母組合換成空格，例如 bird → b _ _ d */
function phonicsMask(word, pat) {
  const i = word.indexOf(pat);
  return (word.slice(0, i) + ' ' + pat.replace(/./g, '_ ').trim() + ' ' + word.slice(i + pat.length)).replace(/\s+/g, ' ').trim();
}
/* 拼字題：留第一個字母和每隔一個字母，例如 Canada → C _ n _ d _ */
const spellMask = w => [...w].map((c, i) => (i % 2 === 0 ? c : '_')).join(' ');
const TF = ['True', 'False', 'Not mentioned'];

/* ---------------- 五上・康軒 Wonder World 7・第一次段考（Unit 1–2＋Review 1） ---------------- */
addBank({
  id: 'kh5a-1', title: '五上 第一次段考', sub: '康軒 Wonder World 7・Unit 1–2＋Review 1',
  grade: 5, term: '上', publisher: '康軒', book: 'Wonder World 7', exam: 1, lessonId: 'ww7t1'
}, add => {
  const C = [
    { en: 'Australia', zh: '澳洲', pic: '🦘' }, { en: 'Canada', zh: '加拿大', pic: '🍁' }, { en: 'France', zh: '法國', pic: '🥐' },
    { en: 'India', zh: '印度', pic: '🐘' }, { en: 'Japan', zh: '日本', pic: '🗾' }, { en: 'Taiwan', zh: '台灣', pic: '🧋' },
    { en: 'the UK', zh: '英國', pic: '💂' }, { en: 'the USA', zh: '美國', pic: '🗽' }];
  const pic = en => C.find(c => c.en === en).pic;
  const P = [
    { n: 'Raj', g: 'he', c: 'India' }, { n: 'Sophie', g: 'she', c: 'France' }, { n: 'Leo', g: 'he', c: 'Canada' }, { n: 'Yui', g: 'she', c: 'Japan' },
    { n: 'Emma', g: 'she', c: 'the UK' }, { n: 'Jack', g: 'he', c: 'the USA' }, { n: 'Lily', g: 'she', c: 'Australia' }, { n: 'Ming', g: 'he', c: 'Taiwan' }];
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const other = g => (g === 'he' ? 'she' : 'he');

  // Unit 1・看圖選國家
  C.forEach((c, i) => add({ id: 'u1-pic-' + i, tag: '看圖選字', pic: c.pic, prompt: 'Which country is it?',
    options: [c.en, ...others(rotate(C, i + 1), c, 3, 'en').map(x => x.en)], answer: 0, explain: `${c.pic} 是${c.zh}：${c.en}。` }, 'U1'));
  // Unit 1・Where is … from?
  P.forEach((p, i) => {
    const wrong = others(rotate(C, i + 3), { en: p.c }, 1, 'en')[0].en;
    add({ id: 'u1-where-' + p.n.toLowerCase(), tag: '對話選答', pic: pic(p.c) + ' ' + p.n, prompt: `Where is ${p.n} from?`,
      options: [`${cap(p.g)}'s from ${p.c}.`, `${cap(other(p.g))}'s from ${p.c}.`, `${cap(p.g)}'s from ${wrong}.`, `Yes, ${p.g} is.`], answer: 0,
      explain: `${p.n} 是${p.g === 'he' ? '男生，用 He' : '女生，用 She'}；問「從哪裡來」要說國家，不能用 Yes 回答。` }, 'U1');
  });
  // Unit 1・Is … from …? 簡答
  P.forEach((p, i) => {
    const ask = i % 2 === 0 ? p.c : others(rotate(C, i + 2), { en: p.c }, 1, 'en')[0].en;
    const yes = ask === p.c;
    add({ id: 'u1-is-' + p.n.toLowerCase(), tag: '對話選答', pic: pic(p.c) + ' ' + p.n, prompt: `Is ${p.n} from ${ask}?`,
      options: [yes ? `Yes, ${p.g} is.` : `No, ${p.g}'s not. ${cap(p.g)}'s from ${p.c}.`, yes ? `No, ${p.g}'s not.` : `Yes, ${p.g} is.`, `Yes, ${p.g} does.`, `${yes ? 'Yes' : 'No'}, ${other(p.g)} ${yes ? 'is' : "isn't"}.`],
      answer: 0, explain: `看圖，${p.n} 從 ${p.c} 來。Is 開頭的問句用 is / isn't 回答。` }, 'U1');
  });
  // Unit 1・be 動詞
  [['I ___ from Taiwan.', 0, 'I 用 am。'], ['Ben and I ___ from Taiwan.', 2, 'Ben and I 是兩個人，等於 we，用 are。'], ['Yui ___ from Japan.', 1, 'Yui 是一個人（she），用 is。'],
   ['They ___ from the UK.', 2, 'they 用 are。'], ['My mom ___ from India.', 1, 'my mom 是 she，用 is。'], ['You ___ from the USA.', 2, 'you 用 are。'],
   ['We ___ not from France.', 2, 'we 用 are。'], ['Leo and Jack ___ from Canada.', 2, '兩個人用 are。']]
    .forEach(([s, a, e], i) => add({ id: 'u1-be-' + i, tag: '文法選擇', prompt: s, options: ['am', 'is', 'are'], answer: a, explain: e }, 'U1'));
  // Unit 1・疑問詞
  add({ id: 'u1-wh-0', tag: '文法選擇', prompt: "___ are you from? I'm from Japan.", options: ['Where', 'What', 'How', 'Who'], answer: 0, explain: '問「從哪裡來」用 Where。' }, 'U1');
  add({ id: 'u1-wh-1', tag: '文法選擇', prompt: "___ is he from? He's from France.", options: ['What', 'Where', 'Who', 'How'], answer: 1, explain: '問「從哪裡來」用 Where。' }, 'U1');
  add({ id: 'u1-wh-2', tag: '文法選擇', prompt: '___ they from Australia? Yes, they are.', options: ['Is', 'Are', 'Do', 'Does'], answer: 1, explain: 'they 用 are；用 are 問，就用 are 答。' }, 'U1');
  // Unit 1・they
  [['Japan', 'Haruto and Yui'], ['India', 'Raj and Uma'], ['Canada', 'Leo and Eve']].forEach(([c, who], i) => add({ id: 'u1-they-' + i, tag: '對話選答',
    pic: pic(c) + ' ' + who, prompt: `Where are ${who} from?`, options: [`They're from ${c}.`, `They is from ${c}.`, `He's from ${c}.`, 'Yes, they are.'], answer: 0, explain: '兩個人用 They are（They\'re）。' }, 'U1'));
  // Unit 1・大小寫
  ['Japan', 'Canada', 'India', 'France'].forEach((c, i) => add({ id: 'u1-caps-' + i, tag: '大小寫', prompt: 'Which sentence is correct?',
    options: [`I'm from ${c}.`, `I'm from ${c.toLowerCase()}.`, `i'm from ${c}.`, `I'm From ${c}.`], answer: 0, explain: '句子第一個字、國家名字，第一個字母大寫；其他字小寫。' }, 'U1'));
  // Unit 2
  const I = [
    { w: 'cold', a: 'a cold', zh: '感冒', pic: '🤧' }, { w: 'cough', a: 'a cough', zh: '咳嗽', pic: '😷' }, { w: 'fever', a: 'a fever', zh: '發燒', pic: '🤒' },
    { w: 'headache', a: 'a headache', zh: '頭痛', pic: '🤕' }, { w: 'stomachache', a: 'a stomachache', zh: '肚子痛', pic: '🤢' }, { w: 'toothache', a: 'a toothache', zh: '牙痛', pic: '🦷' },
    { w: 'runny nose', a: 'a runny nose', zh: '流鼻水', pic: '👃' }, { w: 'sore throat', a: 'a sore throat', zh: '喉嚨痛', pic: '🗣️' }];
  I.forEach((x, i) => add({ id: 'u2-pic-' + i, tag: '看圖選字', pic: x.pic, prompt: "What's wrong?", options: [x.w, ...others(rotate(I, i + 2), x, 3, 'w').map(y => y.w)], answer: 0, explain: `${x.pic} 是${x.zh}：${x.w}。` }, 'U2'));
  I.forEach((x, i) => add({ id: 'u2-wrong-' + i, tag: '對話選答', pic: x.pic, prompt: "What's wrong?",
    options: [`I have ${x.a}.`, `I has ${x.a}.`, `I'm from ${C[i].en}.`, `I have ${I[(i + 3) % 8].a}.`], answer: 0, explain: `I 用 have；看圖是${x.zh}。` }, 'U2'));
  [['My sister', 1, 'cough'], ['I', 0, 'fever'], ['Ben', 1, 'headache'], ['We', 0, 'cold'], ['The boy', 1, 'toothache'], ['You', 0, 'runny nose'], ['Mia and Ken', 0, 'sore throat'], ['He', 1, 'stomachache']]
    .forEach(([s, a, w], i) => add({ id: 'u2-has-' + i, tag: '文法選擇', prompt: `${s} ___ a ${w}.`, options: ['have', 'has', 'is'], answer: a,
      explain: a ? `${s} 是一個人（he / she），用 has。` : `${s} 用 have。` }, 'U2'));
  [['___ you have a fever?', 0, 'you 用 Do。'], ['___ your brother have a cough?', 1, 'your brother 是 he，用 Does。'], ['___ they have a cold?', 0, 'they 用 Do。'],
   ['___ Amy have a toothache?', 1, 'Amy 是 she，用 Does。'], ['___ he have a sore throat?', 1, 'he 用 Does。'], ['___ your parents have a cold?', 0, 'your parents 是 they，用 Do。']]
    .forEach(([s, a, e], i) => add({ id: 'u2-do-' + i, tag: '文法選擇', prompt: s, options: ['Do', 'Does', 'Is', 'Are'], answer: a, explain: e }, 'U2'));
  [['Does Ben have a fever?', '🤒 Ben', 'Yes, he does.', ['Yes, he is.', "No, he doesn't.", 'Yes, she does.']],
   ['Does Mia have a cough?', '🦷 Mia', "No, she doesn't. She has a toothache.", ['Yes, she does.', "No, she isn't. She has a toothache.", "No, she doesn't. She have a toothache."]],
   ['Do you have a stomachache?', '🙂 You', "No, I don't.", ['No, I am not.', "No, I doesn't.", 'Yes, please.']],
   ['Does your sister have a runny nose?', '👃 sister', 'Yes, she does.', ['Yes, she has.', 'Yes, he does.', 'Yes, she is.']],
   ['Do they have a cold?', '🤧 they', 'Yes, they do.', ['Yes, they are.', 'Yes, they does.', 'No, they do.']],
   ['Does Ken have a headache?', '🗣️ Ken', "No, he doesn't. He has a sore throat.", ['Yes, he does.', "No, he doesn't. He has a headache.", "No, he don't. He has a sore throat."]]]
    .forEach(([q, p, a, d], i) => add({ id: 'u2-short-' + i, tag: '對話選答', pic: p, prompt: q, options: [a, ...d], answer: 0, explain: 'Do / Does 問句，用 do / does / don\'t / doesn\'t 回答；he、she 後面用 has。' }, 'U2'));
  // 發音（聽力）
  const PH = [['her', 'er'], ['sister', 'er'], ['clerk', 'er'], ['bird', 'ir'], ['girl', 'ir'], ['shirt', 'ir'], ['nurse', 'ur'], ['turtle', 'ur'], ['purple', 'ur'],
    ['car', 'ar'], ['star', 'ar'], ['park', 'ar'], ['corn', 'or'], ['fork', 'or'], ['short', 'or']];
  const PD = { er: ['ar', 'or'], ir: ['or', 'ar'], ur: ['ar', 'or'], ar: ['or', 'ur'], or: ['ar', 'ir'] };
  PH.forEach(([w, pat]) => add({ id: 'ph-' + w, tag: '聽音辨字', audio: w, show: phonicsMask(w, pat), prompt: 'Which letters are missing?',
    options: [pat, ...PD[pat]], answer: 0, explain: `${w} 的 ${pat}。er、ir、ur 的發音一樣，ar、or 不一樣。` }, '發音'));
  // 聽句子
  [['Lily is from Australia.', 'Where is Lily from?', ['🦘 Australia', '🗽 the USA', '🍁 Canada']],
   ['Raj is from India.', 'Where is Raj from?', ['🐘 India', '🗾 Japan', '💂 the UK']],
   ['Ben has a fever.', "What's wrong with Ben?", ['🤒 fever', '🤧 cold', '🦷 toothache']],
   ['Mia has a stomachache.', "What's wrong with Mia?", ['🤢 stomachache', '🤕 headache', '😷 cough']],
   ["I'm from Canada.", 'Where is the speaker from?', ['🍁 Canada', '🥐 France', '🧋 Taiwan']],
   ['She has a sore throat.', "What's wrong with her?", ['🗣️ sore throat', '👃 runny nose', '🤒 fever']]]
    .forEach(([a, q, o], i) => add({ id: 'ls-' + i, tag: '聽句子', audio: a, prompt: q, options: o, answer: 0 }, '聽力'));
  [['Where are you from?', ["I'm from Taiwan.", 'Yes, I am.', 'I have a cold.']],
   ['Is he from Japan?', ["No, he's not.", 'Yes, he does.', "I'm from Japan."]],
   ["What's wrong?", ['I have a headache.', "I'm from India.", "No, I don't."]],
   ['Does she have a cough?', ['Yes, she does.', 'Yes, she is.', 'She has from Canada.']]]
    .forEach(([a, o], i) => add({ id: 'lq-' + i, tag: '聽問句選回答', audio: a, prompt: 'Choose the best answer.', options: o, answer: 0 }, '聽力'));
  // 閱讀（對話判斷 True / False / Not mentioned）
  const D1 = "Amy: Hi, I'm Amy. I'm from the UK. Where are you from?\nKen: I'm from Japan. This is my friend, Raj.\nAmy: Is he from Japan, too?\nKen: No, he's not. He's from India.\nRaj: Nice to meet you, Amy!";
  [['Amy is from the UK.', 0], ['Raj is from Japan.', 1], ['Ken likes sushi.', 2]]
    .forEach(([s, a], i) => add({ id: 'rd1-' + i, tag: '閱讀判斷', passage: D1, prompt: s, options: TF, answer: a, explain: a === 2 ? '對話裡沒有提到，選 Not mentioned。' : '' }, '閱讀'));
  const D2 = "Mom: What's wrong, Tim?\nTim: I have a headache and a sore throat.\nMom: Do you have a fever?\nTim: No, I don't. But my sister has a fever.\nMom: Oh, no! Let's go see the doctor.";
  [['Tim has a headache.', 0], ['Tim has a fever.', 1], ["Tim's sister has a cough.", 2]]
    .forEach(([s, a], i) => add({ id: 'rd2-' + i, tag: '閱讀判斷', passage: D2, prompt: s, options: TF, answer: a, explain: a === 2 ? '對話只說姊姊發燒，沒有說咳嗽，選 Not mentioned。' : '' }, '閱讀'));
  // 句子重組
  [['Where is Yui from?', 'Yui 是從哪裡來的？'], ['He is from the USA.', '他是從美國來的。'], ["She's not from Canada.", '她不是從加拿大來的。'], ['Are they from Japan?', '他們是從日本來的嗎？'],
   ["What's wrong with you?", '你怎麼了？'], ['I have a runny nose.', '我流鼻水。'], ['Does Leo have a cough?', 'Leo 咳嗽嗎？'], ["No, he doesn't.", '不，他沒有。']]
    .forEach(([a, zh], i) => add({ id: 'od-' + i, type: 'order', tag: '句子重組', answer: a, zh }, a.match(/wrong|have|cough|doesn't/) ? 'U2' : 'U1'));
  // 拼字
  [['Canada', '🍁', '加拿大', 1], ['France', '🥐', '法國', 1], ['India', '🐘', '印度', 1], ['Japan', '🗾', '日本', 1], ['Taiwan', '🧋', '台灣', 1],
   ['cold', '🤧', '感冒'], ['fever', '🤒', '發燒'], ['cough', '😷', '咳嗽'], ['headache', '🤕', '頭痛'], ['toothache', '🦷', '牙痛']]
    .forEach(([w, p, zh, caps], i) => add({ id: 'sp-' + w.toLowerCase(), type: 'spell', tag: '看圖拼字', word: w, caps: !!caps, pic: p, zh, show: spellMask(w) }, i < 5 ? 'U1' : 'U2'));
});

/* ---------------- 五上・康軒 Wonder World 7・第二次段考（Unit 3–4＋Review 2） ---------------- */
addBank({
  id: 'kh5a-2', title: '五上 第二次段考', sub: '康軒 Wonder World 7・Unit 3–4＋Review 2',
  grade: 5, term: '上', publisher: '康軒', book: 'Wonder World 7', exam: 2, lessonId: 'ww7t2'
}, add => {
  const F = [
    { w: 'pizza', zh: '披薩', pic: '🍕' }, { w: 'rice', zh: '飯', pic: '🍚' }, { w: 'soup', zh: '湯', pic: '🍲' }, { w: 'steak', zh: '牛排', pic: '🥩' },
    { w: 'dumplings', zh: '水餃', pic: '🥟' }, { w: 'noodles', zh: '麵', pic: '🍜' }, { w: 'sandwiches', zh: '三明治', pic: '🥪' }, { w: 'French fries', zh: '薯條', pic: '🍟' }];
  const R = [
    { v: 'get', rest: 'up', s: 'gets', zh: '起床', pic: '⏰', t: 'six thirty', clock: '6:30' },
    { v: 'have', rest: 'breakfast', s: 'has', zh: '吃早餐', pic: '🍳', t: 'seven', clock: '7:00' },
    { v: 'go', rest: 'to school', s: 'goes', zh: '上學', pic: '🏫', t: 'seven twenty', clock: '7:20' },
    { v: 'have', rest: 'lunch', s: 'has', zh: '吃午餐', pic: '🍱', t: 'twelve', clock: '12:00' },
    { v: 'go', rest: 'home', s: 'goes', zh: '回家', pic: '🏠', t: 'four', clock: '4:00' },
    { v: 'have', rest: 'dinner', s: 'has', zh: '吃晚餐', pic: '🍽️', t: 'six thirty', clock: '6:30' },
    { v: 'do', rest: 'my homework', s: 'does', zh: '寫功課', pic: '📝', t: 'eight', clock: '8:00' },
    { v: 'go', rest: 'to bed', s: 'goes', zh: '睡覺', pic: '🛏️', t: 'nine thirty', clock: '9:30' }];
  const phrase = r => `${r.v} ${r.rest}`;
  const wrongTime = { 'six thirty': 'seven thirty', seven: 'six', 'seven twenty': 'seven thirty', twelve: 'twelve thirty', four: 'five', eight: 'nine', 'nine thirty': 'ten' };

  // Unit 3・看圖選食物
  F.forEach((f, i) => add({ id: 'u3-pic-' + i, tag: '看圖選字', pic: f.pic, prompt: 'What food is it?', options: [f.w, ...others(rotate(F, i + 1), f, 3, 'w').map(x => x.w)], answer: 0, explain: `${f.pic} 是${f.zh}：${f.w}。` }, 'U3'));
  // Unit 3・What would you like to eat?
  F.forEach((f, i) => add({ id: 'u3-like-' + i, tag: '對話選答', pic: f.pic, prompt: 'What would you like to eat?',
    options: [`I'd like some ${f.w}, please.`, `I'd like some ${F[(i + 2) % 8].w}, please.`, 'Yes, please.', `I like to ${f.w}.`], answer: 0, explain: `用 I'd like some …, please. 回答；看圖是${f.zh}。` }, 'U3'));
  // Unit 3・Would you like some …? 要／不要
  F.forEach((f, i) => {
    const yes = i % 2 === 0;
    add({ id: 'u3-want-' + i, tag: '對話選答', pic: f.pic + (yes ? ' 👍' : ' ✋'), prompt: `Would you like some ${f.w}?`,
      options: [yes ? 'Yes, please.' : 'No, thank you.', yes ? 'No, thank you.' : 'Yes, please.', 'Yes, I do.', "No, I'm not."], answer: 0,
      explain: 'Would you like …? 要就說 Yes, please.，不要就說 No, thank you.' }, 'U3');
  });
  // Unit 3・a / some、複數
  [["I'd like ___ dumplings, please.", 2, 'dumplings 是很多個，用 some。'], ['Would you like ___ French fries?', 2, 'French fries 是很多根，用 some。'],
   ["I'd like ___ sandwich, please.", 0, 'sandwich 是一個，用 a。'], ['Would you like ___ rice?', 2, 'rice 不能一個一個數，用 some。'],
   ["I'd like ___ soup, please.", 2, '湯不能一個一個數，用 some。'], ['We would like ___ noodles.', 2, 'noodles 是很多條，用 some。']]
    .forEach(([s, a, e], i) => add({ id: 'u3-some-' + i, tag: '文法選擇', prompt: s, options: ['a', 'an', 'some'], answer: a, explain: e }, 'U3'));
  [['sandwich', 'sandwiches', 'sandwichs'], ['dumpling', 'dumplings', 'dumplinges'], ['noodle', 'noodles', 'noodless'], ['French fry', 'French fries', 'French frys']]
    .forEach((o, i) => add({ id: 'u3-pl-' + i, tag: '文法選擇', prompt: 'Would you like some ___?', options: o, answer: 1, explain: 'some 後面接可數名詞要用複數：sandwich → sandwiches，fry → fries。' }, 'U3'));
  add({ id: 'u3-to', tag: '文法選擇', prompt: 'What would you like ___ eat?', options: ['to', 'for', 'at'], answer: 0, explain: 'would like to 後面接動詞。' }, 'U3');
  // Unit 4・看圖選片語
  R.forEach((r, i) => add({ id: 'u4-pic-' + i, tag: '看圖選字', pic: r.pic, prompt: 'Which one matches the picture?', options: [phrase(r), ...others(rotate(R, i + 1), r, 3, 'zh').map(phrase)],
    answer: 0, explain: `${r.pic} 是${r.zh}：${phrase(r)}。` }, 'U4'));
  // Unit 4・What time do you …?
  R.forEach((r, i) => add({ id: 'u4-time-' + i, tag: '對話選答', pic: `${r.pic} ${r.clock}`, prompt: `What time do you ${phrase(r).replace('my ', 'your ')}?`,
    options: [`I ${phrase(r)} at ${r.t}.`, `I ${r.s} ${r.rest} at ${r.t}.`, `I ${phrase(r)} at ${wrongTime[r.t]}.`, 'Yes, I do.'], answer: 0, explain: `I 後面動詞不加 s；看圖是 ${r.clock}（${r.t}）。` }, 'U4'));
  // Unit 4・he / she 動詞加 s
  const N = [['Ruby', 'her'], ['Ben', 'his'], ['My sister', 'her'], ['Tom', 'his'], ['Amy', 'her'], ['My dad', 'his'], ['Kevin', 'his'], ['Lisa', 'her']];
  R.forEach((r, i) => {
    const [who, pos] = N[i];
    const rest = r.rest.replace('my ', pos + ' ');
    const ing = r.v === 'get' ? 'getting' : r.v === 'have' ? 'having' : r.v + 'ing';
    const bad = r.v === 'go' ? 'gos' : r.v === 'do' ? 'dos' : ing;
    add({ id: 'u4-s-' + i, tag: '文法選擇', prompt: `${who} ___ ${rest} at ${r.t}.`, options: [r.v, r.s, bad], answer: 1, explain: `${who} 是 he / she，${r.v} 要變 ${r.s}。` }, 'U4');
  });
  [['What time ___ you have lunch?', 0, 'you 用 do。'], ['What time ___ Ben go to bed?', 1, 'Ben 是 he，用 does。'], ['___ your sister get up at six?', 1, 'your sister 是 she，用 Does。'],
   ['___ they go home at four?', 0, 'they 用 Do。'], ['What time ___ your parents have dinner?', 0, 'your parents 是 they，用 do。'], ['What time ___ Amy do her homework?', 1, 'Amy 是 she，用 does。']]
    .forEach(([s, a, e], i) => add({ id: 'u4-do-' + i, tag: '文法選擇', prompt: s, options: ['do', 'does', 'is', 'are'].map((o, j) => (s.startsWith('___') ? o[0].toUpperCase() + o.slice(1) : o)), answer: a, explain: e }, 'U4'));
  [['Do you have lunch at twelve?', '🍱 12:30', "No, I don't. I have lunch at twelve thirty.", ['Yes, I do.', "No, I'm not. I have lunch at twelve thirty.", "No, I don't. I has lunch at twelve thirty."]],
   ['Does Ben go to school at seven?', '🏫 7:00', 'Yes, he does.', ['Yes, he is.', "No, he doesn't.", 'Yes, he do.']],
   ['Do you go to bed at nine?', '🛏️ 9:00', 'Yes, I do.', ['Yes, I am.', 'Yes, please.', "No, I don't. I go to bed at nine."]],
   ['Does your mom get up at six?', '⏰ 5:30', "No, she doesn't. She gets up at five thirty.", ['Yes, she does.', "No, she doesn't. She get up at five thirty.", "No, she isn't. She gets up at five thirty."]]]
    .forEach(([q, p, a, d], i) => add({ id: 'u4-short-' + i, tag: '對話選答', pic: p, prompt: q, options: [a, ...d], answer: 0, explain: 'Do / Does 問句用 do / does / don\'t / doesn\'t 回答；he、she 後面的動詞加 s。' }, 'U4'));
  // 發音（聽力）
  const PH = [['coin', 'oi'], ['point', 'oi'], ['oil', 'oi'], ['soil', 'oi'], ['boy', 'oy'], ['toy', 'oy'], ['joy', 'oy'], ['enjoy', 'oy'],
    ['house', 'ou'], ['mouse', 'ou'], ['mouth', 'ou'], ['cloud', 'ou'], ['cow', 'ow'], ['owl', 'ow'], ['clown', 'ow'], ['town', 'ow']];
  const PD = { oi: ['ou', 'ar'], oy: ['ow', 'ur'], ou: ['oi', 'or'], ow: ['oy', 'ar'] };
  PH.forEach(([w, pat]) => add({ id: 'ph-' + w, tag: '聽音辨字', audio: w, show: phonicsMask(w, pat), prompt: 'Which letters are missing?',
    options: [pat, ...PD[pat]], answer: 0, explain: `${w} 的 ${pat}。oi 和 oy 發音一樣，ou 和 ow 發音一樣。` }, '發音'));
  // 聽句子
  [["I'd like some rice, please.", 'What does she want?', ['🍚 rice', '🍜 noodles', '🍲 soup']],
   ['Ben goes home at four.', 'What time does Ben go home?', ['4:00', '5:00', '4:30']],
   ['She has dinner at six thirty.', 'What time does she have dinner?', ['6:30', '7:30', '6:00']],
   ["I'd like some steak and French fries.", 'What does he want?', ['🥩🍟 steak and French fries', '🍕🍟 pizza and French fries', '🥩🍚 steak and rice']],
   ['I do my homework at eight.', 'What does he do at eight?', ['📝 do his homework', '🛏️ go to bed', '🍽️ have dinner']]]
    .forEach(([a, q, o], i) => add({ id: 'ls-' + i, tag: '聽句子', audio: a, prompt: q, options: o, answer: 0 }, '聽力'));
  [['Would you like some soup?', ['No, thank you.', 'No, I don\'t like.', 'Yes, I am.']],
   ['What would you like to eat?', ["I'd like some pizza, please.", 'Yes, please.', 'I get up at seven.']],
   ['What time do you get up?', ['I get up at six forty.', "I'd like some rice.", 'Yes, I do.']],
   ['Does he go to bed at ten?', ["No, he doesn't.", 'No, he isn\'t.', 'Yes, he goes.']]]
    .forEach(([a, o], i) => add({ id: 'lq-' + i, tag: '聽問句選回答', audio: a, prompt: 'Choose the best answer.', options: o, answer: 0 }, '聽力'));
  // 閱讀
  const D3 = "Waiter: What would you like to eat?\nAnn: I'd like some noodles, please.\nWaiter: Would you like some soup, too?\nAnn: No, thank you.\nWaiter: How about your brother?\nAnn: He would like some dumplings.";
  [['Ann would like some noodles.', 0], ['Ann would like some soup.', 1], ["Ann's brother likes pizza.", 2]]
    .forEach(([s, a], i) => add({ id: 'rd3-' + i, tag: '閱讀判斷', passage: D3, prompt: s, options: TF, answer: a, explain: a === 2 ? '對話沒有提到 pizza，選 Not mentioned。' : '' }, '閱讀'));
  const D4 = "Ben: What time do you get up, Ruby?\nRuby: I get up at six thirty on school days.\nBen: Do you go to school at seven?\nRuby: No, I don't. I go to school at seven twenty.\nBen: Me too! Let's go together.";
  [['Ruby gets up at six thirty on school days.', 0], ['Ruby goes to school at seven.', 1], ['Ben has breakfast at six.', 2]]
    .forEach(([s, a], i) => add({ id: 'rd4-' + i, tag: '閱讀判斷', passage: D4, prompt: s, options: TF, answer: a, explain: a === 2 ? '對話沒有提到 Ben 幾點吃早餐，選 Not mentioned。' : '' }, '閱讀'));
  // 句子重組
  [['What would you like to eat?', '你想要吃什麼？', 'U3'], ["I'd like some dumplings, please.", '我想要一些水餃，謝謝。', 'U3'], ['Would you like some soup?', '你想要一些湯嗎？', 'U3'],
   ['No, thank you.', '不，謝謝。', 'U3'], ['What time do you get up?', '你幾點起床？', 'U4'], ['I go to bed at nine thirty.', '我九點半睡覺。', 'U4'],
   ['What time does Ben have lunch?', 'Ben 幾點吃午餐？', 'U4'], ['She goes to school at seven twenty.', '她七點二十分上學。', 'U4']]
    .forEach(([a, zh, u], i) => add({ id: 'od-' + i, type: 'order', tag: '句子重組', answer: a, zh }, u));
  // 拼字
  [['pizza', '🍕', '披薩'], ['rice', '🍚', '飯'], ['soup', '🍲', '湯'], ['steak', '🥩', '牛排'], ['noodles', '🍜', '麵'],
   ['lunch', '🍱', '午餐'], ['dinner', '🍽️', '晚餐'], ['breakfast', '🍳', '早餐'], ['home', '🏠', '家'], ['school', '🏫', '學校']]
    .forEach(([w, p, zh], i) => add({ id: 'sp-' + w, type: 'spell', tag: '看圖拼字', word: w, pic: p, zh, show: spellMask(w) }, i < 5 ? 'U3' : 'U4'));
});
})();
