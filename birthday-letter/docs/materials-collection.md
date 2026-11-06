# 生日文具素材組

2026-11-05 使用內建 `image_gen` 製作，延續網站的奶油白、淡紫、乾燥玫瑰與可可色鉛筆線條，搭配低飽和水彩質感。鴨子與青蛙以使用者提供的照片作角色參考。

| 素材 | 檔案 | 尺寸 |
| --- | --- | --- |
| 薰衣草 | [lavender.png](../public/artwork/birthday-collection/lavender.png) | 1254 × 1254 |
| 開心鴨子 | [happy-duck.png](../public/artwork/birthday-collection/happy-duck.png) | 1254 × 1254 |
| 青蛙 | [frog.png](../public/artwork/birthday-collection/frog.png) | 1254 × 1254 |
| 麻辣蝦子 | [spicy-shrimp.png](../public/artwork/birthday-collection/spicy-shrimp.png) | 1254 × 1254 |
| 巧克力蛋糕 | [chocolate-cake.png](../public/artwork/birthday-collection/chocolate-cake.png) | 1254 × 1254 |
| Steam 圖示 | [steam-emblem.png](../public/artwork/birthday-collection/steam-emblem.png) | 1254 × 1254 |

六張皆保留原始 RGBA 透明背景。鴨子保留大眼睛、平面粉紅腮紅、愛心舌頭與張開的翅膀；右下方為抬起的蹼足；青蛙以原圖為底，保留原本瞇眼、腮紅與坐姿，僅將嘴巴改為小笑嘴。食物素材採相同水彩媒材。Steam 圖示依 [Steam 官方標誌](https://store.steampowered.com/public/shared/images/header/logo_steam.svg) 的幾何輪廓風格化，Steam 及其標誌屬 Valve，品牌資料見 [Steamworks](https://partner.steamgames.com/doc/marketing/branding?l=english)。官方來源 SVG 與參考圖存於 `docs/references/`。

## 使用

- 開發預覽：<http://127.0.0.1:5173/materials.html>
- [獨立素材預覽頁](../public/materials.html)：可切換奶油白、淡紫與透明格背景，逐張下載 PNG。
- [整組 ZIP](../public/artwork/birthday-materials.zip)：六張 PNG、素材清單、README 與完整提示詞。
- [完整提示詞](../public/artwork/birthday-collection/prompts.md)
- [素材清單](../public/artwork/birthday-collection/manifest.json)

麻辣蝦子與光滑版巧克力蛋糕已放入「吃得爽快」詳情，Steam 圖示已放入「玩得開心」。鴨子與蛋糕修訂提示詞見 [素材修訂](material-revisions.md)。原始 PNG 可保留作印刷編排來源，網頁中的尺寸可用 CSS 自由設定。

## 驗證

`node scripts/capture-materials.mjs` 已驗證桌面 Chromium、手機 Chromium 與 WebKit：六張圖均可解碼為 1254×1254，具透明像素與可見筆觸；三種底色切換正常，390px 及 320px 無水平溢出。PNG 下載與原始檔位元組一致，ZIP 可下載；另逐一核對 ZIP 內 9 個檔案的 SHA-256 與來源一致。紀錄見 [materials-check.json](screenshots/materials-check.json)，畫面見 [桌面](screenshots/materials-desktop.png)／[手機](screenshots/materials-mobile.png)。
