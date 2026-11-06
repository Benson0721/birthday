import { useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { AppState } from '../app/letterFlow'
import type { GiftId } from '../content/gifts'
import { usePaperDrag } from '../app/usePaperDrag'
import { useTouchButton } from '../app/useTouchButton'
import { ReturnEnvelopeIcon } from './Artwork'
import { GiftBack } from './GiftBack'
import { LetterFront } from './LetterFront'

type Props = {
  state: AppState
  controlsHost: HTMLElement | null
  onFlip: () => void
  onFlipFinished: () => void
  onOpenGift: (id: GiftId, trigger: HTMLButtonElement) => void
  onReturn: () => void
  reducedMotion: boolean
}

function ReturnButton({ onReturn, disabled }: { onReturn: () => void; disabled: boolean }) {
  const interaction = useTouchButton(onReturn)
  return <button type="button" className="page-return-button" aria-label="收回信封" title="收回信封" disabled={disabled} {...interaction}><ReturnEnvelopeIcon /></button>
}

export function FlippablePaper({ state, controlsHost, onFlip, onFlipFinished, onOpenGift, onReturn, reducedMotion }: Props) {
  const scene = useRef<HTMLElement>(null)
  const flipper = useRef<HTMLDivElement>(null)
  const cullingFrame = useRef<number | null>(null)
  const entered = useRef(false)
  const wasFlipping = useRef(false)
  const previousSide = useRef(state.paperSide)
  const ready = state.envelopePhase === 'expanded'
  const domainBlocked = !ready || state.isPaperFlipping || Boolean(state.activeGift)
  const drag = usePaperDrag({ scene, flipper, disabled: domainBlocked, side: state.paperSide, reducedMotion, onCommit: onFlip })
  const blocked = domainBlocked || drag.isDragging || drag.isSettling

  useLayoutEffect(() => {
    const element = flipper.current
    if (!element || drag.isDragging) return
    // A fallback may finish the state before a busy compositor has caught up.
    // Idle semantics must always agree with the physical face on screen.
    const animating = state.isPaperFlipping || drag.isSettling
    if (!animating) for (const animation of element.getAnimations()) animation.finish()
    // Explicitly cull by the physical normal. WebKit may otherwise paint a
    // mirrored scrolling layer while both semantic faces are transitioning.
    const syncVisibleFace = () => {
      const transform = window.getComputedStyle(element).transform
      const normal = transform === 'none' ? 1 : new DOMMatrixReadOnly(transform).m33
      const face = normal >= 0 ? 'front' : 'back'
      if (element.getAttribute('data-visible-face') !== face) element.setAttribute('data-visible-face', face)
    }
    syncVisibleFace()
    if (!animating) return
    const tick = () => { syncVisibleFace(); cullingFrame.current = window.requestAnimationFrame(tick) }
    cullingFrame.current = window.requestAnimationFrame(tick)
    return () => {
      if (cullingFrame.current !== null) window.cancelAnimationFrame(cullingFrame.current)
      cullingFrame.current = null
    }
  }, [state.paperSide, state.isPaperFlipping, drag.isDragging, drag.isSettling])

  useEffect(() => {
    if (!ready || state.activeGift || drag.isDragging || drag.isSettling) return
    if (!entered.current) {
      entered.current = true
      scene.current?.querySelector<HTMLElement>('#letter-title')?.focus({ preventScroll: true })
    } else if ((wasFlipping.current || previousSide.current !== state.paperSide) && !state.isPaperFlipping) {
      scene.current?.focus({ preventScroll: true })
    }
    wasFlipping.current = state.isPaperFlipping
    previousSide.current = state.paperSide
  }, [ready, state.activeGift, state.isPaperFlipping, state.paperSide, drag.isDragging, drag.isSettling])

  const paper = (
    // The draggable region contains independent buttons and supports arrow keys.
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <section className="paper-scene" ref={scene} tabIndex={0} aria-label="生日信紙" aria-describedby="paper-instructions"
      aria-keyshortcuts="ArrowLeft ArrowRight" {...drag.handlers}
      onKeyDown={(event) => {
        if ((event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.repeat) return
        if (event.target instanceof Element && event.target.closest('button, a, input, select, textarea, [contenteditable="true"]')) return
        event.preventDefault()
        drag.flipByKeyboard(event.key === 'ArrowLeft' ? -1 : 1)
      }}>
      <span id="paper-instructions" className="sr-only">左右拖曳信紙，或使用左右方向鍵翻面；上下滑動閱讀內容。</span>
      <div className="paper-flipper" ref={flipper} style={drag.style} data-side={state.paperSide}
        data-flipping={state.isPaperFlipping || drag.isSettling} data-dragging={drag.isDragging}
        onTransitionEnd={(event) => {
          if (event.target === event.currentTarget && event.propertyName === 'transform') { drag.finishSettling(); onFlipFinished() }
        }}>
        <section className="paper-face paper-front" data-face="front" aria-labelledby="letter-title"
          aria-hidden={state.paperSide !== 'front' || !ready} inert={blocked || state.paperSide !== 'front'}>
          <LetterFront />
        </section>
        <section className="paper-face paper-back" data-face="back" aria-labelledby="gifts-title"
          aria-hidden={state.paperSide !== 'back' || !ready} inert={blocked || state.paperSide !== 'back'}>
          <GiftBack openedGiftIds={state.openedGiftIds} onOpenGift={(id, trigger) => { if (!blocked) onOpenGift(id, trigger) }} />
        </section>
      </div>
    </section>
  )

  // Keep the return control outside every paper transform while the same drag
  // state still guards it during gestures and settling.
  return (
    <>
      {ready && !state.activeGift && controlsHost && createPortal(<ReturnButton onReturn={onReturn} disabled={blocked} />, controlsHost)}
      {paper}
    </>
  )
}
