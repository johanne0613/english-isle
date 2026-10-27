# English Isle 英語島：給 Claude 的工作說明

家教用的英語口說練習網站。學生按麥克風說英文，電腦聽寫、給分數；老師上課評分、下課產生報告、派回家任務。

- 正式網址：https://johanne0613.github.io/english-isle/
- 測試網址：https://johanne0613.github.io/english-isle/beta/

## 使用者

- 不寫程式。用繁體中文、台灣用語，先講結論，技術詞要白話解釋。
- 老師有兩位：使用者本人和 Taffy。

## 分支與檔案

- `main`：GitHub Pages 發佈的分支。
  - 根目錄是正式版：單一檔案 `index.html`，不用登入，資料存在瀏覽器。
  - `beta/` 是測試版。
  - `audio/` 是 Google Gemini 預錄的語音，正式版和測試版共用。
- `dashboard`：新版的原始碼，有 Firebase 老師後台、學生專屬連結、回家任務、練習時間軸。
  - 檔案是 `index.html`、`app.js`、`lessons.js`。課程內容在 `lessons.js`。
  - 改新版一律改這個分支，再把三個檔案複製到 `main` 的 `beta/`。

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
- Gemini 額度用完時，剩下的句子會自動改用 edge-tts（微軟免費語音，不用金鑰、沒有每日上限）一句一句錄，音量會調到跟 Gemini 差不多。只想用 edge-tts：`node tools/make-audio.js --edge`。使用者 Mac 已用 `uv tool install edge-tts` 裝好。edge-tts 的聲音跟 Gemini 不同人，所以 Gemini 還是第一選擇。

## 學生和課程

- 三位都是新北市小學五年級，課本用康軒 Wonder World 7。
- 星期五 19:30–21:00，1 位學生：程度普通，要補學校進度、為國中打底。用「段考城堡」。
- 星期日 14:00–16:00，雙胞胎分開上課：程度好，有上吉的堡，目標是增能和超前。之後的區域是英檢山（Cambridge Flyers、GEPT 初級）和閱讀燈塔。
- 題目要用課本的單字和句型自己出，不照抄課文對話。

## 段考城堡（2026-10-26 做好，在 `beta/` 測試中）

- 語音全部錄好（182 句）。其中 3 句是 edge-tts 錄的：I'd like some beef noodles, please.／We have sandwiches for breakfast.／Good. Sleep well, sweetie. Good night!，想統一聲音可以刪掉重錄 Gemini。
- 一個 Review 是一次段考範圍（使用者確認）。WW7 五上：第一次段考 Unit 1–2＋Review 1（課本 p.15–46），第二次段考 Unit 3–4＋Review 2（p.47–78）。中秋節單元（p.79）沒放進去。
- 課程在 `lessons.js` 的 `ww7t1`、`ww7t2`，地圖上的區域 id 是 `castle`。
- 每堂六關：單字口說、句型問答、情境對話、聽力題、段考題型（文法選擇、句子重組、看圖拼字）、閱讀理解。
- 新題型 `choice`、`order`、`spell` 由電腦直接改：第一次答對 3 顆糖，第二次 2 顆，之後 1 顆。
- 句型題可以設 `groups`（每組都要說到）和 `avoid`（常見錯誤，一字不差才算，例如 she have、he go home）。
- 課本內容來源：康軒數位高手 → 電子書 → 英語 WW7（要老師帳號登入）。

## 上傳到 GitHub

- 使用者的 Mac 已經用 GitHub 官方工具 gh 登入（帳號 johanne0613，2026-10-27），git push 可以直接用。

## 下一步

1. 使用者和 Taffy 測試 `beta/` 的段考城堡，修正回報的問題。
2. 新版確認可以用之後，在非上課時段換上正式版。
3. 下學期：Wonder World 8 的段考城堡。
