import { describe, expect, it } from 'vitest'
import { paperDragPose, paperFacingSide, shouldCommitPaperDrag } from './paperDrag'

describe('整張信紙的滑鼠拖曳', () => {
  it('以實際角度剔除背向的一面，跨過紙張邊緣才顯示另一面', () => {
    expect(paperFacingSide(53)).toBe('front')
    expect(paperFacingSide(89)).toBe('front')
    expect(paperFacingSide(91)).toBe('back')
    expect(paperFacingSide(-105)).toBe('back')
    expect(paperFacingSide(269)).toBe('back')
    expect(paperFacingSide(271)).toBe('front')
    expect(paperFacingSide(360)).toBe('front')
  })
  it('以紙張寬度換算跟手角度，垂直位移提供輕微傾斜', () => {
    expect(paperDragPose(0, 170, 40, 680, 800)).toEqual({ angle: 45, tilt: -1 })
  })
  it('保留累積方向，反向拖曳能從背面回到正面', () => {
    expect(paperDragPose(-180, 340, -80, 680, 800)).toEqual({ angle: -90, tilt: 2 })
  })
  it('限制過大的傾角與單次旋轉，避免超出一張紙的翻面範圍', () => {
    expect(paperDragPose(0, -2000, 2000, 680, 800)).toEqual({ angle: -175, tilt: -9 })
    expect(paperDragPose(180, 2000, -2000, 680, 800)).toEqual({ angle: 355, tilt: 9 })
  })
  it('小幅移動會回復，足夠距離在左右兩個方向均可翻面', () => {
    expect(shouldCommitPaperDrag(28, 680, 10)).toBe(false)
    expect(shouldCommitPaperDrag(140, 680, 0)).toBe(true)
    expect(shouldCommitPaperDrag(-140, 680, 0)).toBe(true)
  })
  it('窄紙張使用相對距離，不必拖完整張的寬度', () => {
    expect(shouldCommitPaperDrag(100, 360, 0)).toBe(false)
    expect(shouldCommitPaperDrag(101, 360, 0)).toBe(true)
  })
  it('支援有意圖的快甩，反向速度與微小晃動不算快甩', () => {
    expect(shouldCommitPaperDrag(80, 680, 1)).toBe(true)
    expect(shouldCommitPaperDrag(-80, 680, -1)).toBe(true)
    expect(shouldCommitPaperDrag(-80, 680, 1)).toBe(false)
    expect(shouldCommitPaperDrag(59, 680, 10)).toBe(false)
  })
})
