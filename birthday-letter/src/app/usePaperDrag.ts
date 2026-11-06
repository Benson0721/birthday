import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent, type RefObject } from 'react'
import type { PaperSide } from './letterFlow'
import { motion } from './motion'
import { paperDrag, paperDragPose, paperFacingSide, shouldCommitPaperDrag } from './paperDrag'

type Gesture = {
  pointerId: number
  pointerType: string
  x: number
  y: number
  dx: number
  dy: number
  lastX: number
  lastTime: number
  velocity: number
  width: number
  height: number
  startAngle: number
  dragging: boolean
}

// Protect actual text, rather than excluding the entire text block: the empty
// part of a paragraph or heading can still be grabbed like the rest of the paper.
function isReadingText(target: Element, x: number, y: number) {
  const text = target.closest('p, h1, h2, h3, strong, em, [data-letter-paragraphs]')
  if (!text || text.closest('[aria-hidden="true"]')) return false
  const walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue
    range.selectNodeContents(node)
    for (const rect of range.getClientRects()) {
      if (x >= rect.left - 2 && x <= rect.right + 2 && y >= rect.top - 2 && y <= rect.bottom + 2) return true
    }
  }
  return false
}

type Options = {
  scene: RefObject<HTMLElement | null>
  flipper: RefObject<HTMLDivElement | null>
  disabled: boolean
  side: PaperSide
  reducedMotion: boolean
  onCommit: () => void
}

function applyPose(element: HTMLElement, pose: ReturnType<typeof paperDragPose>) {
  element.style.setProperty('--paper-angle', `${pose.angle}deg`)
  element.style.setProperty('--paper-tilt', `${pose.tilt}deg`)
  const visibleFace = paperFacingSide(pose.angle)
  if (element.getAttribute('data-visible-face') !== visibleFace) element.setAttribute('data-visible-face', visibleFace)
}

export function usePaperDrag({ scene, flipper, disabled, side, reducedMotion, onCommit }: Options) {
  const gesture = useRef<Gesture | null>(null)
  const frame = useRef<number | null>(null)
  const suppressClick = useRef(false)
  const settledAngle = useRef(side === 'back' ? 180 : 0)
  const [rotation, setRotation] = useState(side === 'back' ? 180 : 0)
  const [isDragging, setDragging] = useState(false)
  const [isSettling, setSettling] = useState(false)

  const finishGesture = useCallback((allowCommit: boolean) => {
    const current = gesture.current
    const element = flipper.current
    if (!current || !element) return
    gesture.current = null
    if (frame.current !== null) { window.cancelAnimationFrame(frame.current); frame.current = null }
    if ((current.pointerType !== 'touch' || !allowCommit) && scene.current?.hasPointerCapture(current.pointerId)) scene.current.releasePointerCapture(current.pointerId)
    if (!current.dragging) return

    const pose = paperDragPose(current.startAngle, current.dx, current.dy, current.width, current.height)
    applyPose(element, pose)
    // Flush the current pose once on release, so even a fast flick settles from
    // the position under the pointer instead of jumping to an animation start.
    void window.getComputedStyle(element).transform
    const commit = allowCommit && shouldCommitPaperDrag(current.dx, current.width, current.velocity)
    const target = current.startAngle + (commit ? Math.sign(current.dx) * 180 : 0)
    settledAngle.current = target
    element.setAttribute('data-dragging', 'false')
    element.setAttribute('data-flipping', reducedMotion ? 'false' : 'true')
    element.style.setProperty('--paper-angle', `${target}deg`)
    element.style.setProperty('--paper-tilt', '0deg')
    setRotation(target)
    setDragging(false)
    setSettling(!reducedMotion)
    // A captured touch swipe ends on the paper, so it cannot activate a gift.
    // Suppression is only needed for mouse-generated compatibility clicks.
    suppressClick.current = current.pointerType !== 'touch'
    if (commit) onCommit()
  }, [onCommit, reducedMotion, scene, flipper])

  useEffect(() => {
    const cancel = () => finishGesture(false)
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') cancel() }
    window.addEventListener('blur', cancel)
    window.addEventListener('keydown', escape)
    return () => {
      window.removeEventListener('blur', cancel)
      window.removeEventListener('keydown', escape)
    }
  }, [finishGesture])

  useEffect(() => {
    if (!isSettling) return
    const timer = window.setTimeout(() => setSettling(false), reducedMotion ? 0 : motion.flip + motion.fallbackPadding)
    return () => window.clearTimeout(timer)
  }, [isSettling, reducedMotion])

  useEffect(() => () => {
    if (frame.current !== null) window.cancelAnimationFrame(frame.current)
    gesture.current = null
  }, [])

  function pointerDown(event: PointerEvent<HTMLElement>) {
    suppressClick.current = false
    // Horizontal touch gestures turn the paper; vertical touch remains native scrolling.
    if (disabled || isSettling || gesture.current || !event.isPrimary || event.button !== 0) return
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    const target = event.target
    if (!(target instanceof Element) || target.closest('button, a, input, select, textarea, [contenteditable="true"]')) return
    if (event.pointerType !== 'touch' && isReadingText(target, event.clientX, event.clientY)) return
    const bounds = event.currentTarget.getBoundingClientRect()
    gesture.current = {
      pointerId: event.pointerId, pointerType: event.pointerType, x: event.clientX, y: event.clientY, dx: 0, dy: 0,
      lastX: event.clientX, lastTime: event.timeStamp, velocity: 0,
      width: bounds.width, height: bounds.height, startAngle: settledAngle.current, dragging: false,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    if (event.pointerType !== 'touch') event.preventDefault()
  }

  function pointerMove(event: PointerEvent<HTMLElement>) {
    const current = gesture.current
    if (!current || event.pointerId !== current.pointerId) return
    if (event.buttons !== 1) { finishGesture(false); return }
    current.dx = event.clientX - current.x
    current.dy = event.clientY - current.y
    current.velocity = (event.clientX - current.lastX) / Math.max(event.timeStamp - current.lastTime, 1)
    current.lastX = event.clientX
    current.lastTime = event.timeStamp
    if (!current.dragging) {
      if (Math.abs(current.dx) < paperDrag.intentDistance || Math.abs(current.dx) < Math.abs(current.dy) * paperDrag.horizontalRatio) return
      current.dragging = true
      scene.current?.focus({ preventScroll: true })
      window.getSelection()?.removeAllRanges()
      setDragging(true)
      flipper.current?.setAttribute('data-dragging', 'true')
    }
    if (current.pointerType !== 'touch') event.preventDefault()
    if (frame.current !== null) return
    frame.current = window.requestAnimationFrame(() => {
      frame.current = null
      const active = gesture.current
      if (!active?.dragging || !flipper.current) return
      const pose = paperDragPose(active.startAngle, active.dx, active.dy, active.width, active.height)
      applyPose(flipper.current, pose)
    })
  }

  function pointerUp(event: PointerEvent<HTMLElement>) {
    const current = gesture.current
    if (!current || event.pointerId !== current.pointerId) return
    current.dx = event.clientX - current.x
    current.dy = event.clientY - current.y
    finishGesture(true)
  }

  function cancelPointer(event: PointerEvent<HTMLElement>) {
    if (gesture.current?.pointerId === event.pointerId) finishGesture(false)
  }

  function lostPointerCapture(event: PointerEvent<HTMLElement>) {
    // Touch starts with implicit capture on the original child. Moving capture
    // to the whole paper must not treat that child's bubbling event as a cancel.
    if (event.target === event.currentTarget) cancelPointer(event)
  }

  function clickCapture(event: MouseEvent<HTMLElement>) {
    if (suppressClick.current && event.detail > 0) {
      suppressClick.current = false
      event.preventDefault()
      event.stopPropagation()
    }
  }

  function flipByKeyboard(direction: -1 | 1) {
    if (disabled || isDragging || isSettling) return
    scene.current?.focus({ preventScroll: true })
    settledAngle.current += direction * 180
    setRotation(settledAngle.current)
    onCommit()
  }

  return {
    isDragging, isSettling, flipByKeyboard,
    finishSettling: () => setSettling(false),
    style: { '--paper-angle': `${rotation}deg` } as CSSProperties,
    handlers: { onPointerDown: pointerDown, onPointerMove: pointerMove, onPointerUp: pointerUp,
      onPointerCancel: cancelPointer, onLostPointerCapture: lostPointerCapture, onClickCapture: clickCapture },
  }
}
