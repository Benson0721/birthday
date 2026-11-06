# 原創文具插圖

新增的薰衣草、照片鴨子、青蛙、麻辣蝦子、蛋糕與 Steam 風格化圖示，另見 [生日文具素材組](materials-collection.md)。

2026-11-05 依使用者要求，網站信封小卡、開合動畫與信紙標題區的鴨子，統一改用 [新版鴨子](../public/artwork/birthday-collection/happy-duck.png)。以下抱月小鴨為初版插圖歷程，網站已不再引用。

2026-11-04 使用內建 `image_gen` 產生透明背景插圖，依使用者最新指定採小鴨、小狗、小貓。沒有取用參考圖的角色或商標。

| 檔案 | 像素尺寸 | 格式 |
| --- | --- | --- |
| [抱月亮的小鴨](../public/artwork/moon-duckling.png) | 1254 × 1254 | RGBA PNG，保留原始透明度 |
| [探頭的狗狗與貓咪](../public/artwork/puppy-kitten.png) | 1752 × 897 | RGBA PNG，保留原始透明度 |

兩張均已複製至專案 `public/artwork/`，生產建置一併收錄。網頁文字、淡方格、暈染與互動控制獨立於插圖，未壓成一張背景圖片。小月亮及禮物線稿為專案內 SVG。高解析 PNG 可供日後紙品編排使用；印刷時仍需另處理尺寸、出血、CMYK 打樣與實際紙材。

紙緣另使用專案內手寫的 [lavender-paper-wash.svg](../public/artwork/lavender-paper-wash.svg)：以可編輯的向量漸層、雜訊位移及柔化遮罩形成四周紫色暈染，獨立於動物插圖，可直接調整色素濃度與邊界寬度。

## 最終提示詞：小鴨

```text
Use case: illustration-story.
Asset type: original transparent decorative animal cutout for a gentle Japanese birthday stationery website, with potential future print use.
Style/medium: delicate hand-drawn cocoa pencil outline with soft dry watercolor, subtle paper-grain pastel fill, flat 2D stationery illustration. Cute rounded marshmallow shapes, tiny simple dot eyes, small blush, tender calm expressions. Soft, simple, quiet, intimate, restrained. No glossy 3D or photorealism.
Color palette: cream #FFF9F2, pale lavender #DCCDF0, dusty rose #D8B2C1, cocoa outlines #6E5651, buttery moon yellow #F6E58B and warm pale grey.
Scene/backdrop: genuinely transparent alpha. No scene, no paper rectangle, no lettering, no logo, no watermark, no frame, no ground shadow.
Constraints: completely original character designs, do not imitate any existing cartoon or stationery brand. Large clean cutout, all subjects fully visible, fill most of the canvas with narrow transparent margin. Animal faces should be clear and sweet when displayed at 90px.
Primary request: one tiny round pale-yellow duckling hugging a small crescent moon against its belly with both wings. A soft cream-yellow marshmallow body, a small dusty peach oval bill, two short head tufts, tiny tucked webbed feet. Slight three-quarter seated view. One miniature lavender bow at its neck. Two tiny four-point yellow twinkles near the duckling, no other objects. Square composition. The duckling is the only animal.
```

## 最終提示詞：狗狗與貓咪

```text
Use case: illustration-story.
Asset type: original transparent decorative animal cutout for a gentle Japanese birthday stationery website, with potential future print use.
Style/medium: delicate hand-drawn cocoa pencil outline with soft dry watercolor, subtle paper-grain pastel fill, flat 2D stationery illustration. Cute rounded marshmallow shapes, tiny simple dot eyes, small blush, tender calm expressions. Soft, simple, quiet, intimate, restrained. No glossy 3D or photorealism.
Color palette: cream #FFF9F2, pale lavender #DCCDF0, dusty rose #D8B2C1, cocoa outlines #6E5651, buttery moon yellow #F6E58B and warm pale grey.
Scene/backdrop: genuinely transparent alpha. No scene, no paper rectangle, no lettering, no logo, no watermark, no frame, no ground shadow.
Constraints: completely original character designs, do not imitate any existing cartoon or stationery brand. Large clean cutout, all subjects fully visible, fill most of the canvas with narrow transparent margin. Animal faces should be clear and sweet when displayed at 90px.
Primary request: a cream puppy with two floppy pale-cocoa ears and a pale grey-lavender kitten with two rounded triangular ears, leaning their little front paws together over an imaginary bottom edge as if peeking onto stationery. Small round marshmallow bodies, short cuddly paws, each animal clearly recognizable. The dog on left, cat on right; kitten gently holds one small pale-yellow star. Both animals fully visible in a wide low cluster, shoulders touching. No actual ledge or paper drawn. Soft cream puppy with cocoa patches, pale grey-lavender kitten, tiny dusty rose noses and cheeks. Landscape composition.
```
