import { expect, test, type Page } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

async function openPaper(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: '打開生日信' }).click()
  await expect(page.getByRole('main')).toHaveAttribute('data-phase', 'expanded')
  await page.evaluate(() => document.fonts.ready)
  return (await page.locator('.paper-scene').boundingBox())!
}

async function settle(page: Page, side: 'front' | 'back') {
  await expect(page.getByRole('main')).toHaveAttribute('data-side', side)
  await expect(page.locator('.paper-flipper')).toHaveAttribute('data-dragging', 'false')
  await expect(page.locator('.paper-flipper')).toHaveAttribute('data-flipping', 'false')
}

test('整張紙空白處可跟手旋轉、小幅回彈、左右拖曳翻面且保留閱讀位置', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  const bounds = await openPaper(page)
  const scroll = page.getByRole('region', { name: '生日信內容' })
  await scroll.evaluate(element => { element.scrollTop = 160 })
  const position = await scroll.evaluate(element => element.scrollTop)
  const x = bounds.x + bounds.width * .72
  const y = bounds.y + 18
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x + 28, y + 4, { steps: 6 })
  await expect(page.locator('.paper-flipper')).toHaveAttribute('data-dragging', 'true')
  const firstAngle = await page.locator('.paper-flipper').evaluate(element => parseFloat(element.style.getPropertyValue('--paper-angle')))
  expect(firstAngle).toBeGreaterThan(0)
  expect(firstAngle).toBeLessThan(20)
  await expect(page.locator('.paper-back')).toHaveCSS('visibility', 'hidden')
  await expect(page.locator('.paper-front')).toHaveCSS('visibility', 'visible')
  await page.mouse.up()
  await settle(page, 'front')

  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x - bounds.width * .62, y + 24, { steps: 16 })
  await expect(page.locator('.paper-flipper')).toHaveAttribute('data-dragging', 'true')
  // Still held: the physical paper has already rotated beyond its edge.
  await expect.poll(() => page.locator('.paper-flipper').evaluate(element => parseFloat(element.style.getPropertyValue('--paper-angle')))).toBeLessThan(-90)
  await expect(page.getByRole('main')).toHaveAttribute('data-side', 'front')
  await expect(page.locator('.paper-back')).toHaveCSS('visibility', 'visible')
  await expect(page.locator('.page-return-button')).toBeDisabled()
  await page.mouse.up()
  await settle(page, 'back')
  await expect(page.locator('.paper-front')).toHaveCSS('visibility', 'hidden')
  await expect(page.getByRole('dialog')).toHaveCount(0)

  const backX = bounds.x + bounds.width * .28
  await page.mouse.move(backX, y)
  await page.mouse.down()
  // Pointer capture keeps the gesture attached when it leaves the rotated face.
  await page.mouse.move(backX + bounds.width * .62, y - 8, { steps: 16 })
  await page.mouse.up()
  await settle(page, 'front')
  expect(await scroll.evaluate(element => element.scrollTop)).toBeCloseTo(position, 0)
  expect(errors).toEqual([])
})

test('保留原生文字選取，取消拖曳可恢復，Reduced Motion 與禮物仍正常', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const bounds = await openPaper(page)
  const text = await page.locator('[data-letter-paragraphs] p').first().evaluate(element => {
    const range = document.createRange()
    range.selectNodeContents(element)
    const rect = range.getClientRects()[0]!
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
  })
  await page.mouse.move(text.x + 3, text.y + text.height / 2)
  await page.mouse.down()
  await page.mouse.move(text.x + text.width - 3, text.y + text.height / 2, { steps: 10 })
  await page.mouse.up()
  await expect.poll(() => page.evaluate(() => window.getSelection()?.toString().length ?? 0)).toBeGreaterThan(0)
  await settle(page, 'front')
  await page.evaluate(() => window.getSelection()?.removeAllRanges())

  const x = bounds.x + bounds.width * .72
  const y = bounds.y + 18
  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x - 200, y + 10, { steps: 10 })
  await expect(page.locator('.paper-flipper')).toHaveAttribute('data-dragging', 'true')
  await page.evaluate(() => window.dispatchEvent(new Event('blur')))
  await page.mouse.up()
  await settle(page, 'front')

  await page.mouse.move(x, y)
  await page.mouse.down()
  await page.mouse.move(x - 200, y, { steps: 10 })
  await page.mouse.up()
  await settle(page, 'back')
  await page.getByRole('button', { name: '吃得爽快，點擊拆開' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('main')).toHaveAttribute('inert', '')
  await expect(page.locator('.paper-flipper')).toHaveAttribute('data-dragging', 'false')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByRole('button', { name: '吃得爽快，再看一次' })).toBeFocused()
  await page.locator('.paper-scene').focus()
  await page.keyboard.press('ArrowRight')
  await settle(page, 'front')
})
