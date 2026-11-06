export type GiftId = 'steam' | 'thai' | 'mystery'

export type GiftImage = { file: string; alt: string }

export type Gift = {
  id: GiftId
  label: string
  icon: string
  detailTitle: string
  paragraphs: readonly string[]
  announcementDate?: string
  artwork?: GiftImage
  treats?: readonly {
    title: string
    description: string
    artwork: GiftImage
    appointment?: { dateTime: string; label: string }
  }[]
}

// 陣列順序即拆封順序；詳情只在該份禮物開啟後呈現。
export const gifts = [
  {
    id: 'thai',
    label: '吃得爽快',
    icon: '🍽️',
    detailTitle: '泰式與金沙大蛋糕',
    paragraphs: ['好吃的和甜甜的，都幫妳準備好了。'],
    treats: [
      {
        title: '好吃ㄉ泰式',
        description: '泰式料理吃到吐',
        artwork: { file: 'spicy-shrimp.png', alt: '一盤麻辣蝦子' },
        appointment: { dateTime: '2026-11-06T19:00:00+08:00', label: '11/6 19:00' },
      },
      {
        title: '金沙大蛋糕',
        description: '巧克力蛋糕，一定超級好吃ㄉ',
        artwork: { file: 'chocolate-cake.png', alt: '表面光滑、插著紫色蠟燭的巧克力蛋糕' },
      },
    ],
  },
  {
    id: 'steam',
    label: '玩得開心',
    icon: '🎮',
    detailTitle: 'Steam 遊戲任選券',
    artwork: { file: 'steam-emblem.png', alt: '淡紫色水彩 Steam 圖示' },
    paragraphs: [
      '任選一款想玩的 Steam 遊戲\n然後叫呱呱刷卡買給妳ლ(◉◞౪◟◉ )ლ。',
      '我知道妳沒地方放禮物，但肯定還有空間可以放新遊戲',
    ],
  },
  {
    id: 'mystery',
    label: '神祕小禮',
    icon: '🎁',
    detailTitle: '有個小呱呱準備來見妳',
    paragraphs: ['預計在 2026/11/18 (做不完◢▆▅▄▃╰(〒皿〒)╯▃▄▅▇◣)'],
    announcementDate: '2026-11-18',
  },
] as const satisfies readonly Gift[]

export function canOpenGift(id: GiftId, openedGiftIds: readonly GiftId[]): boolean {
  const index = gifts.findIndex(gift => gift.id === id)
  return index >= 0 && gifts.slice(0, index).every(gift => openedGiftIds.includes(gift.id))
}
