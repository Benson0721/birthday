# 生日信網站：Phase 1

繁體中文的單頁生日信：輕觸漂浮信封，一次完成開封、抽卡與放大；滑鼠拖曳或手機左右滑動可翻轉整張信紙，背面有三個並排的圖示禮物按鈕。生日信目前使用明確標示的中性示範文字。

信紙左上角的信封圖示可收回信件：信紙縮回小卡、滑入信封、闔上封口，約 1.9 秒後回到可再次打開的信封。重新開信從正面頂端開始，已看過的禮物紀錄保留。鍵盤焦點會回到信封；Reduced Motion 直接完成收回。

視覺採淡粉紫與奶油白的日系文具風格，包含張開翅膀、抬起蹼足的新鴨子、探頭的狗狗與貓咪、極淡方格及柔紫紙緣。文字、互動與插圖分開保存；鴨子使用 `public/artwork/birthday-collection/happy-duck.png`，狗貓使用 `public/artwork/puppy-kitten.png`，均為高解析透明 PNG，方便後續印刷編排。

- [需求、架構決策與後續驗收](docs/requirements.md)
- [環境驗證紀錄](docs/environment-verification.md)
- [Phase 1 功能驗收](docs/phase1-verification.md)
- [視覺方向](docs/design-direction.md)
- [原創插圖、尺寸與生成提示詞](docs/artwork-provenance.md)
- [薰衣草、照片鴨子、青蛙、麻辣蝦子、蛋糕與 Steam 素材](docs/materials-collection.md)
- [第三方授權紀錄](THIRD_PARTY_NOTICES.md)
- [原始規格書](../birthday_letter_phase1_agent_spec.md)

## 啟動開發

目前電腦的依賴與測試瀏覽器已安裝。PowerShell：

```powershell
cd 'C:\Users\a0924\OneDrive\桌面\瓜生\birthday-letter'
npm run dev
```

開啟 <http://127.0.0.1:5173>。按 Ctrl+C 停止；port 被占用時會明確報錯，可指定其他 port：`npm run dev -- --port 5174`。

建議將 `birthday-letter` 作為 IDE 工作區開啟，以套用 `.vscode` 設定、專案 TypeScript 版本與推薦擴充功能。

## 固定工具鏈

| 工具 | 版本 |
| --- | --- |
| Node.js | 24.16.0（支援 24.x 且 ≥24.16.0） |
| npm | 11.13.0（支援 11.x） |
| React / React DOM | 19.3.1 |
| TypeScript | 7.0.2 |
| Vite / React plugin | 8.3.5 / 6.2.1 |
| Oxlint | 1.91.0 |
| Vitest | 5.1.0 |
| Playwright Test | 1.64.1 |
| Noto Sans TC / Noto Serif TC Variable（Fontsource） | 5.3.1 |

依賴精確版本與 lockfile 已保留；`.npmrc` 會檢查 Node／npm 版本。未加入動畫框架、WebGL 或後端依賴。

## 在新電腦重新安裝

先安裝上述 Node.js／npm 版本，再在專案目錄執行：

```powershell
.\scripts\setup.ps1
```

此腳本執行 `npm ci` 與 Chromium／WebKit 安裝。Node 會使用 Windows 系統信任的 CA 憑證，TLS 驗證保持啟用；設定只作用於安裝程序，結束後還原。

也可手動執行：

```powershell
$env:NODE_USE_SYSTEM_CA = '1'
npm ci
npm run browsers:install
```

本機曾遇到 `UNABLE_TO_VERIFY_LEAF_SIGNATURE`，採用系統 CA 已解決。若在專案外或舊 IDE 終端機新增套件，先執行上述環境變數設定；新開的專案 VS Code 終端機已配置此變數。無需停用 SSL 或安裝全域開發套件。

其他作業系統可執行 `npm ci`，再執行 `npx playwright install --with-deps chromium webkit`。Playwright 瀏覽器存於使用者快取，不放入 Git。

這是純前端專案，沒有必填的 `.env`、API key、登入、資料庫或後端服務。

## 開發與驗證指令

| 指令 | 用途 |
| --- | --- |
| `npm run dev` | 啟動 Vite 開發伺服器，支援熱更新 |
| `npm run typecheck` | 嚴格 TypeScript 檢查 |
| `npm run lint` | Oxlint 檢查，包含 React／TypeScript／JSX 無障礙規則 |
| `npm test` | 執行 Vitest 狀態契約與內容設定測試 |
| `npm run test:watch` | 單元測試監看模式 |
| `npm run build` | 型別檢查並產生 `dist/` 靜態產物 |
| `npm run preview` | 在 <http://127.0.0.1:4173> 預覽已建置產物 |
| `npm run test:e2e` | 先 build，再用 Playwright 驗證正式產物 |
| `npm run test:e2e:ui` | Playwright 互動測試介面 |
| `npm run check` | 依序執行 lint、單元測試、build 與 E2E |
| `npm audit` | 檢查已安裝的套件公告 |

E2E 會自動啟動／停止 port 4173 的 preview。執行 E2E 前先關閉手動啟動的 preview；port 5173 的開發伺服器可保留。

E2E 覆蓋五個 Chromium 視窗尺寸（360×780、390×844、768×1024、1440×900、1920×1080）、Reduced Motion 及 WebKit iPhone 模擬。驗證開信／三份禮物、千字長信與固定標題、鍵盤／焦點、反向收信、動畫備援與 844×390 橫向畫面；Chromium 手機使用原生觸控事件測試左右翻面及上下捲動，WebKit 模擬器測試觸控點開與退出。另有 Chromium／WebKit 的桌面滑鼠拖曳專案。

`playwright-report/` 為 HTML 報告；失敗時 `test-results/` 留存 screenshot／trace。查看最近一次報告：`npx playwright show-report`。

開發伺服器啟動後，可執行 `node scripts/capture-stationery.mjs` 更新桌面、手機、WebKit 的文具畫面與拖曳截圖；記錄存於 `docs/screenshots/`。腳本也檢查圖片實際解碼、透明像素與頁面／圖片請求錯誤。

`node scripts/capture-return.mjs` 可擷取收信的縮小、插入、關封與完成畫面，檢查桌面背面與手機正面的反向路徑。

## 目錄與內容替換

```text
src/
  app/App.tsx             串接信封、信紙與禮物 Portal；管理瀏覽器返回
  app/letterFlow.ts       狀態與事件契約；純 reducer
  app/useLetterFlow.ts    動畫階段與有清理機制的備援計時
  app/motion.ts           統一動畫時間與 CSS Variables
  app/useReducedMotion.ts 系統偏好監聽
  app/usePaperDrag.ts     Pointer Capture、逐幀姿態與放手吸附
  app/paperDrag.ts        拖曳角度、距離及快甩門檻
  components/            信封、FLIP 展信、雙面信紙、禮物與 SVG 插畫
  content/letter.ts       信件標題、段落、署名
  content/gifts.ts        三份禮物資料與 Gift 型別
  content/content.test.ts 內容完整性測試
  styles/tokens.css      色彩、陰影、字型與信紙外框尺寸
  styles/                基本排版、信封、信紙與禮物樣式
  main.tsx               React 掛載入口
e2e/letter.spec.ts        正式產物完整流程測試
e2e/paper-drag.spec.ts    實際滑鼠拖曳與文字選取測試
docs/                    需求整理與環境驗證
scripts/setup.ps1        Windows 可重現安裝腳本
```

正式生日信請修改 `src/content/letter.ts` 的 `title`、`paragraphs`、`signature`。每個陣列元素為一段，字串中的 `\n` 代表換行，`**文字**` 代表強調；內容以 React 文字節點渲染，不接受 HTML。

禮物內容集中於 `src/content/gifts.ts`：`label` 用於按鈕的無障礙名稱及詳情標示，`detailTitle`／`paragraphs` 在詳情揭曉。SVG 插畫位於 `components/Artwork.tsx`，依 `id` 對應；`icon` 是保留的簡易圖示資料。`announcementDate` 為可編輯的 ISO 日期，僅作預告，正式公開時另行更新內容與部署。

`gifts` 陣列的順序即拆封順序，目前為吃得爽快 → 玩得開心 → 神祕小禮。關閉前一份詳情後才記錄拆封並解鎖下一份；本次頁面工作階段內可重看已拆禮物，收回信封仍保留進度，重新整理則重置。`artwork` 設定單張插圖，`treats` 設定餐點圖片、名稱與預約時間；「吃得爽快」已填入麻辣香泰式料理吃到飽（2026/11/6 19:00）與金沙大蛋糕。

Noto Sans TC／Noto Serif TC 已自託管，隨 Vite 靜態產物發布，依 Unicode 範圍按需載入並使用 `font-display: swap`，離線或字型載入失敗時回到系統字型。完整字型授權隨產物保留於 `licenses/`。

## 互動與維護

- 開信為單向首次儀式，重新整理可重播。動畫以完成事件推進，若事件遺失則由集中管理的計時備援完成。
- 桌面以整張紙的滑鼠拖曳為主要翻面方式：按住任意紙面空白處左右拖動，整張紙會跟著旋轉並輕微傾斜；達到距離或快甩門檻後放開完成翻面，幅度不足則回彈。
- 文字本身仍可原生選取；空白段落區也能抓取，禮物列與按鈕不攔截拖曳。滑鼠移出旋轉後的紙面仍會追蹤，Escape、取消或視窗失焦會回復原面。
- 手機左右滑動信紙翻面，上下滑動閱讀；鍵盤可在信紙區按左右方向鍵翻面。拖曳、回彈與翻轉期間鎖住衝突操作；正反面保持掛載，獨立捲動位置會保留，非作用面設為 `inert`。
- 正反面標題及下方裝飾固定在紙緣內，只有中間內容捲動；信紙與禮物詳情的捲軸隱藏。
- 詳情使用 Portal 與原生 modal dialog，覆蓋 viewport；點擊／輕觸畫面、返回按鈕、Esc 與瀏覽器返回鍵均可回到原禮物按鈕，保留本次拆封紀錄。選取文字或捲動時不會誤關閉。
- 原生對話框加上明確的 Tab／Shift+Tab 焦點循環，詳情開啟期間背景不可操作；關閉後焦點回到觸發列。
- Reduced Motion 會停止漂浮，直接完成開信與翻面；途中切換系統偏好也會收斂到可閱讀狀態。
- `src/app/motion.ts` 是動畫時間唯一來源，App 與 Portal 共用其 CSS 變數；調整動畫請修改該檔。
- 手機水平觸控與垂直原生捲動依手勢方向區分；桌面滑鼠拖曳不受紙張邊緣限制。

## GitHub Pages 自動部署

整體儲存庫保留規格書與 `birthday-letter` 子目錄，透過 [`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml) 部署。推送至 `main` 或手動執行 Action 後，工作流程會：

1. 依 `birthday-letter/.node-version` 安裝 Node.js，快取子目錄的 npm 依賴。
2. 在 `birthday-letter` 執行 `npm ci`、lint、單元測試與建置。
3. 依 Pages 提供的 base path 建置；目前網站使用 `/birthday/`，圖片、字型、CSS 及 JavaScript 均對應此網址前綴。
4. 上傳 `birthday-letter/dist` 並部署至 GitHub Pages。

網站：<https://benson0721.github.io/birthday/>。儲存庫的 Settings → Pages → Source 使用 **GitHub Actions**，不直接發布 Git 原始碼根目錄。

在本機模擬相同子路徑：

```powershell
npm run build -- --base /birthday/
npm run preview -- --base /birthday/
```

開啟 <http://127.0.0.1:4173/birthday/>。一般本機開發與 `npm run build` 保持使用根路徑，亦可部署到 Cloudflare Pages。

官方參考：[Vite 的 GitHub Pages 部署](https://vite.dev/guide/static-deploy.html#github-pages)、[GitHub Pages 自訂工作流程](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## Cloudflare Pages 靜態部署

若改用 Cloudflare Pages，可連接同一個 GitHub 儲存庫並使用以下設定，或直接上傳建置後的 `dist/`。GitHub Pages 的 Action 不需要改動。

Git 整合設定：

| 設定 | 值 |
| --- | --- |
| Root directory | `birthday-letter` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | `24.16.0`（`.node-version`；必要時設定 `NODE_VERSION`） |
| Production branch | `main` |

官方步驟：[React on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/)。上傳產物前先執行 `npm run check`，並在上線後實測完整開信、翻面與禮物流程。

## 後續內容與 Phase 2

上線前替換正式生日信與署名、確認神祕禮物預告日期，並補上正式分享圖片與網址。真實 iPhone／Safari 測試及遠端部署結果仍需在相應設備／帳戶驗證。

Phase 2 的寵物可在 `App.tsx` 的主場景旁新增 `PetLayer`，置於信紙的 3D 容器之外。Phase 1 沒有寵物程式碼、虛構下載或遊戲狀態機。
