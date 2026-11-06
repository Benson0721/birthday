# 2026-11-05 素材修訂（內建 image_gen 編輯模式）

覆寫同名 `happy-duck.png`、`chocolate-cake.png` 與 `frog.png`。輸入為原素材；保留透明度，依使用者修正角色、蛋糕表面及青蛙表情。

## frog 最終編輯提示詞（原圖只改嘴巴）

以初版原圖為底，只改成小笑嘴。保留原本瞇眼、眼皮線、圓形腮紅輪廓、身體與坐姿；輸入為最初的 `exec-e203c470-fc6f-49b6-be04-f61cebad3a38.png`，未使用圓眼修訂版。

```text
Use case: precise-object-edit.
Input image: EDIT TARGET is the ORIGINAL seated pale-green frog with closed sleepy eyes, not the later open-eyed revision.
Primary request: change ONLY THE MOUTH. Replace the very wide sweeping brown mouth line and wide tongue with one SMALL, compact, gentle curved smile centered under the nostrils, with a tiny softly rounded pink tongue. Keep the mouth modest and sweet. Fill the removed long mouth strokes with matching original pale-green/cream watercolor face color and grain.
Strict invariants: absolutely preserve the ORIGINAL closed eyes and heavy curved eye strokes, eyelid lines, tiny nostrils, cheek-circle outlines, pink cheek patches, original rounded face outline, eye bulges, body, seated pose, limbs, toes, cream belly, all existing colors, cocoa pencil contours, paper-grain texture, size, crop, scale, placement and silhouette. DO NOT open, enlarge, brighten or redesign the eyes. DO NOT change the cheeks. DO NOT change the head or body. Do not reinterpret the overall expression or redraw the character. The only changed region is the existing mouth region.
Background: preserve genuine transparent alpha and the existing square canvas. No new objects, text, shadows, frame or scenery.
```

## frog 前版提示詞（已停用）

將臉改為有高光的圓眼、小笑嘴與淡粉紅腮紅，保留原本坐姿、配色與水彩鉛筆質感。

```text
Use case: precise-object-edit.
Input image: edit target, the existing pale sage-green seated frog stationery illustration.
Primary request: change ONLY the facial features to make this same frog sweeter and cuter. Replace the heavy closed eyelids and brow-like strokes with two open rounded cocoa-brown eyes, each with a small cream highlight, gently curious and friendly. Use a small compact smiling mouth with a tiny pink tongue under the little nostrils; remove the long sweeping mouth line across the whole face. Keep soft flat rosy blush on both cheeks. The expression should be innocent, tender, happy and cuddly, readable at small icon size, not sleepy, smug, stern or startling.
Invariants: preserve the exact same frog silhouette, rounded eye lobes, head size, seated pose, limbs, little fingers and toes, cream belly, pale sage and cream color palette, soft cocoa pencil contours, delicate watercolor/paper-grain medium, proportions, framing, and placement. Keep the body unchanged. This is a face correction, not a new character or outfit.
Background: genuine transparent alpha, square composition. No extra objects, letters, border, shadow or scenery.
```

## happy-duck 最終編輯提示詞

```text
Use case: precise-object-edit. Input image: edit target, the existing happy duck illustration. Preserve this specific character, large sparkling dark eyes, open orange smiling bill with heart-shaped pink tongue, tufts, both spread wings, cream-yellow fluffy body, two floating pink hearts, cocoa pencil contours and quiet pastel stationery style. Make two anatomical corrections only: (1) The two round circles on the face are FLAT pink blush patches on a continuous round head, not protruding cheeks. Remove the circular outline and external bulges of the cheeks; place soft circular rosy blush flat on the face, with no separate cheek shapes. (2) The lower-right shape on the belly is its LIFTED WEBBED FOOT, not a printed feather/heart/flame emblem. Remove that belly marking and clearly draw a small peach-orange raised webbed foot with three rounded toes and a short connected ankle, tucked forward in front of the lower-right body. The duck has exactly TWO feet total: one grounded supporting webbed foot at lower left, and the other lifted on the lower right of its belly. Remove the existing grounded bottom-right foot so there is no third foot. Keep all other aspects, scale, style, arrangement, and soft colors. Truly transparent RGBA background, square composition, no text or border. Do not create any belly symbol or badge.
```

## chocolate-cake 最終編輯提示詞

```text
Use case: precise-object-edit. Input image: edit target, existing chocolate birthday cake slice. User requests a SMOOTH cake with no holes and no grainy textures. Keep exactly the same cake slice shape and composition, chocolate brown layers and light cocoa cream filling, smooth chocolate ganache flowing edge, cream swirl, lavender striped candle and yellow flame, cream plate, gentle pastel illustrated stationery style. Remove EVERY porous pit, hole, crumb dot, speckle, sponge pore, stippling, paper grain, rough surface texture and visible brush grain from the cake and frosting. Render the chocolate layers as completely smooth continuous matte brown fills with clean subtle shading. Ganache and cream also smooth, no surface noise. Clean soft cocoa outlines, flat smooth pastel illustration, delicate simple shading, no photorealism. Preserve the candle, flame, cream swirl, plate, framing and placement. Transparent alpha background, square composition, no words or new decoration.
```

以下保留初次生成提示詞作為歷程。


# 生日素材生成提示詞

日期：2026-11-05（Asia/Taipei）。使用內建 `image_gen` 產生，保留真正透明背景。鴨子與青蛙參考使用者提供的木板線稿照片之角色特徵；媒材延續網站的柔霧水彩文具風。Steam 幾何參考官方 Steam 標誌，品牌來源見素材清單。

## lavender

```text
Use case: illustration-story.
Asset type: one reusable transparent PNG sticker illustration for an intimate Japanese birthday stationery website and possible print extension.
Style/medium: gentle flat 2D hand illustration, fine slightly irregular cocoa pencil contours, soft dry watercolor and subtle pastel grain inside the subject, rounded soft shapes. Quiet, warm, low saturation, delicate stationery quality. Match the project's cream, lavender and dusty rose animal illustrations, not a glossy commercial mascot.
Palette: cream #FFF9F2, lavender #DCCDF0, dusty rose #D8B2C1, cocoa #6E5651, butter yellow #F6E58B, with restrained subject-appropriate colors.
Composition: one clear centered cutout, full subject visible, square canvas, generous enough contour spacing to read at 80px but fill most of the canvas. Narrow transparent margin. Genuinely transparent alpha background, no paper rectangle, no scene, no ground shadow.
Text: none. Avoid logos except when explicitly requested, lettering, watermark, sticker white outlines, hard vector fills, 3D rendering.
Primary request: a small tied bouquet of five lavender sprigs, slender sage stems, rounded lavender-purple flower buds in layered elongated clusters. A loose tiny cream and dusty-rose ribbon ties the stems. Slight asymmetrical fan shape, elegant and restrained, softly hand painted.
```

## reference-duck

```text
Use case: illustration-story.
Asset type: one reusable transparent PNG sticker illustration for an intimate Japanese birthday stationery website and possible print extension.
Style/medium: gentle flat 2D hand illustration, fine slightly irregular cocoa pencil contours, soft dry watercolor and subtle pastel grain inside the subject, rounded soft shapes. Quiet, warm, low saturation, delicate stationery quality. Match the project's cream, lavender and dusty rose animal illustrations, not a glossy commercial mascot.
Palette: cream #FFF9F2, lavender #DCCDF0, dusty rose #D8B2C1, cocoa #6E5651, butter yellow #F6E58B, with restrained subject-appropriate colors.
Composition: one clear centered cutout, full subject visible, square canvas, generous enough contour spacing to read at 80px but fill most of the canvas. Narrow transparent margin. Genuinely transparent alpha background, no paper rectangle, no scene, no ground shadow.
Text: none. Avoid logos except when explicitly requested, lettering, watermark, sticker white outlines, hard vector fills, 3D rendering.
Input image: the user's uploaded wooden-panel drawing is a CHARACTER reference, not a material or color reference.
Primary request: faithfully translate the large duck character in the uploaded drawing into this soft pastel watercolor stationery style. Preserve the duck's distinctive large rounded dark oval eyes with tiny highlights, curved expressive eyebrows, bulging round cheeks, very wide joyful open duck bill with a clearly visible small HEART-shaped tongue inside, round fluffy feathery body, small forehead tufts, both feathered wings stretched joyfully out sideways, and two webbed feet. The heart tongue and large eyes are the key identifiers. Pale butter-yellow and cream body, dusty peach-orange bill and feet, small rosy cheeks, cocoa pencil lines. Full body front view with wings fully visible, maximum two tiny dusty-rose hearts nearby. Do not turn it into the project's earlier small moon-hugging duckling. No frog in this asset. No woodgrain or burned-wood texture.
```

## frog

```text
Use case: illustration-story.
Asset type: one reusable transparent PNG sticker illustration for an intimate Japanese birthday stationery website and possible print extension.
Style/medium: gentle flat 2D hand illustration, fine slightly irregular cocoa pencil contours, soft dry watercolor and subtle pastel grain inside the subject, rounded soft shapes. Quiet, warm, low saturation, delicate stationery quality. Match the project's cream, lavender and dusty rose animal illustrations, not a glossy commercial mascot.
Palette: cream #FFF9F2, lavender #DCCDF0, dusty rose #D8B2C1, cocoa #6E5651, butter yellow #F6E58B, with restrained subject-appropriate colors.
Composition: one clear centered cutout, full subject visible, square canvas, generous enough contour spacing to read at 80px but fill most of the canvas. Narrow transparent margin. Genuinely transparent alpha background, no paper rectangle, no scene, no ground shadow.
Text: none. Avoid logos except when explicitly requested, lettering, watermark, sticker white outlines, hard vector fills, 3D rendering.
Input image: the user's uploaded wooden-panel drawing provides the small frog at lower left as a CHARACTER reference only.
Primary request: translate that little seated frog into a matching pastel stationery illustration. Preserve the two prominent round eyes atop its head, sleepy friendly lids, broad smiling mouth, round cheek patches, compact seated body, tiny front toes and rounded folded hind legs. Soft sage-green and pale mint body with cream belly, dusty rose cheeks, cocoa pencil contours. One single frog, full body, no duck, no pond, no wood texture.
```

## spicy-shrimp

```text
Use case: illustration-story.
Asset type: one reusable transparent PNG sticker illustration for an intimate Japanese birthday stationery website and possible print extension.
Style/medium: gentle flat 2D hand illustration, fine slightly irregular cocoa pencil contours, soft dry watercolor and subtle pastel grain inside the subject, rounded soft shapes. Quiet, warm, low saturation, delicate stationery quality. Match the project's cream, lavender and dusty rose animal illustrations, not a glossy commercial mascot.
Palette: cream #FFF9F2, lavender #DCCDF0, dusty rose #D8B2C1, cocoa #6E5651, butter yellow #F6E58B, with restrained subject-appropriate colors.
Composition: one clear centered cutout, full subject visible, square canvas, generous enough contour spacing to read at 80px but fill most of the canvas. Narrow transparent margin. Genuinely transparent alpha background, no paper rectangle, no scene, no ground shadow.
Text: none. Avoid logos except when explicitly requested, lettering, watermark, sticker white outlines, hard vector fills, 3D rendering.
Primary request: an inviting tiny serving of Sichuan-style spicy prawns (mala shrimp): three plump curved coral-orange prawns with tails in a shallow cream ceramic dish, coated with a modest amount of muted chili-red sauce, two small dried red chili segments, tiny Sichuan pepper dots and a few sage-green scallion pieces. The shrimp should look appetizing and simplified, not realistic or scary. No faces, no cutlery, no text. Pastel watercolor food illustration with the same fine cocoa contours.
```

## chocolate-cake

```text
Use case: illustration-story.
Asset type: one reusable transparent PNG sticker illustration for an intimate Japanese birthday stationery website and possible print extension.
Style/medium: gentle flat 2D hand illustration, fine slightly irregular cocoa pencil contours, soft dry watercolor and subtle pastel grain inside the subject, rounded soft shapes. Quiet, warm, low saturation, delicate stationery quality. Match the project's cream, lavender and dusty rose animal illustrations, not a glossy commercial mascot.
Palette: cream #FFF9F2, lavender #DCCDF0, dusty rose #D8B2C1, cocoa #6E5651, butter yellow #F6E58B, with restrained subject-appropriate colors.
Composition: one clear centered cutout, full subject visible, square canvas, generous enough contour spacing to read at 80px but fill most of the canvas. Narrow transparent margin. Genuinely transparent alpha background, no paper rectangle, no scene, no ground shadow.
Text: none. Avoid logos except when explicitly requested, lettering, watermark, sticker white outlines, hard vector fills, 3D rendering.
Primary request: one lovely slice of chocolate birthday cake, viewed from a gentle three-quarter angle on a tiny plain cream saucer. Two fluffy cocoa sponge layers with a lighter chocolate cream layer, soft chocolate ganache on top, a small whipped cream swirl, and one short pale lavender candle with a tiny moon-yellow flame. Rounded appetizing shapes and restrained cocoa-brown palette, fine pencil edge and soft watercolor texture. No berries, no text, no cutlery.
```

## steam-emblem

```text
Use case: style-transfer.
Asset type: transparent Steam emblem artwork for a private birthday stationery website.
Input image: the attached local Steam emblem is the exact GEOMETRY reference. Keep the recognizable circle, lower-left linkage and upper-right ring in their exact arrangement and proportions.
Primary request: repaint the visible light-grey Steam silhouette in soft muted lavender #BDA7D3 watercolor, with a very fine slightly irregular cocoa #6E5651 pencil edge and subtle dry pastel grain. Preserve every negative-space cutout as transparent. Maintain the whole emblem's clean legibility at 80px. This should feel hand painted on delicate Japanese stationery, visually matching cream/lavender/dusty-rose watercolor animals and food illustrations.
Composition: one centered emblem, full circle visible, square canvas, a narrow clean transparent margin.
Background: genuinely transparent alpha, including all holes in the emblem. No separate paper disk or square, no badge border, no scene, no drop shadow.
Text: none. No other symbols, animals, stars, hearts or text. Do not add a controller or invent a different Steam symbol. No glossy 3D and no extra lettering.
```

