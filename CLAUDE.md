# English Isle 英語島：給 Claude 的工作說明

家教用的英語口說練習網站。學生按麥克風說英文，電腦聽寫、給分數；老師上課評分、下課產生報告、派回家任務。

- 正式網址：https://johanne0613.github.io/english-isle/
- 測試網址：https://johanne0613.github.io/english-isle/beta/

## 使用者

- 不寫程式。用繁體中文、台灣用語，先講結論，技術詞要白話解釋。
- 老師有兩位：使用者本人和 Taffy。

## 分支與檔案

- `main`：GitHub Pages 發佈的分支。
  - 根目錄是正式版：2026-10-27 換成新版（`index.html`、`app.js`、`lessons.js`、`bank.js`，老師用 Google 登入，資料存雲端）。舊版（單一檔案、不用登入）在 git 歷史裡，要換回去就 revert「正式版換成新版」那次 commit。
  - `beta/` 是測試版。
  - `audio/` 是 Google Gemini 預錄的語音，正式版和測試版共用。
- `dashboard`：新版的原始碼，有 Firebase 老師後台、學生專屬連結、回家任務、練習時間軸。
  - 檔案是 `index.html`、`app.js`、`lessons.js`、`bank.js`。課程內容在 `lessons.js`，段考和英檢題庫在 `bank.js`。
  - 改新版一律改這個分支，再把四個檔案複製到 `main` 的 `beta/`；測試沒問題、使用者說「可以換」，再複製到 `main` 的根目錄。

## 換版規則（很重要）

- 上課時段不能動 `main` 的根目錄（台灣時間）：
  - 星期五 19:00–21:30
  - 星期日 13:30–16:30
- 流程：在 `dashboard` 改 → 複製到 `main/beta/` → 使用者和 Taffy 測試 → 使用者說「可以換」，才在非上課時段換到根目錄。
- 出問題就用 `git revert` 換回上一版，再請老師用 Ctrl+Shift+R 重新整理。

## Firebase（新版才用到）

- 專案 `english-isle`，Spark 免費方案。
- 安全規則在 `firestore.rules`。改了要請使用者貼到 Firebase 主控台 → Firestore → 規則 → 發布。
- 老師帳號清單寫在兩個地方：`firestore.rules` 和 `app.js` 的 `TEACHERS`。

## 語音錄製

- 在 `dashboard` 分支執行：`GEMINI_API_KEY=… node tools/make-audio.js`，需要 Node、ffmpeg（不用 playwright，句子清單直接讀 `lessons.js` 的 `speechCatalog()`）。
- 錄好之後，把 `audio/` 整個資料夾複製到 `main`。正式版和測試版都讀 `main` 的 `audio/`。
- 會一次錄很多句再切開。免費額度一天大約 10 次請求；程式會自動換模型。沒錄完的話，隔天再跑一次，只會錄剩下的。
- 新增課程後跑一次，只會錄新的句子。沒錄到的句子會用電腦內建語音，聽起來比較不自然。
- 金鑰不要貼在對話或寫進檔案，要用環境變數。可以在終端機用 `read -rs GEMINI_API_KEY` 讓使用者自己貼。
- 一次錄很多句再依停頓切開，有時會切錯（一句被切成兩段、或混到下一句）。現在含兩個以上短句的句子會單獨錄；錄完最好用 whisper 轉文字比對一次。使用者 Mac 上有 `whisper-cli` 和 `~/whisper-models/ggml-large-v3-turbo.bin`。
- 切錯的句子：從 `audio/manifest.json` 刪掉那一行和 mp3，再跑一次錄音程式。剩很少句時用 `TTS_BATCH=1` 一句一句錄最穩。
- 聲音角色：`teacher`（老師）、`word`（唸單字）、情境對話的角色（WW9 加了 `classmate`、`dad`、`uncle`、`tourist`），還有英檢山用的 `examiner`（Flyers 考官，英國腔）、`narrator`（GEPT 聽力唸題目的旁白）、`duo`（GEPT 對話，一男一女）。
- GEPT 聽力的 `audio` 格式：`M: …`、`W: …` 開頭的行是對話（Gemini 用兩個聲音一次錄）；最後一行 `Q: …` 是題目，用旁白另外錄，網站播完對話再接著播題目（`audioParts()` 在 `lessons.js`）。含換行或兩句以上的句子、對話都單獨錄。
- whisper 比對的小程式沒有放進 repo：把音檔轉 16 kHz wav，用 `whisper-cli -m ~/whisper-models/ggml-large-v3-turbo.bin -l en -nt -np -f 檔案` 轉文字，跟 `manifest.json` 的原句比對字的重合率（對話要先拿掉 M: W: Q:）。
- Gemini 額度用完時，剩下的句子會自動改用 edge-tts（微軟免費語音，不用金鑰、沒有每日上限）一句一句錄，音量會調到跟 Gemini 差不多。只想用 edge-tts：`node tools/make-audio.js --edge`。使用者 Mac 已用 `uv tool install edge-tts` 裝好。edge-tts 只當臨時替代：錄過的句子記在 `audio/edge.json`，下次用 Gemini 金鑰執行時會自動換成 Gemini。Gemini 每日額度在太平洋時間午夜重置（台灣 15:00，冬令時間 16:00）。

## 學生和課程

- 新北市國小學生，課本是康軒 Wonder World。各校六上用的冊次不一樣，有的用 WW7，有的用 WW9，看學生課本封面。週五學生的學校六上用**第七冊**（使用者 2026-10-30 更正，先前說的 Book 9 是記錯）。
- 星期五 19:30–21:00，1 位學生：**六年級**（使用者 2026-10-30 更正），程度普通，要補學校進度、為國中打底。用「段考城堡」，課本 **WW7（六上）**。WW9 留在城堡裡，給六上用第九冊的學校。
- 星期日 14:00–16:00，雙胞胎分開上課：程度好，有上吉的堡，目標是增能和超前。之後的區域是英檢山（Cambridge Flyers、GEPT 初級）和閱讀燈塔。
- 題目要用課本的單字和句型自己出，不照抄課文對話。
- 出題原則（使用者 2026-10-27 定的）：每一題都要能從題目裡的英文找到答案。不考地理常識、不考背課本、不考中翻英。人物題給英文自我介紹再問 he / she；單字用英文描述；拼字用聽寫；句子重組給對話的另一半。

## 段考城堡（WW7 2026-10-27 上正式版；WW9 2026-10-30 在測試版；兩本都是六上）

- 地圖上的區域 id 是 `castle`。四堂課照這個順序排：`ww7t1`、`ww7t2`、`ww9t1`、`ww9t2`。兩本都是六上，所以課程卡標題的中文寫冊次（「WW7・第一次段考」「WW9・第一次段考」），題庫標題寫「六上 WW7・第一次段考」，避免老師點錯。
- 一個 Review 是一次段考範圍（使用者確認）。
  - WW7（六上，週五學生用）：第一次段考 Unit 1–2＋Review 1（課本 p.15–46），第二次段考 Unit 3–4＋Review 2（p.47–78）。中秋節單元（p.79）沒放進去。語音 182 句全部是 Gemini。使用者比較過，Gemini 比 edge-tts 自然很多。
  - WW9（六上，115 上，有些學校用）：第一次段考 Unit 1–2＋Review 1（p.7–34），第二次段考 Unit 3–4＋Review 2（p.35–62）。Culture & Festivals（p.63）、Task（p.68）沒放進去。
- WW9 內容（2026-10-30 從康軒數位高手電子書讀的，只整理單字句型，題目自己出）：
  - Unit 1 First Day of School：規則動詞過去式 -ed（cleaned the room、cooked dinner、played the recorder、visited my grandparents、walked the dog、watched a movie）、What did you do yesterday? Did you …? 發音：-ed 的三種唸法。
  - Unit 2 A Great Day：did / had / went（did the dishes、did the laundry、had breakfast / lunch / dinner、went shopping / swimming）、What time did you …? 發音：-ing、-ong。
  - Unit 3 Amy's Graduation Trip：beach、forest、island、lake、mountain、river、hot spring、Where did you go …? 發音：y 的三種唸法（yellow、sky、baby）。
  - Unit 4 A Small World：convenience store、MRT station、science museum、tea shop、next to、across from、between、Where is the …? 發音：al、au、aw。
- WW9 出題的做法（照出題原則）：
  - 課本 Unit 3 的景點是台灣真實地名，不考地理：只用 beach、lake 這類單字，地點題的答案都寫在題目裡（行程表、對話）。
  - 單字用英文描述考（例如 It's land with water all around it. → island）。干擾選項避開說法也通的地方（便利商店也能寄包裹、買雜誌，所以不跟 post office、bookstore 放在一起）。
  - -ed、y 的發音題：選項固定是代表字（played / cooked / visited；yellow / sky / baby），問 Which word has the same … sound?（`fixed: true`）。
  - al、au、aw 唸起來一樣，「缺哪些字母」的干擾選項要用唸法不同的組合（ar、oa、ou、oi、ow、ay），不然只靠聽分不出來。
  - Unit 4 的地圖題（題型「看地圖選答」）：`scene` 用 emoji 排成上下兩排店、中間一條馬路，`ctx` 用英文寫每個 emoji 是什麼地方。同一排緊鄰是 next to，正對面是 across from。出新地圖題時要確認干擾選項沒有剛好也對的（例如中間那家店同時是 between 和 across from）。
  - 句型題檢查過去式時，`groups` 要加 `exact: true`：比對會把 walk / walked 當成同一個字。
- 每堂六關：單字口說、句型問答、情境對話、聽力題、段考題型（文法選擇、句子重組、看圖拼字）、閱讀理解。
- 新題型 `choice`、`order`、`spell` 由電腦直接改：第一次答對 3 顆糖，第二次 2 顆，之後 1 顆。
- 句型題可以設 `groups`（每組都要說到）和 `avoid`（常見錯誤，一字不差才算，例如 she have、he go home）。
- 課本內容來源：康軒數位高手 → 電子書 → 英語 WW7（要老師帳號登入）。

## 登入和前台（2026-10-27 使用者決定）

- 新版維持老師用 Google 登入（資料存雲端，兩位老師共用）。登入後一定要先到前台：選學生 → 島上上課，後台放右上角。
- 選了學生就自動帶入他的學習紀錄：島上最上面的「學習紀錄」、課程卡上的上課次數和分數、上課時評分區的「上次這題」。地圖直接打開他上次上課的區域。

## WW7 第一次段考對照康軒題型（2026-10-30）

- 對照康軒出題高手 3.0（數位高手 → 題庫試卷 → 出題高手，手動出題、紙本出卷、WW7 期中考範圍）的題型清單補題，只看題型和題數，題目全部自己出。月考卷、聽力卷只能下載，沒有下載。
- 康軒的段考切法：三次段考制 第一次＝Unit 1–2；兩次段考制 期中＝Unit 1–2＋Review 1。課本前面的 Phonics Review、Vocabulary & Sentence Review 沒有題庫題目，不在段考範圍（沒有 Starter 單元）。
- `kh5a-1` 從 119 題補到 191 題，新題型：聽音選同音、聽音判斷 O/X（兩個字中間用 ... 停頓）、長母音複習（ai、ay、ea、ee）、聽句選字、聽對話選答（M: / W: 對話＋Q: 題目）、選出不同類（範圍 R1）、看圖判斷 O/X、看圖選句、看圖選單字、對話填空、閱讀測驗、克漏字。
- 看圖題的圖只用 emoji 表示男生女生和病痛（🤒 發燒、🦷 牙痛…），不放國旗、地圖。
- 對話填空：`type: 'spell'` 加 `noAudio: true` 和 `ctx`（對話，空格寫 ___），學生讀對話打出空格的字，不用聽，也不錄音。
- 上課版 `ww7t1` 也加了同樣的題型（聽力 16 題、段考題型 27 題、閱讀 7 題，課程 85 分鐘），題目跟題庫共用語音。上課畫面的選擇題現在會顯示 `scene`（圖）和 `ctx`（對話）。
- 這 30 句新語音先用 edge-tts，記在 `audio/edge.json`，下次跑 Gemini 一起換。

## 段考刷題和題庫（2026-10-27 做好並上正式版）

- 題庫在 `bank.js`，每份標年級、版本、冊次、第幾次段考：六上 WW7 `kh5a-1`、`kh5a-2`（代號是一開始誤以為五上取的，學生紀錄用這個代號存，不改）；六上 WW9 `kh6a-1`（136 題）、`kh6a-2`（122 題）。之後加國中、會考就再加一份。英檢的題庫 `gept-e1` 見「英檢山」。
- 分頁名稱 2026-10-28 改成「刷題」（學生頁、後台都是）。每份題庫可以設 `drill` 決定按鈕叫什麼：沒設是「段考刷題」，英檢是「英檢刷題」。
- 題目是自命題，用課本單字句型照模板產生，每題有 `source`。收進學校公開的真實考題時，`source` 寫學校＋學年＋段考，圖片換成我們的。
- 學生：專屬連結 →「段考刷題」分頁。隨機刷題、錯題本（答錯放進來、答對拿掉）、老師指定的題目。
- 老師：段考城堡課程卡的「段考刷題」「題庫・上課素材」。題庫可以依範圍、題型、學生答錯篩選，然後上課刷、印學習單（解答在最後一頁）、指定給學生回家刷。
- 成績存在學生的 `practice/drill_題庫代號`（attempts 每次成績、stats 每題對錯、assigned 老師指定）。後台「段考刷題」分頁、練習時間軸、島上的學習紀錄都看得到。
- 使用者想法：段考城堡不限國小，之後可以加國中；會考另外開一個區域（不放在段考城堡）。Taffy 可能會接一位國九學生（雙胞胎的哥哥），重點是會考。

## 訪客練習（2026-10-30 做好，在測試版）

- 網址最後加 `#guest`（例如 `…/english-isle/beta/#guest`）：不用登入、不用學生資料，打開就是「刷題」，列出全部題庫。`#guest=kh5a-1` 直接打開那一份題庫。
- 兩個分頁：「刷題」和「上課內容」。上課內容列出段考城堡的四堂複習課，每一關按「練習這一關」就能自己練（不用老師先上過）。`#guest=class` 直接打開上課內容。上課內容的練習不存，只存刷題成績和錯題本。
- 成績和錯題本只存在那台電腦的瀏覽器（`guest:practice`），不會上傳，老師後台看不到；換電腦或清除瀏覽器資料就沒了。要老師看得到紀錄，還是用學生的專屬連結。
- 程式在 `app.js` 的 `startGuest()`：把 `Cloud.savePractice`、`log`、`touch` 換成只存在瀏覽器，不連 Firebase。

## 英檢山（2026-10-28 做好第一版，在測試版）

- 地圖上的區域 id 是 `exam`，已開放。給週日的雙胞胎用（增能、超前）。
- 題目全部自命題，沒有用劍橋或 LTTC 的考古題；題型和題數照官方格式（2026-10-28 查過官方說明）。
- **Flyers 口說**：`lessons.js` 的 `flyers1`（一堂課，`voice: 'examiner'` 用考官的聲音唸題目）。
  - Part 1 找不同 `diff`：1 個例子＋6 個不同（數量、動作、位置、顏色、外表、大小）。學生只看自己的圖，老師的圖可以打開對答案。圖用 emoji 拼，寫在關卡的 `diff.candidate` / `diff.examiner`，格式跟萬聖節的 scene 一樣：`[emoji, 左右%, 上下%, 大小 s/m/l/xl]`。
  - Part 2 資訊交換 `info`：老師看學生的資訊卡問 5 題（`card: 'mine'`），學生看提示字問 5 題（`card: 'yours'`，`reply` 是考官的回答，學生說完才出現，問過的那行會填上答案）。
  - Part 3 看圖說故事 `story`：5 張圖，`lead` 是考官先說的第 1 張，學生說第 2–5 張（沿用 panel 題型，要用過去式）。
  - Part 4 個人問答 `talk`：5 題，最後一題 Tell me about …。
  - 官方評分三項：字彙文法、發音、互動（各 0–5 分，換成最多 5 個盾牌）。我們的 skills 對到 vocab、grammar、pron、fluency、ideas。
- **GEPT 初級聽讀**：`bank.js` 的 `gept-e1`（`grade: 5`、`gradeText: '國小五、六年級'`、`level: '初級'`、CEFR A2）。沒有掛在哪一堂課，英檢山的區域用 `banks: ['gept-e1']` 放一張題庫卡（`bankCard()`）。
  - 照 2021 新制兩回的量：聽力 60 題（看圖辨義 10、問答 20、簡短對話 20、短文聽解 10，三選一）、閱讀 60 題（詞彙 20、段落填空 16＝4 篇×4 格、閱讀理解 24＝8 篇×3 題，四選一）。
  - 官方一回：聽力 30 題約 20 分鐘（5／10／10／5，每題只播一次）、閱讀 30 題 35 分鐘（10／8／12）。通過：聽讀合計 160（各 120 滿分），兩項都不低於 72。
  - 刷題首頁多「模擬考」：照 `mock` 的題型和題數出一整回，同一篇文章的題目一起出、照順序排。也可以只練一種題型。
  - 題目欄位：`fixed`（選項不打亂，答案位置用題號決定）、`scene`（看圖辨義的圖）、`hideOpts`（選項用聽的，答完才顯示字）、`picOpts`（選項是圖）、`noRead`（閱讀文章不給「聽一次」）。
- 出題原則照舊：答案都從題目的英文找得到。看圖辨義是把圖跟聽到的英文對起來；閱讀只看文章裡寫的。
- 單字範圍：2026-10-28 用 LTTC 官方「全民英檢初級參考字表」（https://www.lttc.ntu.edu.tw/resources/GEPT/GEPT_Elementary.pdf ，約 2,300 個詞條）逐字比對過，超出字表的都換掉了，只剩字表單字的變化形（chose、forgot、taken）和人名。之後加題目也要比對一次。
- 圖：聽力的圖（看圖辨義、短文聽解的選項）目前是 emoji 和文字拼的，沒有另外畫圖檔。

## 本機測試（不用真的雲端）

- 用 `python3 -m http.server` 開 dashboard 的資料夾，網頁跑到登入畫面後，在瀏覽器把 `isleDebug.Cloud` 的方法（watchStudents、list、savePractice、saveSession、saveHomework、updateStudent、log、getStudent…）換成存在記憶體的假的，設 `Cloud.user`、`Cloud.isTeacher = true`，再呼叫 `startTeacher()`；學生頁面改呼叫 `startStudent(學生 id)`。
- `isleDebug.say('…')` 模擬學生說了一句話。瀏覽器會快取 js，改完要先 `fetch(檔名, { cache: 'reload' })` 再重新整理。

## 考古題來源

- 學校段考試題依著作權法第 9 條第 1 項第 5 款可以自由利用（智慧局解釋：各級學校月考、期中、期末考試題），但卷子裡借用的文章、插圖仍受保護。使用時標出處、圖換成我們的。
- 真實考卷要從學校官網或學生自己學校的舊考卷拿。週五學生學校的舊考卷：等面談時再跟家長要（使用者說開發階段先不要）。
- tcool 題庫網（https://www.tcool.cc/）有各校段考考古題。條款只限個人非商業使用、禁止重製散布和自動化大量存取，所以不能從 tcool 搬題目；可以用它的校名、學年、段考當線索，到學校官網找原始卷子。清單看得到，但題目頁有「確認不是機器人」的驗證，不能自動讀取或串接，也不要照抄。段考城堡的教材放了它的六上康軒英語刷題連結：期中 `/mock/-12/`、期末 `/mock/-615/`（WW7、WW9 都放這兩個）。五上的是期中 `/mock/-23/`、期末 `/mock/-501/`。

## 上傳到 GitHub

- 使用者的 Mac 已經用 GitHub 官方工具 gh 登入（帳號 johanne0613，2026-10-27），git push 可以直接用。

## 下一步

1. Taffy 在正式版測試新版（2026-10-27 換上），修正回報的問題；週五 19:00 上課前要處理完，不行就 revert 換回舊版。
2. 舊版存在老師電腦瀏覽器的上課紀錄：登入後台會出現「上傳到雲端」。
3. 段考城堡 WW9（六上）：2026-10-30 放上測試版，等使用者看過、說「可以換」，再在非上課時段換到正式版。語音 192 句都錄好了：181 句 Gemini，11 句對話先用 edge-tts（Gemini 三個模型當天額度都用完，記在 `audio/edge.json`），下次用 Gemini 金鑰跑一次 make-audio 就會換掉（英檢山還有 41 句也在 edge.json 裡，同一次一起換）。whisper 比對過，句子都沒有切錯；只有單字被聽成同音字（rained → reigned、across → a cross），laughed 會被 whisper 聽成 left，連 edge-tts 唸的也一樣，是 whisper 的限制，不是錄錯。
4. 下學期：五下 Wonder World 8、六下 Wonder World 10 的段考城堡。
5. 英檢山：使用者和 Taffy 在測試版試用 Flyers 口說、GEPT 刷題；沒問題、使用者說「可以換」再上正式版。語音先用 edge-tts 錄好，Gemini 額度有了就重錄（跑一次 make-audio 就會換掉 `audio/edge.json` 裡的句子），錄完用 whisper 比對。
6. 接下來的區域：閱讀燈塔 → 口說海灣 → 寫作森林 → 會考區；11/8 前另外做節慶廣場的感恩節課。
