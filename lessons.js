'use strict';

/* ==========================================================
   這段在做什麼：課程內容
   之後要加新課程，就照 halloween 的格式再加一份。
   kind 決定題目長怎樣：question 開放回答、word 單字、catch 抓單字、
   shadow 跟讀、dialogue 角色扮演、panel 看圖說故事、
   choice 選擇題（有 audio 是聽力題、有 passage 是閱讀題）、order 句子重組、spell 看圖拼字
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
  },

  /* ==========================================================
     這段在做什麼：段考城堡・康軒 Wonder World 7（六上，週五那位六年級學生的學校用這本）
     一個 Review 是一次段考範圍。題目用課本的單字和句型自己出，不照抄課文。
     段考題型：choice 選擇題（有 audio 就是聽力題）、order 句子重組、spell 看圖拼字
     ========================================================== */
  ww7t1: {
    id: 'ww7t1', zone: 'castle', bankId: 'kh5a-1',
    title: 'Test 1 Review', zh: 'WW7・第一次段考：Unit 1–2',
    level: '康軒 Wonder World 7・六上', minutes: 85,
    format: '段考複習課（口說＋段考題型）',
    audience: '程度普通，在補學校進度、為國中打底。',
    scope: [
      'Unit 1 Whale Watching（課本 p.15–28）：8 個國家、Where are you from? Is he / she from …?',
      "Unit 2 Having a Cold（p.29–42）：8 種病痛、What's wrong? Does he / she have a …?",
      'Review 1（p.43–46）',
      '發音：er、ir、ur、ar、or'
    ],
    goals: [
      '說出 16 個課本單字，並用單字造句',
      '用 Where are you from? 問答國家，分清楚 he / she / they',
      "用 What's wrong? 和 Does he / she have …? 問答身體狀況",
      '分清楚 have / has、do / does、am / is / are',
      '熟悉段考的聽力、選擇、重組、拼字、閱讀題'
    ],
    assess: '口說題由電腦聽寫、給建議分數，老師可以改。選擇、重組、拼字題電腦直接改：第一次就對 3 顆糖，第二次對 2 顆，之後才對 1 顆。',
    aiPoint: '語音辨識檢查句型有沒有說完整，例如 he / she、have / has。答錯幾次都會記下來，下課報告列出要加強的題型。',
    ranks: [[90, 'Castle Champion 城堡冠軍'], [75, 'Brave Knight 勇敢騎士'], [60, 'Castle Guard 城堡守衛'], [0, 'Young Squire 見習騎士，繼續加油']],
    stages: [
      {
        id: 'words', kind: 'word', title: 'Word Check', zh: '單字口說', minutes: 15,
        skills: ['vocab', 'pron'],
        intro: 'Say the word. Then make a sentence with it.',
        items: [
          { id: 'australia', word: 'Australia', pic: '🦘', pos: 'noun', zh: '澳洲', def: 'A big country with kangaroos and koalas.', ex: 'Lily is from Australia. She can swim very well.' },
          { id: 'canada', word: 'Canada', pic: '🍁', pos: 'noun', zh: '加拿大', def: 'A big, cold country next to the USA.', ex: "Leo is from Canada. It's very cold there in winter." },
          { id: 'france', word: 'France', pic: '🥐', pos: 'noun', zh: '法國', def: 'A country in Europe. Paris is in this country.', ex: 'Is Sophie from France? Yes, she is.' },
          { id: 'india', word: 'India', pic: '🐘', pos: 'noun', zh: '印度', def: 'A big country in Asia with lots of people.', ex: 'Raj is from India. He likes curry.' },
          { id: 'japan', word: 'Japan', pic: '🗾', pos: 'noun', zh: '日本', def: 'A country near Taiwan. People there eat sushi.', ex: 'Haruto and Yui are from Japan.' },
          { id: 'taiwan', word: 'Taiwan', pic: '🧋', pos: 'noun', zh: '台灣', def: 'Our home! Bubble tea comes from here.', ex: "I'm from Taiwan. Where are you from?" },
          { id: 'uk', word: 'the UK', alt: ['uk', 'united kingdom', 'england'], pic: '💂', pos: 'noun', zh: '英國', def: 'A country in Europe. London is in this country.', ex: "Emma isn't from the USA. She's from the UK." },
          { id: 'usa', word: 'the USA', alt: ['usa', 'u s a', 'america', 'united states', 'the us'], pic: '🗽', pos: 'noun', zh: '美國', def: 'A big country. New York is in this country.', ex: 'Jack is from the USA. He plays baseball.' },
          { id: 'cold', word: 'cold', pic: '🤧', pos: 'noun', zh: '感冒', def: 'A common illness. You sneeze and feel tired.', ex: 'I have a cold, so I stay home today.' },
          { id: 'cough', word: 'cough', pic: '😷', pos: 'noun', zh: '咳嗽', def: 'A loud sound from your throat when you are sick.', ex: 'Does Ben have a cough? Yes, he does.' },
          { id: 'fever', word: 'fever', pic: '🤒', pos: 'noun', zh: '發燒', def: 'Your body is very hot because you are sick.', ex: 'My sister has a fever. Her face is red.' },
          { id: 'headache', word: 'headache', pic: '🤕', pos: 'noun', zh: '頭痛', def: 'A pain in your head.', ex: 'I have a headache. I want to sleep.' },
          { id: 'stomachache', word: 'stomachache', alt: ['stomach ache'], pic: '🤢', pos: 'noun', zh: '肚子痛', def: 'A pain in your stomach.', ex: "Tom has a stomachache. He can't eat dinner." },
          { id: 'toothache', word: 'toothache', alt: ['tooth ache'], pic: '🦷', pos: 'noun', zh: '牙痛', def: 'A pain in your tooth.', ex: "Does Mia have a toothache? No, she doesn't." },
          { id: 'runny', word: 'runny nose', alt: ['running nose'], pic: '👃', pos: 'noun', zh: '流鼻水', def: 'Water comes out of your nose when you have a cold.', ex: 'He has a runny nose. Here is a tissue.' },
          { id: 'sore', word: 'sore throat', pic: '🗣️', pos: 'noun', zh: '喉嚨痛', def: 'Your throat hurts when you talk or eat.', ex: 'I have a sore throat. I drink warm water.' }
        ]
      },
      {
        id: 'talk', kind: 'question', title: 'Sentence Talk', zh: '句型問答', minutes: 15,
        skills: ['grammar', 'fluency'],
        intro: 'Look at the picture. Answer in a full sentence.',
        items: [
          { id: 't1', pic: '🙋', prompt: 'Where are you from?', hint: "I'm from …",
            follow: '可以追問：Where is your mom from?',
            expect: { minWords: 3, groups: [{ any: ['im from', 'i am from'], miss: "用 I'm from … 回答" }] } },
          { id: 't2', pic: '👦', ctx: "Raj: Hi! I'm Raj. I'm from India.", prompt: 'Where is Raj from?', hint: "He's from …",
            follow: 'Raj 是男生，用 he。',
            expect: { minWords: 3, groups: [{ any: ['hes from', 'he is from'], miss: "男生用 He's from …" }, { any: ['india'], miss: '說出國家 India' }],
              avoid: [{ any: ['shes from', 'she is from'], tip: 'Raj 是男生，要用 he' }] } },
          { id: 't3', pic: '👧', ctx: "Sophie: I'm Sophie. I'm from France.", prompt: 'Is Sophie from Canada?', hint: "No, she's not. She's from …",
            follow: "完整答法：No, she's not. She's from France.",
            expect: { minWords: 4, groups: [{ any: ['no'], miss: '先回答 No' }, { any: ['shes not', 'she is not', 'she isnt'], miss: "說 she's not" }, { any: ['france'], miss: '說出 France' }] } },
          { id: 't4', pic: '👦👧', ctx: 'Haruto: Yui and I are from Japan.', prompt: 'Where are Haruto and Yui from?', hint: "They're from …",
            follow: '兩個人用 they。',
            expect: { minWords: 3, groups: [{ any: ['theyre from', 'they are from'], miss: "兩個人用 They're from …" }, { any: ['japan'], miss: '說出 Japan' }] } },
          { id: 't5', pic: '👧', ctx: "Emma: I'm from the UK.", prompt: 'Is Emma from the UK?', hint: 'Yes, she …',
            follow: '簡答：Yes, she is.',
            expect: { minWords: 3, groups: [{ any: ['yes'], miss: '回答 Yes' }, { any: ['she is'], miss: '用 she is 回答' }] } },
          { id: 't6', pic: '🩺', ctx: 'You: My head hurts.', prompt: "What's wrong?", hint: 'I have a …',
            follow: '可以換病痛再問：fever、cough、toothache。',
            expect: { minWords: 3, groups: [{ any: ['i have'], miss: '用 I have a … 回答' }, { any: ['headache', 'cold', 'cough', 'fever', 'stomachache', 'toothache', 'runny nose', 'sore throat'], miss: '說出哪裡不舒服' }],
              avoid: [{ any: ['i has'], tip: 'I 後面用 have' }] } },
          { id: 't7', pic: '👦', ctx: "Leo: I feel very hot. I'm 39°C.", prompt: 'Does Leo have a fever?', hint: 'Yes, he …',
            follow: '簡答：Yes, he does.',
            expect: { minWords: 3, groups: [{ any: ['yes'], miss: '回答 Yes' }, { any: ['he does'], miss: 'Does 問句，用 he does 回答' }] } },
          { id: 't8', pic: '👧', ctx: 'Nina: Water keeps coming out of my nose.', prompt: 'Does Nina have a toothache?', hint: "No, she doesn't. She has a …",
            follow: "完整答法：No, she doesn't. She has a runny nose.",
            expect: { minWords: 5, groups: [{ any: ['no'], miss: '先回答 No' }, { any: ['she doesnt', 'she does not'], miss: "說 she doesn't" }, { any: ['runny nose', 'cold'], miss: '說出 Nina 真正的問題' }],
              avoid: [{ any: ['she have'], tip: 'she 後面要用 has' }] } },
          { id: 't9', pic: '🙂', prompt: 'Do you have a stomachache today?', hint: "Yes, I do. / No, I don't.",
            follow: '再問一題：Do you have a cold?',
            expect: { minWords: 3, groups: [{ any: ['yes i do', 'no i dont', 'no i do not'], miss: "用 Yes, I do. 或 No, I don't. 回答" }] } },
          { id: 't10', pic: '🧑‍🤝‍🧑', prompt: 'Tell me about a friend. Where is he or she from? Is he or she sick today?',
            hint: 'My friend … is from … He / She has a …',
            follow: '進階題：把兩個句型串起來。',
            expect: { minWords: 10, groups: [{ any: ['is from'], miss: '說朋友從哪裡來' }, { any: ['has a', 'doesnt have', 'isnt sick', 'is not sick'], miss: '說朋友今天身體怎麼樣' }] } }
        ]
      },
      {
        id: 'role', kind: 'dialogue', title: 'Role Play', zh: '情境對話', minutes: 10,
        skills: ['fluency', 'pron'],
        intro: 'The teacher plays the other person. You answer.',
        items: [
          { id: 'camp', who: 'Coach Max', voice: 'camp', pic: '🏕️', mood: '英語營第一天。旁邊的新朋友 Leo 從加拿大來。',
            lines: [
              { s: 'n', t: "Hi! Welcome to the English camp. What's your name?" },
              { s: 's', t: 'My name is ___. Nice to meet you.', expect: [['my name is', 'im', 'i am'], ['nice to meet you']] },
              { s: 'n', t: 'Nice to meet you, too. Where are you from?' },
              { s: 's', t: "I'm from Taiwan.", expect: [['im from', 'i am from'], ['taiwan']] },
              { s: 'n', t: 'This is Leo. Is he from the USA?' },
              { s: 's', t: "No, he's not. He's from Canada.", expect: [['no'], ['hes not', 'he is not', 'he isnt'], ['canada']] },
              { s: 'n', t: 'Great! Have fun at the camp!' }
            ] },
          { id: 'nurse', who: 'Nurse Lin', voice: 'nurse', pic: '🏥', mood: '健康中心。你頭痛、喉嚨痛，沒有發燒。同學 Ben 在旁邊咳嗽。',
            lines: [
              { s: 'n', t: "Hi. Come in. What's wrong?" },
              { s: 's', t: 'I have a headache.', expect: [['i have'], ['headache']] },
              { s: 'n', t: 'Oh, no. Do you have a fever?' },
              { s: 's', t: "No, I don't. I have a sore throat.", expect: [['no'], ['i dont', 'i do not'], ['sore throat']] },
              { s: 'n', t: 'Is that your friend Ben? Does he have a sore throat, too?' },
              { s: 's', t: "No, he doesn't. He has a cough.", expect: [['no'], ['he doesnt', 'he does not'], ['cough']] },
              { s: 'n', t: 'OK. Drink some warm water and get some rest.' },
              { s: 's', t: 'Thank you, Nurse Lin.', expect: [['thank']] }
            ] }
        ]
      },
      {
        id: 'listen', kind: 'choice', title: 'Listening', zh: '聽力題', minutes: 12,
        skills: ['listening'],
        intro: 'Press the play button. Listen and choose.',
        items: [
          { id: 'l1', tag: '聽音辨字', audio: 'bird', show: 'b _ _ d', prompt: 'Which letters are missing?', options: ['ir', 'ar', 'or'], answer: 0, explain: 'bird 的 ir 跟 girl、skirt 一樣。' },
          { id: 'l2', tag: '聽音辨字', audio: 'turtle', show: 't _ _ tle', prompt: 'Which letters are missing?', options: ['or', 'ur', 'ar'], answer: 1, explain: 'turtle 的 ur 跟 nurse、purse 一樣。' },
          { id: 'l3', tag: '聽音辨字', audio: 'star', show: 'st _ _', prompt: 'Which letters are missing?', options: ['er', 'or', 'ar'], answer: 2, explain: 'star 的 ar 跟 car、farm 一樣。' },
          { id: 'l4', tag: '聽音辨字', audio: 'fork', show: 'f _ _ k', prompt: 'Which letters are missing?', options: ['or', 'ir', 'ar'], answer: 0, explain: 'fork 的 or 跟 corn、horse 一樣。' },
          { id: 'l5', tag: '聽音辨字', audio: 'sister', show: 'sist _ _', prompt: 'Which letters are missing?', options: ['ar', 'er', 'or'], answer: 1, explain: 'sister 的 er 跟 clerk、perm 一樣。' },
          { id: 'l6', tag: '聽句子', audio: 'Lily is from Australia.', prompt: 'Where is Lily from?', options: ['🦘 Australia', '🐘 India', '🗽 the USA'], answer: 0 },
          { id: 'l7', tag: '聽句子', audio: 'Tom has a toothache.', prompt: "What's wrong with Tom?", options: ['🤕 headache', '🦷 toothache', '🤢 stomachache'], answer: 1 },
          { id: 'l8', tag: '聽問句選回答', audio: 'Where are you from?', prompt: 'Choose the best answer.', options: ["I'm from Japan.", 'Yes, I am.', 'I have a cold.'], answer: 0 },
          { id: 'l9', tag: '聽問句選回答', audio: 'Does she have a fever?', prompt: 'Choose the best answer.', options: ['Yes, she is.', "No, she doesn't.", "She's from Canada."], answer: 1, explain: "Does 開頭的問句，用 does / doesn't 回答。" },
          { id: 'l10', tag: '聽問句選回答', audio: "What's wrong?", prompt: 'Choose the best answer.', options: ["I'm from India.", "No, I don't.", 'I have a runny nose.'], answer: 2 },
          // 2026-10-30 補：康軒段考常見的聽力題型（題目和題庫 kh5a-1 一樣，語音共用）
          { id: 'l11', tag: '聽音選同音', audio: 'nurse', prompt: 'Which word has the same sound?', options: ['bird', 'park', 'fork'], answer: 0, explain: 'nurse 跟 bird 唸起來一樣。er、ir、ur 的發音相同。' },
          { id: 'l12', tag: '聽音判斷 O/X', audio: 'car ... corn', prompt: 'Listen to the two words. Same sound → O. Different sound → X.', options: ['O', 'X'], answer: 1, explain: 'car 的 ar 和 corn 的 or 不一樣，畫 X。' },
          { id: 'l13', tag: '聽音判斷 O/X', audio: 'bird ... nurse', prompt: 'Listen to the two words. Same sound → O. Different sound → X.', options: ['O', 'X'], answer: 0, explain: 'bird 的 ir、nurse 的 ur 唸起來一樣，畫 O。' },
          { id: 'l14', tag: '聽句選字', audio: 'Does your dad have a sore throat?', prompt: 'Which word do you hear?', options: ['runny nose', 'sore throat', 'cough'], answer: 1 },
          { id: 'l15', tag: '聽對話選答', audio: "W: What's wrong, Tom?\nM: I have a cough and a runny nose.\nQ: What's wrong with Tom?", prompt: 'Listen to the conversation and answer the question.', options: ['He has a cough and a runny nose.', 'He has a cough and a fever.', 'He has a headache.'], answer: 0 },
          { id: 'l16', tag: '聽對話選答', audio: "M: Where are you from, Lisa?\nW: I'm from Australia. My friend Ken is from Japan.\nQ: Where is Ken from?", prompt: 'Listen to the conversation and answer the question.', options: ['Australia', 'Japan', 'Canada'], answer: 1 }
        ]
      },
      {
        id: 'exam', kind: 'choice', title: 'Test Practice', zh: '段考題型', minutes: 20,
        skills: ['grammar'],
        intro: 'Choose, build, or spell. Just like the school test!',
        items: [
          { id: 'g1', tag: '文法選擇', prompt: 'Tina and I ___ from Canada.', options: ['am', 'is', 'are'], answer: 2, explain: 'Tina and I 是兩個人，等於 we，用 are。' },
          { id: 'g2', tag: '文法選擇', prompt: "___ is Raj from? He's from India.", options: ['What', 'Where', 'How'], answer: 1, explain: '問「從哪裡來」用 Where。' },
          { id: 'g3', tag: '文法選擇', prompt: 'Is your mom from Japan? ___', options: ['Yes, she is.', 'Yes, he is.', 'Yes, she does.'], answer: 0, explain: 'mom 是 she；Is 開頭的問句用 is 回答。' },
          { id: 'g4', tag: '文法選擇', prompt: 'My brother ___ a runny nose.', options: ['have', 'has', 'is'], answer: 1, explain: 'my brother 是 he，用 has。' },
          { id: 'g5', tag: '文法選擇', prompt: '___ your sister have a cold?', options: ['Do', 'Does', 'Is'], answer: 1, explain: 'your sister 是 she，問句用 Does。' },
          { id: 'g6', tag: '文法選擇', prompt: 'Does Ben have a sore throat? No, he ___.', options: ["isn't", "don't", "doesn't"], answer: 2, explain: "Does 問，就用 doesn't 答。" },
          { id: 'g7', tag: '大小寫', prompt: 'Which sentence is correct?', options: ["I'm from taiwan.", "I'm from Taiwan.", "i'm from Taiwan."], answer: 1, explain: '句子第一個字、國家名字，第一個字母都要大寫。' },
          { id: 'o1', kind: 'order', tag: '句子重組', answer: 'Where are you from?', zh: '你是從哪裡來的？', ctx: "A: ＿＿＿\nB: I'm from Taiwan." },
          { id: 'o2', kind: 'order', tag: '句子重組', answer: "She's not from the USA.", zh: '她不是從美國來的。', ctx: "A: Is Emma from the USA?\nB: No. ＿＿＿ She's from the UK." },
          { id: 'o3', kind: 'order', tag: '句子重組', answer: 'Does your dad have a fever?', zh: '你爸爸發燒了嗎？', ctx: 'A: ＿＿＿\nB: Yes, he does. He feels very hot.' },
          { id: 'o4', kind: 'order', tag: '句子重組', answer: 'My sister has a toothache.', zh: '我妹妹牙痛。', ctx: "A: What's wrong with your sister?\nB: ＿＿＿ She ate too much candy." },
          { id: 's1', kind: 'spell', tag: '聽寫拼字', word: 'Canada', caps: true, pic: '🍁', zh: '加拿大', show: 'C _ n _ d _', skills: ['vocab'] },
          { id: 's2', kind: 'spell', tag: '聽寫拼字', word: 'France', caps: true, pic: '🥐', zh: '法國', show: 'F r _ _ c e', skills: ['vocab'] },
          { id: 's3', kind: 'spell', tag: '聽寫拼字', word: 'fever', pic: '🤒', zh: '發燒', show: 'f _ v _ r', skills: ['vocab'] },
          { id: 's4', kind: 'spell', tag: '聽寫拼字', word: 'headache', pic: '🤕', zh: '頭痛', show: 'h _ _ d _ c h e', skills: ['vocab'] },
          { id: 's5', kind: 'spell', tag: '聽寫拼字', word: 'cough', pic: '😷', zh: '咳嗽', show: 'c _ _ g h', skills: ['vocab'] },
          // 2026-10-30 補：看圖題（emoji 只表示男生女生和病痛）、選出不同類、對話填空、克漏字
          { id: 'p1', tag: '看圖判斷 O/X', scene: '👧🦷', prompt: 'She has a headache.', options: ['O', 'X'], answer: 1, explain: '圖是牙痛（toothache），不是頭痛，畫 X。' },
          { id: 'p2', tag: '看圖判斷 O/X', scene: '👦👧😷', prompt: 'They have a cough.', options: ['O', 'X'], answer: 0, explain: '兩個人都在咳嗽，圖和句子相符，畫 O。' },
          { id: 'p3', tag: '看圖選句', scene: '👦👧🤧', prompt: 'Which sentence matches the picture?', options: ['They has a cold.', 'They have a cold.', 'We have a fever.'], answer: 1, explain: '兩個人用 they，they 後面用 have。' },
          { id: 'p4', tag: '看圖選單字', scene: '🤒', prompt: "What's wrong?", options: ['cough', 'fever', 'toothache'], answer: 1 },
          { id: 'd1', tag: '選出不同類', prompt: 'Which word is different from the other two?', options: ['Japan', 'India', 'fever'], answer: 2, explain: 'Japan、India 是國家，fever 是身體不舒服。' },
          { id: 'f1', kind: 'spell', noAudio: true, tag: '對話填空', ctx: "A: Is Emma from Canada?\nB: No, she's ___. She's from the UK.", word: 'not', show: 'n _ _', zh: '對話填空', skills: ['grammar'] },
          { id: 'f2', kind: 'spell', noAudio: true, tag: '對話填空', ctx: "A: What's wrong with Amy?\nB: She ___ a fever.", word: 'has', show: 'h _ _', zh: '對話填空', skills: ['grammar'] },
          { id: 'c1', tag: '克漏字', passage: 'cz', noRead: true, prompt: 'Choose the best answer for (1).', options: ['is', 'am', 'are'], answer: 2, explain: 'classmates 是很多人，用 are。' },
          { id: 'c2', tag: '克漏字', passage: 'cz', noRead: true, prompt: 'Choose the best answer for (2).', options: ['have', 'has', 'is'], answer: 1, explain: 'she 用 has。' },
          { id: 'c3', tag: '克漏字', passage: 'cz', noRead: true, prompt: 'Choose the best answer for (3).', options: ['Is', 'Are', 'Do'], answer: 1, explain: 'you 用 Are。' },
          { id: 'c4', tag: '克漏字', passage: 'cz', noRead: true, prompt: 'Choose the best answer for (4).', options: ['Do', 'Does', 'Is'], answer: 1, explain: 'he 用 Does。' }
        ]
      },
      {
        id: 'read', kind: 'choice', title: 'Reading', zh: '閱讀理解', minutes: 10,
        skills: ['reading'],
        intro: 'Read the short letter. Then answer the questions.',
        items: [
          { id: 'r1', tag: '閱讀理解', passage: 'nina', prompt: 'Where is Nina from?', options: ['Taiwan', 'Canada', 'Japan'], answer: 1 },
          { id: 'r2', tag: '閱讀理解', passage: 'nina', prompt: "What's wrong with Nina?", options: ['She has a fever.', 'She has a cold.', 'She has a toothache.'], answer: 1 },
          { id: 'r3', tag: '閱讀理解', passage: 'nina', prompt: 'Does Nina have a fever?', options: ['Yes, she does.', "No, she doesn't.", "No, she isn't."], answer: 1 },
          { id: 'r4', tag: '閱讀理解', passage: 'nina', prompt: 'Is Haruto from Japan?', options: ['Yes, he is.', "No, he isn't.", 'Yes, he does.'], answer: 0 },
          { id: 'r5', tag: '閱讀測驗', passage: 'max', prompt: "What's wrong with Max?", options: ['He has a fever.', 'He has a stomachache.', 'He has a headache.'], answer: 1 },
          { id: 'r6', tag: '閱讀測驗', passage: 'max', prompt: 'Who has a fever?', options: ['Max.', "Max's dad.", "Max's sister."], answer: 2 },
          { id: 'r7', tag: '閱讀測驗', passage: 'max', prompt: "Where is Max's sister?", options: ['At home.', 'At school.', "At the doctor's."], answer: 0 }
        ]
      }
    ],
    passages: {
      max: "Doctor: Hello, Max. What's wrong?\nMax: I have a stomachache.\nDoctor: Do you have a fever, too?\nMax: No, I don't. But my little sister has a fever.\nDoctor: Oh, no. Is she here today?\nMax: No, she's at home with my dad.",
      cz: "Hi, I'm Kevin. I'm from the USA. My new classmates (1)___ from Japan and India. Today my classmate Yui is not at school. She (2)___ a cold and a sore throat. My friend Raj is at school, but his head hurts. \"(3)___ you OK, Raj?\" I ask. \"No, I'm not. I have a headache,\" he says. (4)___ he have a fever? No, he doesn't.",
      nina: "Hi! I'm Nina. I'm from Canada, but now I live in Taipei. Today I'm not at school. I have a cold and a sore throat. I don't have a fever. My friend Haruto is from Japan. He visits me after school. He has a book for me. Thank you, Haruto!"
    },
    materials: [
      { id: 'knsh', kind: '其他', title: '康軒數位高手（WW7 電子書）', url: 'https://digitalmaster.knsh.com.tw/', note: '老師帳號登入後，電子書 → 英語 WW7，對照課本頁碼。' },
      { id: 'tcool', kind: '學習單', title: 'tcool 題庫網：六上康軒英語・期中考（第一次段考）', url: 'https://www.tcool.cc/mock/-12/', note: '各校考古題的線上刷題。第一次打開會有「確認不是機器人」的驗證。' }
    ]
  },

  ww7t2: {
    id: 'ww7t2', zone: 'castle', bankId: 'kh5a-2',
    title: 'Test 2 Review', zh: 'WW7・第二次段考：Unit 3–4',
    level: '康軒 Wonder World 7・六上', minutes: 75,
    format: '段考複習課（口說＋段考題型）',
    audience: '程度普通，在補學校進度、為國中打底。',
    scope: [
      'Unit 3 From Farm to Table（課本 p.47–60）：8 種食物、What would you like to eat? Would you like some …?',
      'Unit 4 A Call in the Morning（p.61–74）：8 個作息片語、What time do you …? 主詞是 he / she 時動詞加 s',
      'Review 2（p.75–78）',
      '發音：oi、oy、ou、ow'
    ],
    goals: [
      '說出 16 個課本單字和片語，並用它們造句',
      "用 What would you like to eat? 點餐，用 Yes, please. / No, thank you. 回答",
      '用 What time do you …? 說自己的作息',
      '分清楚 a / some、do / does、get / gets、go / goes',
      '熟悉段考的聽力、選擇、重組、拼字、閱讀題'
    ],
    assess: '口說題由電腦聽寫、給建議分數，老師可以改。選擇、重組、拼字題電腦直接改：第一次就對 3 顆糖，第二次對 2 顆，之後才對 1 顆。',
    aiPoint: '語音辨識檢查句型有沒有說完整，例如 he goes、she gets。答錯幾次都會記下來，下課報告列出要加強的題型。',
    ranks: [[90, 'Castle Champion 城堡冠軍'], [75, 'Brave Knight 勇敢騎士'], [60, 'Castle Guard 城堡守衛'], [0, 'Young Squire 見習騎士，繼續加油']],
    stages: [
      {
        id: 'words', kind: 'word', title: 'Word Check', zh: '單字口說', minutes: 15,
        skills: ['vocab', 'pron'],
        intro: 'Say the word. Then make a sentence with it.',
        items: [
          { id: 'pizza', word: 'pizza', pic: '🍕', pos: 'noun', zh: '披薩', def: 'Round, flat bread with cheese and tomato on top.', ex: 'My dad makes pizza on Sundays.' },
          { id: 'rice', word: 'rice', pic: '🍚', pos: 'noun', zh: '飯、米', def: 'Small white food. People in Taiwan eat it every day.', ex: 'I eat rice and soup for dinner.' },
          { id: 'soup', word: 'soup', pic: '🍲', pos: 'noun', zh: '湯', def: 'Hot food like water. You eat it with a spoon.', ex: 'Would you like some corn soup?' },
          { id: 'steak', word: 'steak', pic: '🥩', pos: 'noun', zh: '牛排', def: 'A big piece of meat, often beef.', ex: 'My brother likes steak with French fries.' },
          { id: 'dumplings', word: 'dumplings', alt: ['dumpling'], pic: '🥟', pos: 'noun', zh: '水餃', def: 'Small food with meat or vegetables inside.', ex: 'Grandma makes dumplings for us.' },
          { id: 'noodles', word: 'noodles', alt: ['noodle'], pic: '🍜', pos: 'noun', zh: '麵', def: 'Long, thin food. You can eat it with chopsticks.', ex: "I'd like some beef noodles, please." },
          { id: 'sandwiches', word: 'sandwiches', alt: ['sandwich'], pic: '🥪', pos: 'noun', zh: '三明治', def: 'Bread with egg, ham or cheese inside.', ex: 'We have sandwiches for breakfast.' },
          { id: 'fries', word: 'French fries', alt: ['fries', 'french fry'], pic: '🍟', pos: 'noun', zh: '薯條', def: 'Long, thin pieces of potato. They are hot and crispy.', ex: 'Would you like some French fries? Yes, please.' },
          { id: 'getup', word: 'get up', alt: ['gets up', 'got up', 'getting up'], pic: '⏰', pos: 'phrase', zh: '起床', def: 'To get out of bed in the morning.', ex: 'I get up at six forty on school days.' },
          { id: 'breakfast', word: 'have breakfast', alt: ['has breakfast', 'had breakfast', 'eat breakfast'], pic: '🍳', pos: 'phrase', zh: '吃早餐', def: 'To eat the first meal of the day.', ex: 'We have breakfast at seven.' },
          { id: 'school', word: 'go to school', alt: ['goes to school', 'went to school'], pic: '🏫', pos: 'phrase', zh: '上學', def: 'To leave home and go to your school.', ex: 'My sister goes to school at seven thirty.' },
          { id: 'lunch', word: 'have lunch', alt: ['has lunch', 'had lunch', 'eat lunch'], pic: '🍱', pos: 'phrase', zh: '吃午餐', def: 'To eat the meal in the middle of the day.', ex: 'Do you have lunch at twelve?' },
          { id: 'home', word: 'go home', alt: ['goes home', 'went home'], pic: '🏠', pos: 'phrase', zh: '回家', def: 'To go back to your house.', ex: 'He goes home at four.' },
          { id: 'dinner', word: 'have dinner', alt: ['has dinner', 'had dinner', 'eat dinner'], pic: '🍽️', pos: 'phrase', zh: '吃晚餐', def: 'To eat the meal in the evening.', ex: 'What time do you have dinner?' },
          { id: 'homework', word: 'do my homework', alt: ['do homework', 'does homework', 'do his homework', 'do her homework', 'does his homework', 'does her homework', 'do your homework'], pic: '📝', pos: 'phrase', zh: '寫功課', def: 'To do the school work you bring home.', ex: 'I do my homework after dinner.' },
          { id: 'bed', word: 'go to bed', alt: ['goes to bed', 'went to bed'], pic: '🛏️', pos: 'phrase', zh: '睡覺', def: 'To get into bed at night and sleep.', ex: 'I go to bed at nine thirty.' }
        ]
      },
      {
        id: 'talk', kind: 'question', title: 'Sentence Talk', zh: '句型問答', minutes: 15,
        skills: ['grammar', 'fluency'],
        intro: 'Look at the picture. Answer in a full sentence.',
        items: [
          { id: 't1', pic: '🍽️', prompt: 'What would you like to eat?', hint: "I'd like some …, please.",
            follow: '換一種食物再問一次。',
            expect: { minWords: 4, groups: [{ any: ['id like', 'i would like'], miss: "用 I'd like some … 回答" },
              { any: ['pizza', 'rice', 'soup', 'steak', 'dumplings', 'noodles', 'sandwiches', 'sandwich', 'french fries', 'fries', 'hamburgers', 'hamburger'], miss: '說出想吃的食物' },
              { any: ['please'], miss: '最後加 please 比較有禮貌' }] } },
          { id: 't2', pic: '🍽️', ctx: 'You love pizza and French fries.', prompt: 'What would you like to eat for lunch?', hint: "I'd like some … and …, please.",
            follow: "完整答法：I'd like some pizza and French fries, please.",
            expect: { minWords: 6, groups: [{ any: ['id like', 'i would like'], miss: "用 I'd like some … 回答" }, { any: ['pizza'], miss: '說出 pizza' }, { any: ['french fries', 'fries'], miss: '說出 French fries' }] } },
          { id: 't3', pic: '🍽️', ctx: 'You are hungry. You love dumplings.', prompt: 'Would you like some dumplings?', hint: 'Yes, …',
            follow: 'Would you like …? 要的話說 Yes, please.',
            expect: { minWords: 2, groups: [{ any: ['yes please'], miss: '想要就說 Yes, please.' }] } },
          { id: 't4', pic: '🍽️', ctx: "You are full. You can't eat any more.", prompt: 'Would you like some steak?', hint: 'No, …',
            follow: '不要的話說 No, thank you.',
            expect: { minWords: 2, groups: [{ any: ['no thank you', 'no thanks'], miss: '不要就說 No, thank you.' }] } },
          { id: 't5', pic: '⏰', prompt: 'What time do you get up?', hint: 'I get up at …',
            follow: '追問：What time do you go to school?',
            expect: { minWords: 4, groups: [{ any: ['i get up'], miss: '用 I get up at … 回答' }, { any: ['at'], miss: '時間前面加 at' }] } },
          { id: 't6', pic: '🛏️', prompt: 'What time do you go to bed?', hint: 'I go to bed at …',
            follow: '追問：What time do you have dinner?',
            expect: { minWords: 5, groups: [{ any: ['go to bed'], miss: '用 I go to bed at … 回答' }, { any: ['at'], miss: '時間前面加 at' }] } },
          { id: 't7', pic: '🍳', prompt: 'Do you have breakfast at seven?', hint: "Yes, I do. / No, I don't. I have breakfast at …",
            follow: "答 No 的話，要再說正確的時間。",
            expect: { minWords: 3, groups: [{ any: ['yes i do', 'no i dont', 'no i do not'], miss: "用 Yes, I do. 或 No, I don't. 回答" }] } },
          { id: 't8', pic: '👧', ctx: "Ruby's schedule: get up — 6:30", prompt: 'What time does Ruby get up?', hint: 'She gets up at …',
            follow: 'Ruby 是 she，動詞要加 s：gets up。',
            expect: { minWords: 5, groups: [{ any: ['she gets up'], exact: true, miss: '說 She gets up at …' }, { any: ['six thirty'], miss: '說出時間 six thirty' }],
              avoid: [{ any: ['she get up'], tip: 'she 後面的動詞要加 s：gets' }] } },
          { id: 't9', pic: '👦', ctx: "Ben's schedule: go home — 4:00", prompt: 'What time does Ben go home?', hint: 'He goes home at …',
            follow: 'Ben 是 he，go 要變 goes。',
            expect: { minWords: 5, groups: [{ any: ['goes home'], miss: '說 He goes home at …' }, { any: ['four'], miss: '說出時間 four' }],
              avoid: [{ any: ['he go home'], tip: 'he 後面的 go 要變 goes' }] } },
          { id: 't10', pic: '📅', prompt: 'Tell me about your day after school.',
            hint: 'I go home at … I do my homework at … I have dinner at … I go to bed at …',
            follow: '進階題：至少說兩件事，每件都加時間。',
            expect: { minWords: 12, keywords: ['go home', 'do my homework', 'do homework', 'have dinner', 'go to bed', 'take a bath', 'watch tv', 'play'], needHits: 2,
              groups: [{ any: ['at'], miss: '加上時間 at …' }] } }
        ]
      },
      {
        id: 'role', kind: 'dialogue', title: 'Role Play', zh: '情境對話', minutes: 10,
        skills: ['fluency', 'pron'],
        intro: 'The teacher plays the other person. You answer.',
        items: [
          { id: 'diner', who: 'The Waiter', voice: 'waiter', pic: '🍽️', mood: '在餐廳點餐。你想吃牛排和薯條，不想喝湯。',
            lines: [
              { s: 'n', t: "Good evening. Here's the menu. What would you like to eat?" },
              { s: 's', t: "I'd like some steak and French fries, please.", expect: [['id like', 'i would like'], ['steak'], ['french fries', 'fries'], ['please']] },
              { s: 'n', t: 'Sure. Would you like some soup, too?' },
              { s: 's', t: 'No, thank you.', expect: [['no'], ['thank you', 'thanks']] },
              { s: 'n', t: 'OK. Here you are. Enjoy your meal!' },
              { s: 's', t: 'Thank you.', expect: [['thank']] }
            ] },
          { id: 'grandma', who: 'Grandma', voice: 'grandma', pic: '☎️', mood: '奶奶打電話問你的作息。你 6:40 起床、5:00 回家、9:30 睡覺。',
            lines: [
              { s: 'n', t: 'Hi, sweetie! What time do you get up on school days?' },
              { s: 's', t: 'I get up at six forty.', expect: [['i get up'], ['six forty']] },
              { s: 'n', t: "Wow, that's early. Do you go home at four?" },
              { s: 's', t: "No, I don't. I go home at five.", expect: [['no'], ['i dont', 'i do not'], ['go home'], ['five']] },
              { s: 'n', t: 'And what time do you go to bed?' },
              { s: 's', t: 'I go to bed at nine thirty.', expect: [['go to bed'], ['nine thirty']] },
              { s: 'n', t: 'Good. Sleep well, sweetie. Good night!' }
            ] }
        ]
      },
      {
        id: 'listen', kind: 'choice', title: 'Listening', zh: '聽力題', minutes: 10,
        skills: ['listening'],
        intro: 'Press the play button. Listen and choose.',
        items: [
          { id: 'l1', tag: '聽音辨字', audio: 'point', show: 'p _ _ nt', prompt: 'Which letters are missing?', options: ['ou', 'oi', 'ar'], answer: 1, explain: 'point 的 oi 跟 coin、soil 一樣。' },
          { id: 'l2', tag: '聽音辨字', audio: 'enjoy', show: 'enj _ _', prompt: 'Which letters are missing?', options: ['ay', 'ow', 'oy'], answer: 2, explain: 'enjoy 的 oy 跟 boy、toy 一樣。' },
          { id: 'l3', tag: '聽音辨字', audio: 'mouth', show: 'm _ _ th', prompt: 'Which letters are missing?', options: ['ou', 'oi', 'ur'], answer: 0, explain: 'mouth 的 ou 跟 house、mouse 一樣。' },
          { id: 'l4', tag: '聽音辨字', audio: 'cow', show: 'c _ _', prompt: 'Which letters are missing?', options: ['oy', 'ow', 'or'], answer: 1, explain: 'cow 的 ow 跟 clown、owl 一樣。' },
          { id: 'l5', tag: '聽音辨字', audio: 'cloud', show: 'cl _ _ d', prompt: 'Which letters are missing?', options: ['ou', 'oy', 'ar'], answer: 0, explain: 'cloud 的 ou 跟 shout 一樣。' },
          { id: 'l6', tag: '聽句子', audio: "I'd like some noodles, please.", prompt: 'What does he want?', options: ['🍜 noodles', '🍚 rice', '🥟 dumplings'], answer: 0 },
          { id: 'l7', tag: '聽句子', audio: 'Mark goes to bed at ten.', prompt: 'What time does Mark go to bed?', options: ['9:00', '9:30', '10:00'], answer: 2 },
          { id: 'l8', tag: '聽問句選回答', audio: 'Would you like some rice?', prompt: 'Choose the best answer.', options: ['Yes, please.', 'Yes, I do.', 'I go home at four.'], answer: 0, explain: 'Would you like …? 用 Yes, please. 或 No, thank you. 回答。' },
          { id: 'l9', tag: '聽問句選回答', audio: 'What time does your dad have dinner?', prompt: 'Choose the best answer.', options: ['Yes, he does.', 'He has dinner at seven.', 'He have dinner at seven.'], answer: 1, explain: 'your dad 是 he，用 has。' },
          { id: 'l10', tag: '聽問句選回答', audio: 'Do you do your homework at eight?', prompt: 'Choose the best answer.', options: ['Yes, I am.', "No, I don't.", "I'd like some pizza."], answer: 1 }
        ]
      },
      {
        id: 'exam', kind: 'choice', title: 'Test Practice', zh: '段考題型', minutes: 15,
        skills: ['grammar'],
        intro: 'Choose, build, or spell. Just like the school test!',
        items: [
          { id: 'g1', tag: '文法選擇', prompt: "I'd like ___ dumplings, please.", options: ['a', 'an', 'some'], answer: 2, explain: 'dumplings 是很多個，用 some。' },
          { id: 'g2', tag: '文法選擇', prompt: 'Would you like some ___?', options: ['sandwich', 'sandwiches', 'sandwichs'], answer: 1, explain: 'some 後面接可數名詞要用複數，sandwich 加 es。' },
          { id: 'g3', tag: '文法選擇', prompt: 'What would you like ___ eat?', options: ['to', 'for', 'at'], answer: 0, explain: 'would like to 後面接動詞。' },
          { id: 'g4', tag: '文法選擇', prompt: 'My sister ___ up at six every day.', options: ['get', 'gets', 'getting'], answer: 1, explain: 'my sister 是 she，動詞加 s。' },
          { id: 'g5', tag: '文法選擇', prompt: 'What time ___ Ben go to school?', options: ['do', 'does', 'is'], answer: 1, explain: 'Ben 是 he，用 does。' },
          { id: 'g6', tag: '文法選擇', prompt: 'Do you have lunch at twelve? No, I ___.', options: ["don't", "doesn't", 'am not'], answer: 0, explain: "Do you 問，就用 I don't 答。" },
          { id: 'g7', tag: '文法選擇', prompt: 'He ___ his homework at eight.', options: ['do', 'does', 'dos'], answer: 1, explain: 'do 遇到 he / she 要變 does。' },
          { id: 'o1', kind: 'order', tag: '句子重組', answer: 'What would you like to eat?', zh: '你想要吃什麼？', ctx: "A: ＿＿＿\nB: I'd like some steak, please." },
          { id: 'o2', kind: 'order', tag: '句子重組', answer: "I'd like some noodles, please.", zh: '我想要一些麵，謝謝。', ctx: 'A: What would you like to eat?\nB: ＿＿＿' },
          { id: 'o3', kind: 'order', tag: '句子重組', answer: 'What time does Ruby get up?', zh: 'Ruby 幾點起床？', ctx: 'A: ＿＿＿\nB: She gets up at six thirty.' },
          { id: 'o4', kind: 'order', tag: '句子重組', answer: 'He goes home at four thirty.', zh: '他四點半回家。', ctx: 'A: What time does Ben go home?\nB: ＿＿＿' },
          { id: 's1', kind: 'spell', tag: '聽寫拼字', word: 'rice', pic: '🍚', zh: '飯', show: 'r _ c e', skills: ['vocab'] },
          { id: 's2', kind: 'spell', tag: '聽寫拼字', word: 'soup', pic: '🍲', zh: '湯', show: 's _ _ p', skills: ['vocab'] },
          { id: 's3', kind: 'spell', tag: '聽寫拼字', word: 'noodles', pic: '🍜', zh: '麵', show: 'n _ _ d l e s', skills: ['vocab'] },
          { id: 's4', kind: 'spell', tag: '聽寫拼字', word: 'dinner', pic: '🍽️', zh: '晚餐', show: 'd _ n n _ r', skills: ['vocab'] },
          { id: 's5', kind: 'spell', tag: '聽寫拼字', word: 'school', pic: '🏫', zh: '學校', show: 's c h _ _ l', skills: ['vocab'] }
        ]
      },
      {
        id: 'read', kind: 'choice', title: 'Reading', zh: '閱讀理解', minutes: 8,
        skills: ['reading'],
        intro: "Read about Ruby's day. Then answer the questions.",
        items: [
          { id: 'r1', tag: '閱讀理解', passage: 'ruby', prompt: 'What time does Ruby get up?', options: ['At six.', 'At six thirty.', 'At seven.'], answer: 1 },
          { id: 'r2', tag: '閱讀理解', passage: 'ruby', prompt: 'What does Ruby like for lunch?', options: ['Pizza and French fries.', 'Rice and soup.', 'Noodles and dumplings.'], answer: 2 },
          { id: 'r3', tag: '閱讀理解', passage: 'ruby', prompt: 'Does Ruby do her homework at five?', options: ['Yes, she does.', "No, she doesn't.", 'Yes, she is.'], answer: 0 },
          { id: 'r4', tag: '閱讀理解', passage: 'ruby', prompt: 'What time does Ruby go to bed?', options: ['At nine.', 'At nine thirty.', 'At ten.'], answer: 1 }
        ]
      }
    ],
    passages: {
      ruby: "Hi, I'm Ruby. On school days, I get up at six thirty. I have breakfast at seven. I go to school at seven twenty. At school, I have lunch at twelve. My favorite lunch is noodles and dumplings. I go home at four. I do my homework at five. I have dinner with my family at six thirty. I go to bed at nine thirty."
    },
    materials: [
      { id: 'knsh', kind: '其他', title: '康軒數位高手（WW7 電子書）', url: 'https://digitalmaster.knsh.com.tw/', note: '老師帳號登入後，電子書 → 英語 WW7，對照課本頁碼。' },
      { id: 'tcool', kind: '學習單', title: 'tcool 題庫網：六上康軒英語・期末考（第二次段考）', url: 'https://www.tcool.cc/mock/-615/', note: '各校考古題的線上刷題。第一次打開會有「確認不是機器人」的驗證。' }
    ]
  },

  /* ==========================================================
     這段在做什麼：段考城堡・康軒 Wonder World 9（有些學校六上用 WW9，看學生課本封面的冊次）
     一個 Review 是一次段考範圍。題目用課本的單字和句型自己出，不照抄課文。
     課本 Unit 3 的景點是台灣真實地名，我們不考地理：只用 beach、lake 這類單字，答案都寫在題目的英文裡。
     ========================================================== */
  ww9t1: {
    id: 'ww9t1', zone: 'castle', bankId: 'kh6a-1',
    title: 'Test 1 Review', zh: 'WW9・第一次段考：Unit 1–2',
    level: '康軒 Wonder World 9・六上', minutes: 75,
    format: '段考複習課（口說＋段考題型）',
    audience: '六年級，程度普通，在補學校進度、為國中打底。',
    scope: [
      'Unit 1 First Day of School（課本 p.7–18）：6 個做家事、休閒的片語、What did you do yesterday? Did you …? 動詞加 -ed',
      'Unit 2 A Great Day（p.19–30）：7 個作息片語、What time did you …? 不規則動詞 did、had、went',
      'Review 1（p.31–34）',
      '發音：-ed 的三種唸法、-ing、-ong'
    ],
    goals: [
      '說出 13 個課本片語（過去式），並用它們造句',
      '用 What did you do yesterday? 說昨天做了什麼',
      '用 What time did you …? 說幾點做了什麼',
      "用 Did you …? 問答，回答 Yes, I did. / No, I didn't.",
      '分清楚現在式和過去式：every day / yesterday、walk / walked、go / went',
      '熟悉段考的聽力、選擇、重組、拼字、閱讀題'
    ],
    assess: '口說題由電腦聽寫、給建議分數，老師可以改。選擇、重組、拼字題電腦直接改：第一次就對 3 顆糖，第二次對 2 顆，之後才對 1 顆。',
    aiPoint: '語音辨識檢查句型有沒有說完整，例如 walked、went、he did。答錯幾次都會記下來，下課報告列出要加強的題型。',
    ranks: [[90, 'Castle Champion 城堡冠軍'], [75, 'Brave Knight 勇敢騎士'], [60, 'Castle Guard 城堡守衛'], [0, 'Young Squire 見習騎士，繼續加油']],
    stages: [
      {
        id: 'words', kind: 'word', title: 'Word Check', zh: '單字口說', minutes: 15,
        skills: ['vocab', 'pron'],
        intro: 'Say the words. Then make a sentence about yesterday.',
        items: [
          { id: 'cleaned', word: 'cleaned the room', alt: ['clean the room', 'cleaned my room', 'cleaned his room', 'cleaned her room'], pic: '🧹', pos: 'phrase', zh: '打掃房間', def: 'You made your room clean and tidy.', ex: 'I cleaned the room before dinner yesterday.' },
          { id: 'cooked', word: 'cooked dinner', alt: ['cook dinner', 'cooks dinner'], pic: '🍳', pos: 'phrase', zh: '煮晚餐', def: 'You made the evening meal in the kitchen.', ex: 'Dad cooked dinner for us last night.' },
          { id: 'recorder', word: 'played the recorder', alt: ['play the recorder', 'plays the recorder', 'played recorder'], pic: '🎶', pos: 'phrase', zh: '吹直笛', def: 'You made music with a long, thin instrument. You blew into it.', ex: 'Emma played the recorder in music class.' },
          { id: 'visited', word: 'visited my grandparents', alt: ['visit my grandparents', 'visited his grandparents', 'visited her grandparents', 'visited our grandparents', 'visited grandparents'], pic: '👵', pos: 'phrase', zh: '拜訪祖父母', def: 'You went to see your grandpa and grandma.', ex: 'We visited my grandparents last Sunday.' },
          { id: 'walked', word: 'walked the dog', alt: ['walk the dog', 'walks the dog', 'walked my dog', 'walked his dog', 'walked her dog'], pic: '🐕', pos: 'phrase', zh: '遛狗', def: 'You took your dog outside for a walk.', ex: 'Kevin walked the dog in the park this morning.' },
          { id: 'watched', word: 'watched a movie', alt: ['watch a movie', 'watched the movie', 'watched movie'], pic: '🎬', pos: 'phrase', zh: '看電影', def: 'You sat down and saw a film.', ex: 'We watched a movie at home last Friday.' },
          { id: 'dishes', word: 'did the dishes', alt: ['do the dishes', 'does the dishes', 'doing the dishes'], pic: '🍽️', pos: 'phrase', zh: '洗碗', def: 'You washed the plates and bowls after a meal.', ex: 'I did the dishes after dinner yesterday.' },
          { id: 'laundry', word: 'did the laundry', alt: ['do the laundry', 'does the laundry', 'doing the laundry'], pic: '🧺', pos: 'phrase', zh: '洗衣服', def: 'You washed your dirty clothes.', ex: 'Mom did the laundry this morning.' },
          { id: 'breakfast', word: 'had breakfast', alt: ['have breakfast', 'has breakfast', 'ate breakfast'], pic: '🥞', pos: 'phrase', zh: '吃早餐', def: 'You ate the first meal of the day.', ex: "I had breakfast at seven o'clock." },
          { id: 'lunch', word: 'had lunch', alt: ['have lunch', 'has lunch', 'ate lunch'], pic: '🍱', pos: 'phrase', zh: '吃午餐', def: 'You ate the meal in the middle of the day.', ex: 'We had lunch at school at twelve.' },
          { id: 'dinner', word: 'had dinner', alt: ['have dinner', 'has dinner', 'ate dinner'], pic: '🍲', pos: 'phrase', zh: '吃晚餐', def: 'You ate the meal in the evening.', ex: 'My family had dinner at a night market.' },
          { id: 'shopping', word: 'went shopping', alt: ['go shopping', 'goes shopping'], pic: '🛍️', pos: 'phrase', zh: '去購物、逛街', def: 'You went to the stores to buy things.', ex: 'My sister went shopping last weekend.' },
          { id: 'swimming', word: 'went swimming', alt: ['go swimming', 'goes swimming'], pic: '🏊', pos: 'phrase', zh: '去游泳', def: 'You went into the water and swam.', ex: 'Did you go swimming yesterday?' }
        ]
      },
      {
        id: 'talk', kind: 'question', title: 'Sentence Talk', zh: '句型問答', minutes: 15,
        skills: ['grammar', 'fluency'],
        intro: 'Read the card. Answer in a full sentence.',
        items: [
          { id: 't1', pic: '🙋', prompt: 'What did you do yesterday?', hint: 'I … yesterday.',
            follow: '可以追問：Did you watch TV yesterday?',
            expect: { minWords: 4, past: true } },
          { id: 't2', pic: '👦', ctx: 'Ben: I walked the dog yesterday.', prompt: 'What did Ben do yesterday?', hint: 'He …',
            follow: 'Ben 是男生，用 he；昨天的事，用過去式 walked。',
            expect: { minWords: 4, groups: [{ any: ['he walked'], exact: true, miss: '說 He walked the dog.' }, { any: ['the dog', 'his dog'], miss: '說出 the dog' }],
              avoid: [{ any: ['he walk the', 'he walks the'], tip: '昨天的事，walk 要加 -ed' }, { any: ['she walked'], tip: 'Ben 是男生，要用 he' }] } },
          { id: 't3', pic: '👧', ctx: "Amy: I didn't watch TV last night. I played the recorder.", prompt: 'Did Amy watch TV last night?', hint: "No, she didn't. She …",
            follow: "完整答法：No, she didn't. She played the recorder.",
            expect: { minWords: 6, groups: [{ any: ['no'], miss: '先回答 No' }, { any: ['she didnt', 'she did not'], miss: "說 she didn't" }, { any: ['played the recorder'], exact: true, miss: '說出 Amy 做了什麼：played the recorder' }],
              avoid: [{ any: ['she doesnt', 'she dont'], tip: "Did 問，要用 didn't 回答" }] } },
          { id: 't4', pic: '👦', ctx: 'Tom: I cleaned my room this morning.', prompt: 'Did Tom clean his room this morning?', hint: 'Yes, he …',
            follow: '簡答：Yes, he did.',
            expect: { minWords: 3, groups: [{ any: ['yes'], miss: '回答 Yes' }, { any: ['he did'], miss: 'Did 問句，用 he did 回答' }],
              avoid: [{ any: ['he does', 'he is'], tip: 'Did 問，就用 did 答' }] } },
          { id: 't5', pic: '🍳', prompt: 'What time did you have breakfast this morning?', hint: 'I had breakfast at …',
            follow: '追問：What did you have for breakfast?',
            expect: { minWords: 5, groups: [{ any: ['had breakfast'], exact: true, miss: '用過去式 I had breakfast at …' }, { any: ['at'], miss: '時間前面加 at' }],
              avoid: [{ any: ['i have breakfast'], tip: '今天早上已經過去了，have 要變 had' }] } },
          { id: 't6', pic: '👧', ctx: "Mia's day yesterday: go shopping — 3:00", prompt: 'What time did Mia go shopping yesterday?', hint: 'She went shopping at …',
            follow: 'Mia 是 she；昨天的事，go 要變 went。',
            expect: { minWords: 5, groups: [{ any: ['she went shopping'], exact: true, miss: '說 She went shopping at …' }, { any: ['three'], miss: '說出時間 three' }],
              avoid: [{ any: ['she go shopping', 'she goes shopping'], tip: '昨天的事，go 要變 went' }] } },
          { id: 't7', pic: '👦', ctx: 'Ken: I did the dishes after dinner.', prompt: 'Did Ken do the laundry?', hint: "No, he didn't. He …",
            follow: "完整答法：No, he didn't. He did the dishes.",
            expect: { minWords: 6, groups: [{ any: ['no'], miss: '先回答 No' }, { any: ['he didnt', 'he did not'], miss: "說 he didn't" }, { any: ['did the dishes'], exact: true, miss: '說出 Ken 做了什麼：did the dishes' }],
              avoid: [{ any: ['he do the dishes', 'he does the dishes'], tip: '過去的事，do 要變 did' }] } },
          { id: 't8', pic: '🏊', prompt: 'Did you go swimming last weekend?', hint: "Yes, I did. / No, I didn't. I …",
            follow: '答 No 的話，再說你做了什麼。',
            expect: { minWords: 3, groups: [{ any: ['yes i did', 'no i didnt', 'no i did not'], miss: "用 Yes, I did. 或 No, I didn't. 回答" }] } },
          { id: 't9', pic: '👦👧', ctx: 'Leo and Amy: We went swimming at four. Then we had dinner at six.', prompt: 'What time did Leo and Amy have dinner?', hint: 'They had dinner at …',
            follow: '兩個人用 they；have 的過去式是 had。',
            expect: { minWords: 5, groups: [{ any: ['they had dinner'], exact: true, miss: '說 They had dinner at …' }, { any: ['six'], miss: '說出時間 six' }],
              avoid: [{ any: ['they have dinner'], tip: '過去的事，have 要變 had' }] } },
          { id: 't10', pic: '📅', prompt: 'Tell me about your day yesterday. What did you do? What time?',
            hint: 'I … at … Then I … at …',
            follow: '進階題：至少說兩件事，用過去式，加上時間。',
            expect: { minWords: 12, past: true, groups: [{ any: ['at'], miss: '加上時間 at …' }] } }
        ]
      },
      {
        id: 'role', kind: 'dialogue', title: 'Role Play', zh: '情境對話', minutes: 10,
        skills: ['fluency', 'pron'],
        intro: 'The teacher plays the other person. You answer.',
        items: [
          { id: 'monday', who: 'Emma', voice: 'classmate', pic: '🏫', mood: '星期一早上，同學 Emma 問你週末做了什麼。你週六遛狗、看電影；週日沒有打掃房間，去看爺爺奶奶。',
            lines: [
              { s: 'n', t: 'Good morning! What did you do last weekend?' },
              { s: 's', t: 'I walked the dog and watched a movie.', expect: [['walked the dog'], ['watched a movie', 'watched']] },
              { s: 'n', t: 'Cool! Did you clean your room on Sunday?' },
              { s: 's', t: "No, I didn't. I visited my grandparents.", expect: [['no'], ['i didnt', 'i did not'], ['visited']] },
              { s: 'n', t: 'Nice! I played the recorder all weekend.' },
              { s: 's', t: 'Wow! Can you play a song for me?', expect: [['play'], ['song']] },
              { s: 'n', t: 'Sure! Listen.' }
            ] },
          { id: 'dad', who: 'Dad', voice: 'dad', pic: '🏠', mood: '爸爸出差回家，問你昨天做了什麼。你 7:00 吃早餐、5:30 去游泳；晚餐後沒有洗碗，你洗了衣服。',
            lines: [
              { s: 'n', t: 'I missed you! What time did you have breakfast yesterday?' },
              { s: 's', t: "I had breakfast at seven o'clock.", expect: [['had breakfast'], ['seven']] },
              { s: 'n', t: 'Good. What did you do after school?' },
              { s: 's', t: 'I went swimming at five thirty.', expect: [['went swimming'], ['five thirty']] },
              { s: 'n', t: 'Did you do the dishes after dinner?' },
              { s: 's', t: "No, I didn't. I did the laundry.", expect: [['no'], ['i didnt', 'i did not'], ['did the laundry']] },
              { s: 'n', t: 'Thank you. You were a big help!' }
            ] }
        ]
      },
      {
        id: 'listen', kind: 'choice', title: 'Listening', zh: '聽力題', minutes: 10,
        skills: ['listening'],
        intro: 'Press the play button. Listen and choose.',
        items: [
          { id: 'l1', tag: '聽音辨字', audio: 'rained', prompt: 'Which word has the same -ed sound?', options: ['played', 'cooked', 'visited'], answer: 0, explain: 'rained 的 -ed 唸 /d/，跟 played、listened 一樣。' },
          { id: 'l2', tag: '聽音辨字', audio: 'helped', prompt: 'Which word has the same -ed sound?', options: ['played', 'cooked', 'visited'], answer: 1, explain: 'helped 的 -ed 唸 /t/，跟 cooked、watched 一樣。' },
          { id: 'l3', tag: '聽音辨字', audio: 'shouted', prompt: 'Which word has the same -ed sound?', options: ['played', 'cooked', 'visited'], answer: 2, explain: '字的最後是 t 或 d，-ed 唸 /ɪd/，跟 visited、landed 一樣。' },
          { id: 'l4', tag: '聽音辨字', audio: 'king', show: 'k _ _ _', prompt: 'Which letters are missing?', options: ['ong', 'ing', 'ang'], answer: 1, explain: 'king 的 ing 跟 ring、sing 一樣。' },
          { id: 'l5', tag: '聽音辨字', audio: 'strong', show: 'str _ _ _', prompt: 'Which letters are missing?', options: ['ong', 'ing', 'ung'], answer: 0, explain: 'strong 的 ong 跟 long、wrong 一樣。' },
          { id: 'l6', tag: '聽句子', audio: 'Kevin walked the dog yesterday.', prompt: 'What did Kevin do yesterday?', options: ['🎬 watched a movie', '🐕 walked the dog', '🧹 cleaned the room'], answer: 1 },
          { id: 'l7', tag: '聽句子', audio: 'I had dinner at six thirty.', prompt: 'What time did she have dinner?', options: ['6:00', '7:30', '6:30'], answer: 2 },
          { id: 'l8', tag: '聽問句選回答', audio: 'What did you do last night?', prompt: 'Choose the best answer.', options: ['I watched TV.', 'Yes, I did.', 'I watch TV every day.'], answer: 0, explain: '問 What did you do，用過去式回答。' },
          { id: 'l9', tag: '聽問句選回答', audio: 'Did you go shopping yesterday?', prompt: 'Choose the best answer.', options: ['Yes, I do.', "No, I didn't.", 'I go shopping on Sundays.'], answer: 1, explain: "Did 開頭的問句，用 did / didn't 回答。" },
          { id: 'l10', tag: '聽問句選回答', audio: 'What time did you go home?', prompt: 'Choose the best answer.', options: ['Yes, I did.', 'I go home every day.', 'I went home at five.'], answer: 2 }
        ]
      },
      {
        id: 'exam', kind: 'choice', title: 'Test Practice', zh: '段考題型', minutes: 15,
        skills: ['grammar'],
        intro: 'Choose, build, or spell. Just like the school test!',
        items: [
          { id: 'g1', tag: '文法選擇', prompt: 'I ___ the dog last night.', options: ['walk', 'walks', 'walked'], answer: 2, explain: 'last night 是過去，用 walked。' },
          { id: 'g2', tag: '文法選擇', prompt: 'Emma ___ the recorder every day.', options: ['play', 'plays', 'played'], answer: 1, explain: 'every day 是每天的習慣，用現在式；Emma 是 she，加 s。' },
          { id: 'g3', tag: '文法選擇', prompt: 'What ___ you do yesterday?', options: ['did', 'do', 'does'], answer: 0, explain: 'yesterday 是過去，用 did。' },
          { id: 'g4', tag: '文法選擇', prompt: 'Did Ben visit his grandparents? No, he ___.', options: ["doesn't", "didn't", "isn't"], answer: 1, explain: "Did 問，就用 didn't 答。" },
          { id: 'g5', tag: '文法選擇', prompt: 'We ___ shopping last Saturday.', options: ['go', 'goes', 'went'], answer: 2, explain: 'go 的過去式是 went。' },
          { id: 'g6', tag: '文法選擇', prompt: 'My mom ___ the laundry this morning.', options: ['did', 'do', 'does'], answer: 0, explain: 'this morning 已經過去了，do 的過去式是 did。' },
          { id: 'g7', tag: '文法選擇', prompt: 'What time did he ___ lunch?', options: ['has', 'have', 'had'], answer: 1, explain: 'did 後面的動詞用原形 have。' },
          { id: 'o1', kind: 'order', tag: '句子重組', answer: 'What did you do yesterday?', zh: '你昨天做了什麼？', ctx: 'A: ＿＿＿\nB: I watched a movie with my dad.' },
          { id: 'o2', kind: 'order', tag: '句子重組', answer: 'I cleaned the room last night.', zh: '我昨晚打掃了房間。', ctx: 'A: What did you do last night?\nB: ＿＿＿' },
          { id: 'o3', kind: 'order', tag: '句子重組', answer: 'What time did you have lunch?', zh: '你幾點吃午餐？', ctx: 'A: ＿＿＿\nB: I had lunch at twelve thirty.' },
          { id: 'o4', kind: 'order', tag: '句子重組', answer: 'She went shopping at three.', zh: '她三點去逛街。', ctx: 'A: What time did Mia go shopping?\nB: ＿＿＿' },
          { id: 's1', kind: 'spell', tag: '聽寫拼字', word: 'cooked', pic: '🍳', zh: '煮（過去式）', show: 'c _ _ k _ d', skills: ['vocab'] },
          { id: 's2', kind: 'spell', tag: '聽寫拼字', word: 'visited', pic: '👵', zh: '拜訪（過去式）', show: 'v _ s _ t _ d', skills: ['vocab'] },
          { id: 's3', kind: 'spell', tag: '聽寫拼字', word: 'watched', pic: '🎬', zh: '看（過去式）', show: 'w _ t c h _ d', skills: ['vocab'] },
          { id: 's4', kind: 'spell', tag: '聽寫拼字', word: 'dishes', pic: '🍽️', zh: '碗盤', show: 'd _ s h _ s', skills: ['vocab'] },
          { id: 's5', kind: 'spell', tag: '聽寫拼字', word: 'laundry', pic: '🧺', zh: '要洗的衣服', show: 'l _ _ n d r y', skills: ['vocab'] }
        ]
      },
      {
        id: 'read', kind: 'choice', title: 'Reading', zh: '閱讀理解', minutes: 8,
        skills: ['reading'],
        intro: "Read Leo's diary. Then answer the questions.",
        items: [
          { id: 'r1', tag: '閱讀理解', passage: 'leo', prompt: 'What did Leo do after breakfast?', options: ['He walked the dog.', 'He went shopping.', 'He played the recorder.'], answer: 0 },
          { id: 'r2', tag: '閱讀理解', passage: 'leo', prompt: 'What time did Leo and his mom go shopping?', options: ['At seven.', 'At ten.', 'At six thirty.'], answer: 1 },
          { id: 'r3', tag: '閱讀理解', passage: 'leo', prompt: 'Did Leo watch TV in the afternoon?', options: ['Yes, he did.', "No, he doesn't.", "No, he didn't."], answer: 2 },
          { id: 'r4', tag: '閱讀理解', passage: 'leo', prompt: 'Who cooked dinner?', options: ['Leo.', "Leo's dad.", "Leo's mom."], answer: 1 }
        ]
      }
    ],
    passages: {
      leo: "Hi, I'm Leo. Last Saturday was a busy day. I had breakfast with my family at seven. After breakfast, I walked the dog in the park. At ten, Mom and I went shopping. We had lunch at a noodle shop. In the afternoon, I didn't watch TV. I cleaned my room and did the laundry. At six thirty, Dad cooked dinner for us. After dinner, I played the recorder. It was a great day!"
    },
    materials: [
      { id: 'knsh', kind: '其他', title: '康軒數位高手（WW9 電子書）', url: 'https://digitalmaster.knsh.com.tw/', note: '老師帳號登入後，電子書 → 英語 WW9，對照課本頁碼。' },
      { id: 'tcool', kind: '學習單', title: 'tcool 題庫網：六上康軒英語・期中考（第一次段考）', url: 'https://www.tcool.cc/mock/-12/', note: '各校考古題的線上刷題。第一次打開會有「確認不是機器人」的驗證。' }
    ]
  },

  ww9t2: {
    id: 'ww9t2', zone: 'castle', bankId: 'kh6a-2',
    title: 'Test 2 Review', zh: 'WW9・第二次段考：Unit 3–4',
    level: '康軒 Wonder World 9・六上', minutes: 75,
    format: '段考複習課（口說＋段考題型）',
    audience: '六年級，程度普通，在補學校進度、為國中打底。',
    scope: [
      "Unit 3 Amy's Graduation Trip（課本 p.35–46）：7 個地方（beach、forest、island、lake、mountain、river、hot spring）、Where did you go …? Did you go to …?",
      'Unit 4 A Small World（p.47–58）：4 個地點、3 個位置詞（next to、across from、between）、Where is the …? Is the … next to …?',
      'Review 2（p.59–62）',
      '發音：y 的三種唸法、al、au、aw'
    ],
    goals: [
      '說出 14 個課本單字和片語，並用它們造句',
      '用 Where did you go last weekend? 說去了哪裡',
      "用 Did you go to …? 問答，回答 Yes, I did. / No, I didn't.",
      '用 next to、across from、between 說地點在哪裡',
      '分清楚 go / went、in the forest / on Park Street、between … and …',
      '熟悉段考的聽力、選擇、重組、拼字、閱讀題'
    ],
    assess: '口說題由電腦聽寫、給建議分數，老師可以改。選擇、重組、拼字題電腦直接改：第一次就對 3 顆糖，第二次對 2 顆，之後才對 1 顆。',
    aiPoint: "語音辨識檢查句型有沒有說完整，例如 went to、it's between … and …。答錯幾次都會記下來，下課報告列出要加強的題型。",
    ranks: [[90, 'Castle Champion 城堡冠軍'], [75, 'Brave Knight 勇敢騎士'], [60, 'Castle Guard 城堡守衛'], [0, 'Young Squire 見習騎士，繼續加油']],
    stages: [
      {
        id: 'words', kind: 'word', title: 'Word Check', zh: '單字口說', minutes: 15,
        skills: ['vocab', 'pron'],
        intro: 'Say the word. Then make a sentence with it.',
        items: [
          { id: 'beach', word: 'beach', pic: '🏖️', pos: 'noun', zh: '海灘', def: 'Land with sand next to the sea.', ex: 'We went to the beach last Saturday.' },
          { id: 'forest', word: 'forest', pic: '🌲', pos: 'noun', zh: '森林', def: 'A big place with a lot of trees.', ex: 'Amy went hiking in the forest.' },
          { id: 'island', word: 'island', pic: '🏝️', pos: 'noun', zh: '島', def: 'Land with water all around it.', ex: 'Did you go to the island by boat?' },
          { id: 'lake', word: 'lake', pic: '🛶', pos: 'noun', zh: '湖', def: 'A lot of water with land all around it.', ex: 'We went biking around the lake.' },
          { id: 'mountain', word: 'mountain', pic: '⛰️', pos: 'noun', zh: '山', def: 'A very high hill. It is hard to walk to the top.', ex: 'My dad and I went to the mountain last weekend.' },
          { id: 'river', word: 'river', pic: '🏞️', pos: 'noun', zh: '河', def: 'Long water that moves across the land to the sea.', ex: 'We went camping by the river.' },
          { id: 'hotspring', word: 'hot spring', alt: ['hot springs'], pic: '♨️', pos: 'noun', zh: '溫泉', def: 'Hot water that comes out of the ground.', ex: 'Grandpa went to the hot spring yesterday.' },
          { id: 'store', word: 'convenience store', alt: ['convenience stores'], pic: '🏪', pos: 'noun', zh: '便利商店', def: 'A small store. It is open twenty-four hours a day.', ex: 'The convenience store is next to my school.' },
          { id: 'mrt', word: 'MRT station', alt: ['mrt', 'm r t station', 'metro station', 'mrt stations'], pic: '🚇', pos: 'noun', zh: '捷運站', def: 'A place where you get on and off the MRT train.', ex: "Let's meet at the MRT station." },
          { id: 'museum', word: 'science museum', alt: ['museum', 'science museums'], pic: '🦖', pos: 'noun', zh: '科學博物館', def: 'A place where you learn about dinosaurs, space, and robots.', ex: 'The science museum is across from the park.' },
          { id: 'tea', word: 'tea shop', alt: ['tea shops', 'teashop'], pic: '🧋', pos: 'noun', zh: '飲料店', def: 'A shop that sells bubble tea and other drinks.', ex: 'Is the tea shop next to the bakery?' },
          { id: 'across', word: 'across from', pic: '↔️', pos: 'phrase', zh: '在…的對面', def: 'On the other side of the street.', ex: 'The library is across from the park.' },
          { id: 'between', word: 'between', pic: '🏠🏪🏠', pos: 'preposition', zh: '在…的中間', def: 'In the middle of two things.', ex: 'The tea shop is between the bakery and the bookstore.' },
          { id: 'next', word: 'next to', pic: '👫', pos: 'phrase', zh: '在…的旁邊', def: 'Very close, right beside something.', ex: 'The MRT station is next to the convenience store.' }
        ]
      },
      {
        id: 'talk', kind: 'question', title: 'Sentence Talk', zh: '句型問答', minutes: 15,
        skills: ['grammar', 'fluency'],
        intro: 'Read the card. Answer in a full sentence.',
        items: [
          { id: 't1', pic: '🧳', prompt: 'Where did you go last weekend?', hint: 'I went to … last weekend.',
            follow: '可以追問：What did you do there?',
            expect: { minWords: 4, groups: [{ any: ['i went'], exact: true, miss: '用 I went to … 回答' }],
              avoid: [{ any: ['i go to'], tip: 'last weekend 是過去，go 要變 went' }] } },
          { id: 't2', pic: '👧', ctx: 'Lucy: I went to the beach last Sunday.', prompt: 'Where did Lucy go last Sunday?', hint: 'She went to …',
            follow: 'Lucy 是女生，用 she；過去的事用 went。',
            expect: { minWords: 5, groups: [{ any: ['she went'], exact: true, miss: '說 She went to …' }, { any: ['beach'], miss: '說出 the beach' }],
              avoid: [{ any: ['he went'], tip: 'Lucy 是女生，要用 she' }, { any: ['she go to', 'she goes to'], tip: '過去的事，go 要變 went' }] } },
          { id: 't3', pic: '👦', ctx: "Max: I didn't go to the lake. I went to the river.", prompt: 'Did Max go to the lake?', hint: "No, he didn't. He went to …",
            follow: "完整答法：No, he didn't. He went to the river.",
            expect: { minWords: 7, groups: [{ any: ['no'], miss: '先回答 No' }, { any: ['he didnt', 'he did not'], miss: "說 he didn't" }, { any: ['river'], miss: '說出 Max 去了哪裡：the river' }],
              avoid: [{ any: ['he doesnt', 'he dont'], tip: "Did 問，要用 didn't 回答" }] } },
          { id: 't4', pic: '👦👧', ctx: 'Ben and Amy: We went hiking in the forest yesterday.', prompt: 'Did Ben and Amy go to the forest yesterday?', hint: 'Yes, they …',
            follow: '簡答：Yes, they did.',
            expect: { minWords: 3, groups: [{ any: ['yes'], miss: '回答 Yes' }, { any: ['they did'], miss: '兩個人用 they did' }] } },
          { id: 't5', pic: '🗺️', ctx: 'Park Street, from left to right:\n🏪 convenience store, 🚇 MRT station, 🧋 tea shop', prompt: 'Where is the MRT station?', hint: "It's between the … and the …",
            follow: "完整答法：It's between the convenience store and the tea shop.",
            expect: { minWords: 7, groups: [{ any: ['its between', 'it is between'], miss: "用 It's between … 回答" }, { any: ['convenience store'], miss: '說出 convenience store' }, { any: ['tea shop'], miss: '說出 tea shop' }] } },
          { id: 't6', pic: '🗺️', ctx: 'Park Street, from left to right:\n🏪 convenience store, 🚇 MRT station, 🧋 tea shop', prompt: 'Is the tea shop next to the convenience store?', hint: "No, it's not. It's next to the …",
            follow: "完整答法：No, it's not. It's next to the MRT station.",
            expect: { minWords: 7, groups: [{ any: ['no'], miss: '先回答 No' }, { any: ['its not', 'it is not', 'it isnt'], miss: "說 it's not" }, { any: ['mrt station', 'station'], miss: '說出旁邊是 MRT station' }] } },
          { id: 't7', pic: '🗺️', ctx: '📚 library\n━━━ Green Street ━━━\n🦖 science museum', prompt: 'Where is the library?', hint: "It's across from the …",
            follow: '在馬路對面，用 across from。',
            expect: { minWords: 5, groups: [{ any: ['across from'], miss: '用 across from 回答' }, { any: ['science museum', 'museum'], miss: '說出 science museum' }] } },
          { id: 't8', pic: '🧋', ctx: 'Lily: My favorite tea shop is on Happy Street.', prompt: 'Where is the tea shop?', hint: "It's on …",
            follow: '在某條街上，用 on。',
            expect: { minWords: 4, groups: [{ any: ['its on', 'it is on'], miss: "用 It's on … 回答" }, { any: ['happy street'], miss: '說出 Happy Street' }] } },
          { id: 't9', pic: '🏫', prompt: 'What is next to your school?', hint: 'The … is next to my school.',
            follow: '追問：What is across from your school?',
            expect: { minWords: 5, groups: [{ any: ['next to'], miss: '用 next to 說' }] } },
          { id: 't10', pic: '🧳', prompt: 'Tell me about a trip. Where did you go? What did you do there?',
            hint: 'Last …, I went to … I … there. It was …',
            follow: '進階題：說去哪裡、做了什麼，用過去式。',
            expect: { minWords: 12, past: true, groups: [{ any: ['went to'], miss: '說你去了哪裡：I went to …' }] } }
        ]
      },
      {
        id: 'role', kind: 'dialogue', title: 'Role Play', zh: '情境對話', minutes: 10,
        skills: ['fluency', 'pron'],
        intro: 'The teacher plays the other person. You answer.',
        items: [
          { id: 'uncle', who: 'Uncle Sam', voice: 'uncle', pic: '📱', mood: '住在美國的 Uncle Sam 打視訊電話。你週六去湖邊騎腳踏車；週日沒有去海邊，去了溫泉。',
            lines: [
              { s: 'n', t: 'Hi there! Where did you go last weekend?' },
              { s: 's', t: 'I went to the lake last Saturday.', expect: [['went to'], ['lake']] },
              { s: 'n', t: 'That sounds fun. What did you do there?' },
              { s: 's', t: 'I went biking around the lake.', expect: [['went biking', 'biking'], ['lake']] },
              { s: 'n', t: 'Cool! Did you go to the beach on Sunday?' },
              { s: 's', t: "No, I didn't. I went to the hot spring.", expect: [['no'], ['i didnt', 'i did not'], ['hot spring']] },
              { s: 'n', t: 'Lucky you! I miss Taiwan.' }
            ] },
          { id: 'tourist', who: 'A Tourist', voice: 'tourist', pic: '🧭', mood: '你在 Green Street。這一邊從左到右是 convenience store、MRT station、tea shop；對面是 science museum。外國遊客來問路。',
            lines: [
              { s: 'n', t: 'Excuse me. Where is the MRT station?' },
              { s: 's', t: "It's on Green Street.", expect: [['its on', 'it is on'], ['green street']] },
              { s: 'n', t: 'Is it next to the science museum?' },
              { s: 's', t: "No, it's not. It's across from the science museum.", expect: [['no'], ['its not', 'it is not', 'it isnt'], ['across from']] },
              { s: 'n', t: 'I see. Is it between the convenience store and the tea shop?' },
              { s: 's', t: 'Yes, it is.', expect: [['yes'], ['it is']] },
              { s: 'n', t: 'Thank you so much!' },
              { s: 's', t: "You're welcome.", expect: [['welcome']] }
            ] }
        ]
      },
      {
        id: 'listen', kind: 'choice', title: 'Listening', zh: '聽力題', minutes: 10,
        skills: ['listening'],
        intro: 'Press the play button. Listen and choose.',
        items: [
          { id: 'l1', tag: '聽音辨字', audio: 'yard', prompt: 'Which word has the same y sound?', options: ['yellow', 'sky', 'baby'], answer: 0, explain: 'y 在字的前面，唸起來跟 yellow、yes 一樣。' },
          { id: 'l2', tag: '聽音辨字', audio: 'fly', prompt: 'Which word has the same y sound?', options: ['yellow', 'sky', 'baby'], answer: 1, explain: 'fly 的 y 跟 sky、my 一樣。' },
          { id: 'l3', tag: '聽音辨字', audio: 'puppy', prompt: 'Which word has the same y sound?', options: ['yellow', 'sky', 'baby'], answer: 2, explain: 'puppy 的 y 跟 baby、sunny 一樣。' },
          { id: 'l4', tag: '聽音辨字', audio: 'chalk', show: 'ch _ _ k', prompt: 'Which letters are missing?', options: ['ar', 'al', 'oa'], answer: 1, explain: 'chalk 的 al 跟 talk、walk 一樣。' },
          { id: 'l5', tag: '聽音辨字', audio: 'draw', show: 'dr _ _', prompt: 'Which letters are missing?', options: ['aw', 'ay', 'ow'], answer: 0, explain: 'draw 的 aw 跟 lawn、saw 一樣。' },
          { id: 'l6', tag: '聽句子', audio: 'We went to the island last Friday.', prompt: 'Where did they go last Friday?', options: ['⛰️ the mountain', '🏖️ the beach', '🏝️ the island'], answer: 2 },
          { id: 'l7', tag: '聽句子', audio: 'The bakery is next to the post office.', prompt: 'Where is the bakery?', options: ['next to the post office', 'across from the post office', 'between the post office and the park'], answer: 0 },
          { id: 'l8', tag: '聽問句選回答', audio: 'Where did you go yesterday?', prompt: 'Choose the best answer.', options: ['Yes, I did.', 'I went to the river.', "It's next to the river."], answer: 1 },
          { id: 'l9', tag: '聽問句選回答', audio: 'Is the library across from the park?', prompt: 'Choose the best answer.', options: ['Yes, it is.', 'Yes, I did.', 'I went to the park.'], answer: 0, explain: 'Is 開頭的問句，用 it is / it\'s not 回答。' },
          { id: 'l10', tag: '聽問句選回答', audio: 'Did you go to the hot spring last week?', prompt: 'Choose the best answer.', options: ["No, it's not.", 'I go there every week.', "No, I didn't."], answer: 2 }
        ]
      },
      {
        id: 'exam', kind: 'choice', title: 'Test Practice', zh: '段考題型', minutes: 15,
        skills: ['grammar'],
        intro: 'Choose, build, or spell. Just like the school test!',
        items: [
          { id: 'g1', tag: '文法選擇', prompt: 'Where ___ you go last weekend?', options: ['do', 'did', 'are'], answer: 1, explain: 'last weekend 是過去，用 did。' },
          { id: 'g2', tag: '文法選擇', prompt: 'I ___ to the forest yesterday.', options: ['go', 'goes', 'went'], answer: 2, explain: 'yesterday 是過去，go 要變 went。' },
          { id: 'g3', tag: '文法選擇', prompt: 'Did they go to the beach? Yes, they ___.', options: ['did', 'do', 'are'], answer: 0, explain: 'Did 問，就用 did 答。' },
          { id: 'g4', tag: '文法選擇', prompt: 'The tea shop is ___ the bakery and the bookstore.', options: ['next to', 'between', 'across from'], answer: 1, explain: 'between A and B：在 A 和 B 的中間。' },
          { id: 'g5', tag: '文法選擇', prompt: 'The park is across ___ the library.', options: ['to', 'of', 'from'], answer: 2, explain: '對面是 across from。' },
          { id: 'g6', tag: '文法選擇', prompt: 'The MRT station is ___ Park Street.', options: ['on', 'in', 'at'], answer: 0, explain: '在某條街上，用 on。' },
          { id: 'g7', tag: '文法選擇', prompt: 'Is the hospital next to the school? No, it ___.', options: ["didn't", "isn't", "doesn't"], answer: 1, explain: "Is 問，就用 it isn't / it's not 答。" },
          { id: 'o1', kind: 'order', tag: '句子重組', answer: 'Where did you go last Sunday?', zh: '你上星期日去了哪裡？', ctx: 'A: ＿＿＿\nB: I went to the mountain with my dad.' },
          { id: 'o2', kind: 'order', tag: '句子重組', answer: 'I went to the hot spring.', zh: '我去了溫泉。', ctx: 'A: Where did you go yesterday?\nB: ＿＿＿ The water was very warm.' },
          { id: 'o3', kind: 'order', tag: '句子重組', answer: 'Is the bakery next to the bookstore?', zh: '麵包店在書店旁邊嗎？', ctx: "A: ＿＿＿\nB: Yes, it is. They are on Pink Street." },
          { id: 'o4', kind: 'order', tag: '句子重組', answer: "It's across from the park.", zh: '它在公園對面。', ctx: 'A: Where is the library?\nB: ＿＿＿' },
          { id: 's1', kind: 'spell', tag: '聽寫拼字', word: 'beach', pic: '🏖️', zh: '海灘', show: 'b _ _ c h', skills: ['vocab'] },
          { id: 's2', kind: 'spell', tag: '聽寫拼字', word: 'forest', pic: '🌲', zh: '森林', show: 'f _ r _ s t', skills: ['vocab'] },
          { id: 's3', kind: 'spell', tag: '聽寫拼字', word: 'river', pic: '🏞️', zh: '河', show: 'r _ v _ r', skills: ['vocab'] },
          { id: 's4', kind: 'spell', tag: '聽寫拼字', word: 'station', pic: '🚇', zh: '車站', show: 's t _ t _ _ n', skills: ['vocab'] },
          { id: 's5', kind: 'spell', tag: '聽寫拼字', word: 'between', pic: '🏠🏪🏠', zh: '在…中間', show: 'b _ t w _ _ n', skills: ['vocab'] }
        ]
      },
      {
        id: 'read', kind: 'choice', title: 'Reading', zh: '閱讀理解', minutes: 8,
        skills: ['reading'],
        intro: "Read Nora's post. Then answer the questions.",
        items: [
          { id: 'r1', tag: '閱讀理解', passage: 'nora', prompt: "Where did Nora's family go hiking?", options: ['On the island.', 'In the forest.', 'By the lake.'], answer: 1 },
          { id: 'r2', tag: '閱讀理解', passage: 'nora', prompt: 'Did they go to the beach on Sunday?', options: ['Yes, they did.', "No, it's not.", "No, they didn't."], answer: 2 },
          { id: 'r3', tag: '閱讀理解', passage: 'nora', prompt: "Why didn't they go to the beach on Sunday?", options: ['It was rainy.', 'It was hot.', 'They were tired.'], answer: 0 },
          { id: 'r4', tag: '閱讀理解', passage: 'nora', prompt: 'Where is the science museum?', options: ['Next to the beach.', 'Between the forest and the river.', 'Across from their hotel.'], answer: 2 }
        ]
      }
    ],
    passages: {
      nora: "Hi, I'm Nora. Last weekend, my family and I went on a trip. On Saturday, we went hiking in the forest. The trees were tall and green. We had lunch by the river. At night, we went to a hot spring. The water was very hot! On Sunday, it was rainy, so we didn't go to the beach. We went to the science museum. It's across from our hotel. I saw a big dinosaur there. It was a great trip!"
    },
    materials: [
      { id: 'knsh', kind: '其他', title: '康軒數位高手（WW9 電子書）', url: 'https://digitalmaster.knsh.com.tw/', note: '老師帳號登入後，電子書 → 英語 WW9，對照課本頁碼。' },
      { id: 'tcool', kind: '學習單', title: 'tcool 題庫網：六上康軒英語・期末考（第二次段考）', url: 'https://www.tcool.cc/mock/-615/', note: '各校考古題的線上刷題。第一次打開會有「確認不是機器人」的驗證。' }
    ]
  },

  /* ==========================================================
     這段在做什麼：英檢山・Cambridge A2 Flyers 口說模擬（自命題）
     照官方四大題型：Part 1 找不同（1 個例子＋6 個不同）、Part 2 資訊交換（老師問 5 題、學生問 5 題）、
     Part 3 看圖說故事（5 張圖，老師說第 1 張）、Part 4 個人問答（5 題）。
     題目和圖都是自己出的，沒有用劍橋的考古題。voice 是唸題目的聲音（英國腔考官）。
     ========================================================== */
  flyers1: {
    id: 'flyers1', zone: 'exam', voice: 'examiner',
    title: 'Flyers Speaking 1', zh: '劍橋 Flyers 口說模擬・第 1 回',
    level: 'CEFR A2・Cambridge A2 Flyers', minutes: 40,
    format: 'Flyers 口說四大題型（自命題）',
    audience: '程度好，有上吉的堡；目標增能和超前。',
    scopeTitle: '官方題型（正式考試 7–9 分鐘，一對一）',
    scope: [
      'Part 1 找不同：老師（考官）說自己的圖，學生說自己的圖哪裡不一樣。1 個例子＋6 個不同',
      'Part 2 資訊交換：老師看學生的資訊卡問 5 題；學生看提示字問老師 5 題',
      'Part 3 看圖說故事：5 張圖，老師說第 1 張，學生接著說第 2–5 張',
      'Part 4 個人問答：5 題，最後一題是 Tell me about …',
      '評分三項：字彙文法、發音、互動（各 5 分，換成最多 5 個盾牌）'
    ],
    goals: [
      '用 In my picture, … 說出兩張圖的 6 個不同（數量、顏色、位置、動作、外表、大小）',
      '看資訊卡用短句回答，再看提示字自己問出 5 個問題（Where did …? Was it … or …?）',
      '看 5 張圖用過去式說完一個故事',
      '個人問答每題多說一句理由或細節'
    ],
    assess: '學生按麥克風說話，電腦聽寫並給建議分數，老師可以改。每題 1–3 顆糖，下課自動算出能力分數。對應 Flyers 的評分：字彙文法、發音、互動。',
    aiPoint: '語音辨識檢查學生有沒有用對句型（In my picture、did 問句、過去式）。下課後一鍵複製報告給 Claude，寫出家長評語和下次要練的題型。',
    ranks: [[90, 'Flyers Ace 五個盾牌'], [75, 'Sky Pilot 四個盾牌'], [60, 'Cloud Climber 三個盾牌'], [0, 'Young Flyer 小飛行員，繼續加油']],
    stages: [
      {
        id: 'diff', kind: 'question', title: 'Find the Differences', zh: 'Part 1 找不同', minutes: 8,
        skills: ['vocab', 'grammar'],
        intro: "Here are two pictures. They are different. I'll tell you about my picture. You tell me about your picture.",
        diff: {
          candidate: { label: '你的圖：公園。陰天、樹上兩隻鳥、男孩踢足球、貓在椅子上、黃色的花、沒有鬍子的男生在看報紙、女孩拿大冰淇淋',
            items: [['☁️', 14, 14, 'l'], ['☁️', 30, 9, 'm'], ['🌳', 84, 46, 'xl'], ['🐦', 79, 36, 's'], ['🐦', 89, 40, 's'],
              ['👦', 40, 70, 'l'], ['⚽', 47, 85, 'm'], ['🪑', 71, 76, 'l'], ['🐈', 71, 63, 's'],
              ['🌻', 6, 88, 's'], ['🌻', 13, 92, 's'], ['🌻', 20, 88, 's'], ['👨', 24, 68, 'l'], ['📰', 30, 75, 's'], ['👧', 55, 70, 'l'], ['🍦', 60.5, 72, 'l']] },
          examiner: { label: '老師的圖：公園。晴天、樹上三隻鳥、男孩放風箏、貓在椅子下、紅色的花、有鬍子的男生在看報紙、女孩拿小冰淇淋',
            items: [['☀️', 14, 14, 'l'], ['🌳', 84, 46, 'xl'], ['🐦', 78, 36, 's'], ['🐦', 85, 31, 's'], ['🐦', 91, 40, 's'],
              ['👦', 40, 70, 'l'], ['🪁', 47, 24, 'l'], ['🪑', 71, 76, 'l'], ['🐈', 71, 84, 's'],
              ['🌹', 6, 88, 's'], ['🌹', 13, 92, 's'], ['🌹', 20, 88, 's'], ['🧔', 24, 68, 'l'], ['📰', 30, 75, 's'], ['👧', 55, 70, 'l'], ['🍦', 59.5, 75, 's']] }
        },
        items: [
          { id: 'd0', prompt: "For example, in my picture, it's sunny. Now you. What's the weather like in your picture?",
            hint: "In my picture, it's cloudy.",
            follow: '這是例子。正式考試由考官示範，學生跟著說一次就好。',
            expect: { minWords: 4, groups: [{ any: ['in my picture'], miss: '用 In my picture, … 開頭' }, { any: ['cloudy', 'clouds', 'cloud'], miss: '看你的圖：天氣怎麼樣？' }] } },
          { id: 'd1', prompt: 'In my picture, there are three birds in the tree.',
            hint: 'In my picture, there are … birds.',
            follow: '差在數量。追問：How many birds can you see?',
            expect: { minWords: 5, groups: [{ any: ['in my picture'], miss: '用 In my picture, … 開頭' }, { any: ['two'], miss: '數數看你的圖有幾隻鳥' }, { any: ['bird', 'birds'], miss: '說出 birds' }] } },
          { id: 'd2', prompt: 'In my picture, a boy is flying a kite.',
            hint: 'In my picture, the boy is …ing …',
            follow: '差在動作。要用現在進行式 is playing。',
            expect: { minWords: 5, groups: [{ any: ['in my picture'], miss: '用 In my picture, … 開頭' }, { any: ['football', 'soccer', 'ball'], miss: '你的圖裡男孩在玩什麼？' }, { any: ['is playing', 'is kicking', 'playing', 'kicking'], miss: '用 is playing … 說他在做什麼' }] } },
          { id: 'd3', prompt: 'In my picture, the cat is under the chair.',
            hint: 'In my picture, the cat is … the chair.',
            follow: '差在位置：under / on / next to / behind。',
            expect: { minWords: 5, groups: [{ any: ['in my picture'], miss: '用 In my picture, … 開頭' }, { any: ['on the chair', 'is on', 'on it', 'sitting on'], miss: '你的圖裡貓在椅子的哪裡？' }] } },
          { id: 'd4', prompt: 'In my picture, the flowers are red.',
            hint: 'In my picture, the flowers are …',
            follow: '差在顏色。說成 sunflowers 也可以。',
            expect: { minWords: 5, groups: [{ any: ['in my picture'], miss: '用 In my picture, … 開頭' }, { any: ['yellow', 'sunflower', 'sunflowers'], miss: '你的圖裡花是什麼顏色？' }] } },
          { id: 'd5', prompt: 'In my picture, the man with the newspaper has got a beard.',
            hint: "In my picture, the man hasn't got a beard.",
            follow: "差在外表。hasn't got、doesn't have、has no beard 都可以。",
            expect: { minWords: 5, groups: [{ any: ['in my picture'], miss: '用 In my picture, … 開頭' }, { any: ['hasnt got', 'has not got', 'doesnt have', 'does not have', 'no beard', 'hasnt', 'doesnt'], miss: "你的圖裡他有沒有鬍子？用 hasn't got 說" }] } },
          { id: 'd6', prompt: 'In my picture, the girl has got a small ice cream.',
            hint: "In my picture, the girl's ice cream is …",
            follow: '差在大小。big、large、huge 都可以。',
            expect: { minWords: 5, groups: [{ any: ['in my picture'], miss: '用 In my picture, … 開頭' }, { any: ['big', 'large', 'huge'], miss: '你的圖裡冰淇淋是大的還是小的？' }] } }
        ]
      },
      {
        id: 'info', kind: 'question', title: 'Information Exchange', zh: 'Part 2 資訊交換', minutes: 8,
        skills: ['grammar', 'fluency'],
        intro: "Ben and Lily went on school trips. First, I'll ask you about Ben. Then you ask me about Lily.",
        cards: {
          mine: { pic: '👦', title: "Ben's school trip", rows: [['Where', 'the science museum'], ['When', 'last Friday'], ['How / travel', 'by train'], ['What / see', 'a robot that can dance'], ['Fun or boring', 'fun!']] },
          yours: { pic: '👧', title: "Lily's school trip", ask: true, rows: [['Where / go', 'the zoo'], ['When / go', 'last Wednesday'], ['How / travel', 'by bus'], ['What / see', 'a baby elephant'], ['fun / boring', 'fun']] }
        },
        items: [
          { id: 'b1', card: 'mine', row: 0, prompt: "I don't know anything about Ben's school trip, so I'm going to ask you some questions. Where did Ben go?",
            hint: 'He went to …', follow: '看卡片回答，短句也可以：The science museum.',
            expect: { minWords: 2, groups: [{ any: ['science museum', 'museum'], miss: '看卡片上 Where 那一行' }] } },
          { id: 'b2', card: 'mine', row: 1, prompt: 'When did he go?',
            hint: 'He went last …', follow: '短答：Last Friday.',
            expect: { minWords: 2, groups: [{ any: ['friday'], miss: '看卡片上 When 那一行' }] } },
          { id: 'b3', card: 'mine', row: 2, prompt: 'How did he travel there?',
            hint: 'He went by …', follow: '短答：By train.',
            expect: { minWords: 2, groups: [{ any: ['train'], miss: '看卡片上 How 那一行' }] } },
          { id: 'b4', card: 'mine', row: 3, prompt: 'What did he see?',
            hint: 'He saw a …', follow: '完整答法：He saw a robot that can dance.',
            expect: { minWords: 3, groups: [{ any: ['robot'], miss: '看卡片上 What / see 那一行' }, { any: ['dance', 'dancing'], miss: '說出機器人會做什麼' }] } },
          { id: 'b5', card: 'mine', row: 4, prompt: 'Was the trip fun or boring?',
            hint: 'It was …', follow: '可以多說一句：He loved it!',
            expect: { minWords: 2, groups: [{ any: ['fun'], miss: '看卡片最後一行' }] } },
          { id: 'l1', card: 'yours', row: 0, prompt: "Lily went on a school trip too. You don't know anything about her trip, so you ask me some questions.",
            hint: 'Where did Lily go?', follow: '學生要自己問。考官的回答會在說完後出現。',
            reply: 'She went to the zoo.',
            expect: { minWords: 3, groups: [{ any: ['where'], miss: '用 Where 開頭問' }, { any: ['did she go', 'did lily go', 'did she visit', 'did lily visit'], miss: '問過去的事：Where did she go?' }] } },
          { id: 'l2', card: 'yours', row: 1, prompt: 'Ask me the next question.',
            hint: 'When did she go?', reply: 'She went last Wednesday.',
            expect: { minWords: 3, groups: [{ any: ['when', 'what day'], miss: '用 When 開頭問' }, { any: ['did she go', 'did lily go', 'was it', 'was the trip'], miss: '問過去的事：When did she go?' }] } },
          { id: 'l3', card: 'yours', row: 2, prompt: 'And the next one.',
            hint: 'How did she travel?', reply: 'She went by bus.',
            expect: { minWords: 3, groups: [{ any: ['how'], miss: '用 How 開頭問' }, { any: ['did she travel', 'did lily travel', 'did she go', 'did lily go', 'did she get'], miss: '問過去的事：How did she travel?' }] } },
          { id: 'l4', card: 'yours', row: 3, prompt: 'Ask me about what she saw.',
            hint: 'What did she see?', reply: 'She saw a baby elephant!',
            expect: { minWords: 3, groups: [{ any: ['what'], miss: '用 What 開頭問' }, { any: ['did she see', 'did lily see'], miss: '問過去的事：What did she see?' }] } },
          { id: 'l5', card: 'yours', row: 4, prompt: 'Ask me one more question.',
            hint: 'Was it fun or boring?', reply: 'It was fun. Lily loved it!',
            follow: '這是「A 還是 B」的問句，語調先上揚再下降。',
            expect: { minWords: 3, groups: [{ any: ['was it', 'was the trip', 'was her trip', 'was lilys trip'], miss: '用 Was it … ? 問' }, { any: ['fun or boring', 'boring or fun'], miss: '把兩個選擇都問出來：fun or boring' }] } }
        ]
      },
      {
        id: 'story', kind: 'panel', title: 'Picture Story', zh: 'Part 3 看圖說故事', minutes: 10,
        skills: ['vocab', 'grammar', 'fluency'], storyTitle: 'The Hungry Duck',
        intro: 'These pictures tell a story. Look at the pictures first. I will tell you about picture 1. Then you tell the story.',
        lead: { scene: '🧺 ☀️ 👧 👨 🌳', text: "This story is called 'The Hungry Duck'. Last Saturday, Emma and her dad went to the park for a picnic. The sun was shining and they were very happy." },
        items: [
          { id: 'p2', scene: '🧺 🥪 🍎 🦆', prompt: 'What happened next?',
            keywords: ['opened', 'basket', 'ate', 'sandwiches', 'duck', 'came', 'walked', 'lake'],
            model: 'They opened the basket and ate some sandwiches. Then a big duck came out of the lake and walked to them.' },
          { id: 'p3', scene: '🦆 🥪 💨 😮', prompt: 'What did the duck do?',
            keywords: ['suddenly', 'took', 'sandwich', 'ran away', 'flew', 'surprised', 'laughed'],
            model: "Suddenly, the duck took Emma's sandwich and ran away! Emma was very surprised." },
          { id: 'p4', scene: '🌧️ 🌳 🏃‍♀️ 🏃‍♂️', prompt: 'What happened to the weather?',
            keywords: ['started', 'rain', 'raining', 'ran', 'under', 'tree', 'got wet', 'cloudy'],
            model: 'Then it started to rain. Emma and her dad ran under a big tree, but they got wet.' },
          { id: 'p5', scene: '🏠 🧺 😄 🛋️', prompt: 'How did the story end?',
            keywords: ['went home', 'had', 'picnic', 'living room', 'floor', 'laughed', 'happy', 'in the end'],
            model: 'In the end, they went home and had their picnic on the living room floor. They laughed about the hungry duck.' }
        ]
      },
      {
        id: 'talk', kind: 'question', title: 'Personal Questions', zh: 'Part 4 個人問答', minutes: 8,
        skills: ['fluency', 'ideas', 'pron'],
        intro: "Now let's talk about your weekends. Answer and say a little more.",
        items: [
          { id: 'q1', pic: '🗓️', prompt: 'What do you usually do on Saturday mornings?',
            hint: 'On Saturday mornings, I usually …', follow: '追問：What time do you get up on Saturdays?',
            expect: { minWords: 6, keywords: ['usually', 'play', 'watch', 'read', 'sleep', 'swim', 'visit', 'help', 'go', 'have', 'study', 'practise', 'practice'], needHits: 1 } },
          { id: 'q2', pic: '👨‍👩‍👧‍👦', prompt: 'Who do you spend your weekends with?',
            hint: 'I spend my weekends with my …', follow: '追問：What do you like doing together?',
            expect: { minWords: 5, keywords: ['family', 'mom', 'mum', 'dad', 'parents', 'brother', 'sister', 'grandma', 'grandpa', 'friends', 'cousin', 'twin'], needHits: 1 } },
          { id: 'q3', pic: '⏪', prompt: 'What did you do last weekend?',
            hint: 'Last weekend, I went / played / watched …', follow: '鼓勵說兩件事，都用過去式。',
            expect: { minWords: 8, past: true } },
          { id: 'q4', pic: '🌳🏠', prompt: 'Do you like going to the park or staying at home? Why?',
            hint: 'I like … because …', follow: '要說原因：because …',
            expect: { minWords: 8, because: true, keywords: ['park', 'home', 'outside', 'inside'], needHits: 1 } },
          { id: 'q5', pic: '⭐', prompt: 'Tell me about your favourite weekend activity.',
            hint: 'My favourite weekend activity is … I usually do it with … I like it because …',
            follow: 'Flyers 最後一題通常是 Tell me about …，鼓勵說三句以上。',
            expect: { minWords: 15, because: true } }
        ]
      }
    ],
    materials: [
      { id: 'cam', kind: '其他', title: 'Cambridge A2 Flyers 官方題型說明', url: 'https://www.cambridgeenglish.org/exams-and-tests/flyers/test-format/', note: '口說四大題型的官方說明。' },
      { id: 'words', kind: '學習單', title: 'Pre A1 Starters、A1 Movers、A2 Flyers 官方字表（PDF）', url: 'https://www.cambridgeenglish.org/Images/wordlists-pre-a1-starters-a1-movers-and-a2-flyers.pdf', note: '出題用的單字範圍。' },
      { id: 'p3', kind: '學習單', title: 'Flyers Speaking Part 3 線上教學說明（Cambridge）', url: 'https://www.cambridgeenglish.org/Images/584860--online-teaching-a2-flyers-speaking-part-3.pdf', note: '官方的看圖說故事教學建議，裡面有樣題，上課前老師看就好。' }
    ]
  }
};

/* 這段在做什麼：島上的區域（open: true 代表已開放） */
const ZONES = [
  { id: 'festival', name: 'Festival Plaza', zh: '節慶廣場', x: 58, y: 51.6, open: true,
    desc: '跟著節日換主題，每個月一檔。這個月是萬聖節。', lessons: ['halloween'],
    plan: ['11 月 Thanksgiving 感恩節', '12 月 Christmas 聖誕節', '1–2 月 Lunar New Year 農曆新年'] },
  { id: 'castle', name: 'Exam Castle', zh: '段考城堡', x: 72, y: 70.2, open: true,
    desc: '康軒 Wonder World 段考複習：課本單字、句型口說、段考題型。一個 Review 是一次段考範圍。六上依學校用 WW7 或 WW9，看學生課本封面的冊次。', lessons: ['ww7t1', 'ww7t2', 'ww9t1', 'ww9t2'],
    plan: ['下學期：五下 Wonder World 8、六下 Wonder World 10', '錯題本：把答錯的題目集中再練一次'] },
  { id: 'speaking', name: 'Speaking Bay', zh: '口說海灣', x: 24, y: 58.1, open: false,
    desc: '日常口說練習。', plan: ['情境角色扮演', 'Show and Tell 上台報告', '看圖說故事題庫'] },
  { id: 'writing', name: 'Writing Woods', zh: '寫作森林', x: 40, y: 32.3, open: false,
    desc: '從句子寫到小短文。', plan: ['句型重組', '看圖寫句子', '五句小短文（說完再寫）'] },
  { id: 'exam', name: 'Exam Peak', zh: '英檢山', x: 70, y: 27.4, open: true,
    desc: '準備英檢：劍橋 Flyers 口說四大題型、全民英檢初級聽力和閱讀。題目都是照官方題型自己出的。', lessons: ['flyers1'], banks: ['gept-e1'],
    plan: ['Flyers 口說第 2 回（換主題：學校、旅行）', 'Flyers 聽力、閱讀與寫作', 'GEPT 初級寫作、口說（複試）'] },
  { id: 'reading', name: 'Reading Lighthouse', zh: '閱讀燈塔', x: 84, y: 59.7, open: false,
    desc: '讀了再說。', plan: ['分級讀本朗讀', '讀後重述', 'Twinkl 閱讀理解學習單'] },
  { id: 'harbor', name: 'Report Harbor', zh: '成績港', x: 42, y: 77.4, open: true,
    desc: '每堂課的報告都停在這裡。', action: 'history' }
];

/* 這段在做什麼：列出所有要預錄的句子和角色。網站播放、錄音程式 tools/make-audio.js 都用這一份 */
/* 聽力題：單一個字用唸單字的聲音，整句用老師的聲音 */
function audioRole(text) { return /\s/.test(text) ? 'teacher' : 'word'; }
/* 英檢聽力：M: / W: 開頭的對話用一男一女兩個聲音（duo）；最後一行 Q: 是題目，用旁白的聲音（narrator）另外錄，播的時候接在後面 */
function audioParts(text) {
  const m = String(text).match(/^([\s\S]*?)\nQ: (.+)$/);
  const main = m ? m[1] : String(text);
  const out = [{ role: /^[MW]: /m.test(main) ? 'duo' : audioRole(main), text: main }];
  if (m) out.push({ role: 'narrator', text: m[2] });
  return out;
}
function speechCatalog() {
  const out = [], seen = new Set();
  const add = (role, text) => { const k = role + '|' + text; if (text && !seen.has(k)) { seen.add(k); out.push({ role, text }); } };
  Object.values(LESSONS).forEach(L => L.stages.forEach(st => {
   const V = L.voice || 'teacher';  // 英檢山用考官的聲音
   if (st.lead) add(V, st.lead.text);
   st.items.forEach(it => {
    const kind = it.kind || st.kind;
    if (kind === 'question' || kind === 'panel') add(V, it.prompt);
    if (kind === 'question' && it.reply) add(V, it.reply);
    if (kind === 'panel') add(V, it.model);
    if (kind === 'word') { add('word', it.word); add('teacher', it.ex); }
    if (kind === 'shadow') add('teacher', it.text);
    if (kind === 'dialogue') it.lines.forEach(l => { if (l.s === 'n') add(it.voice || 'teacher', l.t); });
    if (kind === 'choice' && it.audio) audioParts(it.audio).forEach(p => add(p.role, p.text));
    if (kind === 'order') add('teacher', it.answer);
    if (kind === 'spell' && !it.noAudio) add('word', it.word);
   });
  }));
  // 題庫（bank.js）裡的聽力、重組、拼字也要錄
  if (typeof BANKS !== 'undefined') Object.values(BANKS).forEach(B => B.questions.forEach(q => {
    if (q.audio) audioParts(q.audio).forEach(p => add(p.role, p.text));
    if (q.type === 'order') add('teacher', q.answer);
    if (q.type === 'spell' && !q.noAudio) add('word', q.word);  // 對話填空（noAudio）不用錄
  }));
  return out;
}
