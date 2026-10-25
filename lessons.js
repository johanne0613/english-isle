'use strict';

/* ==========================================================
   這段在做什麼：課程內容
   之後要加新課程，就照 halloween 的格式再加一份。
   kind 決定題目長怎樣：question 開放回答、word 單字、catch 抓單字、
   shadow 跟讀、dialogue 角色扮演、panel 看圖說故事
   ========================================================== */
const LESSONS = {
  halloween: {
    id: 'halloween', zone: 'festival',
    title: 'Halloween Night', zh: '萬聖夜口說課',
    level: 'CEFR A2・Cambridge Flyers', minutes: 60,
    goals: [
      '用 12 個萬聖節單字說出完整句子',
      '看懂一支英文影片，說出 3 個重點',
      '用 be going to 和過去式談計畫與經驗',
      '在 trick-or-treat 情境裡主動回應',
      '比較中元節和萬聖節的不同'
    ],
    assess: '學生按麥克風說話，電腦聽寫並給建議分數，老師可以改。每題 1–3 顆糖，下課自動算出六項能力分數。',
    aiPoint: '語音辨識即時聽寫學生的話，檢查單字、關鍵字和句型。下課後一鍵複製報告給 Claude，寫出家長評語。',
    video: {
      title: 'The history of Halloween',
      source: 'British Council LearnEnglish Kids',
      url: 'https://learnenglishkids.britishcouncil.org/listen-watch/video-zone/history-halloween'
    },
    stages: [
      {
        id: 'picture', kind: 'question', title: 'Picture Talk', zh: '看圖說說', minutes: 5,
        skills: ['ideas', 'fluency'], scene: true,
        intro: 'Look at the picture. Answer in full sentences.',
        items: [
          { id: 'p1', prompt: 'What can you see in the picture? Tell me three things.',
            hint: 'I can see a … / There is a … / There are some …',
            follow: 'Where is the bat? What is the cat doing?',
            expect: { minWords: 10, keywords: ['house','pumpkin','jack o lantern','bat','ghost','cat','moon','witch','vampire','spider','web','tree','candy'], needHits: 3 } },
          { id: 'p2', prompt: 'What are the children wearing?',
            hint: 'The girl is wearing a … costume. The boy is dressed as …',
            follow: 'Which costume do you like best? Why?',
            expect: { minWords: 8, keywords: ['witch','vampire','costume','hat','cape','wearing','dressed'], needHits: 2 } },
          { id: 'p3', prompt: 'How do you think the children feel? Why?',
            hint: 'I think they feel … because …',
            follow: 'Would you go into that house? Why or why not?',
            expect: { minWords: 8, because: true, keywords: ['happy','excited','scared','afraid','nervous','brave','fun','surprised'], needHits: 1 } }
        ]
      },
      {
        id: 'words', kind: 'word', title: 'Word Lab', zh: '單字實驗室', minutes: 10,
        skills: ['vocab', 'pron'],
        intro: 'Press the mic. Say the word, then make your own sentence.',
        items: [
          { id: 'costume', word: 'costume', pic: '🦸', pos: 'noun', zh: '變裝服', def: 'Clothes you wear to look like a different person or thing.', ex: "I'm wearing a superhero costume tonight." },
          { id: 'jack', word: "jack-o'-lantern", alt: ['jack o lantern','jackolantern','jack lantern'], pic: '🎃', pos: 'noun', zh: '南瓜燈', def: 'A pumpkin with a face cut into it and a light inside.', ex: "We put a jack-o'-lantern next to the front door." },
          { id: 'skeleton', word: 'skeleton', pic: '💀', pos: 'noun', zh: '骷髏、骨架', def: 'All the bones inside a body.', ex: "There's a plastic skeleton hanging on the door." },
          { id: 'witch', word: 'witch', pic: '🧙‍♀️', pos: 'noun', zh: '女巫', def: 'A woman in stories who can do magic.', ex: 'The witch flew over the moon on her broom.' },
          { id: 'broom', word: 'broom', pic: '🧹', pos: 'noun', zh: '掃帚', def: 'A brush with a long handle for cleaning the floor.', ex: 'Witches in stories ride on brooms.' },
          { id: 'vampire', word: 'vampire', pic: '🧛', pos: 'noun', zh: '吸血鬼', def: 'A monster in stories that sleeps in the day and wakes up at night.', ex: 'My brother dressed up as a vampire with long teeth.' },
          { id: 'bat', word: 'bat', pic: '🦇', pos: 'noun', zh: '蝙蝠', def: 'A small animal with wings that flies at night.', ex: 'Bats sleep upside down.' },
          { id: 'web', word: 'spider web', alt: ['spiderweb','cobweb'], pic: '🕸️', pos: 'noun', zh: '蜘蛛網', def: 'The thin net that a spider makes.', ex: "There's a big spider web in the corner." },
          { id: 'haunted', word: 'haunted house', alt: ['haunted'], pic: '🏚️', pos: 'noun', zh: '鬼屋', def: 'A house where people think ghosts live.', ex: 'Nobody wants to go into the haunted house.' },
          { id: 'spooky', word: 'spooky', pic: '👻', pos: 'adjective', zh: '陰森的、有點恐怖的', def: 'A little bit scary, often in a fun way.', ex: 'The music in this movie is so spooky!' },
          { id: 'decorate', word: 'decorate', pic: '🎀', pos: 'verb', zh: '裝飾', def: 'To make a place look pretty or special.', ex: 'We decorate our classroom with paper bats.' },
          { id: 'scream', word: 'scream', pic: '😱', pos: 'verb', zh: '尖叫', def: 'To shout very loudly because you are scared or excited.', ex: 'Everyone screamed when the lights went out.' }
        ]
      },
      {
        id: 'video', kind: 'question', title: 'Watch & Talk', zh: '影片練習', minutes: 15,
        skills: ['listening', 'ideas'], video: true,
        intro: 'Watch the video. Catch the words, then talk about it.',
        items: [
          { id: 'v1', prompt: 'This video is about the history of Halloween. What do you think you will learn?',
            hint: 'I think I will learn about … / Maybe Halloween started in …',
            follow: '看影片前問。猜錯沒關係，看完再對照。',
            expect: { minWords: 8, keywords: ['think','maybe','learn','started','began','ghosts','costumes','pumpkins','old','long ago'], needHits: 1 } },
          { id: 'v2', kind: 'catch', title: 'Word Catch 抓單字',
            prompt: 'While you watch, tap the words you hear.',
            words: ['Celts','Samhain','ghosts','fire','costumes','turnips','pumpkins','trick or treat','America','October'] },
          { id: 'v3', prompt: 'Where did Halloween start? How long ago?',
            hint: 'It started in … more than … years ago.',
            follow: '答案通常是：Celts、Samhain、兩千多年前。以影片內容為準。',
            expect: { minWords: 8, keywords: ['celts','celtic','samhain','ireland','britain','scotland','europe','two thousand','years ago','long ago'], needHits: 2 } },
          { id: 'v4', prompt: 'Why did people wear costumes a long time ago?',
            hint: 'They wore costumes because they thought …',
            follow: '可以追問：Do people wear costumes for the same reason today?',
            expect: { minWords: 8, because: true, past: true, keywords: ['ghost','ghosts','spirit','spirits','scare','scary','hide','afraid','recognize','dead'], needHits: 1 } },
          { id: 'v5', prompt: 'What did people use before pumpkins? Why did that change?',
            hint: 'Before pumpkins, people used … In America, …',
            follow: '常見答案：turnips 蕪菁；移民到美國後改用南瓜。以影片內容為準。',
            expect: { minWords: 8, keywords: ['turnip','potato','beetroot','vegetable','america','pumpkin','bigger','easier'], needHits: 2 } },
          { id: 'v6', kind: 'shadow', text: 'Halloween started more than two thousand years ago.', skills: ['pron', 'listening'] },
          { id: 'v7', kind: 'shadow', text: 'People thought that ghosts came back on that night.', skills: ['pron', 'listening'] },
          { id: 'v8', kind: 'shadow', text: 'They wore costumes so the ghosts could not find them.', skills: ['pron', 'listening'] },
          { id: 'v9', prompt: 'Tell me three things you learned from the video.',
            hint: 'First, … Also, … Finally, …',
            follow: '鼓勵用 First / Also / Finally 串起來。',
            expect: { minWords: 15, past: true, keywords: ['celts','samhain','ghosts','spirits','fire','bonfire','costumes','turnips','pumpkins','america','candy','trick or treat','two thousand','october'], needHits: 3 } }
        ]
      },
      {
        id: 'street', kind: 'dialogue', title: 'Trick-or-Treat Street', zh: '不給糖就搗蛋街', minutes: 10,
        skills: ['fluency', 'pron'],
        intro: 'Knock on the doors. The teacher plays the neighbor. You play the trick-or-treater.',
        items: [
          { id: 'door1', who: 'Mrs. Green', voice: 'green', pic: '🏡', mood: 'A friendly neighbor',
            lines: [
              { s: 'n', t: 'Hello there! Wow, look at you! What are you dressed as?' },
              { s: 's', t: "Trick or treat! I'm dressed as a ___.", expect: [['trick or treat'], ['im','i am','dressed']] },
              { s: 'n', t: "That's amazing! Did you make it yourself?" },
              { s: 's', t: 'Yes, I did. / No, my ___ made it for me.', expect: [['yes','no','did','made']] },
              { s: 'n', t: 'Would you like chocolate or gummy bears?' },
              { s: 's', t: '___, please. Thank you! Happy Halloween!', expect: [['please'], ['thank','thanks'], ['happy halloween']] }
            ] },
          { id: 'door2', who: 'Mr. Bones', voice: 'bones', pic: '💀', mood: 'A curious grandpa',
            lines: [
              { s: 'n', t: 'Trick or treat, eh? Answer my questions first! How many houses have you been to tonight?' },
              { s: 's', t: "We've been to ___ houses.", expect: [['been to','visited','went to','houses','house']] },
              { s: 'n', t: "And what's the best treat you've got so far?" },
              { s: 's', t: 'The best one is ___ because ___.', expect: [['best'], ['because','so']] },
              { s: 'n', t: "Don't eat it all tonight! Here you are." },
              { s: 's', t: "Thanks, Mr. Bones! I won't. Good night!", expect: [['thank','thanks'], ['wont','will not','good night']] }
            ] },
          { id: 'door3', who: 'The Haunted House', voice: 'haunted', pic: '🏚️', mood: 'A spooky voice behind the door',
            lines: [
              { s: 'n', t: 'Whooo is knocking on my door? No candy, unless you answer my riddle! What has a face and two hands, but no arms or legs?' },
              { s: 's', t: "It's a clock!", expect: [['clock']] },
              { s: 'n', t: 'Correct! Now YOU tell ME a Halloween joke.' },
              { s: 's', t: "Why didn't the skeleton go to the party? Because he had no body to go with!", expect: [['skeleton'], ['party'], ['no body','nobody']] },
              { s: 'n', t: "Ha ha ha! That's terrible! Take two candies." }
            ] }
        ]
      },
      {
        id: 'interview', kind: 'question', title: 'Interview Time', zh: '訪問時間', minutes: 10,
        skills: ['ideas', 'grammar'],
        intro: 'Answer the questions. Give a reason every time.',
        items: [
          { id: 'i1', prompt: 'What are you going to be for Halloween this year? Why?',
            hint: "I'm going to be a … because …", follow: 'Who will help you make your costume?',
            expect: { minWords: 10, future: true, because: true } },
          { id: 'i2', prompt: 'What did you do last Halloween?',
            hint: 'Last Halloween, I went / wore / ate …', follow: 'Who were you with? Was it fun?',
            expect: { minWords: 10, past: true } },
          { id: 'i3', prompt: 'Do you like scary stories or movies? Why or why not?',
            hint: "I like / don't like … because …", follow: "What's the scariest story you know?",
            expect: { minWords: 10, because: true } },
          { id: 'i4', prompt: 'If you could design a haunted house, what would you put inside?',
            hint: 'I would put … in it, so people would …', follow: 'Would you let your friends in for free?',
            expect: { minWords: 10, would: true } },
          { id: 'i5', prompt: 'In Taiwan, we have Ghost Month. How is it different from Halloween?',
            hint: 'During Ghost Month, people … On Halloween, people …', follow: 'Which one do you like better? Why?',
            expect: { minWords: 15, keywords: ['ghost month','ghosts','food','burn','money','paper','pray','ancestors','swim','lanterns','costumes','candy','trick or treat','scary'], needHits: 2 } }
        ]
      },
      {
        id: 'story', kind: 'panel', title: 'Story Time', zh: '說故事', minutes: 10,
        skills: ['grammar', 'fluency'], storyTitle: 'The House on Maple Street',
        intro: 'Look at the pictures and tell the story. Use the past tense.',
        items: [
          { id: 's1', scene: '🌕 🧙‍♀️ 🧛‍♂️ 🐈‍⬛', prompt: 'What happened first?',
            keywords: ['last halloween','wore','went','costumes','trick or treating'],
            model: 'Last Halloween, Amy and Ben wore costumes and went trick-or-treating with their cat.' },
          { id: 's2', scene: '🏚️ 🕸️ 🕯️', prompt: 'What did they see?',
            keywords: ['saw','old','house','spider','light','window','there was'],
            model: 'They saw an old house with spider webs. There was a light in the window.' },
          { id: 's3', scene: '🚪 💀 😱', prompt: 'What happened next?',
            keywords: ['knocked','opened','door','jumped','skeleton','screamed','suddenly'],
            model: 'They knocked on the door. Suddenly, a skeleton jumped out and they screamed!' },
          { id: 's4', scene: '👴 🍬 😂', prompt: 'How did the story end?',
            keywords: ['it was','grandpa','laughed','ate','shared','candy'],
            model: 'It was Grandpa in a skeleton costume! Everyone laughed and shared the candy.' }
        ]
      },
      {
        id: 'exit', kind: 'question', title: 'Exit Ticket', zh: '下課小任務', minutes: 3,
        skills: ['vocab', 'ideas'],
        intro: 'Two quick questions before you go!',
        items: [
          { id: 'e1', prompt: 'Tell me three new words you learned today.',
            hint: 'Today I learned … , … and …',
            expect: { minWords: 6, keywords: ['costume','jack o lantern','skeleton','witch','broom','vampire','bat','spider web','haunted','spooky','decorate','scream','celts','samhain','turnip'], needHits: 3 } },
          { id: 'e2', prompt: "What was your favorite part of today's lesson? Why?",
            hint: 'My favorite part was … because …',
            expect: { minWords: 8, because: true } }
        ]
      }
    ],
    materials: [
      { id: 'bc', kind: '影片', title: 'The history of Halloween（British Council）', url: 'https://learnenglishkids.britishcouncil.org/listen-watch/video-zone/history-halloween', note: '影片練習用這支。頁面上有逐字稿，可以複製句子到「跟讀」。' },
      { id: 'hist', kind: '影片', title: "Bet You Didn't Know: Halloween（History Channel）", url: 'https://www.youtube.com/results?search_query=bet+you+didn%27t+know+halloween+history+channel', note: 'YouTube 搜尋結果。比較難，適合加深。' },
      { id: 'broom', kind: '動畫', title: 'Room on the Broom（2012 動畫短片）', url: 'https://www.youtube.com/results?search_query=room+on+the+broom+magic+light+pictures', note: '說故事關的延伸。找 Magic Light Pictures 或 BBC 官方上傳的版本。' },
      { id: 'ghost', kind: '影片', title: 'Ghost Month in Taiwan（英文介紹）', url: 'https://www.youtube.com/results?search_query=ghost+month+taiwan+explained+english', note: 'YouTube 搜尋結果。訪問第 5 題前可以先看。' },
      { id: 'twwiki', kind: 'Twinkl', title: 'What is the History of Halloween?（Twinkl Teaching Wiki）', url: 'https://www.twinkl.com/teaching-wiki/history-of-halloween-for-children', note: '影片內容的文字版，可以當課後閱讀。' },
      { id: 'tw', kind: 'Twinkl', title: 'Twinkl 台灣萬聖節教材', url: 'https://www.twinkl.com.tw/', note: '換成你要用的學習單頁面。' }
    ]
  }
};

/* 這段在做什麼：島上的區域（open: true 代表已開放） */
const ZONES = [
  { id: 'festival', name: 'Festival Plaza', zh: '節慶廣場', x: 58, y: 51.6, open: true,
    desc: '跟著節日換主題，每個月一檔。這個月是萬聖節。', lessons: ['halloween'],
    plan: ['11 月 Thanksgiving 感恩節', '12 月 Christmas 聖誕節', '1–2 月 Lunar New Year 農曆新年'] },
  { id: 'speaking', name: 'Speaking Bay', zh: '口說海灣', x: 24, y: 58.1, open: false,
    desc: '日常口說練習。', plan: ['情境角色扮演', 'Show and Tell 上台報告', '看圖說故事題庫'] },
  { id: 'writing', name: 'Writing Woods', zh: '寫作森林', x: 40, y: 32.3, open: false,
    desc: '從句子寫到小短文。', plan: ['句型重組', '看圖寫句子', '五句小短文（說完再寫）'] },
  { id: 'exam', name: 'Exam Peak', zh: '英檢山', x: 70, y: 27.4, open: false,
    desc: '準備考試的地方。', plan: ['Cambridge Flyers 口說四大題型', 'GEPT 初級聽讀模擬', '錯題本'] },
  { id: 'reading', name: 'Reading Lighthouse', zh: '閱讀燈塔', x: 84, y: 59.7, open: false,
    desc: '讀了再說。', plan: ['分級讀本朗讀', '讀後重述', 'Twinkl 閱讀理解學習單'] },
  { id: 'harbor', name: 'Report Harbor', zh: '成績港', x: 42, y: 77.4, open: true,
    desc: '每堂課的報告都停在這裡。', action: 'history' }
];
