# 2026-11-05 素材修訂（內建 image_gen 編輯模式）

覆寫同名 `happy-duck.png`、`chocolate-cake.png` 與 `frog.png`。輸入為原素材；保留透明度，依使用者修正角色、蛋糕表面及青蛙表情。

最終檔案：[鴨子](../public/artwork/birthday-collection/happy-duck.png)／[光滑巧克力蛋糕](../public/artwork/birthday-collection/chocolate-cake.png)／[原圖嘴巴修訂青蛙](../public/artwork/birthday-collection/frog.png)。三張均為 1254×1254 透明 PNG，已同步素材預覽頁與 ZIP。

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

