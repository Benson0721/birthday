# 開發環境驗證紀錄

> 本文件保留初始環境建置時的檢查結果。網站後續已實作 Phase 1，現況請見 [Phase 1 功能驗收](phase1-verification.md)。

驗證日期：2026-11-04（Asia/Taipei）。範圍為本次建立的開發環境與靜態佔位頁。

驗證路徑：瀏覽器載入首頁 → Vite／靜態產物 → React 入口 → `src/content/letter.ts` → 繁中信件呈現。此階段無 API、資料庫或外部內容請求。

## 執行環境

- Windows、PowerShell 5.1。
- Node.js `v24.16.0`、npm `11.13.0`、Git `2.54.0.windows.1`。
- 專案：`C:\Users\a0924\OneDrive\桌面\瓜生\birthday-letter`。
- 依賴採精確版本；`package-lock.json` 可供 `npm ci` 重建。
- 已安裝 Playwright Chromium v1248（Chrome for Testing 156.0.8078.4）、WebKit v2370（27.2），以及測試所需輔助程式。

## 已通過的檢查

| 檢查 | 結果與證據 |
| --- | --- |
| Windows 重建腳本 | `scripts/setup.ps1` 成功執行 `npm ci` 與瀏覽器安裝；exit code 0。 |
| 依賴相容性 | `npm ls --depth=0` exit code 0，11 項直接依賴均正常，無缺失／無效依賴。 |
| 套件公告檢查 | 最終乾淨安裝輸出 `found 0 vulnerabilities`，共 audited 52 packages。 |
| 靜態檢查 | `npm run lint` exit code 0。 |
| 單元測試 | `npm test`：1 個測試檔、2 個測試通過，檢查信件與三份禮物設定的完整性。 |
| 型別檢查 | `npm run typecheck` exit code 0，涵蓋應用程式、Vite 設定與 Playwright 測試。 |
| 正式建置 | `npm run build` 成功，輸出 `dist/index.html`、favicon 與 JS／CSS assets。 |
| 正式產物 E2E | `npm run test:e2e`：7 passed，exit code 0，測試完成後自動停止 preview server。 |
| 開發伺服器 | Vite 在 201ms 內就緒；首頁 HTTP 200，標題為「給妳的一封信｜生日快樂」。 |
| HMR | 瀏覽器已建立至本機 Vite 的 WebSocket 連線，`/@vite/client` 可正常存取。 |
| 瀏覽器錯誤 | 佔位頁未出現 `pageerror` 或 console error。 |
| 人工畫面檢視 | 已查看 1440×900 桌面與 390×844 手機截圖，繁中、信紙排版及留白正常。 |

正式產物大小：HTML 約 0.92 kB、CSS 約 1.60 kB、JavaScript 約 220.19 kB（gzip 約 69.08 kB）。

## E2E 專案

| 瀏覽器／模式 | Viewport | 結果 |
| --- | --- | --- |
| Chromium 桌面 | 1440×900 | 通過 |
| Chromium 小手機、觸控 | 360×780 | 通過 |
| Chromium 手機、觸控 | 390×844 | 通過 |
| Chromium 平板、觸控 | 768×1024 | 通過 |
| Chromium 大桌面 | 1920×1080 | 通過 |
| Chromium Reduced Motion | 390×844 | 通過 |
| WebKit iPhone 13 模擬 | 390×844 | 通過 |

各專案均檢查 HTTP 200、頁面 title、`zh-Hant` 語系、可見信件標題、佔位文字、無水平溢出與無主控台錯誤。

## 已處理的環境問題

- Node 直接 HTTPS 請求曾遇到 `UNABLE_TO_VERIFY_LEAF_SIGNATURE`。安裝腳本與專案 IDE 終端機改用系統 CA（`NODE_USE_SYSTEM_CA=1`），保留 TLS 驗證，已成功完成套件與瀏覽器下載。
- 最終使用 Vite 模板採用的 Oxlint 與 TypeScript 7，避免引入 ESLint 工具鏈目前的 minimatch 漏洞依賴。沒有使用強制降版、忽略 peer dependencies 或跨主版本 override。
- Playwright 首輪自動推估 6 workers 時有多組瀏覽器逾時。現將併行數固定為 2；同一組 7 項測試在 5.7 秒內全部通過。
- Playwright 的瀏覽器端 `page.evaluate` 需要 DOM 型別，已納入測試的 TypeScript 設定。

## 參考專案檢視

已讀取上游 HTML／CSS／JavaScript／MIT License，並實際載入展示頁、點開信封、查看開啟前後畫面。展示頁 HTTP 200，點擊後為 `.envelope.open`。GitHub 連線工具不可用時，以公開原始碼連結及瀏覽器完成檢視。

完整上游授權與參考來源保留於 `THIRD_PARTY_NOTICES.md`，目前未移植其實質動畫程式碼。

## 尚未驗收的功能

- 信封動畫、小卡放大、真正 3D 翻面與長信捲動位置保留。
- 三列禮物、Portal 全畫面詳情、返回與拆封紀錄。
- 上述互動的鍵盤焦點、背景鎖定、Reduced Motion 動畫簡化與手機捲動。
- 真實 iPhone／Safari 測試與遠端 Cloudflare Pages 部署。

以上功能需在後續 Milestone A～C 實作及驗收。現在的 Reduced Motion／手機測試只確認佔位頁可正常載入；不能推論尚未實作的互動已通過。
