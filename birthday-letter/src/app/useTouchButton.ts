import { useRef, type MouseEvent, type TouchEvent } from 'react'

// Some mobile browsers suppress the first compatibility click after a 3D swipe.
// Recognize a stationary touch on real buttons while keeping scrolls and mouse/
// keyboard clicks native. Prevent the later compatibility click from firing twice.
export function useTouchButton(activate: (button: HTMLButtonElement) => void) {
  const touch = useRef<{ id: number; x: number; y: number } | null>(null)
  const lastTouch = useRef(0)

  function onTouchStart(event: TouchEvent<HTMLButtonElement>) {
    const first = event.changedTouches[0]
    touch.current = !event.currentTarget.disabled && event.touches.length === 1 && first ? { id: first.identifier, x: first.clientX, y: first.clientY } : null
  }

  function onTouchMove(event: TouchEvent<HTMLButtonElement>) {
    const start = touch.current
    if (!start) return
    const point = Array.from(event.changedTouches).find(item => item.identifier === start.id)
    if (point && Math.hypot(point.clientX - start.x, point.clientY - start.y) > 10) touch.current = null
  }

  function onTouchEnd(event: TouchEvent<HTMLButtonElement>) {
    const start = touch.current
    touch.current = null
    if (!start || event.currentTarget.disabled) return
    const end = Array.from(event.changedTouches).find(point => point.identifier === start.id)
    if (!end || Math.hypot(end.clientX - start.x, end.clientY - start.y) > 10) return
    event.preventDefault()
    lastTouch.current = Date.now()
    activate(event.currentTarget)
  }

  function onClick(event: MouseEvent<HTMLButtonElement>) {
    if (event.currentTarget.disabled || (event.detail > 0 && Date.now() - lastTouch.current < 800)) return
    activate(event.currentTarget)
  }

  return { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel: () => { touch.current = null }, onClick }
}
