'use strict';

/* ==========================================================
   這段在做什麼：段考題庫（學生刷題、老師挑題上課、印學習單都用這裡）
   每一份題庫標好年級、版本、冊次、第幾次段考。之後加國中、會考，只要再加一份。
   題目照課本單字和句型自己出（source 是「英語島自命題」）。
   收進學校公開的真實考題時，source 寫「學校＋學年＋段考」，圖片換成我們自己的。
   題型 type：choice 選擇（有 audio 是聽力、有 passage 是閱讀、有 ctx 是情境）、order 句子重組（ctx 是對話的另一半）、spell 聽寫拼字
   出題原則：每一題都要能從題目裡的英文找到答案，不考地理常識、不考背課本、不考中翻英。
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

/* ---------------- 五上（新北）・康軒 Wonder World 7・第一次段考（Unit 1–2＋Review 1） ---------------- */
addBank({
  id: 'kh5a-1', title: '五上 第一次段考', sub: '康軒 Wonder World 7・Unit 1–2＋Review 1',
  grade: 5, term: '上', publisher: '康軒', book: 'Wonder World 7', exam: 1, lessonId: 'ww7t1'
}, add => {
  // 出題原則：每一題都要能從題目裡的英文找到答案。不考地理常識、不考背課本、不考中翻英。
  // 人物旁邊的 👦 👧 只是告訴學生是男生還是女生（用 he 還是 she）。
  const C = ['Australia', 'Canada', 'France', 'India', 'Japan', 'Taiwan', 'the UK', 'the USA'];
  const P = [
    { n: 'Raj', g: 'he', c: 'India' }, { n: 'Sophie', g: 'she', c: 'France' }, { n: 'Leo', g: 'he', c: 'Canada' }, { n: 'Yui', g: 'she', c: 'Japan' },
    { n: 'Emma', g: 'she', c: 'the UK' }, { n: 'Jack', g: 'he', c: 'the USA' }, { n: 'Lily', g: 'she', c: 'Australia' }, { n: 'Ming', g: 'he', c: 'Taiwan' }];
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const other = g => (g === 'he' ? 'she' : 'he');
  const kid = g => (g === 'he' ? '👦' : '👧');

  // Unit 1・Where is … from?（先讀他自己說的話，再把 I'm 換成 He's / She's）
  P.forEach((p, i) => {
    const wrong = C[(C.indexOf(p.c) + 3) % C.length];
    add({ id: 'u1-where-' + p.n.toLowerCase(), tag: '對話選答', pic: kid(p.g), ctx: `${p.n}: Hi! I'm ${p.n}. I'm from ${p.c}.`, prompt: `Where is ${p.n} from?`,
      options: [`${cap(p.g)}'s from ${p.c}.`, `${cap(other(p.g))}'s from ${p.c}.`, `${cap(p.g)}'s from ${wrong}.`, `Yes, ${p.g} is.`], answer: 0,
      explain: `${p.n} 自己說 I'm from ${p.c}。別人問的時候，要換成 ${cap(p.g)}'s from ${p.c}.` }, 'U1');
  });
  // Unit 1・Is … from …? 簡答
  P.forEach((p, i) => {
    const ask = i % 2 === 0 ? p.c : C[(C.indexOf(p.c) + 2) % C.length];
    const yes = ask === p.c;
    add({ id: 'u1-is-' + p.n.toLowerCase(), tag: '對話選答', pic: kid(p.g), ctx: `${p.n}: I'm ${p.n}. I'm from ${p.c}.`, prompt: `Is ${p.n} from ${ask}?`,
      options: [yes ? `Yes, ${p.g} is.` : `No, ${p.g}'s not. ${cap(p.g)}'s from ${p.c}.`, yes ? `No, ${p.g}'s not.` : `Yes, ${p.g} is.`, `Yes, ${p.g} does.`, `${yes ? 'Yes' : 'No'}, ${other(p.g)} ${yes ? 'is' : "isn't"}.`],
      answer: 0, explain: `${p.n} 說自己從 ${p.c} 來。Is 開頭的問句，用 Yes, ${p.g} is. 或 No, ${p.g}'s not. 回答。` }, 'U1');
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
  [['Japan', 'Haruto', 'Yui', '👦👧'], ['India', 'Raj', 'Uma', '👦👧'], ['Canada', 'Eve', 'Leo', '👧👦']].forEach(([c, a1, a2, pic], i) => add({ id: 'u1-they-' + i, tag: '對話選答',
    pic, ctx: `${a1}: ${a2} and I are from ${c}.`, prompt: `Where are ${a1} and ${a2} from?`, options: [`They're from ${c}.`, `They is from ${c}.`, `We're from ${c}.`, 'Yes, they are.'], answer: 0,
    explain: `${a1} 說 ${a2} and I are from ${c}。別人問兩個人，要說 They're from ${c}.` }, 'U1'));
  // Unit 1・大小寫
  ['Japan', 'Canada', 'India', 'France'].forEach((c, i) => add({ id: 'u1-caps-' + i, tag: '大小寫', prompt: 'Which sentence is correct?',
    options: [`I'm from ${c}.`, `I'm from ${c.toLowerCase()}.`, `i'm from ${c}.`, `I'm From ${c}.`], answer: 0, explain: '句子第一個字、國家名字，第一個字母大寫；其他字小寫。' }, 'U1'));
  // Unit 2：不用看圖猜病名，讀英文描述再判斷
  const I = {
    cold: { a: 'a cold', me: 'Achoo! Achoo! I sneeze all day, and I feel tired.', him: n => `"Achoo! Achoo!" ${n} sneezes all day and feels tired.`, d: ['toothache', 'stomachache'] },
    cough: { a: 'a cough', me: 'Cough, cough! I can\'t stop.', him: n => `"Cough, cough!" ${n} can't stop.`, d: ['headache', 'toothache'] },
    fever: { a: 'a fever', me: "I feel very hot. I'm 39°C.", him: (n, P) => `${n} feels very hot. ${P} is 39°C.`, d: ['toothache', 'runny nose'] },
    headache: { a: 'a headache', me: 'My head hurts.', him: n => `${n}'s head hurts.`, d: ['stomachache', 'sore throat'] },
    stomachache: { a: 'a stomachache', me: 'I ate too much ice cream. My stomach hurts.', him: (n, P, pos) => `${n} ate too much ice cream. Now ${pos} stomach hurts.`, d: ['headache', 'runny nose'] },
    toothache: { a: 'a toothache', me: 'I ate too much candy. My tooth hurts.', him: (n, P, pos) => `${n} ate too much candy. Now ${pos} tooth hurts.`, d: ['stomachache', 'fever'] },
    'runny nose': { a: 'a runny nose', me: 'Water keeps coming out of my nose.', him: n => `Water keeps coming out of ${n}'s nose.`, d: ['toothache', 'headache'] },
    'sore throat': { a: 'a sore throat', me: 'My throat hurts. It hurts when I talk.', him: (n, P, pos, p) => `${n}'s throat hurts. It hurts when ${p} talks.`, d: ['stomachache', 'toothache'] }
  };
  const W = Object.keys(I);
  const K = [['Tom', 'he'], ['Mia', 'she'], ['Ben', 'he'], ['Amy', 'she'], ['Ken', 'he'], ['Lisa', 'she'], ['Joe', 'he'], ['Nina', 'she']];
  W.forEach((w, i) => {
    const [n, g] = K[i], x = I[w], P = cap(g), pos = g === 'he' ? 'his' : 'her';
    add({ id: 'u2-what-' + i, tag: '情境選答', pic: kid(g), ctx: x.him(n, P, pos, g), prompt: `What's wrong with ${n}?`,
      options: [`${P} has ${x.a}.`, `${P} has ${I[x.d[0]].a}.`, `${P} has ${I[x.d[1]].a}.`, `${P} have ${x.a}.`], answer: 0,
      explain: `讀描述判斷是 ${w}；${n} 是 ${g}，用 has。` }, 'U2');
    add({ id: 'u2-wrong-' + i, tag: '情境選答', pic: '🩺', ctx: `You: ${x.me}`, prompt: "Doctor: What's wrong?",
      options: [`I have ${x.a}.`, `I has ${x.a}.`, `I have ${I[x.d[0]].a}.`, "I'm from Taiwan."], answer: 0, explain: `你的情況是 ${w}；I 用 have。` }, 'U2');
  });
  [['My sister', 1, 'cough'], ['I', 0, 'fever'], ['Ben', 1, 'headache'], ['We', 0, 'cold'], ['The boy', 1, 'toothache'], ['You', 0, 'runny nose'], ['Mia and Ken', 0, 'sore throat'], ['He', 1, 'stomachache']]
    .forEach(([s, a, w], i) => add({ id: 'u2-has-' + i, tag: '文法選擇', prompt: `${s} ___ a ${w}.`, options: ['have', 'has', 'is'], answer: a,
      explain: a ? `${s} 是一個人（he / she），用 has。` : `${s} 用 have。` }, 'U2'));
  [['___ you have a fever?', 0, 'you 用 Do。'], ['___ your brother have a cough?', 1, 'your brother 是 he，用 Does。'], ['___ they have a cold?', 0, 'they 用 Do。'],
   ['___ Amy have a toothache?', 1, 'Amy 是 she，用 Does。'], ['___ he have a sore throat?', 1, 'he 用 Does。'], ['___ your parents have a cold?', 0, 'your parents 是 they，用 Do。']]
    .forEach(([s, a, e], i) => add({ id: 'u2-do-' + i, tag: '文法選擇', prompt: s, options: ['Do', 'Does', 'Is', 'Are'], answer: a, explain: e }, 'U2'));
  [['👦', `Ben: I feel very hot. I'm 39°C.`, 'Does Ben have a fever?', 'Yes, he does.', ['Yes, he is.', "No, he doesn't.", 'Yes, she does.']],
   ['👧', 'Mia: My tooth hurts.', 'Does Mia have a cough?', "No, she doesn't. She has a toothache.", ['Yes, she does.', "No, she isn't. She has a toothache.", "No, she doesn't. She have a toothache."]],
   ['🙂', "You: I'm OK today. I'm not sick.", 'Do you have a stomachache?', "No, I don't.", ['No, I am not.', "No, I doesn't.", 'Yes, please.']],
   ['👧', 'My sister: Water keeps coming out of my nose.', 'Does your sister have a runny nose?', 'Yes, she does.', ['Yes, she has.', 'Yes, he does.', 'Yes, she is.']],
   ['👦👧', 'Tom and Amy: Achoo! We have a cold.', 'Do they have a cold?', 'Yes, they do.', ['Yes, they are.', 'Yes, they does.', 'No, they do.']],
   ['👦', 'Ken: My throat hurts.', 'Does Ken have a headache?', "No, he doesn't. He has a sore throat.", ['Yes, he does.', "No, he doesn't. He has a headache.", "No, he don't. He has a sore throat."]]]
    .forEach(([pic, ctx, q, a, d], i) => add({ id: 'u2-short-' + i, tag: '對話選答', pic, ctx, prompt: q, options: [a, ...d], answer: 0, explain: 'Do / Does 問句，用 do / does / don\'t / doesn\'t 回答；he、she 後面用 has。' }, 'U2'));
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
  // 句子重組：看對話的另一半，排出空格那一句
  [['Where is Yui from?', "A: ＿＿＿\nB: She's from Japan."], ['He is from the USA.', 'A: Where is Jack from?\nB: ＿＿＿'], ["She's not from Canada.", "A: Is Sophie from Canada?\nB: No. ＿＿＿ She's from France."],
   ['Are they from Japan?', 'A: ＿＿＿\nB: Yes, they are.'], ["What's wrong with you?", 'A: ＿＿＿\nB: I have a headache.'], ['I have a runny nose.', "A: What's wrong?\nB: ＿＿＿"],
   ['Does Leo have a cough?', 'A: ＿＿＿\nB: Yes, he does. He coughs a lot.'], ["No, he doesn't.", 'A: Does Ken have a fever?\nB: ＿＿＿ He has a sore throat.']]
    .forEach(([a, ctx], i) => add({ id: 'od-' + i, type: 'order', tag: '句子重組', answer: a, ctx }, i < 4 ? 'U1' : 'U2'));
  // 聽寫拼字：聽發音拼出來（考字母和發音的對應，不考中翻英）
  [['Canada', 1], ['France', 1], ['India', 1], ['Japan', 1], ['Taiwan', 1], ['cold'], ['fever'], ['cough'], ['headache'], ['toothache']]
    .forEach(([w, caps], i) => add({ id: 'sp-' + w.toLowerCase(), type: 'spell', tag: '聽寫拼字', word: w, caps: !!caps, show: spellMask(w) }, i < 5 ? 'U1' : 'U2'));
});

/* ---------------- 五上（新北）・康軒 Wonder World 7・第二次段考（Unit 3–4＋Review 2） ---------------- */
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

  // Unit 3・讀描述選食物（不用看圖猜）
  const DEF = {
    pizza: ["It's round and flat. It has cheese and tomato on top.", 'What is it?', ['soup', 'rice', 'noodles']],
    rice: ["It's small and white. People cook it and eat it in a bowl every day.", 'What is it?', ['pizza', 'steak', 'French fries']],
    soup: ["It's hot, and it's like water. You eat it with a spoon.", 'What is it?', ['steak', 'sandwiches', 'pizza']],
    steak: ["It's a big piece of beef. You eat it with a knife and fork.", 'What is it?', ['soup', 'rice', 'noodles']],
    dumplings: ['They are small and white. They have meat and vegetables inside.', 'What are they?', ['French fries', 'sandwiches', 'noodles']],
    noodles: ['They are long and thin. You can eat them with chopsticks.', 'What are they?', ['sandwiches', 'dumplings', 'steak']],
    sandwiches: ['They are bread with egg, ham, or cheese inside.', 'What are they?', ['noodles', 'dumplings', 'soup']],
    'French fries': ['They are long, thin pieces of potato. They are hot and crispy.', 'What are they?', ['dumplings', 'sandwiches', 'soup']]
  };
  F.forEach((f, i) => { const [ctx, q, d] = DEF[f.w]; add({ id: 'u3-def-' + i, tag: '情境選答', ctx, prompt: q, options: [f.w, ...d], answer: 0 }, 'U3'); });
  // Unit 3・What would you like to eat?（讀情境，替自己點餐）
  F.forEach((f, i) => {
    const g = F[(i + 2) % 8];
    add({ id: 'u3-like-' + i, tag: '對話選答', pic: '🍽️', ctx: `You love ${f.w}, but you don't like ${g.w}.`, prompt: 'Waiter: What would you like to eat?',
      options: [`I'd like some ${f.w}, please.`, `I'd like some ${g.w}, please.`, 'Yes, please.', `I like to ${f.w}.`], answer: 0, explain: `你喜歡 ${f.w}，所以點 I'd like some ${f.w}, please.` }, 'U3');
  });
  // Unit 3・Would you like some …? 要／不要
  F.forEach((f, i) => {
    const yes = i % 2 === 0;
    add({ id: 'u3-want-' + i, tag: '對話選答', pic: '🍽️', ctx: yes ? `You are hungry. You love ${f.w}.` : "You are full. You can't eat any more.", prompt: `Would you like some ${f.w}?`,
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
  // Unit 4・讀 Ruby 的一天，選她在做什麼
  const DAY = [
    "It's 6:30 in the morning. Ruby's alarm clock rings, and she gets out of bed.",
    "It's 7:00 in the morning. Ruby eats eggs and toast at home.",
    "It's 7:20. Ruby takes her school bag and walks to school.",
    "It's 12:00. Ruby eats rice and soup with her classmates at school.",
    "It's 4:00 in the afternoon. School is over. Ruby walks back to her house.",
    "It's 6:30 in the evening. Ruby eats with her family at home.",
    "It's 8:00 in the evening. Ruby sits at her desk and finishes her school work.",
    "It's 9:30 at night. Ruby is very sleepy. She turns off the light."];
  const she = r => `She ${r.s} ${r.rest.replace('my ', 'her ')}.`;
  R.forEach((r, i) => add({ id: 'u4-what-' + i, tag: '情境選答', pic: '👧', ctx: DAY[i], prompt: `What does Ruby do at ${r.clock}?`,
    options: [she(r), she(R[(i + 3) % 8]), she(R[(i + 5) % 8]), `She ${r.v} ${r.rest.replace('my ', 'her ')}.`], answer: 0,
    explain: `讀描述判斷是 ${phrase(r)}；Ruby 是 she，${r.v} 要變 ${r.s}。` }, 'U4'));
  // Unit 4・What time do you …?（看自己的時間表回答）
  R.forEach((r, i) => add({ id: 'u4-time-' + i, tag: '對話選答', pic: r.pic, ctx: `Your schedule: ${phrase(r).replace('my ', 'your ')} — ${r.clock}`, prompt: `What time do you ${phrase(r).replace('my ', 'your ')}?`,
    options: [`I ${phrase(r)} at ${r.t}.`, `I ${r.s} ${r.rest} at ${r.t}.`, `I ${phrase(r)} at ${wrongTime[r.t]}.`, 'Yes, I do.'], answer: 0, explain: `${r.clock} 唸作 ${r.t}；I 後面動詞不加 s。` }, 'U4'));
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
  [['Do you have lunch at twelve?', 'Your schedule: have lunch — 12:30', "No, I don't. I have lunch at twelve thirty.", ['Yes, I do.', "No, I'm not. I have lunch at twelve thirty.", "No, I don't. I has lunch at twelve thirty."]],
   ['Does Ben go to school at seven?', "Ben's schedule: go to school — 7:00", 'Yes, he does.', ['Yes, he is.', "No, he doesn't.", 'Yes, he do.']],
   ['Do you go to bed at nine?', 'Your schedule: go to bed — 9:00', 'Yes, I do.', ['Yes, I am.', 'Yes, please.', "No, I don't. I go to bed at nine."]],
   ['Does your mom get up at six?', "Mom's schedule: get up — 5:30", "No, she doesn't. She gets up at five thirty.", ['Yes, she does.', "No, she doesn't. She get up at five thirty.", "No, she isn't. She gets up at five thirty."]]]
    .forEach(([q, ctx, a, d], i) => add({ id: 'u4-short-' + i, tag: '對話選答', pic: '🗓️', ctx, prompt: q, options: [a, ...d], answer: 0, explain: 'Do / Does 問句用 do / does / don\'t / doesn\'t 回答；he、she 後面的動詞加 s。' }, 'U4'));
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
  // 句子重組：看對話的另一半，排出空格那一句
  [['What would you like to eat?', "A: ＿＿＿\nB: I'd like some pizza, please.", 'U3'], ["I'd like some dumplings, please.", 'A: What would you like to eat?\nB: ＿＿＿', 'U3'],
   ['Would you like some soup?', "A: ＿＿＿\nB: No, thank you. I'm full.", 'U3'], ['No, thank you.', "A: Would you like some rice?\nB: ＿＿＿ I'm full.", 'U3'],
   ['What time do you get up?', 'A: ＿＿＿\nB: I get up at six thirty.', 'U4'], ['I go to bed at nine thirty.', 'A: What time do you go to bed?\nB: ＿＿＿', 'U4'],
   ['What time does Ben have lunch?', 'A: ＿＿＿\nB: He has lunch at twelve.', 'U4'], ['She goes to school at seven twenty.', 'A: What time does Ruby go to school?\nB: ＿＿＿', 'U4']]
    .forEach(([a, ctx, u], i) => add({ id: 'od-' + i, type: 'order', tag: '句子重組', answer: a, ctx }, u));
  // 聽寫拼字
  ['pizza', 'rice', 'soup', 'steak', 'noodles', 'lunch', 'dinner', 'breakfast', 'home', 'school']
    .forEach((w, i) => add({ id: 'sp-' + w, type: 'spell', tag: '聽寫拼字', word: w, show: spellMask(w) }, i < 5 ? 'U3' : 'U4'));
});

/* ---------------- 六上（新北）・康軒 Wonder World 9・第一次段考（Unit 1–2＋Review 1） ---------------- */
addBank({
  id: 'kh6a-1', title: '六上 第一次段考', sub: '康軒 Wonder World 9・Unit 1–2＋Review 1',
  grade: 6, term: '上', publisher: '康軒', book: 'Wonder World 9', exam: 1, lessonId: 'ww9t1'
}, add => {
  // Unit 1 是規則動詞過去式（加 -ed），Unit 2 是不規則的 did、had、went。
  // 出題原則同上：答案都在題目的英文裡。描述題不用看圖猜，讀英文描述再選。
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const other = g => (g === 'he' ? 'she' : 'he');
  const kid = g => (g === 'he' ? '👦' : '👧');
  const posOf = g => (g === 'he' ? 'his' : 'her');
  const my = (x, g) => x.replace('my ', posOf(g) + ' ');  // visited my grandparents → visited his grandparents
  // v 原形、s 現在式（he / she）、p 過去式
  const A = [
    { v: 'clean the room', s: 'cleans the room', p: 'cleaned the room' },
    { v: 'cook dinner', s: 'cooks dinner', p: 'cooked dinner' },
    { v: 'play the recorder', s: 'plays the recorder', p: 'played the recorder' },
    { v: 'visit my grandparents', s: 'visits my grandparents', p: 'visited my grandparents' },
    { v: 'walk the dog', s: 'walks the dog', p: 'walked the dog' },
    { v: 'watch a movie', s: 'watches a movie', p: 'watched a movie' },
    { v: 'listen to music', s: 'listens to music', p: 'listened to music' },
    { v: 'water the flowers', s: 'waters the flowers', p: 'watered the flowers' }];
  const B = [
    { v: 'do the dishes', s: 'does the dishes', p: 'did the dishes' },
    { v: 'do the laundry', s: 'does the laundry', p: 'did the laundry' },
    { v: 'have breakfast', s: 'has breakfast', p: 'had breakfast' },
    { v: 'have lunch', s: 'has lunch', p: 'had lunch' },
    { v: 'have dinner', s: 'has dinner', p: 'had dinner' },
    { v: 'go shopping', s: 'goes shopping', p: 'went shopping' },
    { v: 'go swimming', s: 'goes swimming', p: 'went swimming' },
    { v: 'do my homework', s: 'does my homework', p: 'did my homework' }];
  const K = [['Kevin', 'he'], ['Emma', 'she'], ['Ben', 'he'], ['Amy', 'she'], ['Leo', 'he'], ['Mia', 'she'], ['Tom', 'he'], ['Lily', 'she']];
  const T = ['yesterday', 'last night', 'last Friday', 'this morning', 'an hour ago', 'last weekend', 'last Sunday', 'yesterday'];
  const TD = ['last Friday', 'last night', 'an hour ago', 'last weekend', 'last Sunday', 'yesterday', 'yesterday', 'this morning'];  // Did 題的時間（不會出現「今天早上煮晚餐」）

  // Unit 1・讀描述選做了什麼（描述裡不出現答案的動詞）
  const D1 = [
    (n, P, pos) => `${n}'s room was messy. ${P} put away ${pos} toys and books.`,
    (n, P, pos) => `It was six in the evening. ${n} made rice and soup for ${pos} family.`,
    (n, P) => `${n} practiced a song for music class. ${P} used a long, thin instrument.`,
    (n, P) => `${n} went to Grandpa and Grandma's house. ${P} had lunch with them.`,
    (n, P, pos) => `${n} and ${pos} dog, Lucky, went to the park. Lucky ran and played there.`,
    (n, P) => `${n} sat in a dark room with some popcorn. ${P} saw a funny film on a big screen.`,
    (n, P, pos) => `${n} put on ${pos} headphones. ${P} enjoyed ${pos} favorite songs.`,
    n => `The flowers in the garden were dry. ${n} gave them some water.`];
  const DIS1 = [[1, 5], [0, 4], [4, 7], [5, 1], [3, 6], [2, 0], [7, 1], [6, 4]];
  A.forEach((a, i) => {
    const [n, g] = K[i], P = cap(g), pos = posOf(g);
    add({ id: 'u1-def-' + i, tag: '情境選答', pic: kid(g), ctx: D1[i](n, P, pos), prompt: `What did ${n} do yesterday?`,
      options: [`${P} ${my(a.p, g)}.`, `${P} ${my(A[DIS1[i][0]].p, g)}.`, `${P} ${my(A[DIS1[i][1]].p, g)}.`, `${P} ${my(a.s, g)}.`], answer: 0,
      explain: `讀描述判斷是 ${a.p.replace('my ', pos + ' ')}；昨天的事，動詞用過去式。` }, 'U1');
  });
  // Unit 1・What did … do?（把 I 換成 he / she，動詞維持過去式）
  A.forEach((a, i) => {
    const [n, g] = K[(i + 3) % 8], P = cap(g), t = T[i];
    add({ id: 'u1-what-' + i, tag: '對話選答', pic: kid(g), ctx: `${n}: I ${a.p} ${t}.`, prompt: `What did ${n} do ${t}?`,
      options: [`${P} ${my(a.p, g)}.`, `${cap(other(g))} ${my(a.p, other(g))}.`, `${P} ${my(a.s, g)}.`, `Yes, ${g} did.`], answer: 0,
      explain: `${n} 說 I ${a.p}。別人問的時候換成 ${P} ${my(a.p, g)}.，動詞還是過去式。` }, 'U1');
  });
  // Unit 1・Did … ? 簡答
  A.forEach((a, i) => {
    const [n, g] = K[(i + 5) % 8], P = cap(g), t = TD[i], b = A[(i + 3) % 8], yes = i % 2 === 0;
    add({ id: 'u1-did-' + i, tag: '對話選答', pic: kid(g), ctx: yes ? `${n}: I ${a.p} ${t}.` : `${n}: I didn't ${a.v} ${t}. I ${b.p}.`, prompt: `Did ${n} ${my(a.v, g)} ${t}?`,
      options: yes ? [`Yes, ${g} did.`, `No, ${g} didn't.`, `Yes, ${g} does.`, `Yes, ${other(g)} did.`]
        : [`No, ${g} didn't. ${P} ${my(b.p, g)}.`, `Yes, ${g} did.`, `No, ${g} doesn't. ${P} ${my(b.p, g)}.`, `No, ${g} didn't. ${P} ${my(b.s, g)}.`],
      answer: 0, explain: "Did 開頭的問句，用 did / didn't 回答；過去的事，動詞用過去式。" }, 'U1');
  });
  // Unit 1・現在式還是過去式？（看時間的字）
  [['I ___ the dog every morning.', ['walk', 'walks', 'walked'], 0, 'every morning 是每天的習慣，用現在式；I 後面不加 s。'],
   ['Kevin ___ a movie last night.', ['watch', 'watches', 'watched'], 2, 'last night 是過去，用 watched。'],
   ['My dad ___ dinner every Sunday.', ['cook', 'cooks', 'cooked'], 1, 'every Sunday 是習慣，用現在式；my dad 是 he，加 s。'],
   ['We ___ our grandparents last weekend.', ['visit', 'visits', 'visited'], 2, 'last weekend 是過去，用 visited。'],
   ['Amy ___ the recorder an hour ago.', ['play', 'plays', 'played'], 2, 'an hour ago（一小時前）是過去，用 played。'],
   ['They ___ the room on Fridays.', ['clean', 'cleans', 'cleaned'], 0, 'on Fridays 是每個星期五，用現在式；they 後面不加 s。'],
   ['Emma ___ to music yesterday.', ['listen', 'listens', 'listened'], 2, 'yesterday 是過去，用 listened。'],
   ['My grandma ___ the flowers every day.', ['water', 'waters', 'watered'], 1, 'every day 是習慣，用現在式；my grandma 是 she，加 s。'],
   ['I ___ TV this morning.', ['watch', 'watches', 'watched'], 2, 'this morning 已經過去了，用 watched。'],
   ['Ben ___ the dog last Friday.', ['walk', 'walks', 'walked'], 2, 'last Friday 是過去，用 walked。']]
    .forEach(([s, o, a, e], i) => add({ id: 'u1-tense-' + i, tag: '文法選擇', prompt: s, options: o, answer: a, explain: e }, 'U1'));
  [['___ you clean the room yesterday?', ['Do', 'Does', 'Did', 'Are'], 2, 'yesterday 是過去，問句用 Did。'],
   ['What ___ Emma do last night?', ['do', 'does', 'did', 'is'], 2, 'last night 是過去，用 did。'],
   ['Did he walk the dog? No, he ___.', ["don't", "doesn't", "didn't", "isn't"], 2, "Did 問，就用 didn't 答。"],
   ['Did you ___ a movie last night?', ['watch', 'watched', 'watches', 'watching'], 0, 'Did 後面的動詞用原形，不加 -ed。'],
   ["She didn't ___ dinner yesterday.", ['cook', 'cooked', 'cooks', 'cooking'], 0, "didn't 後面的動詞用原形。"],
   ['Did they visit their grandparents? Yes, they ___.', ['do', 'did', 'are', 'does'], 1, 'Did 問，就用 did 答。']]
    .forEach(([s, o, a, e], i) => add({ id: 'u1-dq-' + i, tag: '文法選擇', prompt: s, options: o, answer: a, explain: e }, 'U1'));

  // Unit 2・讀描述選做了什麼
  const D2 = [
    n => `After dinner, ${n} washed the plates, bowls, and chopsticks.`,
    (n, P, pos) => `${n} put ${pos} dirty clothes in the washing machine.`,
    n => `It was seven in the morning. ${n} ate eggs and toast.`,
    n => `It was twelve o'clock. ${n} ate rice and fish at school.`,
    (n, P, pos) => `It was six thirty in the evening. ${n} ate noodles with ${pos} family.`,
    (n, P) => `${n} went to the mall. ${P} bought a new T-shirt and some shoes.`,
    (n, P) => `${n} jumped into the pool. ${P} swam for an hour.`];
  const DIS2 = [[1, 6], [0, 5], [4, 6], [2, 5], [3, 1], [6, 0], [5, 1]];
  D2.forEach((d, i) => {
    const b = B[i], [n, g] = K[(i + 1) % 8], P = cap(g), pos = posOf(g);
    add({ id: 'u2-def-' + i, tag: '情境選答', pic: kid(g), ctx: d(n, P, pos), prompt: `What did ${n} do?`,
      options: [`${P} ${b.p}.`, `${P} ${B[DIS2[i][0]].p}.`, `${P} ${B[DIS2[i][1]].p}.`, `${P} ${b.s}.`], answer: 0,
      explain: `讀描述判斷是 ${b.p}。${b.v.split(' ')[0]} 的過去式是 ${b.p.split(' ')[0]}。` }, 'U2');
  });
  // Unit 2・What time did …?（看他昨天的時間表）
  const TM = [['7:30', 'seven thirty', 'eight thirty'], ['9:00', 'nine', 'ten'], ['6:45', 'six forty-five', 'seven forty-five'], ['12:15', 'twelve fifteen', 'twelve fifty'],
    ['6:00', 'six', 'seven'], ['3:00', 'three', 'two'], ['4:30', 'four thirty', 'five thirty'], ['8:00', 'eight', 'nine']];
  B.forEach((b, i) => {
    const [n, g] = K[i], P = cap(g), [clock, t, wrong] = TM[i];
    add({ id: 'u2-time-' + i, tag: '對話選答', pic: kid(g), ctx: `${n}'s day yesterday:\n${my(b.v, g)} — ${clock}`, prompt: `What time did ${n} ${my(b.v, g)} yesterday?`,
      options: [`${P} ${my(b.p, g)} at ${t}.`, `${P} ${my(b.s, g)} at ${t}.`, `${P} ${my(b.p, g)} at ${wrong}.`, `Yes, ${g} did.`], answer: 0,
      explain: `${clock} 唸作 ${t}；昨天的事，${b.v.split(' ')[0]} 要變 ${b.p.split(' ')[0]}。` }, 'U2');
  });
  [['Your day yesterday:\nhave lunch — 12:00', 'What time did you have lunch yesterday?', 'I had lunch at twelve.', ['I have lunch at twelve.', 'I had lunch at two.', 'Yes, I did.']],
   ['Your day yesterday:\ngo swimming — 5:30', 'What did you do at five thirty yesterday?', 'I went swimming.', ['I go swimming.', 'I went shopping.', "No, I didn't."]],
   ['Your day yesterday:\ndo the dishes — 7:00', 'Did you do the dishes at seven yesterday?', 'Yes, I did.', ['Yes, I do.', "No, I didn't.", 'Yes, I am.']],
   ['Your day yesterday:\ndo the laundry — 10:00', 'Did you do the laundry at nine yesterday?', "No, I didn't. I did the laundry at ten.", ['Yes, I did.', "No, I don't. I do the laundry at ten.", "No, I didn't. I did the laundry at nine."]]]
    .forEach(([ctx, q, a, d], i) => add({ id: 'u2-you-' + i, tag: '對話選答', pic: '🗓️', ctx, prompt: q, options: [a, ...d], answer: 0, explain: '看時間表回答；昨天的事用過去式，Did 問就用 did / didn\'t 答。' }, 'U2'));
  // Unit 2・do / have / go 的過去式
  [['I ___ the dishes after dinner last night.', ['do', 'does', 'did'], 2, 'last night 是過去，do 的過去式是 did。'],
   ['My mom ___ the laundry every Sunday.', ['do', 'does', 'did'], 1, 'every Sunday 是習慣，用現在式；my mom 是 she，用 does。'],
   ['We ___ lunch at school yesterday.', ['have', 'has', 'had'], 2, 'yesterday 是過去，have 的過去式是 had。'],
   ['Ben ___ breakfast at seven every day.', ['have', 'has', 'had'], 1, 'every day 是習慣，用現在式；Ben 是 he，用 has。'],
   ['They ___ swimming last Saturday.', ['go', 'goes', 'went'], 2, 'last Saturday 是過去，go 的過去式是 went。'],
   ['Amy ___ shopping on Sundays.', ['go', 'goes', 'went'], 1, 'on Sundays 是每個星期日，用現在式；Amy 是 she，用 goes。'],
   ['I ___ dinner at six thirty yesterday.', ['have', 'has', 'had'], 2, 'yesterday 是過去，用 had。'],
   ['He ___ his homework an hour ago.', ['do', 'does', 'did'], 2, 'an hour ago 是過去，用 did。'],
   ['What time did you ___ home?', ['go', 'goes', 'went'], 0, 'did 後面的動詞用原形 go。'],
   ['Did she ___ the laundry this morning?', ['do', 'does', 'did'], 0, 'Did 後面的動詞用原形 do。']]
    .forEach(([s, o, a, e], i) => add({ id: 'u2-irr-' + i, tag: '文法選擇', prompt: s, options: o, answer: a, explain: e }, 'U2'));
  [['👧', 'Mia: I went swimming yesterday afternoon.', 'Did Mia go swimming yesterday?', 'Yes, she did.', ['Yes, she does.', 'Yes, he did.', "No, she didn't."]],
   ['👦', "Ken: I didn't do the dishes. I did the laundry.", 'Did Ken do the dishes?', "No, he didn't. He did the laundry.", ["No, he doesn't. He did the laundry.", 'Yes, he did.', "No, he didn't. He does the laundry."]],
   ['🙂', 'You: I had lunch at 12:00.', 'Did you have lunch at twelve thirty?', "No, I didn't. I had lunch at twelve.", ['Yes, I did.', "No, I don't. I have lunch at twelve.", "No, I didn't. I had lunch at twelve thirty."]],
   ['👦👧', 'Tom and Amy: We went shopping last Sunday.', 'Did Tom and Amy go shopping last Sunday?', 'Yes, they did.', ['Yes, they do.', 'Yes, we did.', "No, they didn't."]],
   ['👧', 'Lily: I had breakfast at 6:30 this morning.', 'Did Lily have breakfast at seven this morning?', "No, she didn't. She had breakfast at six thirty.", ['Yes, she did.', "No, she doesn't. She has breakfast at six thirty.", "No, she didn't. She had breakfast at seven."]],
   ['👦', 'Leo: I did my homework at 8:00 last night.', 'What time did Leo do his homework?', 'He did his homework at eight.', ['He does his homework at eight.', 'He did his homework at nine.', 'Yes, he did.']]]
    .forEach(([pic, ctx, q, a, d], i) => add({ id: 'u2-short-' + i, tag: '對話選答', pic, ctx, prompt: q, options: [a, ...d], answer: 0, explain: "Did 問句用 did / didn't 回答；過去的事，動詞用過去式（did、had、went）。" }, 'U2'));

  // 發音（聽力）：-ed 的三種唸法，選項固定是 played（/d/）、cooked（/t/）、visited（/ɪd/）
  const ED = [['d', ['listened', 'rained', 'stayed', 'cleaned', 'called']], ['t', ['helped', 'watched', 'laughed', 'walked', 'talked']], ['id', ['landed', 'shouted', 'invited', 'wanted', 'painted']]];
  const EDX = { d: ['/d/', 'played'], t: ['/t/', 'cooked'], id: ['/ɪd/', 'visited'] };
  ED.forEach(([k, words], a) => words.forEach(w => add({ id: 'ph-' + w, tag: '聽音辨字', audio: w, prompt: 'Which word has the same -ed sound?', options: ['played', 'cooked', 'visited'], answer: a, fixed: true,
    explain: `${w} 的 -ed 唸 ${EDX[k][0]}，跟 ${EDX[k][1]} 一樣。${k === 'id' ? '字的最後是 t 或 d，-ed 就唸 /ɪd/。' : ''}` }, '發音')));
  [['king', 'ing'], ['ring', 'ing'], ['sing', 'ing'], ['wing', 'ing'], ['long', 'ong'], ['strong', 'ong'], ['wrong', 'ong'], ['song', 'ong']]
    .forEach(([w, pat]) => add({ id: 'ph-' + w, tag: '聽音辨字', audio: w, show: phonicsMask(w, pat), prompt: 'Which letters are missing?',
      options: pat === 'ing' ? ['ing', 'ong', 'ang'] : ['ong', 'ing', 'ung'], answer: 0, explain: `${w} 的 ${pat}。-ing 跟 king 一樣，-ong 跟 long 一樣。` }, '發音'));
  // 聽句子
  [['Kevin cleaned the room yesterday.', 'What did Kevin do yesterday?', ['🧹 cleaned the room', '🍳 cooked dinner', '🐕 walked the dog']],
   ['Emma played the recorder last night.', 'What did Emma do last night?', ['🎶 played the recorder', '🎬 watched a movie', '👵 visited her grandparents']],
   ['I had lunch at twelve thirty.', 'What time did she have lunch?', ['12:30', '12:00', '2:30']],
   ['We went swimming last Saturday.', 'What did they do last Saturday?', ['🏊 went swimming', '🛍️ went shopping', '🧺 did the laundry']],
   ['My dad did the dishes after dinner.', 'What did her dad do after dinner?', ['🍽️ did the dishes', '🍲 had dinner', '🍳 cooked dinner']],
   ['Ben went home at five yesterday.', 'What time did Ben go home yesterday?', ['5:00', '4:00', '5:30']]]
    .forEach(([a, q, o], i) => add({ id: 'ls-' + i, tag: '聽句子', audio: a, prompt: q, options: o, answer: 0 }, '聽力'));
  [['What did you do yesterday?', ['I visited my grandparents.', 'Yes, I did.', 'I visit my grandparents every Sunday.']],
   ['Did you watch a movie last night?', ["No, I didn't.", "No, I don't.", 'Yes, I was.']],
   ['What time did you have dinner?', ['I had dinner at seven.', 'I have dinner every day.', 'Yes, I did.']],
   ['Did your mom cook dinner yesterday?', ['Yes, she did.', 'Yes, she does.', 'Yes, I did.']],
   ['What did Ben do last weekend?', ['He went shopping.', 'He goes shopping.', "No, he didn't."]]]
    .forEach(([a, o], i) => add({ id: 'lq-' + i, tag: '聽問句選回答', audio: a, prompt: 'Choose the best answer.', options: o, answer: 0 }, '聽力'));
  // 閱讀（True / False / Not mentioned）
  const R1 = "Amy: What did you do last weekend, Kevin?\nKevin: I visited my grandparents. I played the recorder for them.\nAmy: Did you walk your dog, too?\nKevin: No, I didn't. My sister walked the dog.\nAmy: I watched a movie with my mom.";
  [['Kevin visited his grandparents.', 0], ['Kevin walked the dog.', 1], ["Amy's mom cooked dinner.", 2]]
    .forEach(([s, a], i) => add({ id: 'rd1-' + i, tag: '閱讀判斷', passage: R1, prompt: s, options: TF, answer: a, explain: a === 2 ? '對話裡沒有提到，選 Not mentioned。' : a === 1 ? 'Kevin 說 No, I didn\'t.，遛狗的是他的姊姊或妹妹。' : '' }, '閱讀'));
  const R2 = "Mom: Did you have lunch at school today, Leo?\nLeo: Yes, I did. I had noodles.\nMom: What time did you go swimming?\nLeo: I went swimming at four thirty.\nMom: Did you do your homework?\nLeo: Yes, I did it before dinner.";
  [['Leo had noodles for lunch.', 0], ['Leo went swimming at four.', 1], ['Leo did the dishes after dinner.', 2]]
    .forEach(([s, a], i) => add({ id: 'rd2-' + i, tag: '閱讀判斷', passage: R2, prompt: s, options: TF, answer: a, explain: a === 2 ? '對話沒有提到洗碗，選 Not mentioned。' : a === 1 ? 'Leo 是四點半（four thirty）去游泳。' : '' }, '閱讀'));
  const R3 = 'Last Sunday was a busy day for Mia. She had breakfast at eight. Then she did the laundry with her dad. In the afternoon, she went shopping with her friends. She didn\'t cook dinner. Her brother cooked dinner, and it was yummy!';
  [['Mia did the laundry last Sunday.', 0], ['Mia cooked dinner.', 1], ['Mia bought a new dress.', 2]]
    .forEach(([s, a], i) => add({ id: 'rd3-' + i, tag: '閱讀判斷', passage: R3, prompt: s, options: TF, answer: a, explain: a === 2 ? '文章只說她去逛街，沒有說買了什麼，選 Not mentioned。' : a === 1 ? '煮晚餐的是她哥哥或弟弟。' : '' }, '閱讀'));
  // 句子重組：看對話的另一半，排出空格那一句
  [['What did you do yesterday?', 'A: ＿＿＿\nB: I walked the dog.'], ['I watched a movie last night.', 'A: What did you do last night?\nB: ＿＿＿'],
   ['Did you clean the room?', "A: ＿＿＿\nB: No, I didn't. I cooked dinner."], ['She visited her grandparents.', 'A: What did Amy do last weekend?\nB: ＿＿＿'],
   ['What time did you have breakfast?', 'A: ＿＿＿\nB: I had breakfast at seven.'], ['I went shopping with my mom.', 'A: What did you do yesterday afternoon?\nB: ＿＿＿'],
   ['Did he go swimming yesterday?', 'A: ＿＿＿\nB: Yes, he did. He went with his dad.'], ['They did the dishes after dinner.', 'A: What did Tom and Ken do after dinner?\nB: ＿＿＿']]
    .forEach(([a, ctx], i) => add({ id: 'od-' + i, type: 'order', tag: '句子重組', answer: a, ctx }, i < 4 ? 'U1' : 'U2'));
  // 聽寫拼字：聽發音拼出來
  ['cleaned', 'cooked', 'played', 'visited', 'watched', 'dishes', 'laundry', 'breakfast', 'lunch', 'shopping']
    .forEach((w, i) => add({ id: 'sp-' + w, type: 'spell', tag: '聽寫拼字', word: w, show: spellMask(w) }, i < 5 ? 'U1' : 'U2'));
});

/* ---------------- 六上（新北）・康軒 Wonder World 9・第二次段考（Unit 3–4＋Review 2） ---------------- */
addBank({
  id: 'kh6a-2', title: '六上 第二次段考', sub: '康軒 Wonder World 9・Unit 3–4＋Review 2',
  grade: 6, term: '上', publisher: '康軒', book: 'Wonder World 9', exam: 2, lessonId: 'ww9t2'
}, add => {
  // 課本 Unit 3 的景點是台灣真實地名，我們不考地理：只用 beach、lake 這類單字，答案都寫在題目裡。
  // Unit 4 的地圖題：scene 是用 emoji 排的街道（上下兩排，中間是馬路），ctx 寫每個 emoji 是什麼地方。
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const other = g => (g === 'he' ? 'she' : 'he');
  const kid = g => (g === 'he' ? '👦' : '👧');
  const PL = [
    { w: 'beach', d: "It's next to the sea. It has a lot of sand. People swim and play there." },
    { w: 'forest', d: "It's a big place with a lot of tall trees. People go hiking there." },
    { w: 'island', d: "It's land with water all around it. People go there by boat." },
    { w: 'lake', d: "It's a lot of water with land all around it. People go biking around it." },
    { w: 'mountain', d: "It's very, very high. It's hard to walk to the top." },
    { w: 'river', d: 'It is long water. It moves across the land to the sea.' },
    { w: 'hot spring', d: "It's hot water from under the ground. People sit in it on cold days." }];
  const DIS3 = [[5, 2, 1], [4, 3, 0], [3, 0, 4], [2, 5, 6], [1, 2, 5], [3, 0, 6], [3, 5, 1]];
  PL.forEach((p, i) => add({ id: 'u3-def-' + i, tag: '情境選答', ctx: p.d, prompt: 'What is it?', options: [p.w, ...DIS3[i].map(j => PL[j].w)], answer: 0 }, 'U3'));
  // Unit 3・Where did … go?
  const DO3 = ['We played in the sand.', 'We went hiking.', 'We went there by boat.', 'We went biking around it.', 'We walked to the top.', 'We went camping there.', 'The water was very warm.'];
  const K = [['Kevin', 'he'], ['Emma', 'she'], ['Ben', 'he'], ['Amy', 'she'], ['Leo', 'he'], ['Mia', 'she'], ['Tom', 'he']];
  const T = ['last Sunday', 'yesterday', 'last weekend', 'last Friday', 'last week', 'last Saturday', 'last night'];
  PL.forEach((p, i) => {
    const [n, g] = K[i], P = cap(g), t = T[i], q = PL[(i + 3) % 7].w;
    add({ id: 'u3-where-' + i, tag: '對話選答', pic: kid(g), ctx: `${n}: I went to the ${p.w} ${t}. ${DO3[i]}`, prompt: `Where did ${n} go ${t}?`,
      options: [`${P} went to the ${p.w}.`, `${P} goes to the ${p.w}.`, `${P} went to the ${q}.`, `Yes, ${g} did.`], answer: 0,
      explain: `${n} 說 I went to the ${p.w}。別人問的時候換成 ${P} went to …，go 的過去式是 went。` }, 'U3');
  });
  // Unit 3・看行程表回答 Where / Did … go to …?
  [{ n: 'Betty', g: 'she', rows: [['last Friday', 'island'], ['last Saturday', 'river'], ['last Sunday', 'hot spring']] },
   { n: 'Andy', g: 'he', rows: [['last Monday', 'mountain'], ['last Wednesday', 'lake'], ['last weekend', 'beach']] },
   { n: 'Zoe', g: 'she', rows: [['last Tuesday', 'lake'], ['last Thursday', 'forest'], ['last Saturday', 'beach']] }]
    .forEach(({ n, g, rows }, k) => {
      const P = cap(g), ctx = `${n}'s trips:\n` + rows.map(([t, w]) => `${cap(t)} — the ${w}`).join('\n');
      const [[t0, w0], [t1, w1], [t2, w2]] = rows;
      add({ id: `u3-trip-${k}-0`, tag: '對話選答', pic: kid(g), ctx, prompt: `Where did ${n} go ${t0}?`,
        options: [`${P} went to the ${w0}.`, `${P} went to the ${w1}.`, `${P} goes to the ${w0}.`, `Yes, ${g} did.`], answer: 0, explain: `看行程表：${cap(t0)} — the ${w0}。` }, 'U3');
      add({ id: `u3-trip-${k}-1`, tag: '對話選答', pic: kid(g), ctx, prompt: `Did ${n} go to the ${w1} ${t1}?`,
        options: [`Yes, ${g} did.`, `No, ${g} didn't.`, `Yes, ${g} does.`, `Yes, ${other(g)} did.`], answer: 0, explain: `看行程表：${cap(t1)} — the ${w1}。Did 問，就用 did 答。` }, 'U3');
      add({ id: `u3-trip-${k}-2`, tag: '對話選答', pic: kid(g), ctx, prompt: `Did ${n} go to the ${w1} ${t2}?`,
        options: [`No, ${g} didn't. ${P} went to the ${w2}.`, `Yes, ${g} did.`, `No, ${g} doesn't. ${P} went to the ${w2}.`, `No, ${g} didn't. ${P} went to the ${w1}.`], answer: 0,
        explain: `看行程表：${cap(t2)} — the ${w2}，所以答 No, ${g} didn't.` }, 'U3');
    });
  [['Where ___ you go last Sunday?', ['do', 'did', 'are', 'were'], 1, 'last Sunday 是過去，用 did。'],
   ['I ___ to the lake yesterday.', ['go', 'goes', 'went', 'going'], 2, 'yesterday 是過去，go 要變 went。'],
   ['My uncle ___ to the beach every summer.', ['go', 'goes', 'went', 'going'], 1, 'every summer 是每年的習慣，用現在式；my uncle 是 he，用 goes。'],
   ['Did you go to the island? No, I ___.', ["don't", "didn't", "wasn't", "isn't"], 1, "Did 問，就用 didn't 答。"],
   ['Did Amy go to the mountain last week? Yes, ___ did.', ['he', 'she', 'they', 'it'], 1, 'Amy 是女生，用 she。'],
   ['We went hiking ___ the forest.', ['in', 'on', 'at', 'of'], 0, '在森林裡：in the forest。'],
   ['They went camping ___ the river.', ['by', 'of', 'to', 'from'], 0, '在河邊：by the river。'],
   ['Did they ___ to the hot spring last night?', ['go', 'went', 'goes', 'going'], 0, 'Did 後面的動詞用原形 go。'],
   ["She ___ go to the beach last Sunday. It was rainy.", ["doesn't", "didn't", "don't", "isn't"], 1, "last Sunday 是過去，否定用 didn't。"],
   ['___ did Kevin go last weekend? He went to the mountain.', ['What', 'Where', 'Who', 'When'], 1, '問「去哪裡」用 Where。']]
    .forEach(([s, o, a, e], i) => add({ id: 'u3-g-' + i, tag: '文法選擇', prompt: s, options: o, answer: a, explain: e }, 'U3'));

  // Unit 4・讀描述選地方
  const PC = [
    { w: 'convenience store', e: '🏪', d: "It's a small store. It's open twenty-four hours a day. You can buy snacks and pay bills there." },
    { w: 'MRT station', e: '🚇', d: 'Many people wait for the train here. The train goes under the city.' },
    { w: 'science museum', e: '🦖', d: 'You can learn about dinosaurs, space, and robots here.' },
    { w: 'tea shop', e: '🧋', d: 'You can buy cold drinks like bubble tea here.' },
    { w: 'bakery', e: '🥖', d: 'You can buy bread and cakes here.' },
    { w: 'bookstore', e: '📖', d: 'This store sells only books. You can find storybooks and comic books here.' },
    { w: 'hospital', e: '🏥', d: 'Doctors and nurses work here. Sick people go here.' },
    { w: 'library', e: '📚', d: 'You can borrow books here, but you must give them back.' },
    { w: 'post office', e: '🏣', d: 'You can buy stamps and send letters here.' },
    { w: 'supermarket', e: '🛒', d: "It's a big store. You can buy meat, fruit, and milk here." },
    { w: 'movie theater', e: '🎬', d: 'You can watch a movie on a big screen here.' },
    { w: 'park', e: '🌳', d: 'It has grass, trees, and a playground. Kids play here.' }];
  // 干擾選項避開說法也通的地方（例如便利商店也能寄包裹、買雜誌）
  const DIS4 = [[1, 4, 7], [2, 5, 8], [3, 6, 9], [4, 7, 10], [5, 8, 11], [6, 9, 1], [7, 10, 1], [8, 11, 2], [9, 3, 11], [10, 1, 4], [11, 0, 6], [0, 3, 6]];
  PC.forEach((p, i) => add({ id: 'u4-def-' + i, tag: '情境選答', ctx: p.d, prompt: 'What place is it?', options: [p.w, ...DIS4[i].map(j => PC[j].w)], answer: 0 }, 'U4'));
  // Unit 4・看地圖：上下兩排店，中間是馬路。同一排旁邊是 next to，馬路對面是 across from
  const at = w => PC.find(p => p.w === w);
  const MAPS = [
    { street: 'Park Street', top: ['convenience store', 'MRT station', 'tea shop'], bottom: ['library', 'science museum', 'bakery'], qs: [
      ['Where is the MRT station?', "It's between the convenience store and the tea shop.", ["It's across from the library.", "It's next to the bakery.", "It's between the library and the bakery."]],
      ['Is the tea shop across from the bakery?', 'Yes, it is.', ["No, it's not.", 'Yes, it does.', 'Yes, I did.']],
      ['What is across from the library?', 'The convenience store.', ['The MRT station.', 'The science museum.', 'The tea shop.']]] },
    { street: 'Green Street', top: ['hospital', 'post office', 'supermarket'], bottom: ['park', 'movie theater', 'bookstore'], qs: [
      ['Is the post office next to the supermarket?', 'Yes, it is.', ["No, it's not.", 'Yes, it does.', "No, it's not. It's across from the supermarket."]],
      ['Is the park next to the bookstore?', "No, it's not. It's next to the movie theater.", ['Yes, it is.', "No, it's not. It's next to the hospital.", "No, it doesn't. It's next to the movie theater."]],
      ['Where is the movie theater?', "It's between the park and the bookstore.", ["It's across from the hospital.", "It's next to the supermarket.", "It's between the hospital and the supermarket."]]] },
    { street: 'Happy Street', top: ['bakery', 'tea shop', 'convenience store'], bottom: ['science museum', 'MRT station', 'library'], qs: [
      ['Where is the MRT station?', "It's across from the tea shop.", ["It's next to the bakery.", "It's across from the bakery.", "It's between the bakery and the convenience store."]],
      ['Is the bakery next to the convenience store?', "No, it's not. It's next to the tea shop.", ['Yes, it is.', "No, it's not. It's next to the library.", "No, it's not. It's across from the library."]],
      ['Where is the science museum?', "It's across from the bakery.", ["It's across from the tea shop.", "It's between the MRT station and the library.", "It's next to the convenience store."]]] }];
  MAPS.forEach((m, k) => {
    const scene = m.top.map(w => at(w).e).join(' ') + '\n━━━━━━\n' + m.bottom.map(w => at(w).e).join(' ');
    const ctx = `The road in the middle is ${m.street}.\n` + [m.top, m.bottom].map(row => row.map(w => `${at(w).e} ${w}`).join(', ')).join('\n');
    m.qs.forEach(([q, a, d], i) => add({ id: `u4-map-${k}-${i}`, tag: '看地圖選答', scene, ctx, prompt: q, options: [a, ...d], answer: 0,
      explain: '同一排、緊鄰的是 next to；馬路對面正對的是 across from；兩家店中間的是 between … and …。' }, 'U4'));
  });
  [['The bakery is ___ to the park.', ['next', 'across', 'between', 'on'], 0, '在旁邊是 next to。'],
   ['The library is across ___ the school.', ['from', 'to', 'of', 'at'], 0, '在對面是 across from。'],
   ['The tea shop is between the bookstore ___ the bakery.', ['and', 'or', 'to', 'from'], 0, 'between A and B：在 A 和 B 中間。'],
   ['The hospital is ___ Green Street.', ['on', 'at', 'in', 'to'], 0, '在某條街上，用 on。'],
   ['Where ___ the MRT station?', ['is', 'are', 'do', 'did'], 0, 'the MRT station 是一個地方，用 is。'],
   ['Is the park next to the library? No, it ___.', ["isn't", "doesn't", "didn't", "aren't"], 0, "Is 問，就用 isn't 答。"],
   ['Is the post office across from the bakery? Yes, it ___.', ['is', 'does', 'did', 'was'], 0, 'Is 問，就用 is 答。'],
   ["___ is the science museum? It's next to the park.", ['What', 'Where', 'Who', 'When'], 1, '問「在哪裡」用 Where。']]
    .forEach(([s, o, a, e], i) => add({ id: 'u4-g-' + i, tag: '文法選擇', prompt: s, options: o, answer: a, explain: e }, 'U4'));
  [['👧', "Lily: I'm hungry. I want some bread and cake.", 'Where can Lily go?', 'To the bakery.', ['To the post office.', 'To the hospital.', 'To the MRT station.']],
   ['👦', "Ken: I'm thirsty. I want some bubble tea.", 'Where can Ken go?', 'To the tea shop.', ['To the library.', 'To the bookstore.', 'To the park.']],
   ['👧', 'Amy: I want to send a letter to my grandma.', 'Where can Amy go?', 'To the post office.', ['To the bakery.', 'To the science museum.', 'To the tea shop.']],
   ['👦', "Ben: It's midnight, and I need some milk.", 'Where can Ben go?', 'To the convenience store.', ['To the library.', 'To the bookstore.', 'To the science museum.']]]
    .forEach(([pic, ctx, q, a, d], i) => add({ id: 'u4-need-' + i, tag: '情境選答', pic, ctx, prompt: q, options: [a, ...d], answer: 0 }, 'U4'));

  // 發音（聽力）：y 的三種唸法，選項固定是 yellow、sky、baby
  [['yard', 0], ['yolk', 0], ['young', 0], ['cry', 1], ['fly', 1], ['my', 1], ['puppy', 2], ['sunny', 2], ['city', 2]]
    .forEach(([w, a]) => add({ id: 'ph-' + w, tag: '聽音辨字', audio: w, prompt: 'Which word has the same y sound?', options: ['yellow', 'sky', 'baby'], answer: a, fixed: true,
      explain: [`y 在字的前面，跟 yellow、yes 一樣。`, `${w} 的 y 跟 sky、my 一樣。`, `${w} 的 y 跟 baby、sunny 一樣。`][a] }, '發音'));
  // al、au、aw 唸起來一樣，所以干擾選項用唸法不同的字母組合
  [['chalk', 'al'], ['talk', 'al'], ['walk', 'al'], ['August', 'Au'], ['launch', 'au'], ['sauce', 'au'], ['draw', 'aw'], ['lawn', 'aw'], ['strawberry', 'aw']]
    .forEach(([w, pat]) => add({ id: 'ph-' + w.toLowerCase(), tag: '聽音辨字', audio: w, show: phonicsMask(w, pat), prompt: 'Which letters are missing?',
      options: { al: ['al', 'ar', 'oa'], au: ['au', 'ou', 'oi'], Au: ['Au', 'Ou', 'Oi'], aw: ['aw', 'ow', 'ay'] }[pat], answer: 0,
      explain: `${w} 的 ${pat}。al、au、aw 唸起來一樣（跟 walk 的 a 一樣），要記住拼法。` }, '發音'));
  // 聽句子
  [['I went to the forest last Sunday.', 'Where did she go last Sunday?', ['🌲 the forest', '🏞️ the river', '🏝️ the island']],
   ['We went to the hot spring yesterday.', 'Where did they go yesterday?', ['♨️ the hot spring', '🏖️ the beach', '⛰️ the mountain']],
   ['Ken went to the lake last weekend.', 'Where did Ken go last weekend?', ['🛶 the lake', '🏖️ the beach', '🌲 the forest']],
   ['The tea shop is next to the bakery.', 'Where is the tea shop?', ['next to the bakery', 'across from the bakery', 'between the bakery and the park']],
   ['The library is across from the hospital.', 'Where is the library?', ['across from the hospital', 'next to the hospital', 'between the hospital and the park']],
   ['The MRT station is between the bookstore and the park.', 'Where is the MRT station?', ['between the bookstore and the park', 'next to the bookstore', 'across from the park']]]
    .forEach(([a, q, o], i) => add({ id: 'ls-' + i, tag: '聽句子', audio: a, prompt: q, options: o, answer: 0 }, '聽力'));
  [['Where did you go last weekend?', ['I went to the mountain.', 'Yes, I did.', "It's on Park Street."]],
   ['Did you go to the beach yesterday?', ["No, I didn't. I went to the lake.", "No, it's not.", 'I go to the beach every day.']],
   ['Where is the convenience store?', ["It's next to the park.", 'I went to the store.', 'Yes, it is.']],
   ['Is the library across from the school?', ['Yes, it is.', 'Yes, I did.', 'I like the library.']],
   ['What did you do at the river?', ['We went camping.', "It's next to the river.", 'Yes, we did.']]]
    .forEach(([a, o], i) => add({ id: 'lq-' + i, tag: '聽問句選回答', audio: a, prompt: 'Choose the best answer.', options: o, answer: 0 }, '聽力'));
  // 閱讀（True / False / Not mentioned）
  const R1 = "Kevin: Where did you go last weekend, Emma?\nEmma: I went to the island with my family.\nKevin: Did you go swimming?\nEmma: No, I didn't. It was cold. We went biking.\nKevin: Sounds fun! I went to the hot spring with my grandpa.";
  [['Emma went to the island last weekend.', 0], ['Emma went swimming.', 1], ["Kevin's grandpa likes hiking.", 2]]
    .forEach(([s, a], i) => add({ id: 'rd1-' + i, tag: '閱讀判斷', passage: R1, prompt: s, options: TF, answer: a, explain: a === 2 ? '對話沒有提到爺爺喜歡什麼，選 Not mentioned。' : a === 1 ? "Emma 說 No, I didn't.，他們去騎腳踏車。" : '' }, '閱讀'));
  const R2 = "Tourist: Excuse me. Where is the science museum?\nAmy: It's on Happy Street. It's across from the park.\nTourist: Is it next to the MRT station?\nAmy: Yes, it is. The MRT station is between the museum and a tea shop.\nTourist: Thank you!";
  [['The science museum is on Happy Street.', 0], ['The science museum is next to the park.', 1], ['The tea shop is open twenty-four hours a day.', 2]]
    .forEach(([s, a], i) => add({ id: 'rd2-' + i, tag: '閱讀判斷', passage: R2, prompt: s, options: TF, answer: a, explain: a === 2 ? '對話沒有提到飲料店幾點開，選 Not mentioned。' : a === 1 ? '博物館在公園的對面（across from），不是旁邊。' : '' }, '閱讀'));
  const R3 = 'This is my neighborhood. My house is next to a bakery. Across from my house, there is a big park. The library is between the park and the post office. I go to the library every Saturday. I love my neighborhood!';
  [['The bakery is next to the writer\'s house.', 0], ['The library is next to the bakery.', 1], ['The writer has a dog.', 2]]
    .forEach(([s, a], i) => add({ id: 'rd3-' + i, tag: '閱讀判斷', passage: R3, prompt: s, options: TF, answer: a, explain: a === 2 ? '文章沒有提到狗，選 Not mentioned。' : a === 1 ? '圖書館在公園和郵局中間。' : '' }, '閱讀'));
  // 句子重組
  [['Where did you go last weekend?', 'A: ＿＿＿\nB: I went to the beach.', 'U3'], ['I went to the forest with my dad.', 'A: Where did you go yesterday?\nB: ＿＿＿', 'U3'],
   ['Did you go to the hot spring?', 'A: ＿＿＿\nB: Yes, I did. The water was hot.', 'U3'], ['She went to the lake last Friday.', 'A: Where did Betty go last Friday?\nB: ＿＿＿', 'U3'],
   ['Where is the post office?', "A: ＿＿＿\nB: It's next to the hospital.", 'U4'], ["It's across from the park.", 'A: Where is the library?\nB: ＿＿＿', 'U4'],
   ['Is the bakery next to the bookstore?', "A: ＿＿＿\nB: No, it's not. It's next to the tea shop.", 'U4'], ["It's between the bakery and the bookstore.", 'A: Where is the tea shop?\nB: ＿＿＿', 'U4']]
    .forEach(([a, ctx, u], i) => add({ id: 'od-' + i, type: 'order', tag: '句子重組', answer: a, ctx }, u));
  // 聽寫拼字
  ['beach', 'forest', 'island', 'river', 'mountain', 'museum', 'station', 'store', 'between', 'across']
    .forEach((w, i) => add({ id: 'sp-' + w, type: 'spell', tag: '聽寫拼字', word: w, show: spellMask(w) }, i < 5 ? 'U3' : 'U4'));
});
/* ---------------- 英檢山・全民英檢初級 聽力＋閱讀（國小高年級・CEFR A2） ----------------
   照 2021 年起的新制題型和題數出兩回的量：聽力 4 部分 30 題 ×2、閱讀 3 部分 30 題 ×2。
   全部自命題，沒有用 LTTC 的考古題。fixed：選項照寫的順序，不打亂（看圖辨義的選項是唸出來的）。
   聽力 audio：M: / W: 開頭是一男一女的對話；最後一行 Q: 是題目，用旁白的聲音另外錄。 */
addBank({
  id: 'gept-e1', title: 'GEPT 初級 聽力・閱讀', sub: '全民英檢初級（CEFR A2）・國小高年級・自命題',
  grade: 5, gradeText: '國小五、六年級', exam: 'GEPT', level: '初級', drill: '英檢刷題',
  parts: [
    '聽力 30 題，約 20 分鐘：看圖辨義 5、問答 10、簡短對話 10、短文聽解 5（三選一，正式考試每題只播一次）',
    '閱讀 30 題，35 分鐘：詞彙 10、段落填空 8（2 篇各 4 格）、閱讀理解 12（4 組各 3 題）（四選一）',
    '通過標準：聽力＋閱讀 160 分（各 120 分滿分），而且兩項都不能低於 72 分'
  ],
  about: [
    '題庫有兩回的量：聽力 60 題、閱讀 60 題，題目每次隨機組合',
    '「模擬考」照官方的題型和題數出一整回；「分題型練習」可以只練一種題型',
    '跟段考刷題一樣：答錯的進錯題本，老師可以挑題上課、印學習單、指定回家刷'
  ],
  mock: { '聽力': [['看圖辨義', 5], ['問答', 10], ['簡短對話', 10], ['短文聽解', 5]], '閱讀': [['詞彙', 10], ['段落填空', 8], ['閱讀理解', 12]] },
  mockNote: '照全民英檢初級的題型和題數：聽力 30 題（看圖辨義 5、問答 10、簡短對話 10、短文聽解 5），閱讀 30 題（詞彙 10、段落填空 8、閱讀理解 12）。正式考試聽力每題只播一次，這裡可以重聽。'
}, add => {
  // 出題原則：每一題都要能從題目裡的英文（聽到的、讀到的）找到答案。不考地理常識、不考背課本、不考中翻英。
  // 正確答案寫在第一個，再用題號決定放在 A、B、C、D 的哪一格，答案位置才不會都一樣。
  const hash = s => { let x = 7; for (const ch of s) x = (x * 31 + ch.charCodeAt(0)) >>> 0; return x; };
  const place = (id, opts) => {
    const k = hash(id) % opts.length, rest = opts.slice(1);
    return { options: [...rest.slice(0, k), opts[0], ...rest.slice(k)], answer: k };
  };
  const g = (q, unit) => add(Object.assign({ fixed: true }, q), unit);

  // ---------- 聽力 第一部分：看圖辨義（看圖，聽一個問題和三個句子，選跟圖最相符的）----------
  [['pic-1', '👧 📖 🛋️', 'What is the girl doing?', ['She is reading a book on the sofa.', 'She is writing a letter at her desk.', 'She is cleaning the sofa.']],
   ['pic-2', '🕖\n7:15', 'What time is it?', ["It's seven fifteen.", "It's seven fifty.", "It's eleven fifteen."]],
   ['pic-3', '🍎🍎🍎\n🍌🍌🍌🍌🍌', 'How many bananas are there?', ['There are five.', 'There are three.', 'There are eight.']],
   ['pic-4', '🌧️ ☂️ 🧒', "What's the weather like?", ["It's rainy, so the boy has an umbrella.", "It's sunny and very hot.", "It's snowing, and the boy is cold."]],
   ['pic-5', '👕 NT$250\n👟 NT$520', 'How much are the shoes?', ['They are five hundred and twenty dollars.', 'They are two hundred and fifty dollars.', 'They are five hundred and fifty dollars.']],
   ['pic-6', '👨‍🍳 🍳 🥕', 'Where is the man?', ['He is in the kitchen.', 'He is in the bathroom.', 'He is in the garden.']],
   ['pic-7', '🎂\nMay 2', 'When is the birthday party?', ["It's on May second.", "It's on March second.", "It's on May third."]],
   ['pic-8', '🧒 🚲 ➡️ 🏫', 'How does the boy go to school?', ['He goes to school by bike.', 'He walks to school.', 'He goes to school by bus.']],
   ['pic-9', '👩 🤧 🤒', "What's wrong with the woman?", ['She has a cold.', 'She has a toothache.', 'She is very hungry.']],
   ['pic-10', '🏊‍♀️ 🌊', 'What is the woman doing?', ['She is swimming in the sea.', 'She is walking on the beach.', 'She is fishing on a boat.']]]
    .forEach(([id, scene, q, opts]) => {
      const p = place(id, opts);
      g({ id, tag: '看圖辨義', scene, hideOpts: true, prompt: 'Look at the picture. Listen and choose.', ...p,
        audio: `${q}\n` + p.options.map((o, i) => `${'ABC'[i]}. ${o}`).join('\n') }, '聽力');
    });

  // ---------- 聽力 第二部分：問答（聽一句話，選最適當的回應）----------
  [['qa-1', 'What time do you usually get up on Sundays?', ["At eight o'clock.", 'On Sunday.', 'For two hours.'], '問 What time，回答時間。'],
   ['qa-2', 'Can I borrow your eraser?', ['Sure. Here you are.', 'Yes, I can.', "It's a red one."], '借東西，回答 Sure. Here you are.'],
   ['qa-3', 'How was the movie last night?', ['It was really funny.', "I'm going to the movies.", 'At seven thirty.'], '問電影怎麼樣，回答好不好看。'],
   ['qa-4', 'Whose bag is this?', ["It's Kevin's.", "It's on the chair.", "It's very heavy."], 'Whose 問是誰的。'],
   ['qa-5', 'I have a headache.', ['You should get some rest.', "That's great!", "Me too. I'm full."], '對方不舒服，給建議。'],
   ['qa-6', 'Would you like some more soup?', ["No, thanks. I'm full.", 'Yes, I do.', 'I like hot dogs.'], 'Would you like …? 用 Yes, please. / No, thanks. 回答。'],
   ['qa-7', 'Where did you go last summer?', ['We went to Kenting.', "I'm going to Japan.", 'It was in July.'], '問過去去了哪裡，用過去式 went 回答。'],
   ['qa-8', 'How often do you play basketball?', ['Twice a week.', 'For two years.', 'With my brother.'], 'How often 問多常。'],
   ['qa-9', "Let's go to the park after school.", ['OK. That sounds like fun.', "No, it isn't.", "It's next to the school."], "Let's … 是邀請，回答好或不好。"],
   ['qa-10', 'Why are you so happy today?', ['Because I got a new puppy.', "Yes, I'm very happy.", "I'm sorry to hear that."], 'Why 問原因，用 Because 回答。'],
   ['qa-11', 'Which do you like better, cats or dogs?', ['I like dogs better.', 'Yes, I like them.', 'They are cute animals.'], 'Which 問兩個選一個。'],
   ['qa-12', 'Thank you for the birthday card.', ["You're welcome.", 'Happy birthday to you.', 'No, thank you.'], '別人道謝，回答 You\'re welcome.'],
   ['qa-13', 'Is this seat taken?', ['No. You can sit here.', "Yes, I'll take it.", "It's a big seat."], '問位子有沒有人坐。'],
   ['qa-14', 'How much is this notebook?', ["It's forty dollars.", 'I have many notebooks.', "It's blue and white."], 'How much 問價錢。'],
   ['qa-15', 'Did you finish your homework?', ["Not yet. I'm still doing it.", 'Yes, I do.', "It's math homework."], 'Did 問句，不能用 Yes, I do. 回答。'],
   ['qa-16', "What's your sister like?", ["She's tall and friendly.", 'She likes reading.', "She's at school."], "What's she like? 問她是什麼樣的人；What does she like? 才是問喜歡什麼。"],
   ['qa-17', 'Excuse me. Where is the library?', ["It's next to the post office.", 'I like reading books.', 'It opens at nine.'], 'Where 問地點。'],
   ['qa-18', "Don't forget to bring your swimsuit tomorrow.", ["OK, I won't.", 'Yes, I forgot it.', 'I can swim very well.'], "Don't forget … 回答 OK, I won't."],
   ['qa-19', 'How long does it take to get to your school?', ['About ten minutes.', "It's very long.", 'By MRT.'], 'How long does it take 問要花多久時間。'],
   ['qa-20', 'May I speak to Mr. Chen, please?', ["Sorry, he isn't here right now.", 'Yes, you may speak English.', 'He is a teacher.'], '電話裡找人，回答他在不在。']]
    .forEach(([id, audio, opts, explain]) => g({ id, tag: '問答', audio, prompt: 'Listen and choose the best answer.', ...place(id, opts), explain }, '聽力'));

  // ---------- 聽力 第三部分：簡短對話（聽一段對話和一個問題）----------
  const CONV = [
    ['conv-1', "W: Jason, do you want to go to the bookstore with me after school?\nM: Sorry, I can't. I have a piano lesson at four.\nW: How about tomorrow?\nM: Sure. Tomorrow is fine.", 'When will they go to the bookstore?', ['Tomorrow.', 'This afternoon at four.', 'After the piano lesson today.'], 'Jason 最後說 Tomorrow is fine.'],
    ['conv-2', "M: Mom, I can't find my soccer shoes.\nW: Did you look under your bed?\nM: Yes, but they're not there.\nW: Oh, I put them by the front door this morning.", "Where are the boy's soccer shoes?", ['By the front door.', 'Under his bed.', 'In his school bag.'], '媽媽說 I put them by the front door.'],
    ['conv-3', 'W: What would you like for lunch, Tom? We have noodles and fried rice.\nM: Fried rice, please. I had noodles for breakfast.', 'What will Tom have for lunch?', ['Fried rice.', 'Noodles.', 'Noodles and fried rice.'], 'Tom 說 Fried rice, please. 麵是早餐吃的。'],
    ['conv-4', 'M: Lisa, you look tired today.\nW: Yes. I went to bed at midnight. I was studying for my English test.', 'Why is Lisa tired?', ['She went to bed late.', 'She got up very early.', 'She played games all night.'], 'midnight 是半夜十二點，所以是很晚睡。'],
    ['conv-5', "W: How much are these pencils?\nM: They're ten dollars each. But if you buy five, it's only forty dollars.\nW: Great. I'll take five, please.", 'How much will the girl pay?', ['Forty dollars.', 'Ten dollars.', 'Fifty dollars.'], '買五枝只要 forty dollars。'],
    ['conv-6', "M: Excuse me. Is there a convenience store near here?\nW: Yes. Go straight and turn left at the bank. It's next to the park.", 'Where is the convenience store?', ['Next to the park.', 'Next to the bank.', 'Across from the school.'], "在銀行左轉，店是 next to the park。"],
    ['conv-7', 'W: Do you have any pets, Ben?\nM: I have a dog and two fish. My sister wants a cat, but my dad says no.', 'How many pets does Ben have?', ['Three.', 'Two.', 'Four.'], '一隻狗加兩條魚，共三隻。貓沒有養。'],
    ['conv-8', "M: What are you going to do this weekend?\nW: On Saturday, I'm going to visit my grandma. On Sunday, I'll stay home and clean my room.", 'What will the girl do on Sunday?', ['Clean her room.', 'Visit her grandma.', 'Go to the park.'], 'On Sunday 後面說 clean my room。'],
    ['conv-9', "W: Is your brother taller than you?\nM: Not now. He's only eight. But he eats a lot, so maybe he will be taller one day.", 'Who is taller now?', ['The boy.', "The boy's brother.", 'They are the same.'], 'Not now 代表弟弟現在沒有比較高。'],
    ['conv-10', "M: Hello, this is Peter. Can I speak to Amy?\nW: Sorry, she's taking a shower. Can she call you back?\nM: Sure. Thank you.", 'What is Amy doing now?', ['Taking a shower.', 'Calling Peter.', 'Doing her homework.'], "she's taking a shower。"],
    ['conv-11', "W: Let's take the bus to the zoo.\nM: The bus is too slow. Let's take the MRT. It's faster.\nW: OK.", 'How will they go to the zoo?', ['By MRT.', 'By bus.', 'On foot.'], '男生說公車太慢，坐捷運，女生說 OK。'],
    ['conv-12', 'M: Did you enjoy the school trip yesterday?\nW: Yes! We saw many animals at the farm, and I fed the baby goats.', 'Where did the girl go yesterday?', ['To a farm.', 'To the zoo.', 'To a pet shop.'], 'at the farm。'],
    ['conv-13', 'W: Your shirt is really nice. Is it new?\nM: Thanks. My aunt gave it to me for my birthday.', 'Who gave the boy the shirt?', ['His aunt.', 'His mother.', 'His friend.'], 'My aunt gave it to me.'],
    ['conv-14', "M: It's so hot today. Let's go swimming.\nW: Good idea, but I need to finish my science report first. Can we go at three?\nM: OK.", 'What does the girl need to do first?', ['Finish her report.', 'Go swimming.', 'Buy a swimsuit.'], 'I need to finish my science report first.'],
    ['conv-15', 'W: Excuse me. When does the library close?\nM: It closes at nine on weekdays and at five on weekends.\nW: Today is Saturday, so I need to hurry.', 'When does the library close today?', ['At five.', 'At nine.', 'At three.'], '今天是星期六（週末），週末五點關。'],
    ['conv-16', "M: Which club do you want to join, Mia?\nW: I like drawing, but the art club is full. So I'll join the dance club.", 'Which club will Mia join?', ['The dance club.', 'The art club.', 'The music club.'], "美術社滿了，所以 I'll join the dance club."],
    ['conv-17', "W: Can you help me carry these boxes, Dad?\nM: Sure. Where do you want to put them?\nW: In my bedroom, please. They're full of books.", 'What is in the boxes?', ['Books.', 'Toys.', 'Clothes.'], "They're full of books."],
    ['conv-18', "M: Why didn't you come to basketball practice yesterday?\nW: I had a fever, so I stayed home. I feel much better today.", 'Why did the girl stay home yesterday?', ['She was sick.', 'She had basketball practice.', 'It was raining.'], 'had a fever 就是生病了。'],
    ['conv-19', 'W: How was your trip to Tainan?\nM: Great! The food was delicious, but it rained every day.', 'What was the weather like during the trip?', ['It was rainy.', 'It was sunny.', 'It was snowy.'], 'it rained every day。'],
    ['conv-20', "M: Hurry up, Lucy! The movie starts at seven.\nW: Don't worry. It's only six thirty, and the theater is five minutes away.", 'What time is it now?', ['Six thirty.', 'Seven.', 'Six thirty-five.'], "It's only six thirty."]];
  CONV.forEach(([id, talk, q, opts, explain]) => g({ id, tag: '簡短對話', audio: `${talk}\nQ: ${q}`, prompt: 'Listen to the conversation and the question. Choose the best answer.', ...place(id, opts), explain }, '聽力'));

  // ---------- 聽力 第四部分：短文聽解（聽一段短文和問題，選圖）----------
  const TALK = [
    ['talk-1', "Good morning, everyone. Today is Sports Day. Please don't forget your water bottles and caps. It's going to be very hot and sunny this afternoon.", 'What will the weather be like this afternoon?', ['☀️', '🌧️', '❄️'], 'very hot and sunny。'],
    ['talk-2', "Hi, Grandma. It's Kevin. Thank you for the birthday present. I wanted a new bike, but a basketball is even better! I'll play with it in the park tomorrow.", 'What present did Kevin get?', ['🏀', '🚲', '⚽'], '他想要腳踏車，但收到的是 basketball。'],
    ['talk-3', 'Attention, please. The school library will be closed this Friday. You can return your books on Thursday or next Monday.', 'Which day will the library be closed?', ['🗓️ FRI', '🗓️ THU', '🗓️ MON'], 'closed this Friday；星期四和下星期一可以還書。'],
    ['talk-4', "Hello, class. For homework tonight, please read page twenty-five and draw a picture of your family. You don't need to write anything.", 'What do the students need to do tonight?', ['📖 🎨', '📖 ✏️', '✏️ 🎨'], 'read（讀）和 draw（畫），不用 write（寫）。'],
    ['talk-5', 'My name is Sandy. Every morning, I walk my dog in the park. After that, I eat breakfast and take the bus to school.', 'What does Sandy do first every morning?', ['🐕 🌳', '🍳', '🚌'], '先遛狗，After that 才吃早餐、坐公車。'],
    ['talk-6', 'Welcome to Happy Zoo. The zoo opens at nine. You can watch the monkeys eat lunch at twelve and see the elephants take a bath at two.', 'What can you see at two?', ['🐘', '🐒', '🦁'], 'the elephants take a bath at two。'],
    ['talk-7', "Hi, Mom. This is Amy. I'm at Jenny's house now. We're making cookies for the school party. I'll be home at five thirty.", 'What is Amy making?', ['🍪', '🎂', '🍕'], "We're making cookies。"],
    ['talk-8', "Hi, I'm Mr. Lin, the music teacher. The school band needs new students. If you can play the drums or the violin, please come to the music room after school.", 'Which instruments does the band need?', ['🥁 🎻', '🎹 🎸', '🎺 🥁'], 'the drums or the violin。'],
    ['talk-9', 'Tomorrow will be cloudy in the morning. In the afternoon, it will rain a lot, so take an umbrella with you.', 'What should you take tomorrow?', ['☂️', '🧢', '🧣'], 'take an umbrella with you。'],
    ['talk-10', 'I love Sundays. In the morning, I play basketball with my brother. In the afternoon, we help Dad in the garden. At night, our family watches a movie together.', 'What does the speaker do on Sunday afternoon?', ['🧑‍🌾 🌱', '🏀', '🎬'], 'In the afternoon, we help Dad in the garden.']];
  TALK.forEach(([id, talk, q, opts, explain]) => g({ id, tag: '短文聽解', audio: `${talk}\nQ: ${q}`, picOpts: true, prompt: 'Listen and choose the right picture.', ...place(id, opts), explain }, '聽力'));

  // ---------- 閱讀 第一部分：詞彙（一個句子一個空格，從句子裡的線索選）----------
  [['voc-1', "It's raining hard. Don't forget to take your ___.", ['umbrella', 'camera', 'swimsuit', 'kite'], '下大雨要帶傘。'],
   ['voc-2', "My little brother is only three, so he can't ___ yet.", ['read', 'eat', 'sleep', 'cry'], '三歲還不會的是 read。'],
   ['voc-3', "We need some eggs and milk. Let's go to the ___.", ['supermarket', 'library', 'hospital', 'post office'], '買蛋和牛奶要去超市。'],
   ['voc-4', 'Ken was ___ because he lost his new watch.', ['sad', 'proud', 'excited', 'lucky'], '弄丟新手錶會難過。'],
   ['voc-5', 'The soup is too ___. Please wait a minute before you eat it.', ['hot', 'sweet', 'cheap', 'empty'], '要等一下才能喝，因為太燙。'],
   ['voc-6', 'Kelly ___ her homework before dinner yesterday.', ['finished', 'finishes', 'will finish', 'finishing'], '有 yesterday，用過去式。'],
   ['voc-7', 'There ___ many people at the night market last Saturday.', ['were', 'was', 'are', 'is'], 'many people 是複數，last Saturday 是過去，用 were。'],
   ['voc-8', 'Jack runs ___ than his older brother.', ['faster', 'fast', 'fastest', 'more fast'], '有 than，用比較級 faster。'],
   ['voc-9', 'My mom is a ___. She works at a hospital and helps sick people.', ['nurse', 'cook', 'farmer', 'driver'], '在醫院照顧病人的是 nurse。'],
   ['voc-10', 'Please be ___ in the library. People are reading.', ['quiet', 'loud', 'hungry', 'busy'], '別人在看書，要安靜。'],
   ['voc-11', 'I usually ___ my teeth after breakfast.', ['brush', 'cut', 'comb', 'wear'], '刷牙是 brush my teeth。'],
   ['voc-12', 'Tina is good at ___. She can play the guitar and the piano.', ['music', 'math', 'sports', 'art'], '會彈吉他和鋼琴，擅長音樂。'],
   ['voc-13', "We can't play outside now. It's ___ dark.", ['too', 'many', 'enough', 'much'], 'too dark 太暗了，所以不能出去玩。'],
   ['voc-14', 'How ___ water do you drink every day?', ['much', 'many', 'long', 'old'], 'water 不能一個一個數，用 How much。'],
   ['voc-15', "Sam isn't at home. He ___ soccer in the park now.", ['is playing', 'plays', 'played', 'play'], '有 now，用現在進行式。'],
   ['voc-16', 'The store opens ___ ten in the morning.', ['at', 'on', 'in', 'for'], '幾點用 at。'],
   ['voc-17', "Look at the sky! The sun is out, and it's very hot. It's a ___ day.", ['sunny', 'rainy', 'snowy', 'cloudy'], '出太陽、很熱，是晴天。'],
   ['voc-18', "I'm ___. Can I have a glass of water?", ['thirsty', 'sleepy', 'full', 'angry'], '想喝水是因為口渴。'],
   ['voc-19', 'Peter ___ to Japan two years ago.', ['went', 'goes', 'is going', 'will go'], '有 two years ago，用過去式。'],
   ['voc-20', 'This box is very heavy. Can you ___ me carry it?', ['help', 'tell', 'give', 'ask'], '箱子很重，請人幫忙。']]
    .forEach(([id, prompt, opts, explain]) => g({ id, tag: '詞彙', prompt, ...place(id, opts), explain }, '閱讀'));

  // ---------- 閱讀 第二部分：段落填空（一篇短文 4 個空格，最後一格常常是填一整句）----------
  const CLOZE = [
    ["Dear Grandma,\nThank you (1)___ the books. I love them! Last night, I read the one about a little bear. He (2)___ lost in the forest. My favorite part is when he meets a (3)___ bird. The bird is very kind and helps him find his way home. Next month, our school is having a book fair. (4)___ Can you come with me?\nLove,\nLucy",
      [['for', 'to', 'with', 'at', 'Thank you for … 謝謝你的…'],
       ['got', 'gets', 'get', 'getting', '故事是過去發生的，用 got lost。'],
       ['friendly', 'angry', 'lazy', 'sleepy', '後面說那隻鳥 very kind，所以是 friendly。'],
       ['I want to buy more books there.', "I don't like reading at all.", 'The bear is my favorite animal.', 'My school is very small.', '前一句說書展，接「我想在那裡買更多書」最通順。']]],
    ["Summer Swimming Class\nDo you want to learn to swim? Come to Sunshine Pool! Classes are (5)___ Monday, Wednesday, and Friday afternoons. Each class is one hour (6)___. Children from 6 to 12 years old can join. Please bring a swimsuit, a towel, (7)___ a swimming cap. (8)___ Call 2345-6789 to join today!",
      [['on', 'in', 'at', 'by', '星期幾用 on。'],
       ['long', 'old', 'far', 'much', '一小時長：one hour long。'],
       ['and', 'but', 'or', 'so', '三樣東西都要帶，用 and。'],
       ['The class is only 200 dollars a month.', 'The pool is closed every day.', "You can't swim at Sunshine Pool.", "We don't have any classes.", '其他三句跟廣告的意思相反。']]],
    ["Saturday, May 10\nToday was my mom's birthday. My dad and I got up early (9)___ we wanted to make breakfast for her. Dad made sandwiches, and I made orange juice. When Mom came into the kitchen, she was very (10)___. She said, \"Thank you! This is the best breakfast ever!\" In the afternoon, we (11)___ to the movies together. (12)___ I hope Mom had a wonderful day.",
      [['because', 'but', 'or', 'if', '早起的原因是想做早餐：because。'],
       ['surprised', 'bored', 'tired', 'angry', '媽媽說 Thank you! 是驚喜。'],
       ['went', 'go', 'going', 'will go', '日記寫今天發生的事，用過去式 went。'],
       ['After that, we had dinner at her favorite restaurant.', "Mom doesn't like movies at all.", 'I forgot her birthday this year.', 'Dad was at work all day.', '其他三句都跟日記前面寫的不合。']]],
    ["Hi Ben,\nOur class is going to clean the beach this Sunday. We will meet at the school gate (13)___ 8:00 a.m. and take a bus there. Please wear old clothes and comfortable shoes. Don't forget to bring (14)___ water, because it may be hot. We will pick up bottles, bags, and other (15)___ on the beach. (16)___\nMs. Wang",
      [['at', 'on', 'in', 'for', '幾點用 at。'],
       ['some', 'many', 'a', 'an', 'water 不能數，用 some。'],
       ['trash', 'fish', 'sand', 'friends', '瓶子、袋子都是垃圾：trash。'],
       ['See you on Sunday!', 'The beach is very clean now.', "Please don't come.", 'We will go swimming at night.', '信的最後跟對方說星期天見。']]]];
  CLOZE.forEach(([passage, blanks], pi) => blanks.forEach((b, bi) => {
    const n = pi * 4 + bi + 1, id = 'cloze-' + n;
    g({ id, tag: '段落填空', passage, noRead: true, prompt: `Choose the best answer for (${n}).`, ...place(id, b.slice(0, 4)), explain: b[4] }, '閱讀');
  }));

  // ---------- 閱讀 第三部分：閱讀理解（菜單、公告、信、故事、表格……每篇 3 題）----------
  const READ = [
    ["Lucky Burger Menu\nHamburger ........ $65\nChicken burger ... $70\nFrench fries ..... $40\nCorn soup ........ $35\nCola / Tea ....... $25\n★ Kids' Meal (hamburger + French fries + tea): $110\nOpen 10:00 a.m. – 9:00 p.m. every day",
      [['How much is a chicken burger?', ['$70', '$65', '$40', '$110'], '菜單上 Chicken burger 是 $70。'],
       ["What comes with the Kids' Meal?", ['A hamburger, French fries, and tea', 'A chicken burger and cola', 'Corn soup and French fries', 'A hamburger and corn soup'], "Kids' Meal 後面的括號寫了內容。"],
       ['When can you NOT buy food at Lucky Burger?', ['At 9:30 p.m.', 'At 10:00 a.m.', 'At noon on Sunday', 'At 8:00 p.m.'], '晚上九點就關門了。']]],
    ["From: Jenny\nTo: Lisa\nSubject: Pajama party!\n\nHi Lisa,\nI'm having a pajama party at my house next Saturday night, July 20. Can you come? Mia and Kate will come, too. We will make pizza, watch movies, and sleep in the living room. Please bring your sleeping bag. The next morning, my mom will drive us to the swimming pool.\nJenny",
      [['What should Lisa bring?', ['A sleeping bag', 'A movie', 'Some pizza', 'A pillow'], 'Please bring your sleeping bag.'],
       ['How many girls will be at the party?', ['Four', 'Three', 'Two', 'Five'], 'Jenny、Lisa、Mia、Kate，一共四個人。'],
       ['What will happen on July 21?', ["Jenny's mom will drive the girls to the pool.", 'The girls will make pizza.', 'Lisa will have a party.', 'The girls will go to school.'], '派對是 7/20 晚上，The next morning 就是 7/21。']]],
    ['CITY PARK RULES\n• Open from 6:00 a.m. to 10:00 p.m.\n• Dogs are welcome, but please keep them close to you.\n• No bikes on the grass.\n• Please put your trash in the trash cans.\n• Do not feed the ducks.\nThank you!',
      [['What can you do in City Park?', ['Walk your dog', 'Ride a bike on the grass', 'Give bread to the ducks', 'Stay there at midnight'], 'Dogs are welcome。其他三個都是規定不能做的。'],
       ['Ben gets to the park at 5:30 a.m. What will happen?', ['He has to wait for thirty minutes.', 'He can feed the ducks.', 'He can ride his bike on the grass.', 'He has to go home at 6:00.'], '公園六點才開，要等三十分鐘。'],
       ['Where is this sign?', ['In a park', 'In a school', 'In a zoo', 'In a restaurant'], '標題是 CITY PARK RULES。']]],
    ["Tim's New Friend\nTim moved to a new town last month. At his new school, he didn't know anyone, so he ate lunch alone every day. One day, a boy sat next to him. \"Hi, I'm Leo. Do you like comics?\" he asked. Tim had a comic book in his bag. They read it together and laughed a lot. Now Tim and Leo eat lunch together every day, and they are making their own comic book.",
      [['Why did Tim eat lunch alone?', ["He didn't know anyone at his new school.", "He didn't like Leo.", 'He was reading comics.', 'His friends were sick.'], "he didn't know anyone, so he ate lunch alone。"],
       ['What did Tim and Leo do together first?', ['They read a comic book.', 'They made a comic book.', 'They moved to a new town.', 'They played basketball.'], '先一起看漫畫，現在才在畫自己的漫畫。'],
       ['How does Tim probably feel now?', ['Happy', 'Lonely', 'Angry', 'Sad'], '現在每天跟朋友一起吃午餐，應該很開心。']]],
    ['Sunshine English Camp – Day 1\n8:30  Meet at the school gate\n9:00  Games and songs\n10:30  English drama\n12:00  Lunch\n1:30  Make a robot\n3:30  Show time! (Parents are welcome.)\n4:00  Go home',
      [['What will the students do after lunch?', ['Make a robot', 'Play games', 'Practice drama', 'Go home'], '12:00 午餐，下一個是 1:30 Make a robot。'],
       ['When can parents come to see the students?', ['At 3:30', 'At 8:30', 'At 12:00', 'At 4:00'], 'Show time 後面寫 Parents are welcome.'],
       ['How long is the English drama class?', ['An hour and a half', 'One hour', 'Two hours', 'Half an hour'], '10:30 到 12:00，一個半小時。']]],
    ['What do students in Class 5A do after school?\n(Each student chose one answer.)\n⚽ Play sports: 12 students\n🎹 Take music lessons: 9 students\n🎮 Play video games: 6 students\n📖 Read books: 3 students',
      [['How many students take music lessons after school?', ['Nine', 'Twelve', 'Six', 'Three'], 'Take music lessons: 9。'],
       ['Which is the most popular after-school activity?', ['Playing sports', 'Taking music lessons', 'Playing video games', 'Reading books'], '12 個人最多。'],
       ['How many students are there in Class 5A?', ['Thirty', 'Twelve', 'Twenty-seven', 'Twenty'], '每個人選一個：12＋9＋6＋3＝30。']]],
    ['LOST CAT!\nOur cat, Coco, has been lost since Tuesday. She is white with a black tail. She wears a small red bell around her neck. Coco is very shy, so she may hide under cars. If you see her, please call Mrs. Lee at 0912-345-678. Thank you!',
      [['What does Coco look like?', ['She is white with a black tail.', 'She is black with a white tail.', 'She is brown and white.', 'She is all black.'], 'She is white with a black tail.'],
       ['Where might Coco hide?', ['Under cars', 'In trees', 'In the river', 'On the roof'], 'she may hide under cars。'],
       ['Why did Mrs. Lee write this?', ['She wants to find her cat.', 'She wants to sell her cat.', 'She found a cat.', 'She wants a new cat.'], '標題 LOST CAT! 是在找走丟的貓。']]],
    ["Hi Grandpa,\nI'm in Hualien with my class. Yesterday, we rode bikes along the sea. Today, we visited a farm and drank fresh milk. Tomorrow, we will go home by train. I'll show you my photos on Sunday!\nLove, David\n\nDear David,\nThank you for your postcard. Grandma and I are excited to see your photos. We will make dumplings for you on Sunday. Don't forget to bring your camera!\nLove, Grandpa",
      [['What did David do yesterday?', ['He rode a bike along the sea.', 'He drank fresh milk.', 'He took a train home.', 'He made dumplings.'], 'Yesterday, we rode bikes along the sea.'],
       ['How will David go home?', ['By train', 'By bike', 'By car', 'By plane'], 'we will go home by train。'],
       ['What will happen on Sunday?', ['David will show his photos to Grandma and Grandpa.', 'David will visit a farm.', 'Grandpa will go to Hualien.', 'David will buy a camera.'], "I'll show you my photos on Sunday!"]]]];
  READ.forEach(([passage, qs], pi) => qs.forEach(([prompt, opts, explain], qi) => {
    const id = `read-${pi + 1}-${qi + 1}`;
    g({ id, tag: '閱讀理解', passage, noRead: true, prompt, ...place(id, opts), explain }, '閱讀');
  }));
});
})();
