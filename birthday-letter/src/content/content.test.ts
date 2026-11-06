import { describe, expect, it } from 'vitest'
import { gifts } from './gifts'
import { letter } from './letter'

describe('可替換的內容設定', () => {
  it('提供三份各自可識別且有完整詳情的禮物', () => {
    expect(gifts).toHaveLength(3)
    expect(new Set(gifts.map((gift) => gift.id)).size).toBe(3)
    for (const gift of gifts) {
      expect(gift.label.trim()).not.toBe('')
      expect(gift.detailTitle.trim()).not.toBe('')
      expect(gift.paragraphs.length).toBeGreaterThan(0)
      expect(gift.paragraphs.every((paragraph) => paragraph.trim().length > 0)).toBe(true)
    }
  })

  it('信件包含可渲染的標題、段落與署名', () => {
    expect(letter.title.trim()).not.toBe('')
    expect(letter.paragraphs.length).toBeGreaterThan(0)
    expect(letter.paragraphs.every((paragraph) => paragraph.trim().length > 0)).toBe(true)
    expect(letter.signature.trim()).not.toBe('')
  })
})
