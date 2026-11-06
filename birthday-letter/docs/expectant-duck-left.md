# 朝左期待的鴨子

2026-11-06 使用內建 `image_gen` 編輯現有鴨子，製作禮物頁右上角的裝飾插圖。

- 最終素材：[expectant-duck-left.png](../public/artwork/expectant-duck-left.png)
- 原角色參考：[happy-duck.png](../public/artwork/birthday-collection/happy-duck.png)
- 格式：1254 × 1254，RGBA PNG，保留透明背景。
- 使用位置：`GiftBack.tsx` 禮物頁標題右側。
- 角色特徵：奶油黃色身體、可可色眼睛、愛心舌頭、平面粉色腮紅；雙翅抱於胸前，頭部與視線期待地轉向畫面左側。
- 執行方式：內建工具編輯，先產生姿勢，再調整正方形畫布構圖；原始參考圖未覆寫。

## 姿勢編輯提示詞

```text
Use case: precise-object-edit / identity-preserve illustration.
Input image: character reference and edit target, the existing happy cream-yellow duck with large cocoa eyes, flat pink blush, heart-shaped tongue, fluffy marshmallow body and peach webbed feet.
Primary request: design a new pose of THIS SAME DUCK, expectantly LOOKING TOWARD THE LEFT SIDE OF THE IMAGE. The duck will sit at the upper right corner of a birthday letter UI, looking inward toward the heading on its left. Both the head and the gaze must clearly turn LEFT, in a gentle front-left three-quarter view, not facing right and not merely a front-facing duck mirrored. Keep both big dark eyes visible, the farther eye slightly smaller; pupils glance left with small soft cream highlights. Raised gentle eyebrows and a sweet hopeful smile, the tiny HEART-SHAPED pink tongue still recognizable inside its peach-orange bill. Head slightly tilted and leaning left as if eagerly waiting to see a present.
Pose: compact round full body, little wings tucked together against its chest in a hopeful waiting gesture rather than spread out. Soft seated/tucked webbed feet, clearly anatomical feet rather than any belly emblem. Flat rosy blush on the face, not protruding cheek balls. Three small forehead tufts, round fluffy cream-yellow silhouette. Make the character readable at 95-110px tall.
Invariants: preserve the reference character identity and drawing medium: soft cocoa pencil contours, subtle dry watercolor and paper grain, low-saturation pale cream/yellow, muted peach bill/feet, dusty pink blush, tender Japanese stationery illustration. Avoid photorealism, gloss, 3D, thick black outlines or generic unrelated cartoon-duck designs.
Composition: square canvas, whole character entirely visible, large clean cutout with a narrow transparent margin, no cropped toes or tufts. No added accessories, moon, stars, gifts, extra hearts, lettering, borders, scenery, background wash or ground shadow. Background must be genuine transparent RGBA alpha.
```

## 最終構圖調整提示詞

```text
Use case: precise-object-edit, reframing only.
Input is the finished expectant left-looking duck cutout. KEEP THIS EXACT DUCK unchanged: same left-facing head and leftward gaze, large cocoa eyes, smile and heart tongue, flat pink blush, clasped wings, seated body and two visible webbed feet, colors, pencil watercolor style and details.
Correct ONLY the canvas framing. The input has far too much empty transparent canvas. Output a SQUARE 1:1 canvas with this same duck CENTERED and tightly framed. The entire duck including all tufts, feathers and both feet must fit, with only a narrow 4-6 percent transparent margin around the silhouette. Make the character occupy roughly 85-92 percent of the square height and most of its width. Do not place it in a corner: the website itself will position this square cutout at the upper right. No large blank space at the left or bottom. Do not add a UI, rectangle, text, accessories, scenery or shadows. Genuine transparent RGBA background. No redesign of the character, just tightly reframe and center it on a square canvas.
```

