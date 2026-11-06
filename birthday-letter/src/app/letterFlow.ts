import { canOpenGift, type GiftId } from '../content/gifts'

export type EnvelopePhase = 'floating' | 'opening' | 'extracting' | 'expanding' | 'expanded' | 'returning' | 'inserting' | 'closing'
export type PaperSide = 'front' | 'back'

export type AppState = {
  envelopePhase: EnvelopePhase
  paperSide: PaperSide
  activeGift: GiftId | null
  openedGiftIds: GiftId[]
  isPaperFlipping: boolean
  isGiftClosing: boolean
}

export type LetterEvent =
  | { type: 'OPEN_ENVELOPE'; instant?: boolean }
  | { type: 'ENVELOPE_OPENED' }
  | { type: 'CARD_EXTRACTED' }
  | { type: 'PAPER_EXPANDED' }
  | { type: 'RETURN_TO_ENVELOPE'; instant?: boolean }
  | { type: 'PAPER_RETURNED' }
  | { type: 'CARD_INSERTED' }
  | { type: 'ENVELOPE_CLOSED' }
  | { type: 'FLIP_PAPER'; instant?: boolean }
  | { type: 'FLIP_FINISHED' }
  | { type: 'OPEN_GIFT'; id: GiftId }
  | { type: 'REQUEST_CLOSE_GIFT' }
  | { type: 'CLOSE_GIFT' }
  | { type: 'REDUCE_MOTION' }

export const initialState: AppState = {
  envelopePhase: 'floating',
  paperSide: 'front',
  activeGift: null,
  openedGiftIds: [],
  isPaperFlipping: false,
  isGiftClosing: false,
}

function closedEnvelope(state: AppState): AppState {
  return { ...state, envelopePhase: 'floating', paperSide: 'front', isPaperFlipping: false }
}

export function letterReducer(state: AppState, event: LetterEvent): AppState {
  switch (event.type) {
    case 'OPEN_ENVELOPE':
      return state.envelopePhase === 'floating'
        ? { ...state, envelopePhase: event.instant ? 'expanded' : 'opening' }
        : state
    case 'ENVELOPE_OPENED':
      return state.envelopePhase === 'opening' ? { ...state, envelopePhase: 'extracting' } : state
    case 'CARD_EXTRACTED':
      return state.envelopePhase === 'extracting' ? { ...state, envelopePhase: 'expanding' } : state
    case 'PAPER_EXPANDED':
      return state.envelopePhase === 'expanding' ? { ...state, envelopePhase: 'expanded' } : state
    case 'RETURN_TO_ENVELOPE':
      if (state.envelopePhase !== 'expanded' || state.activeGift || state.isPaperFlipping) return state
      return event.instant ? closedEnvelope(state) : { ...state, envelopePhase: 'returning' }
    case 'PAPER_RETURNED':
      return state.envelopePhase === 'returning' ? { ...state, envelopePhase: 'inserting' } : state
    case 'CARD_INSERTED':
      return state.envelopePhase === 'inserting' ? { ...state, envelopePhase: 'closing' } : state
    case 'ENVELOPE_CLOSED':
      return state.envelopePhase === 'closing' ? closedEnvelope(state) : state
    case 'FLIP_PAPER':
      if (state.envelopePhase !== 'expanded' || state.activeGift || state.isPaperFlipping) return state
      return { ...state, paperSide: state.paperSide === 'front' ? 'back' : 'front', isPaperFlipping: !event.instant }
    case 'FLIP_FINISHED':
      return state.isPaperFlipping ? { ...state, isPaperFlipping: false } : state
    case 'OPEN_GIFT':
      if (state.envelopePhase !== 'expanded' || state.paperSide !== 'back' || state.activeGift || state.isPaperFlipping || !canOpenGift(event.id, state.openedGiftIds)) return state
      return {
        ...state,
        activeGift: event.id,
        isGiftClosing: false,
      }
    case 'REQUEST_CLOSE_GIFT':
      return state.activeGift && !state.isGiftClosing ? { ...state, isGiftClosing: true } : state
    case 'CLOSE_GIFT':
      return state.activeGift ? {
        ...state,
        openedGiftIds: state.openedGiftIds.includes(state.activeGift) ? state.openedGiftIds : [...state.openedGiftIds, state.activeGift],
        activeGift: null,
        isGiftClosing: false,
      } : state
    case 'REDUCE_MOTION':
      if (state.envelopePhase === 'floating') return state
      if (state.envelopePhase === 'returning' || state.envelopePhase === 'inserting' || state.envelopePhase === 'closing') return closedEnvelope(state)
      return { ...state, envelopePhase: 'expanded', isPaperFlipping: false }
  }
}
