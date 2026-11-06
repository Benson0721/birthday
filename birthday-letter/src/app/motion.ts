import type { CSSProperties } from 'react'

export const motion = {
  float: 4800,
  opening: 620,
  extracting: 700,
  expanding: 760,
  returning: 700,
  inserting: 650,
  closing: 560,
  flip: 760,
  overlay: 320,
  reveal: 180,
  fallbackPadding: 180,
} as const

export const motionStyles = Object.fromEntries(
  Object.entries(motion).map(([name, duration]) => [`--motion-${name}`, `${duration}ms`]),
) as CSSProperties

export const paperEasing = 'cubic-bezier(.22,.61,.36,1)'
