import { useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react'
import { motion, paperEasing } from '../app/motion'
import type { EnvelopePhase } from '../app/letterFlow'

type Props = {
  phase: EnvelopePhase
  sourceRef: RefObject<HTMLSpanElement | null>
  onExpanded: () => void
  onReturned: () => void
  children: ReactNode
}

export function ExpandingCard({ phase, sourceRef, onExpanded, onReturned, children }: Props) {
  const container = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (phase !== 'expanding' && phase !== 'returning') return
    const returning = phase === 'returning'
    const finished = returning ? onReturned : onExpanded
    const element = container.current
    const source = sourceRef.current
    if (!element || !source || typeof element.animate !== 'function') {
      finished()
      return
    }
    const from = source.getBoundingClientRect()
    const to = element.getBoundingClientRect()
    if (!from.width || !to.width || !to.height) {
      finished()
      return
    }
    // Measure once, then animate transform and opacity. The final dimensions
    // always come from normal responsive CSS, independently of the envelope.
    const x = from.x + from.width / 2 - (to.x + to.width / 2)
    const y = from.y + from.height / 2 - (to.y + to.height / 2)
    const cardPose = `translate(${x}px, ${y}px) scale(${from.width / to.width}, ${from.height / to.height})`
    const paperPose = 'translate(0, 0) scale(1, 1)'
    const frames: Keyframe[] = returning ? [
      { transform: paperPose, opacity: 1, offset: 0 },
      { opacity: 1, offset: .9 },
      { transform: cardPose, opacity: 0, offset: 1 },
    ] : [{ transform: cardPose }, { transform: paperPose }]
    const animation = element.animate(frames, { duration: returning ? motion.returning : motion.expanding, easing: paperEasing, fill: 'both' })
    animation.onfinish = finished
    return () => { animation.onfinish = null; animation.cancel() }
  }, [phase, sourceRef, onExpanded, onReturned])

  return <div className="paper-arrival" ref={container} data-expanding={phase === 'expanding'} data-returning={phase === 'returning'}>{children}</div>
}
