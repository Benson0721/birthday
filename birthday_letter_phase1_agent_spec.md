# 生日賀卡網站 Phase 1 — Coding Agent 實作規格書

> **版本**：v1.0  
> **日期**：2026-11-04  
> **文件性質**：可直接交付 Coding Agent（Codex / Cursor / Claude Code 等）的產品與工程規格  
> **目前開發範圍**：**只實作 Phase 1：3D 信封、展信、雙面信紙、禮物清單與禮物詳情。不要實作寵物。**

---

## 0. 給 Coding Agent 的執行指令（請先讀）

你要開發一個可正式部署的、繁體中文為主的個人生日賀卡網站。它是一份「可以親手拆開、閱讀、翻面」的 3D 數位信件，不是一般商業網站。

**請先閱讀並實際檢視下方參考專案的 HTML、CSS、JavaScript，以及 MIT License：**

- Live Demo：<https://yuktrium.github.io/3D-Love-Letter/>
- GitHub：<https://github.com/yuktrium/3D-Love-Letter>
- 主要原始碼：[`index.html`](https://github.com/yuktrium/3D-Love-Letter/blob/main/index.html)、[`style.css`](https://github.com/yuktrium/3D-Love-Letter/blob/main/style.css)、[`script.js`](https://github.com/yuktrium/3D-Love-Letter/blob/main/script.js)
- 授權：[`LICENSE`](https://github.com/yuktrium/3D-Love-Letter/blob/main/LICENSE)（MIT；Copyright © 2026 Yuktrium）

**參考規則**：
1. 優先參考其漂浮信封、封口翻開、口袋的前後遮擋、信紙抽出與 3D 層次；**可以在符合 MIT 授權的前提下修改或重用程式碼**。
2. **不要直接照搬原作的三折信／小尺寸閱讀版型**。本專案在信紙抽出後，必須額外擴展為可閱讀長文的固定外框尺寸、**正反兩面可翻轉的 3D 信紙**。
3. 原作 `script.js` 主要以點擊切換 `.open` class；本專案必須改為可控制流程的 React 狀態，避免動畫競爭與重複觸發。
4. 若複製或改作其原始碼／實質部分，保留 MIT 版權及授權聲明（例如 `THIRD_PARTY_NOTICES.md`，附完整原授權文字與來源連結），不可假裝全部都是自行原創。
5. 不用等正式信件文字、圖片或寵物素材才開始。**先以易於替換的示範文案與 CSS 視覺完成可運作版本**。不要捏造私人回憶或替使用者寫成「正式生日信」。
6. 優先完成功能、手感、手機易用性與可靠性；無需後端、資料庫、登入、付款、真正的兌換碼。
7. 每個主要里程碑完成後進行本機預覽與測試；若有可用的瀏覽器測試能力，實際操作桌面及手機 viewport。最後提供執行、部署與替換內容的方式。

## 1. 專案目標、情境與成功標準

### 1.1 產品目標

為收件人製作一個**溫柔、療癒、有手作感**的生日網站：進入首頁先看見上下輕柔漂浮的 3D 信封，點擊後信封展開、小卡抽出並自然放大為完整信紙。**信紙正面是生日信，背面是三份可點擊拆開的生日禮物**。翻面必須具有明確的立體紙張感。

核心感受：
- 收到專屬信件，而非進入一個功能展示網站。
- 先閱讀心意，再自行探索禮物。
- 儀式感適量：每個重要動作都有回饋，但不強迫等待或重複點擊。
- 讀長文順暢，手機與桌面都舒服。

### 1.2 使用者旅程（必須實作）

```text
進入網站
  ↓
3D 信封在柔和背景中央上下漂浮（可點擊／鍵盤啟動）
  ↓ 點擊一次
封口打開 → 小卡抽出 → 小卡過渡為放大信紙（自動連續）
  ↓
信紙正面：生日信（長文可捲動）
  ↕ 點擊「翻到背面」／可選的水平手勢
3D 信紙翻面 180°
  ↓
信紙背面：三列禮物，按任意順序點開
  ↓ 點其中一列
獨立於信紙 3D 容器的全螢幕禮物詳情 Overlay
  ↓ 返回
恢復背面三列清單，保留已拆開狀態，可繼續拆另一份
  ↕ 可隨時翻回正面重新讀信
```

### 1.3 Phase 1 完成定義（Definition of Done）

- 信封浮動、點擊開啟、信紙抽出／放大過場連續且不卡頓。
- 放大後有**真正的 3D 正反翻面**，不是瞬間換文字或導到另一個網頁。
- 正面可放 200～1,000 字以上中文長信，內容不因翻面而被截斷或丟失捲動位置。
- 背面固定三列禮物，任一列可展開**全畫面**詳情，能返回繼續拆其他禮物。
- 手機可正常上下滑動閱讀；翻面不會因普通斜向／垂直滑動被意外觸發。
- 桌面滑鼠、手機觸控、鍵盤基本操作正常；無文字鏡像、明顯穿模、層級錯誤。
- 有可替換的內容設定檔、README、基本測試及可部署的靜態產物。

## 2. 範圍界線

### 2.1 In Scope — Phase 1

- 單頁式生日賀卡；漂浮信封、開啟動畫、小卡抽出、信紙放大。
- 純 CSS 3D（搭配 React 狀態）的雙面信紙。
- 正面可捲動的繁體中文生日信及簽名區。
- 背面三列禮物：玩得開心／吃得爽快／神祕小禮。
- 全螢幕禮物詳情；關閉、返回、繼續拆下一份禮物。
- RWD、觸控、必要的鍵盤操作、Reduced Motion 與基本無障礙支援。
- 基本 SEO 分享資訊（網頁 title / description / favicon 佔位）。
- 靜態部署（優先 Cloudflare Pages）。

### 2.2 Out of Scope — Phase 2 / 後續

- **不要在 Phase 1 實作**網頁小寵物：Idle／Walk／Sleep／Happy、行走位置、互動、Sprite Sheet。
- 不做 Godot Windows 桌面寵物、不做下載頁的實際安裝流程。
- 不做登入、支付、Steam API、餐廳訂位、自動發券、資料庫。
- 不加背景音樂自動播放、複雜粒子動畫、額外導覽列或多人賀卡編輯器。
- 只保留後續可加入小寵物的視覺空間與元件擴充位置；**無須為 Phase 2 提前建立遊戲 FSM**。

## 3. 技術棧與工程準則

| 層級 | 採用方案 | 理由 |
|---|---|---|
| Framework | React + TypeScript | 與現有前端經驗一致，適合 UI 狀態及可重用元件 |
| Build | Vite | 輕量，適合靜態部署 |
| Styling | CSS Modules 或結構清楚的原生 CSS + CSS Variables | 易於維護 3D transform、animation、pseudo-elements |
| 3D | **CSS `perspective` / `transform-style: preserve-3d` / `rotateX` / `rotateY`** | 不需要 Three.js 或 WebGL |
| 狀態 | React hooks + 明確型別；複雜流程時使用 `useReducer` | 讓進場動畫與翻面、禮物互動解耦 |
| 禮物詳情 | React Portal (`createPortal`) | 避開 3D transform 的堆疊與 fixed 定位問題 |
| 圖示 | SVG / 輕量 icon library（可選） | 風格統一、可縮放 |
| 字型 | Noto Serif TC、Noto Sans TC 與系統 fallback | 長文可讀性 |
| 測試 | Vitest（邏輯）+ Playwright（若可用）或等效手動檢查 | 覆蓋狀態與手機操作 |
| 部署 | Cloudflare Pages 靜態網站 | 無需伺服器 |

**工程要求**：
- 選用相容的穩定版依賴，產生並提交 lockfile；不要無理由加 Framer Motion、GSAP、Three.js、狀態管理框架。
- 視覺核心以 CSS transform + opacity 驅動，避免每一幀改 `top/left/width/height` 造成 layout thrashing。布局擴張可用 FLIP 或兩層轉場處理；最終尺寸由正常 CSS 排版控制。
- 將設計 Token、時間參數集中管理，不能把相同時間值散落多處。
- 使用語意 HTML，React 元件主要用於呈現與可測試互動。
- 如現有專案已有相近堆疊，優先沿用，不要擅自覆寫其他功能。

## 4. UI / UX 設計方向

### 4.1 情緒與風格

**主題：溫柔療癒、奶油紙張、淡紫粉、乾燥玫瑰、手作信件。**

- 氣質：私密、柔和、舒適、略帶童話感，避免過度花俏／商業優惠券風。
- 背景：淡紫／奶油色柔和漸層，可有非常低對比的紙張紋理、光暈與陰影。
- 信封：紙張折疊、前口袋、三角封口、愛心蠟封／小封印；強調立體層次，不要大片高光。
- 信紙：奶油白、有細微投影與紙緣線；文字為畫面主角。
- 禮物：同一張信紙背面展示三條整列卡片；點擊後以全屏詳情展開。
- 裝飾避免遮擋文字，尤其不要飄落特效持續干擾閱讀。

### 4.2 色彩 Token（可在細節中微調）

```css
:root {
  --color-bg: #F2E8F0;
  --color-paper: #FFFCF6;
  --color-paper-edge: #E6D6CC;
  --color-envelope: #E9CFCD;
  --color-envelope-fold: #DDB8BD;
  --color-accent: #C995A2;
  --color-accent-deep: #9C7084;
  --color-text: #6E5A56;
  --color-muted: #9C827D;
  --color-soft-card: #F7EEF0;
  --shadow-envelope: 0 24px 50px rgb(101 72 89 / 16%);
  --shadow-paper: 0 24px 70px rgb(99 72 81 / 16%);
}
```

### 4.3 字型與排版

- 標題：`Noto Serif TC`，保留書信感；內文：`Noto Sans TC` 或閱讀友善的繁中字型。
- 正文行高建議 1.8～2.0；桌面內文 16～18px，手機 16px 起，請實測而非硬套。
- 信件不要強迫逐字打字；展開動畫結束後一次顯示全文。
- 手機操作元素觸控目標建議至少 44×44 CSS px。
- 主文案繁體中文；英文裝飾可有，但勿讓英文成為主內容。

## 5. 版面與 RWD 規格

### 5.1 初始信封

- 進站置中信封，上下輕微漂浮；桌面可略大，手機按可用寬度縮放。
- 視覺焦點明確；下方提示「輕觸信封，打開這封信」。
- 信封可被滑鼠點擊、觸控點擊，以及鍵盤 Enter/Space 啟動。
- 預設無側邊欄、無選單、無大型 footer。

### 5.2 展開後固定外框信紙

建議初始參數（可依真實畫面微調）：

| 裝置 | 信紙最大寬度 | 信紙最大高度 | 外側留白 |
|---|---:|---:|---|
| 桌面 ≥ 1024px | 620～720px | `min(82dvh, 850px)` | 至少 24～40px |
| 平板 | `min(90vw, 680px)` | `min(86dvh, 820px)` | 至少 16px |
| 手機 ≤ 767px | `calc(100vw - 24px)` | `calc(100dvh - 32px - safe-area)` 上限 | 12px 起 |

- 使用 `100dvh` 與 `env(safe-area-inset-*)`，考慮手機瀏覽器動態工具列。
- **固定尺寸的是信紙外框，不是文字容器的內容高度**。
- 信紙正反面共用尺寸，**各有獨立 `overflow-y: auto` 的內容區**，可捲動、不被裁切。
- 翻面按鈕盡量放在信紙內固定的底部工具列／邊緣區，內容捲動不應讓按鈕消失。
- 翻面時保留正面閱讀捲動位置及背面列表位置；回來不用從頭讀。
- 避免一邊高度自動增加造成旋轉過程尺寸跳動。
- 頁面外層通常不捲動，由信紙內部捲動；禮物全畫面詳情則可獨立捲動。

## 6. 3D 動態與轉場規格（重點）

### 6.1 動畫序列：信封 → 小卡 → 放大信紙

**一次點擊，完整連續播完；不得要求第二次點擊小卡才能放大。**

| 步驟 | 初始建議時間 | 動畫細節 |
|---|---:|---|
| Floating（等待） | 4～5s / loop | `translateY(-6px ~ +6px)`，ease-in-out、輕柔陰影變化 |
| Opening（封口打開） | 約 0.6～0.7s | 封口上翻 `rotateX(-180deg)`；封蠟隨封口淡出；口袋層級正確 |
| Extracting（抽出小卡） | 約 0.65～0.85s | 信紙 `translateY` 上升、旋轉攤平；稍微延遲於封口 |
| Expanding（小卡放大） | 約 0.7～0.9s | 小卡從信封座標／尺寸自然過渡至居中的閱讀信紙 |
| Expanded（穩定閱讀） | 常態 | 信封淡出或退場，信紙完全可閱讀；此時才能操作翻面 |

**時間為設計初稿**。整段進場約 1.8～2.5 秒，允許部分動畫重疊，避免串行相加過長。將時序統一配置；避免 JS magic timeout 和 CSS 時長不一致。最好透過 `transitionend` / `animationend` 控制步驟完成並提供錯誤 fallback，清理 listener/timer，防止重複點擊。

**重大架構要求**：
- 參考專案的信封與抽卡視覺可以改用，但從「小卡」變成「正式閱讀信紙」要獨立設計，避免原始複雜 `transform` 影響文字排版與捲動。
- 可將動畫分為 `EnvelopeStage`（小卡在信封裡）與 `ExpandedPaper`（主閱讀物件），使用共享幾何尺寸／FLIP 讓交接看似同一張紙。
- 不可在兩個階段切換時出現顯著閃爍、瞬間跳位、文字縮小後難以閱讀的問題。
- 不要求整個信封在 Expanded 後仍存在 DOM 可見畫面內。

### 6.2 3D 正反翻面（必須）

```css
.paper-scene { perspective: 1200px; }
.paper-flipper {
  transform-style: preserve-3d;
  transition: transform 800ms cubic-bezier(.22, .61, .36, 1);
}
.paper-flipper[data-side="back"] { transform: rotateY(180deg); }
.paper-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.paper-back { transform: rotateY(180deg); }
```

此段僅展示原理，請自行建立完整實作。驗收重點：
- 旋轉的是整張信紙的固定尺寸外框；不是讓整個網站旋轉，也不是把內容淡出後瞬間替換。
- 正反面都使用真實 HTML 文本和可操作按鈕，沒有鏡像文字。
- 非作用面不可獲取焦點、不可誤點；需處理 `inert`/焦點切換（或等效機制）。
- 旋轉過程避免前後面同時閃爍（背面剔除、層級與合成檢查）。
- 使用者持續點擊「翻面」時不得造成中間狀態混亂，可在翻轉中暫時鎖定操作。
- 可反覆 `front ↔ back`，次數不限，信件與禮物的閱讀狀態保留。
- 翻面時禮物詳情若已開啟，不允許同時翻面；需先關閉詳情。

### 6.3 禮物整列展開成全畫面

- 信紙背面有三列**直向排列、全列可點擊**的禮物卡片。
- 點擊任何一列時，視覺上由該列向外擴展／柔和淡入至**覆蓋整個 viewport 的詳情畫面**（可用共享元素轉場；若實作複雜，先用 250～450ms scale + opacity）。
- 禮物詳情用 `createPortal(..., document.body)` 渲染於 3D 信紙容器之外；不被 `overflow` 裁切、`transform` 影響定位。
- 詳情內容必須有固定可見「返回三份禮物」按鈕，支援 Esc 關閉；手機返回鍵若能與 history state 相容則正確返回。
- 打開時鎖住背景捲動、管理焦點（進入詳情／返回觸發元素）、讓背景不可互動。
- 關閉後返回**背面三列清單**、保持原有位置與拆封紀錄；不要重新播放開信動畫。
- 禮物詳情可以獨立垂直捲動，避免窄螢幕文字被遮擋。

## 7. 手勢、滑鼠、觸控行為

### 7.1 核心規則

| 行為 | 桌面 | 手機 |
|---|---|---|
| 開信 | 點信封／Enter／Space | 輕觸信封 |
| 讀長信 | 滑鼠滾輪、觸控板或捲軸 | **垂直滑動** |
| 翻面（必備） | 明確的「翻面」按鈕 | 明確的「翻面」按鈕 |
| 翻面（增強） | 從信紙外緣拖曳／點邊緣；可延後 | 從紙張**邊緣**水平滑動；可延後 |
| 禮物 | 點擊其中整列 | 輕觸其中整列 |
| 返回禮物清單 | 按鈕、Esc | 按鈕、瀏覽器返回（如已支援） |

### 7.2 手勢衝突處理

- **不要使用斜上／斜下滑動作為主要翻面判斷**，因為自然的垂直捲動常包含橫向位移。
- Phase 1 必備是「翻面按鈕」；**水平滑動屬可選 P2 增強**，不得影響 MVP 交付。
- 若實作手勢：只從信紙左右外緣（約 24～32px hit zone）啟動，且僅在沒有全畫面詳情時有效。
- 初始閾值可用 `abs(dx) >= 80px` 且 `abs(dx) >= 1.5 * abs(dy)`；需實機調整。
- 在內容滾動區保留原生 touch 行為（例如 `touch-action: pan-y`），不要全域 `preventDefault()`；達到明確意圖才觸發翻面。
- 一般上下滑動、短距離斜滑、點禮物卡不能意外翻面。
- 動畫進行中，不接受新手勢，避免翻面尚未結束再次觸發。
- 桌面「拖曳信紙邊框翻面」同樣是增強，不要為了拖曳犧牲文字選取或捲動。

## 8. 頁面內容規格

### 8.1 信件正面 Front

- 頂部小型裝飾（`HAPPY BIRTHDAY`、細線、日期等），繁體中文標題「給妳的一封信」。
- 生日信正文由 `src/content/letter.ts` 或 Markdown / JSON-like 結構統一管理，支援分段、換行與基本強調。
- 預設採**中性的佔位文案**，清楚提示「此處將填入正式生日信」。**不得自行編造兩人的私人經歷與稱呼。**
- 署名在信件末尾；當內容很長時可捲動至底部閱讀。
- 信紙中可見操作「翻到背面看看禮物」，無需先滾到最底下才能翻面。

### 8.2 信紙背面 Back：三列禮物

背面標題建議「為妳準備的三份小幸福」，副標「想先拆哪一份都可以」。

1. **🎮 玩得開心**  
   詳情：「Steam 遊戲任選券」——可以任選一款想玩的 Steam 遊戲，使用者會在現實中購買贈送；**不是 Steam 官方兌換碼**。文案可說「現在不用決定，之後挑好再告訴我」。不要擅自加入價格上限。
2. **🍽️ 吃得爽快**  
   詳情：「泰味館吃到飽招待」——由送禮者現實中請客，時間可另約；**不是餐廳官方發行的憑證**。不要捏造訂位、分店、價格或優惠條款。
3. **🎁 神祕小禮**  
   詳情：預告 **2026/11/18 公開**，和預計製作中的桌面寵物相關，但**Phase 1 不先揭露完整禮物或提供虛構下載**。可以用「有個小傢伙準備來見妳」的溫柔文字作預告。上線前由使用者最終確認。

- 三列只展示禮物主題、插畫／icon 和「點擊拆開」提示，**實際禮物內容應在點開後揭曉**，保留驚喜。
- 已拆過的禮物可加小標記「已看過／可再查看」，但仍可重新打開；不能真的把它鎖住。
- 11/18 日期只是預告，**不得以純前端時間判斷冒充真正防提前查看的安全控制**。後續若需在公開日切換正式內容，另行更新部署即可。
- 禮物資料集中為可改的 `Gift` 型別與設定檔，不要把文案散落在 JSX 裡。

## 9. 狀態模型與交互事件

建議把動畫階段、紙張方向、禮物詳情**拆為不同狀態**，避免互相干擾。

```ts
type EnvelopePhase =
  | 'floating'
  | 'opening'
  | 'extracting'
  | 'expanding'
  | 'expanded';

type PaperSide = 'front' | 'back';
type GiftId = 'steam' | 'thai' | 'mystery';

type AppState = {
  envelopePhase: EnvelopePhase;
  paperSide: PaperSide;
  activeGift: GiftId | null;
  openedGiftIds: GiftId[];
  isPaperFlipping: boolean;
};
```

### 9.1 事件契約

| 事件 | 前置條件 | 行為 |
|---|---|---|
| `OPEN_ENVELOPE` | `floating` | 鎖住重複點擊、開始開信序列 |
| `ENVELOPE_OPENED` | `opening` | 進入抽卡 |
| `CARD_EXTRACTED` | `extracting` | 進入放大 |
| `PAPER_EXPANDED` | `expanding` | 進入 `expanded`、正面可閱讀 |
| `FLIP_PAPER` | `expanded`、無 activeGift、未翻轉中 | front/back 翻面 |
| `OPEN_GIFT(id)` | `expanded` + `back`、未翻轉中 | 顯示全畫面禮物、標記已開啟 |
| `CLOSE_GIFT` | `activeGift != null` | 關閉詳情，回背面三列 |

規則：
- 開信序列是**單向的首次儀式**；正常使用不需要回到未開信狀態。重新整理頁面可從初始重新開始。
- 正反面可以重複切換；只限制翻轉過程中的衝突事件。
- `openedGiftIds` 只代表「曾打開過」，不代表真正兌換。預設本次工作階段記憶即可；若採 localStorage，應以版本化 key 保護資料格式，且不可儲存敏感資訊。
- `activeGift` 不得是第四個紙張面；它是一個獨立 Overlay。
- 不可依賴 `setTimeout` 散落在元件內，導致離開頁面後舊 timer 修改狀態；所有延遲需清理，支援 Reduced Motion 快速收斂。

## 10. 元件與建議目錄結構

```text
birthday-letter/
├─ public/
│  ├─ favicon.svg
│  └─ assets/                   # Phase 1 裝飾素材；Phase 2 預留 pet/
├─ src/
│  ├─ app/
│  │  ├─ App.tsx
│  │  └─ useLetterFlow.ts       # 開信、翻面、禮物狀態與事件
│  ├─ components/
│  │  ├─ EnvelopeScene.tsx     # 漂浮、封口、口袋、小卡抽出
│  │  ├─ ExpandingCard.tsx     # 小卡銜接成大型信紙
│  │  ├─ FlippablePaper.tsx    # 3D 翻面容器
│  │  ├─ LetterFront.tsx       # 正面正文與獨立捲動
│  │  ├─ GiftBack.tsx          # 背面三列
│  │  ├─ GiftRow.tsx
│  │  ├─ GiftDetailOverlay.tsx # Portal、focus、返回
│  │  └─ PaperFlipControl.tsx
│  ├─ content/
│  │  ├─ letter.ts
│  │  └─ gifts.ts
│  ├─ styles/
│  │  ├─ tokens.css
│  │  ├─ global.css
│  │  ├─ envelope.css
│  │  ├─ paper.css
│  │  └─ gifts.css
│  ├─ main.tsx
│  └─ vite-env.d.ts
├─ README.md
├─ THIRD_PARTY_NOTICES.md     # 如果參考／重用 MIT 原始碼
├─ package.json
└─ ...
```

結構為建議而非硬性限制；請避免為每個純展示小區塊建立沒有必要的抽象。未來 Phase 2 可在 Expanded 場景外加入 `PetLayer`，**不應改動 Phase 1 狀態契約**。

## 11. 可用性、無障礙與瀏覽器兼容

- 信封使用原生 `<button>` 或同等可聚焦語意互動元素，附清楚 accessible label。
- 翻面、返回及禮物各有可見的互動指示，且能用 Tab / Enter / Space 操作。
- 翻面時讓背面非作用面無法獲得焦點；焦點不應停在看不到的按鈕。
- 詳情 Overlay 使用 `role="dialog"`、`aria-modal="true"`、可辨識標題；開啟後焦點進入，關閉後焦點回到原禮物列；必要時 focus trap。
- 尊重 `prefers-reduced-motion: reduce`：停止漂浮／簡化或瞬間完成開信、翻面、彈出，不影響功能。
- 不要因動畫隱藏重要內容；動畫失敗時可進入信紙可閱讀狀態。
- 避免動畫內大量陰影濾鏡、模糊與 scroll event DOM 更新。
- 檢查 Safari（特別 iOS）對 `backface-visibility`、3D transform、`dvh`、固定 Overlay 的呈現；必要時加入 `-webkit-` 前綴。
- 至少測試 Chromium 桌面與手機模擬 viewport；可用時補 Safari/iOS 實機。

## 12. 測試案例與驗收清單

### 12.1 必測裝置／視窗尺寸

- 360 × 780（小手機）
- 390 × 844（常見手機）
- 768 × 1024（平板）
- 1440 × 900（桌面）
- 1920 × 1080（大桌面）

### 12.2 核心流程

- [ ] 初始有漂浮信封、點擊提示、柔和視覺，無水平溢出。
- [ ] 點擊一次開信；快速連點不會出現多個序列或重複展開。
- [ ] 封口、口袋、小卡層次正確，抽出過程不穿模、不突兀跳位。
- [ ] 小卡放大後信紙可直接閱讀，文字不被原信封遮擋。
- [ ] 長信（至少 1,000 字測試資料）正面可捲動，翻面再回來保留捲動位置。
- [ ] 翻面有 3D Y 軸旋轉效果，正反面無鏡像文字或雙面閃爍。
- [ ] 三列禮物皆可點擊；詳情覆蓋全畫面，內容沒有被裁切。
- [ ] 點 Steam／泰味館／神祕小禮分別顯示正確詳細文案。
- [ ] 詳情返回後仍在背面，仍能點開其他兩份；已看過狀態正常。
- [ ] 正面與背面可反覆翻動，無卡死。
- [ ] 手機上下滑正常；若實作水平手勢，不會被普通上下／斜向滑動誤觸。
- [ ] 手機虛擬導覽列／安全區不遮擋翻面和返回按鈕。
- [ ] 鍵盤可開信、翻面、開禮物、關閉詳情；焦點合理。
- [ ] Reduced Motion 模式下所有內容與功能仍可使用。
- [ ] 開發主控台沒有執行錯誤／React warning；production build 成功。
- [ ] 靜態部署後從實際網址可完整操作，不依賴本機路徑。

### 12.3 建議自動化測試

- 單元：各狀態事件的合法轉換、重複開信阻擋、`activeGift` 開關、拆封歷史保留。
- E2E：開信 → 翻背面 → 開 Steam 詳情 → 返回 → 開泰味館 → 翻回正面。
- E2E：手機觸控／滑動後未意外翻面、長信可閱讀。
- E2E：Reduced Motion 仍能正常抵達 Expanded 與禮物詳情。

## 13. 實作優先順序與交付里程碑

### Milestone A — 可閱讀的功能骨架（P0）

1. Vite + React + TypeScript 專案設定、Token 與字型。
2. 不帶動畫的擴展信紙、正反面結構、滾動布局。
3. 三列禮物與全螢幕詳情 Overlay、返回邏輯。
4. 桌面／手機基本可操作；正反面內容皆正確。

**驗收**：即使全部動畫關閉，網站仍可從信件閱讀到三份禮物。

### Milestone B — 3D 視覺與主體動畫（P0）

1. 參考 MIT 範例改作漂浮信封與封口、口袋。
2. 封口開啟 → 小卡抽出 → 放大信紙的一段式流程。
3. 固定外框信紙真正 3D `rotateY(180deg)` 正反面翻轉。
4. 禮物詳情柔和展開、返回動畫。

**驗收**：進場與翻面自然、不卡死、不破版，手機可用。

### Milestone C — 使用體驗與交付（P0）

1. 正式內文易於替換，禮物文案完善。
2. 鍵盤、Focus、Reduced Motion、手機安全區、滾動與 Overlay 測試。
3. 生產編譯、靜態部署設定、README、授權註記。
4. 完成最後測試清單並列出殘留風險。

### Optional Enhancement（P2，不得阻擋交付）

- 手機從紙張左右邊緣水平滑動翻面。
- 桌面拖曳信紙邊緣產生有限角度的 3D 預覽／釋放後翻面。
- 精緻的 Shared Element Transition（禮物列擴至全畫面）。
- 少量紙屑／光點等輕量裝飾，前提是不干擾閱讀。

## 14. Agent 最終交付物

1. 完整可運作原始碼、package lockfile。
2. `README.md`：安裝、執行、測試、打包、Cloudflare Pages 部署步驟。
3. 清楚標示生日信和三份禮物的編輯位置。
4. 如重用第三方程式碼，提供完整必要的 MIT 版權／授權紀錄。
5. 實際執行 `build` 及必要測試，報告通過／未通過項目；若無測試環境，明確說明未驗證部分。
6. 以文字簡述 Phase 1 已完成的互動、尚有的限制、Phase 2 可能需要接入的預留位置。
7. **不要把 Phase 2 小寵物功能混入本次交付。**

## 15. 非目標與決策預設

在使用者未另外指定時，採用以下預設，不應因細節缺少而停工：

- 先用佔位的信件段落、非正式祝福文字與簡易 SVG / CSS 禮物圖示；後續可替換。
- 信件的正面是完整生日信、背面是三列禮物，不增加第二個路由或多餘內容頁。
- 翻面以**按鈕操作優先**；拖曳／滑動是加分選項。
- 生日網站採單頁式 SPA；無伺服器／使用者帳號／資料庫。
- 禮物不需要送出兌換表單，送禮者會在現實中履行承諾。
- 11/18 是神祕禮物預告日期，正式桌面寵物交付屬後續工作。
- 優先確保手機閱讀與穩定性，再追求「像真的紙張」的極致擬真度。

---

## 16. 參考來源與授權備註

- Yuktrium 3D Love Letter Demo：<https://yuktrium.github.io/3D-Love-Letter/>
- Yuktrium 3D Love Letter GitHub：<https://github.com/yuktrium/3D-Love-Letter>
- HTML 結構：<https://github.com/yuktrium/3D-Love-Letter/blob/main/index.html>
- CSS 3D 動畫：<https://github.com/yuktrium/3D-Love-Letter/blob/main/style.css>
- 原版事件處理：<https://github.com/yuktrium/3D-Love-Letter/blob/main/script.js>
- MIT License：<https://github.com/yuktrium/3D-Love-Letter/blob/main/LICENSE>

> 備註：上游範例目前包含折疊信紙（三個 panel）、信封封口與抽出的 3D 動畫。**本規格要求的「小卡放大為長信閱讀頁」、「整張信紙正反翻面」、「三列禮物全螢幕詳情」屬於本專案新增需求，不能期待直接複製上游就會完成。**

**終極產品準則：** 這是一份收件人願意慢慢閱讀的生日禮物，不是一個用動畫證明技術能力的作品。動畫應服務於閱讀與驚喜，而非反過來。
