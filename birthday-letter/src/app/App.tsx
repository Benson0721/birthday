import { useCallback, useEffect, useRef } from 'react'
import { canOpenGift, gifts, type GiftId } from '../content/gifts'
import { FlippablePaper } from '../components/FlippablePaper'
import { GiftDetailOverlay } from '../components/GiftDetailOverlay'
import { EnvelopeScene } from '../components/EnvelopeScene'
import { ExpandingCard } from '../components/ExpandingCard'
import { motionStyles } from './motion'
import { useLetterFlow } from './useLetterFlow'

export default function App() {
  const { state, dispatch, reducedMotion } = useLetterFlow()
  const giftTrigger = useRef<HTMLButtonElement | null>(null)
  const smallCard = useRef<HTMLSpanElement>(null)
  const envelopeTrigger = useRef<HTMLButtonElement>(null)
  const previousPhase = useRef(state.envelopePhase)
  const onExpanded = useCallback(() => dispatch({ type: 'PAPER_EXPANDED' }), [dispatch])
  const onReturned = useCallback(() => dispatch({ type: 'PAPER_RETURNED' }), [dispatch])
  const activeGift = gifts.find((gift) => gift.id === state.activeGift)

  useEffect(() => {
    if (window.history.state?.birthdayLetterGift) window.history.replaceState(null, '')
    const onBack = () => dispatch({ type: 'REQUEST_CLOSE_GIFT' })
    window.addEventListener('popstate', onBack)
    return () => window.removeEventListener('popstate', onBack)
  }, [dispatch])

  useEffect(() => {
    if (state.envelopePhase === 'floating' && previousPhase.current !== 'floating') envelopeTrigger.current?.focus({ preventScroll: true })
    previousPhase.current = state.envelopePhase
  }, [state.envelopePhase])

  function openGift(id: GiftId, trigger: HTMLButtonElement) {
    if (state.envelopePhase !== 'expanded' || state.paperSide !== 'back' || state.isPaperFlipping || state.activeGift || !canOpenGift(id, state.openedGiftIds)) return
    giftTrigger.current = trigger
    window.history.pushState({ birthdayLetterGift: id }, '')
    dispatch({ type: 'OPEN_GIFT', id })
  }

  function closeGift() {
    if (!state.activeGift || state.isGiftClosing) return
    dispatch({ type: 'REQUEST_CLOSE_GIFT' })
    if (window.history.state?.birthdayLetterGift) window.history.back()
  }

  return (
    <>
      <main className="letter-app" data-phase={state.envelopePhase} data-side={state.paperSide}
        data-flipping={state.isPaperFlipping} style={motionStyles} inert={Boolean(state.activeGift)} aria-label="生日信與三份小幸福">
        {state.envelopePhase !== 'expanded' && <EnvelopeScene phase={state.envelopePhase} cardRef={smallCard} triggerRef={envelopeTrigger}
          onOpen={() => dispatch({ type: 'OPEN_ENVELOPE', instant: reducedMotion })}
          onFlapOpened={() => dispatch({ type: 'ENVELOPE_OPENED' })} onCardExtracted={() => dispatch({ type: 'CARD_EXTRACTED' })}
          onCardInserted={() => dispatch({ type: 'CARD_INSERTED' })} onFlapClosed={() => dispatch({ type: 'ENVELOPE_CLOSED' })} />}
        {(state.envelopePhase === 'expanding' || state.envelopePhase === 'expanded' || state.envelopePhase === 'returning') &&
          <div className="reading-stage"><ExpandingCard phase={state.envelopePhase} sourceRef={smallCard} onExpanded={onExpanded} onReturned={onReturned}>
            <FlippablePaper state={state} reducedMotion={reducedMotion} onFlip={() => dispatch({ type: 'FLIP_PAPER', instant: reducedMotion })}
              onFlipFinished={() => dispatch({ type: 'FLIP_FINISHED' })} onOpenGift={openGift}
              onReturn={() => dispatch({ type: 'RETURN_TO_ENVELOPE', instant: reducedMotion })} />
          </ExpandingCard></div>}
      </main>
      {activeGift && <GiftDetailOverlay gift={activeGift} closing={state.isGiftClosing} onRequestClose={closeGift}
        onClosed={() => dispatch({ type: 'CLOSE_GIFT' })} returnFocus={giftTrigger} />}
    </>
  )
}
