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
     這段在做什麼：段考城堡・康軒 Wonder World 7（五上）
     一個 Review 是一次段考範圍。題目用課本的單字和句型自己出，不照抄課文。
     段考題型：choice 選擇題（有 audio 就是聽力題）、order 句子重組、spell 看圖拼字
     ========================================================== */
  ww7t1: {
    id: 'ww7t1', zone: 'castle', bankId: 'kh5a-1',
    title: 'Test 1 Review', zh: '第一次段考：Unit 1–2',
    level: '康軒 Wonder World 7・五上', minutes: 75,
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
          { id: 't1', pic: '🙋', cue: 'You', prompt: 'Where are you from?', hint: "I'm from …",
            follow: '可以追問：Where is your mom from?',
            expect: { minWords: 3, groups: [{ any: ['im from', 'i am from'], miss: "用 I'm from … 回答" }] } },
          { id: 't2', pic: '🐘', cue: 'Raj・India', prompt: 'Where is Raj from?', hint: "He's from …",
            follow: 'Raj 是男生，用 he。',
            expect: { minWords: 3, groups: [{ any: ['hes from', 'he is from'], miss: "男生用 He's from …" }, { any: ['india'], miss: '說出國家 India' }],
              avoid: [{ any: ['shes from', 'she is from'], tip: 'Raj 是男生，要用 he' }] } },
          { id: 't3', pic: '🥐', cue: 'Sophie・France', prompt: 'Is Sophie from Canada?', hint: "No, she's not. She's from …",
            follow: "完整答法：No, she's not. She's from France.",
            expect: { minWords: 4, groups: [{ any: ['no'], miss: '先回答 No' }, { any: ['shes not', 'she is not', 'she isnt'], miss: "說 she's not" }, { any: ['france'], miss: '說出 France' }] } },
          { id: 't4', pic: '🗾', cue: 'Haruto & Yui・Japan', prompt: 'Where are Haruto and Yui from?', hint: "They're from …",
            follow: '兩個人用 they。',
            expect: { minWords: 3, groups: [{ any: ['theyre from', 'they are from'], miss: "兩個人用 They're from …" }, { any: ['japan'], miss: '說出 Japan' }] } },
          { id: 't5', pic: '💂', cue: 'Emma・the UK', prompt: 'Is Emma from the UK?', hint: 'Yes, she …',
            follow: '簡答：Yes, she is.',
            expect: { minWords: 3, groups: [{ any: ['yes'], miss: '回答 Yes' }, { any: ['she is'], miss: '用 she is 回答' }] } },
          { id: 't6', pic: '🤕', cue: 'You', prompt: "What's wrong?", hint: 'I have a …',
            follow: '可以換病痛再問：fever、cough、toothache。',
            expect: { minWords: 3, groups: [{ any: ['i have'], miss: '用 I have a … 回答' }, { any: ['headache', 'cold', 'cough', 'fever', 'stomachache', 'toothache', 'runny nose', 'sore throat'], miss: '說出哪裡不舒服' }],
              avoid: [{ any: ['i has'], tip: 'I 後面用 have' }] } },
          { id: 't7', pic: '🤒', cue: 'Leo', prompt: 'Does Leo have a fever?', hint: 'Yes, he …',
            follow: '簡答：Yes, he does.',
            expect: { minWords: 3, groups: [{ any: ['yes'], miss: '回答 Yes' }, { any: ['he does'], miss: 'Does 問句，用 he does 回答' }] } },
          { id: 't8', pic: '🤧', cue: 'Nina', prompt: 'Does Nina have a toothache?', hint: "No, she doesn't. She has a …",
            follow: "完整答法：No, she doesn't. She has a runny nose.",
            expect: { minWords: 5, groups: [{ any: ['no'], miss: '先回答 No' }, { any: ['she doesnt', 'she does not'], miss: "說 she doesn't" }, { any: ['runny nose', 'cold'], miss: '說出 Nina 真正的問題' }],
              avoid: [{ any: ['she have'], tip: 'she 後面要用 has' }] } },
          { id: 't9', pic: '🙂', cue: 'You', prompt: 'Do you have a stomachache today?', hint: "Yes, I do. / No, I don't.",
            follow: '再問一題：Do you have a cold?',
            expect: { minWords: 3, groups: [{ any: ['yes i do', 'no i dont', 'no i do not'], miss: "用 Yes, I do. 或 No, I don't. 回答" }] } },
          { id: 't10', pic: '🧑‍🤝‍🧑', cue: 'Your friend', prompt: 'Tell me about a friend. Where is he or she from? Is he or she sick today?',
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
        id: 'listen', kind: 'choice', title: 'Listening', zh: '聽力題', minutes: 10,
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
          { id: 'l10', tag: '聽問句選回答', audio: "What's wrong?", prompt: 'Choose the best answer.', options: ["I'm from India.", "No, I don't.", 'I have a runny nose.'], answer: 2 }
        ]
      },
      {
        id: 'exam', kind: 'choice', title: 'Test Practice', zh: '段考題型', minutes: 15,
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
          { id: 'o1', kind: 'order', tag: '句子重組', answer: 'Where are you from?', zh: '你是從哪裡來的？' },
          { id: 'o2', kind: 'order', tag: '句子重組', answer: "She's not from the USA.", zh: '她不是從美國來的。' },
          { id: 'o3', kind: 'order', tag: '句子重組', answer: 'Does your dad have a fever?', zh: '你爸爸發燒了嗎？' },
          { id: 'o4', kind: 'order', tag: '句子重組', answer: 'My sister has a toothache.', zh: '我妹妹牙痛。' },
          { id: 's1', kind: 'spell', tag: '看圖拼字', word: 'Canada', caps: true, pic: '🍁', zh: '加拿大', show: 'C _ n _ d _', skills: ['vocab'] },
          { id: 's2', kind: 'spell', tag: '看圖拼字', word: 'France', caps: true, pic: '🥐', zh: '法國', show: 'F r _ _ c e', skills: ['vocab'] },
          { id: 's3', kind: 'spell', tag: '看圖拼字', word: 'fever', pic: '🤒', zh: '發燒', show: 'f _ v _ r', skills: ['vocab'] },
          { id: 's4', kind: 'spell', tag: '看圖拼字', word: 'headache', pic: '🤕', zh: '頭痛', show: 'h _ _ d _ c h e', skills: ['vocab'] },
          { id: 's5', kind: 'spell', tag: '看圖拼字', word: 'cough', pic: '😷', zh: '咳嗽', show: 'c _ _ g h', skills: ['vocab'] }
        ]
      },
      {
        id: 'read', kind: 'choice', title: 'Reading', zh: '閱讀理解', minutes: 8,
        skills: ['reading'],
        intro: 'Read the short letter. Then answer the questions.',
        items: [
          { id: 'r1', tag: '閱讀理解', passage: 'nina', prompt: 'Where is Nina from?', options: ['Taiwan', 'Canada', 'Japan'], answer: 1 },
          { id: 'r2', tag: '閱讀理解', passage: 'nina', prompt: "What's wrong with Nina?", options: ['She has a fever.', 'She has a cold.', 'She has a toothache.'], answer: 1 },
          { id: 'r3', tag: '閱讀理解', passage: 'nina', prompt: 'Does Nina have a fever?', options: ['Yes, she does.', "No, she doesn't.", "No, she isn't."], answer: 1 },
          { id: 'r4', tag: '閱讀理解', passage: 'nina', prompt: 'Is Haruto from Japan?', options: ['Yes, he is.', "No, he isn't.", 'Yes, he does.'], answer: 0 }
        ]
      }
    ],
    passages: {
      nina: "Hi! I'm Nina. I'm from Canada, but now I live in Taipei. Today I'm not at school. I have a cold and a sore throat. I don't have a fever. My friend Haruto is from Japan. He visits me after school. He has a book for me. Thank you, Haruto!"
    },
    materials: [
      { id: 'knsh', kind: '其他', title: '康軒數位高手（WW7 電子書）', url: 'https://digitalmaster.knsh.com.tw/', note: '老師帳號登入後，電子書 → 英語 WW7，對照課本頁碼。' },
      { id: 'tcool', kind: '學習單', title: 'tcool 題庫網：五上康軒英語・期中考（第一次段考）', url: 'https://www.tcool.cc/mock/-23/', note: '各校考古題的線上刷題。第一次打開會有「確認不是機器人」的驗證。' }
    ]
  },

  ww7t2: {
    id: 'ww7t2', zone: 'castle', bankId: 'kh5a-2',
    title: 'Test 2 Review', zh: '第二次段考：Unit 3–4',
    level: '康軒 Wonder World 7・五上', minutes: 75,
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
          { id: 't1', pic: '🍽️', cue: 'You', prompt: 'What would you like to eat?', hint: "I'd like some …, please.",
            follow: '換一種食物再問一次。',
            expect: { minWords: 4, groups: [{ any: ['id like', 'i would like'], miss: "用 I'd like some … 回答" },
              { any: ['pizza', 'rice', 'soup', 'steak', 'dumplings', 'noodles', 'sandwiches', 'sandwich', 'french fries', 'fries', 'hamburgers', 'hamburger'], miss: '說出想吃的食物' },
              { any: ['please'], miss: '最後加 please 比較有禮貌' }] } },
          { id: 't2', pic: '🍕🍟', cue: 'You want these', prompt: 'What would you like to eat for lunch?', hint: "I'd like some … and …, please.",
            follow: "完整答法：I'd like some pizza and French fries, please.",
            expect: { minWords: 6, groups: [{ any: ['id like', 'i would like'], miss: "用 I'd like some … 回答" }, { any: ['pizza'], miss: '說出 pizza' }, { any: ['french fries', 'fries'], miss: '說出 French fries' }] } },
          { id: 't3', pic: '🥟', cue: 'Yes!', prompt: 'Would you like some dumplings?', hint: 'Yes, …',
            follow: 'Would you like …? 要的話說 Yes, please.',
            expect: { minWords: 2, groups: [{ any: ['yes please'], miss: '想要就說 Yes, please.' }] } },
          { id: 't4', pic: '🥩', cue: 'No, thanks.', prompt: 'Would you like some steak?', hint: 'No, …',
            follow: '不要的話說 No, thank you.',
            expect: { minWords: 2, groups: [{ any: ['no thank you', 'no thanks'], miss: '不要就說 No, thank you.' }] } },
          { id: 't5', pic: '⏰', cue: 'You', prompt: 'What time do you get up?', hint: 'I get up at …',
            follow: '追問：What time do you go to school?',
            expect: { minWords: 4, groups: [{ any: ['i get up'], miss: '用 I get up at … 回答' }, { any: ['at'], miss: '時間前面加 at' }] } },
          { id: 't6', pic: '🛏️', cue: 'You', prompt: 'What time do you go to bed?', hint: 'I go to bed at …',
            follow: '追問：What time do you have dinner?',
            expect: { minWords: 5, groups: [{ any: ['go to bed'], miss: '用 I go to bed at … 回答' }, { any: ['at'], miss: '時間前面加 at' }] } },
          { id: 't7', pic: '🍳', cue: 'You・7:00?', prompt: 'Do you have breakfast at seven?', hint: "Yes, I do. / No, I don't. I have breakfast at …",
            follow: "答 No 的話，要再說正確的時間。",
            expect: { minWords: 3, groups: [{ any: ['yes i do', 'no i dont', 'no i do not'], miss: "用 Yes, I do. 或 No, I don't. 回答" }] } },
          { id: 't8', pic: '⏰', cue: 'Ruby・6:30', prompt: 'What time does Ruby get up?', hint: 'She gets up at …',
            follow: 'Ruby 是 she，動詞要加 s：gets up。',
            expect: { minWords: 5, groups: [{ any: ['she gets up'], exact: true, miss: '說 She gets up at …' }, { any: ['six thirty'], miss: '說出時間 six thirty' }],
              avoid: [{ any: ['she get up'], tip: 'she 後面的動詞要加 s：gets' }] } },
          { id: 't9', pic: '🏠', cue: 'Ben・4:00', prompt: 'What time does Ben go home?', hint: 'He goes home at …',
            follow: 'Ben 是 he，go 要變 goes。',
            expect: { minWords: 5, groups: [{ any: ['goes home'], miss: '說 He goes home at …' }, { any: ['four'], miss: '說出時間 four' }],
              avoid: [{ any: ['he go home'], tip: 'he 後面的 go 要變 goes' }] } },
          { id: 't10', pic: '📅', cue: 'Your day', prompt: 'Tell me about your day after school.',
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
          { id: 'o1', kind: 'order', tag: '句子重組', answer: 'What would you like to eat?', zh: '你想要吃什麼？' },
          { id: 'o2', kind: 'order', tag: '句子重組', answer: "I'd like some noodles, please.", zh: '我想要一些麵，謝謝。' },
          { id: 'o3', kind: 'order', tag: '句子重組', answer: 'What time does Ruby get up?', zh: 'Ruby 幾點起床？' },
          { id: 'o4', kind: 'order', tag: '句子重組', answer: 'He goes home at four thirty.', zh: '他四點半回家。' },
          { id: 's1', kind: 'spell', tag: '看圖拼字', word: 'rice', pic: '🍚', zh: '飯', show: 'r _ c e', skills: ['vocab'] },
          { id: 's2', kind: 'spell', tag: '看圖拼字', word: 'soup', pic: '🍲', zh: '湯', show: 's _ _ p', skills: ['vocab'] },
          { id: 's3', kind: 'spell', tag: '看圖拼字', word: 'noodles', pic: '🍜', zh: '麵', show: 'n _ _ d l e s', skills: ['vocab'] },
          { id: 's4', kind: 'spell', tag: '看圖拼字', word: 'dinner', pic: '🍽️', zh: '晚餐', show: 'd _ n n _ r', skills: ['vocab'] },
          { id: 's5', kind: 'spell', tag: '看圖拼字', word: 'school', pic: '🏫', zh: '學校', show: 's c h _ _ l', skills: ['vocab'] }
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
      { id: 'tcool', kind: '學習單', title: 'tcool 題庫網：五上康軒英語・期末考（第二次段考）', url: 'https://www.tcool.cc/mock/-501/', note: '各校考古題的線上刷題。第一次打開會有「確認不是機器人」的驗證。' }
    ]
  }
};

/* 這段在做什麼：島上的區域（open: true 代表已開放） */
const ZONES = [
  { id: 'festival', name: 'Festival Plaza', zh: '節慶廣場', x: 58, y: 51.6, open: true,
    desc: '跟著節日換主題，每個月一檔。這個月是萬聖節。', lessons: ['halloween'],
    plan: ['11 月 Thanksgiving 感恩節', '12 月 Christmas 聖誕節', '1–2 月 Lunar New Year 農曆新年'] },
  { id: 'castle', name: 'Exam Castle', zh: '段考城堡', x: 72, y: 70.2, open: true,
    desc: '康軒 Wonder World 7 段考複習：課本單字、句型口說、段考題型。一個 Review 是一次段考範圍。', lessons: ['ww7t1', 'ww7t2'],
    plan: ['下學期：Wonder World 8 第一、二次段考', '錯題本：把答錯的題目集中再練一次'] },
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

/* 這段在做什麼：列出所有要預錄的句子和角色。網站播放、錄音程式 tools/make-audio.js 都用這一份 */
/* 聽力題：單一個字用唸單字的聲音，整句用老師的聲音 */
function audioRole(text) { return /\s/.test(text) ? 'teacher' : 'word'; }
function speechCatalog() {
  const out = [], seen = new Set();
  const add = (role, text) => { const k = role + '|' + text; if (text && !seen.has(k)) { seen.add(k); out.push({ role, text }); } };
  Object.values(LESSONS).forEach(L => L.stages.forEach(st => st.items.forEach(it => {
    const kind = it.kind || st.kind;
    if (kind === 'question' || kind === 'panel') add('teacher', it.prompt);
    if (kind === 'panel') add('teacher', it.model);
    if (kind === 'word') { add('word', it.word); add('teacher', it.ex); }
    if (kind === 'shadow') add('teacher', it.text);
    if (kind === 'dialogue') it.lines.forEach(l => { if (l.s === 'n') add(it.voice || 'teacher', l.t); });
    if (kind === 'choice' && it.audio) add(audioRole(it.audio), it.audio);
    if (kind === 'order') add('teacher', it.answer);
    if (kind === 'spell') add('word', it.word);
  })));
  // 段考題庫（bank.js）裡的聽力、重組、拼字也要錄
  if (typeof BANKS !== 'undefined') Object.values(BANKS).forEach(B => B.questions.forEach(q => {
    if (q.audio) add(audioRole(q.audio), q.audio);
    if (q.type === 'order') add('teacher', q.answer);
    if (q.type === 'spell') add('word', q.word);
  }));
  return out;
}
