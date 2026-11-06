# Phase 1 功能驗收

驗證日期：2026-11-04～2026-11-05（Asia/Taipei）。驗證對象為本機 React／Vite 網站與正式 `dist/` 產物。

流程：信封按鈕 → 受控開信序列 → 固定外框雙面信紙 → 禮物列 → 獨立 Portal 詳情 → 返回原清單。內容來源為 `src/content/letter.ts` 與 `src/content/gifts.ts`，無後端與外部 API。

## 功能完成範圍

| 功能 | 結果 |
| --- | --- |
| 信封置中漂浮、封蠟、封口與前口袋層次 | 已實作並查看開啟前後、抽卡與展信畫面 |
| 一次啟動，自動開封、抽卡、放大 | 已實作；正常展信一次量測約 2.22 秒，時序記錄見 `screenshots/animation-timing.json` |
| 收回信封與反覆開合 | 正反面都可收信，依序縮回小卡、插入、關封，約 1.91 秒後恢復漂浮信封；重開從正面頂端開始，已看過紀錄保留，焦點回到信封 |
| 真正 CSS 3D 正反翻面 | 固定外框 `rotateY(180deg)`、`preserve-3d`；已查看中間角度與完成畫面 |
| 滑鼠直接拖曳整張信紙 | 從紙面空白處抓取，整張紙跟手旋轉／傾斜；支援雙向翻面、快甩、未達門檻回彈、取消與失焦復位 |
| 長信閱讀與狀態保留 | 超過 1,000 字可捲動，翻面再回來保留位置；標題及署名／下方插圖固定，捲軸隱藏 |
| 橫排圖示禮物與拆封紀錄 | 三個小按鈕不顯示標題文字，依吃得爽快 → 玩得開心 → 神祕小禮逐一解鎖；關閉前一份詳情後才完成拆封，保留本次頁面工作階段紀錄 |
| 全畫面禮物詳情 | Portal 直接掛到 body；native dialog 覆蓋 viewport，內容獨立捲動 |
| 返回控制 | 按鈕、Esc 與瀏覽器返回鍵均可回到背面；焦點回到原禮物列 |
| 鍵盤與背景隔離 | Tab／Shift+Tab 焦點循環，非作用面及詳情背景 inert，翻面期間阻擋衝突操作 |
| Reduced Motion | 停止漂浮、快速到達閱讀狀態，翻面與禮物保持可用；狀態契約亦涵蓋動畫中途切換偏好 |
| 動畫備援 | 模擬遺失 animationend／transitionend 仍可開信、翻面與返回；計時器集中且可清理 |
| 手機與橫向螢幕 | 原生垂直／斜向捲動不誤翻面；844×390 下仍可閱讀與返回 |
| 內容與字型 | 使用者自行編輯的繁中生日信、基本強調與換行、自託管 Noto 字型、保留授權與 fallback |
| 靜態交付 | 型別檢查與 Vite 建置完成，`dist/` 含網站、字型與授權檔；README 記錄 Pages 部署步驟 |

## 自動化檢查

`npm run check` 包含 Oxlint、Vitest、嚴格 TypeScript、生產建置與 Playwright。狀態／內容／拖曳邏輯測試共 21 項。手動翻面與固定閱讀區更新後，共排程 53 組瀏覽器情境，45 組通過、8 組依裝置能力略過，無失敗。

| 最終檢查 | 結果 |
| --- | --- |
| `npm run lint` | 通過 |
| `npm test` | 3 個測試檔，21 passed |
| `npm run build`（包含 typecheck） | 通過 |
| `node node_modules/@playwright/test/cli.js test --max-failures=1` | 45 passed、8 skipped，約 4.3 分鐘，exit code 0 |
| `npm ls --depth=0` | 13 項直接依賴正常，exit code 0 |
| 最近一次依賴安裝的 audit | 0 vulnerabilities |
| README／docs 本機連結 | 無缺失檔案 |

| Playwright 專案 | 視窗 | 情境 |
| --- | --- | --- |
| Chromium 桌面 | 1440×900 | 5 通過、2 條件略過 |
| Chromium 小手機 | 360×780 | 7 通過 |
| Chromium 手機 | 390×844 | 7 通過 |
| Chromium 平板 | 768×1024 | 6 通過、1 條件略過 |
| Chromium 大桌面 | 1920×1080 | 5 通過、2 條件略過 |
| Chromium Reduced Motion | 390×844 | 5 通過、2 條件略過 |
| WebKit iPhone 模擬 | 390×844 | 6 通過、1 條件略過 |
| Chromium 桌面滑鼠拖曳 | 1440×900 | 2 組 |
| WebKit 桌面滑鼠拖曳 | 1440×900 | 2 組 |

前七個專案各測試：

1. 完整開信、三份禮物、全畫面範圍、返回鍵／Esc／按鈕、重複查看、無主控台錯誤。
2. 千字長信、3D 旋轉矩陣、捲動位置保留、橫向畫面、長詳情可捲動、返回原列表位置。Chromium 手機額外送出真實觸控事件。
3. Reduced Motion 與完整鍵盤流程，非作用面／背景不可互動，焦點循環與返回。
4. 動畫完成事件遭攔截與快速連點，確認備援仍能到達可操作狀態。
5. 正反面收信、實際反向動畫、完整階段順序、衝突操作阻擋、焦點回到信封、反覆開合、從正面頂端重開，以及保留已看過紀錄。鍵盤測試另涵蓋 Reduced Motion 收信；事件遺失測試涵蓋收信備援與收信中途切換偏好。
6. Chromium 手機以原生觸控事件測試文字上水平滑動、垂直捲動、長詳情捲動後單次輕觸退出及左上角收信。
7. 具觸控能力的 Chromium／WebKit 專案測試圖示按鈕點開、再觸碰畫面退出與收信。其餘裝置依能力略過，非失敗。

## 視覺檢查與修正

- Milestone A 已在手機尺寸實際走過讀信、翻面、Steam／泰味館詳情、Esc／按鈕返回與焦點恢復。
- Milestone B 檢查一次開信的五個狀態與抽卡／放大交接；正式閱讀尺寸獨立於信封 transform。
- 最後的 WebKit 截圖檢查發現，正面可能漏出鏡像的背面捲動層。已將面層裁切改為 `overflow: clip`、保留 WebKit 3D 設定，並在停止翻面時明確隱藏非作用面。
- 修正後重新查看正面、翻面中間角度與背面；文字方向正常，保留整張紙的真正 3D 旋轉。E2E 加入非作用面視覺隱藏的回歸檢查。
- 詳情除原生對話框外，補上明確的鍵盤焦點循環，避免 Shift+Tab 離開頁面。
- 詳情關閉時顯式恢復禮物清單的捲動位置，避免焦點恢復帶動列表位移；長文測試亦等待字型完成及點擊列就位後再記錄位置。
- 依使用者補充，桌面拖曳已提升為必要功能。控制器在 requestAnimationFrame 更新整張紙的 transform，放開才提交正反面狀態；實際文字仍可原生選取，禮物與按鈕不會誤啟動拖曳。停止時亦會同步剩餘的合成動畫，讓正反面的語意狀態與實際畫面一致。
- 另以 Chromium 與 WebKit 的真實滑鼠事件測試連續角度、小幅回彈、雙向翻面、閱讀位置、原生文字選取、視窗失焦取消、Reduced Motion 與詳情隔離。滑鼠專案依序執行，避免其他測試視窗切換焦點而取消正在進行的手勢。
- WebKit 在拖曳前半段也可能漏出鏡像背面，因此可見面改為依實際物理角度剔除：滑鼠控制時直接由姿態計算，吸附／按鈕動畫時依合成矩陣的法線追蹤。已查看約 48° 的正面與約 106° 的背面，兩面文字方向皆正確。

## 畫面紀錄

### 日系動物文具更新（2026-11-04）

信封、信紙正反面改用使用者指定的淡紫／奶油白／可可棕配色，搭配原創小鴨、狗狗與貓咪、淡方格、柔紫紙緣及月亮封貼。正文仍為 HTML 文字，裝飾圖片不參與滑鼠事件、不覆蓋正文；後續依使用者要求將左下狗貓與署名改為固定。

`node scripts/capture-stationery.mjs` 已走過桌面 Chromium、手機 Chromium 與 WebKit 的信封 → 正面 → 收尾 → 背面 → 神祕小禮，以及桌面持續拖曳的兩個角度。圖片解碼、圖片 HTTP 請求及頁面錯誤皆通過；透明像素實測與尺寸記錄見 [stationery-visual-check.json](screenshots/stationery-visual-check.json)。兩張高解析 PNG 完整保存於 `public/artwork/`，生成提示詞見 [artwork-provenance.md](artwork-provenance.md)。

最後以 `PREVIEW_URL=http://127.0.0.1:4173/` 對重新建置的正式 `dist/` 再擷取整組畫面，並補拍 Steam 詳情。桌面／手機／WebKit 三組頁面錯誤與圖片 HTTP 錯誤均為 0；透明 PNG 及新 favicon 已包含在正式產物。

新增的畫面紀錄：

- [桌面背面](screenshots/gifts-desktop.png)
- [桌面信件收尾](screenshots/letter-ending-desktop.png)
- [手機信件收尾](screenshots/letter-ending-mobile.png)
- [WebKit 信封](screenshots/envelope-webkit-mobile.png)
- [WebKit 正面](screenshots/letter-webkit-mobile.png)
- [WebKit 背面](screenshots/gifts-webkit-mobile.png)
- [桌面神祕禮物詳情](screenshots/mystery-desktop.png)

### 四周紫色暈染補充驗收

依最新參考圖，正反面改為共用 `public/artwork/lavender-paper-wash.svg`：四邊連續的紫色色帶以不規則柔化遮罩向內暈開，疊少量紙材顆粒，中央仍為奶油白。工具列底色改為較透明，讓底部紙緣延續同一圈紫色。沒有變更文字、動物、版面尺寸或互動狀態。

- 桌面、手機與 WebKit 的正反面、閱讀收尾及拖曳角度截圖已更新並查看，圖片請求與頁面錯誤為 0。
- `npm run build -- --logLevel warn` 與 `npm run lint` 通過；正式 `dist/` 內含相同 SVG，建置 CSS 已引用。
- 這次僅調整紙材，針對 Chromium／WebKit 重跑千字長信、橫向畫面、原生捲動、雙向滑鼠拖曳、回彈、文字選取、取消、Reduced Motion 與禮物操作，共 6 組情境全部通過（58.4 秒）。後續收信與手動介面更新的完整驗收見上方結果。

### 收回信封（2026-11-05）

當時於正反面底部新增「收回信封」，後續已移至左上角圖示。反向 FLIP 先將當前信紙縮回實際小卡位置，接近小卡時才交接圖樣，再依序插入信封、闔上封口，恢復漂浮與可開信狀態。三階段共 1,910ms，皆有事件與計時備援。收信期間暫停翻面／禮物／重複點擊；Reduced Motion 直接收回，中途切換偏好亦能完成。完成後焦點回到信封，重開從正面頂端閱讀，保留禮物瀏覽紀錄。

桌面從背面、手機 Chromium／WebKit 從正面擷取縮小、插入、關封與完成畫面；記錄見 [return-visual-check.json](screenshots/return-visual-check.json)。

當時以正式 `dist/` 的 preview 擷取文具全流程與收信過程，確認延後信紙淡出後的交接、插入口袋層次與完成後的信封。三組收信畫面皆回到 `floating`，頁面錯誤為 0。

### 手動翻面與固定閱讀區

移除底部操作列，滑鼠拖曳信紙空白處、手機水平滑動或鍵盤左右方向鍵均可翻面；左上角保留帶無障礙名稱及 44px 觸控範圍的收信圖示。標題與下方裝飾固定於紫色紙緣內，中央內容獨立捲動且隱藏捲軸。三個禮物改為水平並排的圖示按鈕，保留螢幕閱讀器名稱；詳情點擊／輕觸畫面即可關閉，捲動與選取文字不會誤關閉。

Chromium 原生觸控測試涵蓋文字上左右滑動、垂直捲動、翻面後第一次觸碰禮物、長詳情捲動後單次輕觸退出及收信；WebKit 與 Chromium 平板另檢查觸控開啟／退出。桌面持續測試雙向拖曳、回彈、文字選取與取消。

另外檢查 320×568 的 Chromium／WebKit 窄手機排版：原始預設標題與插圖不重疊，三個禮物維持同一橫排，每個按鈕 69×69px；觸控點開、退出與收信均正常。後續信件標題與正文已由使用者自行編輯，測試標題／首段斷言改由內容設定讀取。

使用者編輯信件後，以最新建置重新驗證 Chromium 手機的完整開信／三份禮物與千字長信兩組情境，2 passed（19.3 秒）。新素材頁、透明度與下載驗證另見 [生日素材組](materials-collection.md)。

- [桌面收回操作](screenshots/return-control-desktop.png)
- [手機收回操作](screenshots/return-control-mobile.png)
- [信紙縮回小卡](screenshots/return-returning-desktop.png)
- [小卡插入信封](screenshots/return-inserting-desktop.png)
- [手機關封](screenshots/return-closing-mobile.png)
- [恢復封好的信封](screenshots/return-closed-mobile.png)

### 其他核心流程畫面

- [桌面信封](screenshots/envelope-desktop.png)
- [桌面閱讀信紙](screenshots/letter-desktop.png)
- [桌面禮物詳情](screenshots/gift-desktop.png)
- [手機信封](screenshots/envelope-mobile.png)
- [手機閱讀信紙](screenshots/letter-mobile.png)
- [手機三份禮物](screenshots/gifts-mobile.png)
- [手機神祕禮物詳情](screenshots/mystery-mobile.png)
- [滑鼠按住拖曳中的整張信紙](screenshots/mouse-drag-preview.png)
- [尚未跨過紙張邊緣時的正面](screenshots/mouse-drag-front-angle.png)
- [放開後翻到背面](screenshots/mouse-drag-back.png)

### 依序拆封與餐敘內容（2026-11-05）

保留使用者編輯的背面標題，補上吃得爽快 → 玩得開心 → 神祕小禮的順序說明。按鈕維持小尺寸橫排圖示，以序號、鎖頭及完成勾號區分進度；未解鎖者為原生 disabled 按鈕。App 入口與 reducer 同時檢查前置禮物，避免繞過介面跳關；完成關閉詳情後才記錄拆封並解鎖下一份。

「吃得爽快」顯示麻辣蝦子與光滑版巧克力蛋糕，內容為麻辣香泰式料理吃到飽（2026/11/6 19:00）及金沙大蛋糕；「玩得開心」改用淡紫色 Steam 圖示。詳情仍可點擊／輕觸畫面退出。鴨子改為平面腮紅及右下抬起的蹼足，圖檔、預覽頁與 ZIP 同步，提示詞見 [素材修訂](material-revisions.md)。

狀態測試已加入跳關阻擋、關閉後才解鎖、重看不重複計數。完整 53 組瀏覽器驗證為 45 passed、8 依裝置能力略過（4.3 分鐘），包含桌面、兩種手機、平板、Reduced Motion、WebKit 與兩個引擎的實際滑鼠拖曳。

使用者同時修改禮物標題、敘述及背面裝飾後，保留最新內容並修正未使用的插圖 import；重新通過 lint、21 項單元測試與生產建置，另以桌面 Chromium、手機 Chromium 與 WebKit 重跑完整依序拆封／圖片與時間／返回與重看流程，3 passed（31.4 秒）。詳情標題與餐點敘述斷言改由內容設定讀取，避免個人化文案改字造成失敗。

畫面：[桌面餐點](screenshots/food-desktop.png)／[手機餐點](screenshots/food-mobile.png)／[WebKit 餐點](screenshots/food-webkit-mobile.png)。

最後重新擷取桌面、390px 手機、320×568 窄手機及 WebKit 的完整文具與依序揭曉畫面，頁面／圖片錯誤皆為 0。320px 的順序說明與三個圖示同列排列，餐點圖文完整且無水平溢出，見 [窄手機背面](screenshots/gifts-small-mobile.png)／[窄手機餐點](screenshots/food-small-mobile.png)。更新後的素材頁亦通過三種瀏覽器尺寸的透明度與下載驗證。

### 全站使用新版鴨子（2026-11-05）

`StationeryAnimal` 的 duck 分支統一引用 `birthday-collection/happy-duck.png`，涵蓋信封小卡、抽卡／收卡動畫及信紙右上角。Lint、型別檢查與生產建置通過，來源及建置 JavaScript 均無舊鴨子引用。重新擷取桌面、390px、320px 與 WebKit 文具流程，以及桌面／手機／WebKit 收信序列，圖片及頁面錯誤均為 0；新版鴨子保留透明度，正式 PNG 與來源一致。

### 信封薰衣草與中央封貼

首頁信封左下改用既有透明薰衣草花束，中央奶油白封貼恢復原本的月亮星星 SVG。針對窄手機修正矮螢幕的信封寬度上限，同時受 viewport 寬高約束，避免 320px 畫面裁切。Lint、型別檢查與生產建置通過，桌面、390px、320px 與 WebKit 的初始信封及開信／收回流程均完成；擷取腳本另檢查實際旋轉後的信封邊界位於畫面內。

畫面：[桌面信封](screenshots/envelope-desktop.png)／[窄手機信封](screenshots/envelope-small-mobile.png)。

## 上線與後續界線


- 生日信與署名已由送禮者編輯；神祕禮物仍為原預告日期，上線前可於內容設定確認。
- 未發布到 Cloudflare Pages 或建立遠端儲存庫。`dist/` 已可部署，帳戶端步驟見 README；遠端實際網址的最終驗收尚未執行。
- WebKit 模擬已測試，但尚未在實體 iPhone／Safari 驗證動態工具列與安全區。
- 手機觸控滑動翻面與桌面整張紙的滑鼠拖曳已完成；完整共享元素轉場與寵物屬後續。Phase 2 可從主場景外側新增 PetLayer，不需要修改現有信紙與禮物事件契約。
