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

- 執行方式：`GEMINI_API_KEY=… node tools/make-audio.js`，需要 Node、playwright、ffmpeg。
- 會一次錄很多句再切開。免費額度一天大約 10 次請求。
- 新增課程後跑一次，只會錄新的句子。
- 金鑰不要貼在對話或寫進檔案，要用環境變數。

## 學生和課程

- 三位都是新北市小學五年級，課本用康軒 Wonder World 7。
- 星期五 19:30–21:00，1 位學生：程度普通，要補學校進度、為國中打底。下一步幫他做「段考城堡」區域：課本單字、句型口說、段考題型。
- 星期日 14:00–16:00，雙胞胎分開上課：程度好，有上吉的堡，目標是增能和超前。之後的區域是英檢山（Cambridge Flyers、GEPT 初級）和閱讀燈塔。
- 題目要用課本的單字和句型自己出，不照抄課文對話。

## 下一步

1. 看康軒 Wonder World 7 的目錄、段考範圍、每一課的單字和句型，規劃「段考城堡」。
2. 修正使用者測試 `beta/` 後回報的問題。
3. 新版確認可以用之後，在非上課時段換上正式版。
