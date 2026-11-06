import { describe, expect, it } from 'vitest'
import { initialState, letterReducer, type AppState, type LetterEvent } from './letterFlow'

const apply = (events: LetterEvent[], start: AppState = initialState) => events.reduce(letterReducer, start)
const expanded = () => apply([{ type: 'OPEN_ENVELOPE', instant: true }])
const back = () => apply([{ type: 'FLIP_PAPER', instant: true }], expanded())

describe('生日信狀態契約', () => {
  it('一次開信依序經過所有階段，忽略重複或次序錯誤的事件', () => {
    let state = letterReducer(initialState, { type: 'OPEN_ENVELOPE' })
    expect(state.envelopePhase).toBe('opening')
    expect(letterReducer(state, { type: 'OPEN_ENVELOPE' })).toBe(state)
    expect(letterReducer(state, { type: 'CARD_EXTRACTED' })).toBe(state)
    state = letterReducer(state, { type: 'ENVELOPE_OPENED' })
    expect(state.envelopePhase).toBe('extracting')
    state = letterReducer(state, { type: 'CARD_EXTRACTED' })
    expect(state.envelopePhase).toBe('expanding')
    state = letterReducer(state, { type: 'PAPER_EXPANDED' })
    expect(state.envelopePhase).toBe('expanded')
    expect(letterReducer(state, { type: 'OPEN_ENVELOPE' })).toBe(state)
  })

  it('閱讀前不接受翻面或開禮物', () => {
    expect(letterReducer(initialState, { type: 'FLIP_PAPER' })).toBe(initialState)
    expect(letterReducer(initialState, { type: 'OPEN_GIFT', id: 'steam' })).toBe(initialState)
  })

  it('正面不能開禮物，翻面中也不能再次翻面或拆禮物', () => {
    const front = expanded()
    expect(letterReducer(front, { type: 'OPEN_GIFT', id: 'steam' })).toBe(front)
    const flipping = letterReducer(front, { type: 'FLIP_PAPER' })
    expect(flipping.paperSide).toBe('back')
    expect(flipping.isPaperFlipping).toBe(true)
    expect(letterReducer(flipping, { type: 'FLIP_PAPER' })).toBe(flipping)
    expect(letterReducer(flipping, { type: 'OPEN_GIFT', id: 'steam' })).toBe(flipping)
    expect(letterReducer(flipping, { type: 'FLIP_FINISHED' }).isPaperFlipping).toBe(false)
  })

  it('開啟詳情時阻擋翻面與其他禮物，返回後保留背面及拆封紀錄', () => {
    const opened = letterReducer(back(), { type: 'OPEN_GIFT', id: 'thai' })
    expect(opened.activeGift).toBe('thai')
    expect(opened.openedGiftIds).toEqual([])
    expect(letterReducer(opened, { type: 'FLIP_PAPER' })).toBe(opened)
    expect(letterReducer(opened, { type: 'OPEN_GIFT', id: 'steam' })).toBe(opened)
    const closing = letterReducer(opened, { type: 'REQUEST_CLOSE_GIFT' })
    expect(closing.isGiftClosing).toBe(true)
    expect(letterReducer(closing, { type: 'REQUEST_CLOSE_GIFT' })).toBe(closing)
    const closed = letterReducer(closing, { type: 'CLOSE_GIFT' })
    expect(closed).toMatchObject({ activeGift: null, paperSide: 'back', openedGiftIds: ['thai'], isGiftClosing: false })
  })

  it('依吃得爽快、玩得開心、神祕小禮解鎖，不能跳關且可重複查看', () => {
    let state = back()
    expect(letterReducer(state, { type: 'OPEN_GIFT', id: 'steam' })).toBe(state)
    expect(letterReducer(state, { type: 'OPEN_GIFT', id: 'mystery' })).toBe(state)
    state = letterReducer(state, { type: 'OPEN_GIFT', id: 'thai' })
    expect(letterReducer(state, { type: 'OPEN_GIFT', id: 'steam' })).toBe(state)
    state = letterReducer(state, { type: 'REQUEST_CLOSE_GIFT' })
    expect(state.openedGiftIds).toEqual([])
    expect(letterReducer(state, { type: 'OPEN_GIFT', id: 'steam' })).toBe(state)
    state = letterReducer(state, { type: 'CLOSE_GIFT' })
    expect(letterReducer(state, { type: 'OPEN_GIFT', id: 'mystery' })).toBe(state)
    for (const id of ['steam', 'thai', 'mystery', 'mystery'] as const) {
      state = apply([{ type: 'OPEN_GIFT', id }, { type: 'CLOSE_GIFT' }], state)
    }
    expect(state.openedGiftIds).toEqual(['thai', 'steam', 'mystery'])
  })

  it('可反覆翻面，拆封紀錄始終保留', () => {
    let state = apply([{ type: 'OPEN_GIFT', id: 'thai' }, { type: 'CLOSE_GIFT' }], back())
    for (let index = 0; index < 20; index++) state = apply([{ type: 'FLIP_PAPER' }, { type: 'FLIP_FINISHED' }], state)
    expect(state.paperSide).toBe('back')
    expect(state.openedGiftIds).toEqual(['thai'])
  })

  it('Reduced Motion 不會自動開信；啟動後直接可讀，翻面不等待動畫', () => {
    expect(letterReducer(initialState, { type: 'REDUCE_MOTION' })).toBe(initialState)
    expect(expanded().envelopePhase).toBe('expanded')
    expect(back().isPaperFlipping).toBe(false)
  })

  it('動畫途中切換 Reduced Motion 能收斂，遲到的完成事件不回退狀態', () => {
    const opening = letterReducer(initialState, { type: 'OPEN_ENVELOPE' })
    const settled = letterReducer(opening, { type: 'REDUCE_MOTION' })
    expect(settled.envelopePhase).toBe('expanded')
    expect(letterReducer(settled, { type: 'ENVELOPE_OPENED' })).toBe(settled)
    const flipping = letterReducer(settled, { type: 'FLIP_PAPER' })
    expect(letterReducer(flipping, { type: 'REDUCE_MOTION' })).toMatchObject({ paperSide: 'back', isPaperFlipping: false })
  })

  it('收信依序縮回小卡、插入、關封，再開信從正面開始且保留拆封紀錄', () => {
    let state = apply([{ type: 'OPEN_GIFT', id: 'thai' }, { type: 'CLOSE_GIFT' }], back())
    state = letterReducer(state, { type: 'RETURN_TO_ENVELOPE' })
    expect(state).toMatchObject({ envelopePhase: 'returning', paperSide: 'back' })
    expect(letterReducer(state, { type: 'RETURN_TO_ENVELOPE' })).toBe(state)
    expect(letterReducer(state, { type: 'CARD_INSERTED' })).toBe(state)
    expect(letterReducer(state, { type: 'ENVELOPE_CLOSED' })).toBe(state)
    state = letterReducer(state, { type: 'PAPER_RETURNED' })
    expect(state.envelopePhase).toBe('inserting')
    state = letterReducer(state, { type: 'CARD_INSERTED' })
    expect(state.envelopePhase).toBe('closing')
    state = letterReducer(state, { type: 'ENVELOPE_CLOSED' })
    expect(state).toMatchObject({ envelopePhase: 'floating', paperSide: 'front', openedGiftIds: ['thai'], activeGift: null })
    expect(letterReducer(state, { type: 'OPEN_ENVELOPE', instant: true })).toMatchObject({ envelopePhase: 'expanded', paperSide: 'front', openedGiftIds: ['thai'] })
  })

  it('開信、翻面、看詳情及收信中阻擋互相衝突的操作', () => {
    for (const state of [initialState, letterReducer(initialState, { type: 'OPEN_ENVELOPE' }),
      letterReducer(expanded(), { type: 'FLIP_PAPER' }), letterReducer(back(), { type: 'OPEN_GIFT', id: 'thai' })]) {
      expect(letterReducer(state, { type: 'RETURN_TO_ENVELOPE' })).toBe(state)
    }
    const phases = apply([{ type: 'RETURN_TO_ENVELOPE' }], expanded())
    for (const state of [phases, letterReducer(phases, { type: 'PAPER_RETURNED' }),
      apply([{ type: 'PAPER_RETURNED' }, { type: 'CARD_INSERTED' }], phases)]) {
      for (const event of [{ type: 'OPEN_ENVELOPE' }, { type: 'FLIP_PAPER' }, { type: 'OPEN_GIFT', id: 'mystery' }] as const) {
        expect(letterReducer(state, event)).toBe(state)
      }
    }
  })

  it('Reduced Motion 可直接收回，收信三階段中途切換也停在封好的信封', () => {
    expect(letterReducer(back(), { type: 'RETURN_TO_ENVELOPE', instant: true })).toMatchObject({ envelopePhase: 'floating', paperSide: 'front' })
    const returning = letterReducer(back(), { type: 'RETURN_TO_ENVELOPE' })
    const inserting = letterReducer(returning, { type: 'PAPER_RETURNED' })
    const closing = letterReducer(inserting, { type: 'CARD_INSERTED' })
    for (const state of [returning, inserting, closing]) {
      const closed = letterReducer(state, { type: 'REDUCE_MOTION' })
      expect(closed).toMatchObject({ envelopePhase: 'floating', paperSide: 'front', isPaperFlipping: false })
      for (const type of ['PAPER_RETURNED', 'CARD_INSERTED', 'ENVELOPE_CLOSED', 'PAPER_EXPANDED'] as const) {
        expect(letterReducer(closed, { type })).toBe(closed)
      }
    }
  })

  it('反覆開信與收回不殘留上一輪的階段或翻面狀態', () => {
    let state = initialState
    for (let index = 0; index < 10; index++) {
      state = apply([{ type: 'OPEN_ENVELOPE' }, { type: 'ENVELOPE_OPENED' }, { type: 'CARD_EXTRACTED' },
        { type: 'PAPER_EXPANDED' }, { type: 'FLIP_PAPER', instant: true }, { type: 'RETURN_TO_ENVELOPE' },
        { type: 'PAPER_RETURNED' }, { type: 'CARD_INSERTED' }, { type: 'ENVELOPE_CLOSED' }], state)
      expect(state).toEqual(initialState)
    }
  })
})
