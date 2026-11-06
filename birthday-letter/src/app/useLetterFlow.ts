import { useEffect, useReducer } from 'react'
import { initialState, letterReducer, type LetterEvent } from './letterFlow'
import { motion } from './motion'
import { useReducedMotion } from './useReducedMotion'

export function useLetterFlow() {
  const [state, dispatch] = useReducer(letterReducer, initialState)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) dispatch({ type: 'REDUCE_MOTION' })
  }, [reducedMotion])

  // Animation events drive the sequence. This guarded fallback also works when
  // an animation is interrupted, disabled, or its completion event is lost.
  useEffect(() => {
    const phase = state.envelopePhase
    const events = {
      opening: 'ENVELOPE_OPENED',
      extracting: 'CARD_EXTRACTED',
      expanding: 'PAPER_EXPANDED',
      returning: 'PAPER_RETURNED',
      inserting: 'CARD_INSERTED',
      closing: 'ENVELOPE_CLOSED',
    } as const
    if (phase === 'floating' || phase === 'expanded') return
    const timer = window.setTimeout(
      () => dispatch({ type: events[phase] } as LetterEvent),
      motion[phase] + motion.fallbackPadding,
    )
    return () => window.clearTimeout(timer)
  }, [state.envelopePhase])

  useEffect(() => {
    if (!state.isPaperFlipping) return
    const timer = window.setTimeout(() => dispatch({ type: 'FLIP_FINISHED' }), motion.flip + motion.fallbackPadding)
    return () => window.clearTimeout(timer)
  }, [state.isPaperFlipping])

  useEffect(() => {
    if (!state.isGiftClosing) return
    if (reducedMotion) {
      dispatch({ type: 'CLOSE_GIFT' })
      return
    }
    const timer = window.setTimeout(() => dispatch({ type: 'CLOSE_GIFT' }), motion.overlay + motion.fallbackPadding)
    return () => window.clearTimeout(timer)
  }, [state.isGiftClosing, reducedMotion])

  return { state, dispatch, reducedMotion }
}
