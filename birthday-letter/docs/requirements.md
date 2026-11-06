# Phase 1 需求釐清與開發決策

整理日期：2026-11-04（Asia/Taipei）  
依據：[原始規格書](../../birthday_letter_phase1_agent_spec.md) v1.0。

補充需求（2026-11-04）：依使用者後續指示，桌面 3D 必須支援滑鼠直接拖動整張信紙翻面，提升為必要功能；以本文此項更新優先於原規格「拖曳可延後」的預設。

補充需求（2026-11-05）：正反面可操作「收回信封」，依序將信紙縮回小卡、插入信封、闔上封口，恢復未開信狀態。可反覆開合；重新開信從正面頂端開始，已看過的禮物紀錄保留。

補充需求（2026-11-05）：移除底部工具列，以滑鼠拖曳／觸控左右滑動手動翻面，收信改為左上角圖示；隱藏捲軸，標題與底部固定、僅中央內容捲動。背面三份禮物改成橫向並排的小圖示按鈕，視覺上不顯示標題；詳情可再點擊畫面關閉。

## 本次工作的完成界線

本文件先於環境建置階段整理，現已依使用者後續指示進行 Phase 1 實作。交付可啟動與建置的 React 網站、集中內容設定、狀態測試、瀏覽器測試及部署文件。

開信、3D 翻面、禮物列表、Portal 詳情、返回與焦點管理已實作；生日信採中性示範文字。實際驗收結果記錄於 `phase1-verification.md`。遠端發布與真實 iPhone 測試需在相應帳戶／設備進行。

## 產品與主要旅程

這是一份繁體中文、溫柔手作風的個人生日信。閱讀與驚喜為核心，動畫配合閱讀節奏。

1. 進站看到置中的漂浮 3D 信封，可點擊或以 Enter／Space 啟動。
2. 一次啟動，自動完成封口打開 → 小卡抽出 → 放大信紙，整段約 1.8～2.5 秒。
3. 正面閱讀生日信；長文在固定尺寸信紙內捲動。
4. 滑鼠按住信紙空白處拖動，或以手指左右滑動，整張紙跟手旋轉；放開後依幅度完成翻面或回彈。鍵盤使用左右方向鍵。
5. 背面三個並排禮物圖示可任意順序開啟；點開後才揭曉具體內容。
6. 詳情覆蓋 viewport；返回後仍在背面清單，保持捲動位置與已看過紀錄。
7. 可反覆翻回正面，保留信件閱讀位置。
8. 點「收回信封」播放反向動畫；完成後焦點回到信封，可再次開信。Reduced Motion 直接收回，動畫中途切換偏好也必須安全完成。

## 必做與排除範圍

| Phase 1 必做（P0） | 後續／可選 |
| --- | --- |
| 信封漂浮、封口／口袋層次、抽卡與放大銜接 | 小寵物、Sprite Sheet、遊戲狀態機屬 Phase 2 |
| 真正 CSS 3D 雙面信紙 | Godot、桌面下載與安裝流程屬後續 |
| 正面長信、背面並排禮物、桌面拖曳與手機滑動翻面 | 觸控手勢依方向區分翻面與原生捲動 |
| Portal 全畫面詳情、返回、拆封紀錄 | 共享元素轉場、少量裝飾是加分項 |
| 手機捲動、鍵盤焦點、Reduced Motion、安全區 | 無後端、資料庫、登入、付款或兌換表單需求 |
| SEO 基礎資訊、靜態產物、文件與測試 | 無 Steam API、餐廳訂位、自動發券或自動播放音樂需求 |

「P2」加分項與「Phase 2」寵物是不同概念；兩者皆不阻擋 Phase 1。

## 內容與編輯位置

| 位置 | 內容與約束 |
| --- | --- |
| `src/content/letter.ts` | 標題、分段正文、署名。先使用明確標示的中性佔位文字，正式信件由送禮者提供。 |
| `src/content/gifts.ts`：steam | 主題「玩得開心」；詳情為一款 Steam 遊戲任選，由送禮者購買贈送，無自行增加的價格上限。 |
| `src/content/gifts.ts`：thai | 主題「吃得爽快」；詳情為泰味館吃到飽招待，時間另約，無虛構訂位／分店／價格。 |
| `src/content/gifts.ts`：mystery | 主題「神祕小禮」；預告 2026/11/18 公開，上線前確認文案。先不提供桌面寵物下載。 |
| `src/styles/tokens.css` | 色彩、陰影及自託管 Noto 字型堆疊，保留系統 fallback。 |
| `index.html` / `public/favicon.svg` | 網頁標題、描述、分享標籤及圖示。分享圖片與正式網址待上線前補齊。 |

`label` 用於禮物按鈕的無障礙名稱與詳情標示，列表視覺不顯示文字；SVG 插畫依 `id` 對應，`icon` 為保留的簡易圖示資料。`detailTitle`／`paragraphs` 只用於詳情。已看過代表瀏覽紀錄，仍可再次打開。神祕禮物日期是公告資料，不加入前端時間鎖；未來公開正式內容時另行部署。

## 技術與架構決策

- 在 `birthday-letter/` 獨立建立專案，保留原規格書。
- Node.js 24.16.0、npm 11；React 19、TypeScript 7、Vite 8，套件採精確版本與 npm lockfile。
- 沿用目前 Vite React／TypeScript 模板的 Oxlint，搭配 React、TypeScript 與 JSX 無障礙檢查；型別檢查獨立由 `tsc` 負責。
- 使用原生 CSS 與 CSS Variables；3D 採 `perspective`、`preserve-3d`、`rotateX/Y`，由 React hooks／reducer 管理狀態。
- 進場階段、信紙方向、禮物詳情分開管理。事件契約沿用規格第 9 節；重複開信、翻面中操作與開啟詳情期間翻面必須被阻擋。
- 進場小卡與正式閱讀信紙分成獨立呈現階段，以共享幾何／FLIP 銜接，避免信封 transform 影響長文排版。
- 收信沿相同共享幾何反向播放，新增 `returning → inserting → closing → floating`。縮小 700ms、插入 650ms、關封 560ms，動畫期間阻擋開信／翻面／禮物操作。三階段都有可清理的計時備援；收回後重新建立閱讀元件，避免殘留翻面角度與捲動位置。
- 翻面時保持正反面 DOM 與各自捲動位置；外框固定、內容獨立 `overflow-y: auto`，操作列保持可見。
- 非作用面使用 `inert` 或等效機制，避免不可見面被 Tab 聚焦或誤點。
- 翻面外框保留 3D 合成；面層使用 `overflow: clip`，並依實際角度／矩陣法線剔除背向的視覺面，涵蓋拖曳與吸附過程，避免 WebKit 捲動層出現鏡像漏出。
- 詳情用 `createPortal(..., document.body)` 與原生 modal dialog；返回按鈕、Esc、Tab 焦點循環、焦點移入／返回及背景鎖定一併實作。
- 動畫完成事件推進流程，統一時間設定，提供有清理機制的 fallback。Reduced Motion 要能快速到達可讀狀態。
- 桌面以滑鼠拖動空白處、手機以水平觸控翻面；鍵盤以左右方向鍵翻面。保留滑鼠文字選取、按鈕點擊與手機垂直捲動；詳情開啟時不能拖曳。
- 拖曳的姿態由局部控制器管理，使用 Pointer Capture 與 requestAnimationFrame 更新 transform；放手後才提交正反面的語意狀態，避免每幀 React 更新與中途改寫拆封紀錄。
- 詳情開啟時加入一筆 history state，返回鍵會關閉詳情。
- 拆封紀錄預設只存本次頁面記憶體；重新整理可重新開信。無需 localStorage、環境密鑰或 API 憑證。
- 產物為 `dist/`。依使用者後續指示，GitHub Pages 改由根目錄的 `.github/workflows/deploy-pages.yml` 從 `birthday-letter` 建置並發布 `birthday-letter/dist`；Cloudflare Pages 的子目錄部署設定亦保留於 README。

## 上游參考檢視

已閱讀 Yuktrium 的 `index.html`、`style.css`、`script.js` 與 MIT License：

- HTML 有信封背板、信紙 wrapper、三折 panel、前口袋、封口及封蠟。
- CSS 的口袋保留在抽出信紙之前；封口開啟後退到信紙後方。浮動、封口 `rotateX`、紙張抽出的 transform 可作後續視覺參考。
- 原版 JavaScript 僅以點擊切換 `.open`；本專案包含開信與反向收信序列，並以 React 狀態阻擋衝突操作。
- 三折 panel 與原作小尺寸閱讀版型不沿用；長信放大、整張紙翻面及 Portal 詳情皆需另行設計。
- 信封折口、抽卡、漂浮與口袋層次參考並改作上游技法；完整原授權保留於 `THIRD_PARTY_NOTICES.md`。

來源：[專案](https://github.com/yuktrium/3D-Love-Letter)、[展示](https://yuktrium.github.io/3D-Love-Letter/)、[HTML](https://github.com/yuktrium/3D-Love-Letter/blob/main/index.html)、[CSS](https://github.com/yuktrium/3D-Love-Letter/blob/main/style.css)、[JavaScript](https://github.com/yuktrium/3D-Love-Letter/blob/main/script.js)、[授權](https://github.com/yuktrium/3D-Love-Letter/blob/main/LICENSE)。

## 後續實作順序與驗收

| 里程碑 | 完成條件 |
| --- | --- |
| A：功能骨架 | 關閉動畫仍可讀信、看三個禮物圖示、開啟與返回全畫面詳情；桌面與手機可操作。 |
| B：3D 與過場 | 一次開信連續播完、銜接不跳位；固定外框真正 3D 翻面；無鏡像、穿模或卡死。 |
| C：品質與交付 | 至少 1,000 字可讀且翻面保留位置；鍵盤、焦點、Reduced Motion、手機捲動、安全區與靜態部署驗收。 |

需驗證尺寸：360×780、390×844、768×1024、1440×900、1920×1080。測試框架已加入這五組 Chromium viewport、Reduced Motion 與 WebKit 手機模擬。

目前測試涵蓋狀態契約、完整開信／翻面／詳情流程、千字長文與捲動保留、鍵盤焦點、Reduced Motion、觸控捲動與動畫備援。WebKit 模擬不能替代真實 iPhone／Safari 測試。

## 不阻擋開發、上線前再確認

- 正式生日信、收件稱呼、署名，以及是否替換預設標題。
- 神祕禮物的 2026/11/18 公開承諾與預告措辭。
- 分享圖片、正式網址，以及 Cloudflare 帳戶與 Git 儲存庫。

現有規格已足以完成示範版，以上正式內容不阻擋 Phase 1 實作。
