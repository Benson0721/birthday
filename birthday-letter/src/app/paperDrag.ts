export const paperDrag = {
  intentDistance: 10,
  horizontalRatio: 1.2,
  commitRatio: .28,
  maximumCommitDistance: 140,
  flickDistance: 60,
  flickVelocity: .6,
  maximumAngle: 175,
  maximumTilt: 9,
} as const

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value))

export function paperDragPose(startAngle: number, dx: number, dy: number, width: number, height: number) {
  return {
    angle: startAngle + clamp(dx / Math.max(width, 1) * 180, paperDrag.maximumAngle),
    tilt: clamp(-dy / Math.max(height, 1) * 20, paperDrag.maximumTilt),
  }
}

export function paperFacingSide(angle: number) {
  return Math.cos(angle * Math.PI / 180) >= 0 ? 'front' : 'back'
}

export function shouldCommitPaperDrag(dx: number, width: number, velocity: number) {
  const distance = Math.abs(dx)
  return distance >= Math.min(paperDrag.maximumCommitDistance, width * paperDrag.commitRatio)
    || (distance >= paperDrag.flickDistance && Math.abs(velocity) >= paperDrag.flickVelocity && Math.sign(velocity) === Math.sign(dx))
}
