# Birthday

繁體中文生日信網站，包含信封開合動畫、可拖曳翻面的信紙，以及依序拆封的三份禮物。

- [網站原始碼與開發說明](birthday-letter/README.md)
- [第一階段規格](birthday_letter_phase1_agent_spec.md)
- [功能驗收紀錄](birthday-letter/docs/phase1-verification.md)
- [插圖與素材](birthday-letter/docs/materials-collection.md)

在 `birthday-letter` 目錄執行：

```bash
npm ci
npm run dev
```

本機開發網址為 `http://127.0.0.1:5173/`。建置指令為 `npm run build`，產物位於 `birthday-letter/dist/`。

GitHub Pages 使用 [部署 Action](.github/workflows/deploy-pages.yml)，從 `birthday-letter` 安裝、檢查及建置，再發布 `birthday-letter/dist`。推送至 `main` 即自動部署，網站網址為 <https://benson0721.github.io/birthday/>。不需更動儲存庫的目錄結構；Vite 的網址前綴由部署時取得的 Pages 設定傳入。
