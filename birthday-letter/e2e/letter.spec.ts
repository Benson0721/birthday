import { expect, test, type Page } from '@playwright/test'
import { letter } from '../src/content/letter.js'
import { gifts } from '../src/content/gifts.js'

const app = (page: Page) => page.getByRole('main')
const paper = (page: Page) => page.getByRole('region', { name: '生日信紙', exact: true })

async function openLetter(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: '打開生日信', exact: true }).click()
  await expect(app(page)).toHaveAttribute('data-phase', 'expanded')
  await expect(page.getByRole('heading', { level: 1, name: letter.title, exact: true })).toBeVisible()
}

async function flip(page: Page, side: 'front' | 'back') {
  await paper(page).focus()
  await page.keyboard.press(side === 'back' ? 'ArrowLeft' : 'ArrowRight')
  await expect(app(page)).toHaveAttribute('data-side', side)
  await expect(app(page)).toHaveAttribute('data-flipping', 'false')
}

test('一鍵開信、三份禮物、全畫面詳情、返回與重複查看', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto('/')
  await expect(page).toHaveTitle('給妳的一封信｜生日快樂')
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hant')
  await expect(page.locator('.envelope-lavender-frame')).toBeVisible()
  await expect(page.locator('.envelope-lavender-frame')).toHaveCSS('pointer-events', 'none')
  await expect(page.locator('.envelope-assembly img[src$="lavender.png"]')).toHaveCount(0)
  await expect(page.getByText(gifts[1].detailTitle, { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: '打開生日信' }).dblclick()
  await expect(app(page)).toHaveAttribute('data-phase', 'expanded')
  await expect(page.locator('.paper-scene')).toHaveCount(1)
  await expect(page.locator('[data-letter-paragraphs] p').first()).toHaveText(letter.paragraphs[0].replaceAll('**', ''))
  const returnPosition = await page.getByRole('button', { name: '收回信封' }).boundingBox()
  await expect(page.locator('.paper-scene .page-return-button')).toHaveCount(0)
  await expect(page.locator('.page-controls')).toHaveCSS('position', 'fixed')
  await flip(page, 'back')
  const backReturnPosition = await page.getByRole('button', { name: '收回信封' }).boundingBox()
  expect(backReturnPosition?.x).toBeCloseTo(returnPosition!.x, 0)
  expect(backReturnPosition?.y).toBeCloseTo(returnPosition!.y, 0)
  await expect(page.locator('.paper-footer')).toHaveCount(0)
  await expect(page.locator('.gift-row')).toHaveCount(3)
  expect(await page.locator('.gift-row').allTextContents()).toEqual(['', '', ''])
  const positions = await page.locator('.gift-row').evaluateAll(elements => elements.map(element => {
    const rect = element.getBoundingClientRect()
    const button = element as HTMLElement
    return { x: rect.x, y: rect.y, width: button.offsetWidth, height: button.offsetHeight }
  }))
  expect(positions[0]!.x).toBeCloseTo(positions[2]!.x, 0)
  expect(positions[0]!.y).toBeLessThan(positions[1]!.y)
  expect(positions[1]!.y).toBeLessThan(positions[2]!.y)
  const paperWidth = (await paper(page).boundingBox())!.width
  expect(positions.every(position => position.width >= paperWidth * .75 && position.height >= 68 && position.width > position.height)).toBe(true)
  expect(positions[0]!.height).toBeCloseTo(positions[2]!.height, 0)
  const giftRegion = page.getByRole('region', { name: '三份禮物清單' })
  expect(await giftRegion.evaluate(element => element.scrollHeight <= element.clientHeight + 1)).toBe(true)
  await expect(page.locator('.gift-row').last()).toBeInViewport()
  await expect(page.locator('[data-face="front"]')).toHaveAttribute('inert', '')
  await expect(page.getByText(gifts[1].detailTitle, { exact: true })).toHaveCount(0)
  const subjects = gifts.map(gift => gift.label)
  const titles = gifts.map(gift => gift.detailTitle)
  await expect(page.locator('[data-gift="thai"]')).toBeEnabled()
  await expect(page.locator('[data-gift="steam"]')).toBeDisabled()
  await expect(page.locator('[data-gift="mystery"]')).toBeDisabled()
  const historyLength = await page.evaluate(() => history.length)
  await page.locator('[data-gift="steam"]').dispatchEvent('click')
  await page.locator('[data-gift="mystery"]').dispatchEvent('click')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  expect(await page.evaluate(() => history.length)).toBe(historyLength)
  for (let index = 0; index < subjects.length; index++) {
    const row = page.getByRole('button', { name: new RegExp(`^${subjects[index]}，`) })
    await expect(row).toBeEnabled()
    await expect(row.locator('.gift-artwork')).toHaveAttribute('data-artwork-state', 'closed')
    const closedArtwork = await row.locator('.gift-artwork').innerHTML()
    await row.click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { name: titles[index], exact: true })).toBeVisible()
    await dialog.evaluate(async (element) => { await Promise.all(element.getAnimations().map((animation) => animation.finished)) })
    await dialog.evaluate(async element => { await Promise.all([...element.querySelectorAll('img')].map(image => image.decode())) })
    expect(await dialog.evaluate((element) => element.parentElement === document.body)).toBe(true)
    const box = await dialog.boundingBox()
    const viewport = page.viewportSize()!
    expect(box?.x).toBeCloseTo(0)
    expect(box?.y).toBeCloseTo(0)
    expect(box?.width).toBeCloseTo(viewport.width, -1)
    expect(box?.height).toBeCloseTo(viewport.height, -1)
    await expect(app(page)).toHaveAttribute('inert', '')
    await expect(dialog.getByRole('button', { name: '返回三份禮物' })).toBeInViewport()
    if (index === 0) {
      await expect(dialog.getByRole('img')).toHaveCount(2)
      await expect(dialog.getByRole('img', { name: '一盤麻辣蝦子' })).toHaveJSProperty('naturalWidth', 1254)
      await expect(dialog.getByRole('img', { name: /表面光滑/ })).toHaveJSProperty('naturalWidth', 1254)
      await expect(dialog.getByRole('heading', { name: gifts[0].treats[1].title, exact: true })).toBeVisible()
      await expect(dialog.getByText(gifts[0].treats[0].description, { exact: true })).toBeVisible()
      await expect(dialog.locator('time')).toHaveText('11/6 19:00')
      await expect(dialog.locator('time')).toHaveAttribute('datetime', '2026-11-06T19:00:00+08:00')
    }
    if (index === 1) await expect(dialog.getByRole('img', { name: '淡紫色水彩 Steam 圖示' })).toHaveJSProperty('naturalWidth', 1254)
    if (index === 2) {
      await expect(dialog.locator('time')).toHaveAttribute('datetime', '2026-11-18')
      await expect(dialog.getByRole('link')).toHaveCount(0)
    }
    if (index === 0) await page.keyboard.press('Escape')
    else if (index === 1) await page.goBack()
    else await dialog.locator('.gift-detail-copy').click({ position: { x: 5, y: 5 } })
    await expect(dialog).toHaveCount(0)
    await expect(row).toBeFocused()
    await expect(row).toHaveAttribute('data-opened', 'true')
    await expect(row.locator('.gift-artwork')).toHaveAttribute('data-artwork-state', 'opened')
    expect(await row.locator('.gift-artwork').innerHTML()).not.toBe(closedArtwork)
    await expect(app(page)).toHaveAttribute('data-side', 'back')
    if (index === 0) await expect(page.locator('[data-gift="mystery"]')).toBeDisabled()
  }
  await page.getByRole('button', { name: '吃得爽快，再看一次' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await flip(page, 'front')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  expect(errors).toEqual([])
})

test('千字長信、原生捲動、3D 翻面保留位置及橫向螢幕', async ({ page, browserName, isMobile }) => {
  test.setTimeout(60_000)
  await openLetter(page)
  await expect(page.locator('[data-face="back"]')).toHaveCSS('visibility', 'hidden')
  const scroll = page.getByRole('region', { name: '生日信內容' })
  const length = await scroll.evaluate((element) => {
    const content = element.querySelector('[data-letter-paragraphs]')!
    const paragraphs = Array.from({ length: 24 }, (_, index) => {
      const paragraph = document.createElement('p')
      paragraph.textContent = `長文閱讀測試 ${index + 1}：願新的一歲有安心的時刻，也有值得期待的小事。這是測試用的中性文字，不包含私人經歷，請慢慢閱讀。`
      return paragraph
    })
    content.replaceChildren(...paragraphs)
    return content.textContent!.length
  })
  expect(length).toBeGreaterThan(1000)
  await expect(scroll).toHaveCSS('touch-action', 'pan-y')
  await expect(scroll).toHaveCSS('scrollbar-width', 'none')
  const fixedBefore = await page.evaluate(() => {
    const heading = document.querySelector('.paper-front .letter-heading')!.getBoundingClientRect()
    const bottom = document.querySelector('.paper-front .letter-closing')!.getBoundingClientRect()
    return { heading: heading.y, bottom: bottom.y }
  })
  if (browserName === 'chromium' && isMobile) {
    const bounds = (await scroll.boundingBox())!
    const session = await page.context().newCDPSession(page)
    const x = bounds.x + bounds.width / 2
    const y = bounds.y + bounds.height * .75
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
    for (let step = 1; step <= 6; step++) {
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + step * 2, y: y - step * 32 }] })
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
    await expect.poll(() => scroll.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
    await session.detach()
    await expect(app(page)).toHaveAttribute('data-side', 'front')
  }
  await scroll.evaluate((element) => { element.scrollTop = 480 })
  const fixedAfter = await page.evaluate(() => {
    const heading = document.querySelector('.paper-front .letter-heading')!.getBoundingClientRect()
    const bottom = document.querySelector('.paper-front .letter-closing')!.getBoundingClientRect()
    return { heading: heading.y, bottom: bottom.y }
  })
  expect(fixedAfter.heading).toBeCloseTo(fixedBefore.heading, 0)
  expect(fixedAfter.bottom).toBeCloseTo(fixedBefore.bottom, 0)
  const position = await scroll.evaluate((element) => element.scrollTop)
  await flip(page, 'back')
  await expect(page.locator('[data-face="front"]')).toHaveCSS('visibility', 'hidden')
  expect(await page.locator('.paper-flipper').evaluate((element) => getComputedStyle(element).transformStyle)).toBe('preserve-3d')
  const matrix = await page.locator('.paper-flipper').evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m11)
  expect(matrix).toBeCloseTo(-1)
  await flip(page, 'front')
  expect(await scroll.evaluate((element) => element.scrollTop)).toBeCloseTo(position, 0)
  await scroll.evaluate((element) => { element.scrollTop = element.scrollHeight })
  await expect(page.locator('.letter-signature')).toBeInViewport()
  await page.setViewportSize({ width: 844, height: 390 })
  await expect(page.getByRole('button', { name: '收回信封' })).toBeInViewport()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await flip(page, 'back')
  await expect(page.getByRole('button', { name: '收回信封' })).toBeInViewport()
  const backScroll = page.getByRole('region', { name: '三份禮物清單' })
  await page.evaluate(() => document.fonts.ready)
  expect(await backScroll.evaluate(element => element.scrollHeight <= element.clientHeight + 1)).toBe(true)
  await expect(page.locator('.gift-row').last()).toBeInViewport()
  const foodRow = page.getByRole('button', { name: '吃得爽快，點擊拆開' })
  await expect(foodRow).toBeInViewport()
  const backPosition = await backScroll.evaluate((element) => element.scrollTop)
  await foodRow.click()
  const detailScroll = page.getByRole('region', { name: '禮物詳情內容' })
  await expect(detailScroll).toHaveCSS('scrollbar-width', 'none')
  await detailScroll.evaluate((element) => {
    const content = element.querySelector('.gift-detail-paragraphs')!
    for (let index = 0; index < 16; index++) {
      const paragraph = document.createElement('p')
      paragraph.textContent = '這是詳情捲動測試文字，用來確認小螢幕仍能完整閱讀，並隨時返回原本的禮物清單。'
      content.append(paragraph)
    }
    element.scrollTop = element.scrollHeight
  })
  await expect(page.getByRole('button', { name: '返回三份禮物' })).toBeInViewport()
  expect(await detailScroll.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
  await page.getByRole('button', { name: '返回三份禮物' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  expect(await backScroll.evaluate((element) => element.scrollTop)).toBeCloseTo(backPosition, 0)
})

test('手機原生觸控可左右翻面，並可輕觸詳情關閉', async ({ page, browserName, isMobile }) => {
  test.skip(browserName !== 'chromium' || !isMobile, '以 Chromium 的原生觸控事件驗證水平手勢')
  test.setTimeout(60_000)
  await openLetter(page)
  await page.evaluate(() => document.fonts.ready)
  const bounds = (await page.locator('.paper-scene').boundingBox())!
  const session = await page.context().newCDPSession(page)
  const swipe = async (x: number, y: number, dx: number) => {
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
    for (let step = 1; step <= 8; step++) {
      await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * step / 8, y }] })
    }
    await expect(page.locator('.paper-flipper')).toHaveAttribute('data-dragging', 'true')
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  }
  const text = await page.locator('.letter-paragraphs p').nth(1).evaluate(element => {
    const range = document.createRange()
    range.selectNodeContents(element)
    const rect = range.getClientRects()[0]!
    return { x: rect.right - 5, y: rect.y + rect.height / 2 }
  })
  await swipe(text.x, text.y, -bounds.width * .6)
  await expect(app(page)).toHaveAttribute('data-side', 'back')
  await expect(page.locator('.paper-flipper')).toHaveAttribute('data-flipping', 'false')
  await page.getByRole('button', { name: '吃得爽快，點擊拆開' }).tap()
  await expect(page.getByRole('dialog')).toBeVisible()
  const detail = page.getByRole('region', { name: '禮物詳情內容' })
  await detail.evaluate(element => {
    const content = element.querySelector('.gift-detail-paragraphs')!
    for (let index = 0; index < 15; index++) {
      const paragraph = document.createElement('p')
      paragraph.textContent = '測試長篇禮物詳情的原生捲動，捲動時不應誤關閉畫面。'
      content.append(paragraph)
    }
  })
  const detailBounds = (await detail.boundingBox())!
  const detailX = detailBounds.x + detailBounds.width / 2
  const detailY = detailBounds.y + detailBounds.height * .75
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: detailX, y: detailY }] })
  for (let step = 1; step <= 6; step++) {
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: detailX, y: detailY - step * 30 }] })
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
  await expect.poll(() => detail.evaluate(element => element.scrollTop)).toBeGreaterThan(0)
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect.poll(async () => {
    const before = await detail.evaluate(element => element.scrollTop)
    await page.waitForTimeout(120)
    return Math.abs((await detail.evaluate(element => element.scrollTop)) - before)
  }).toBeLessThan(1)
  await page.locator('.gift-overlay-header').tap({ position: { x: detailBounds.width - 15, y: 20 } })
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await swipe(bounds.x + bounds.width * .28, bounds.y + 20, bounds.width * .6)
  await expect(app(page)).toHaveAttribute('data-side', 'front')
  await expect(page.locator('.paper-flipper')).toHaveAttribute('data-flipping', 'false')
  await page.getByRole('button', { name: '收回信封' }).tap()
  await expect(app(page)).toHaveAttribute('data-phase', 'floating')
  await session.detach()
})

test('觸控可點開禮物、點擊畫面退出並收回信封', async ({ page, hasTouch }) => {
  test.skip(!hasTouch, '此情境需要觸控裝置')
  await openLetter(page)
  await flip(page, 'back')
  await page.getByRole('button', { name: '吃得爽快，點擊拆開' }).tap()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('dialog').getByRole('img').first().tap()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByRole('button', { name: '吃得爽快，再看一次' })).toBeFocused()
  await page.getByRole('button', { name: '收回信封' }).tap()
  await expect(app(page)).toHaveAttribute('data-phase', 'floating')
})

test('Reduced Motion 與鍵盤操作維持完整流程、焦點與背景隔離', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(app(page)).toHaveAttribute('data-phase', 'floating')
  await expect(page.locator('.envelope-float')).toHaveCSS('animation-name', 'none')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: '打開生日信' })).toBeFocused()
  await page.keyboard.press('Space')
  await expect(app(page)).toHaveAttribute('data-phase', 'expanded')
  await expect(page.locator('#letter-title')).toBeFocused()
  await page.keyboard.press('ArrowLeft')
  await expect(paper(page)).toBeFocused()
  await expect(page.locator('[data-face="front"]')).toHaveAttribute('inert', '')
  await page.keyboard.press('Shift+Tab')
  await expect(page.getByRole('button', { name: '收回信封' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(paper(page)).toBeFocused()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  const row = page.getByRole('button', { name: '吃得爽快，點擊拆開' })
  await expect(row).toBeFocused()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('button', { name: '返回三份禮物' })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Tab')
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(page.getByRole('button', { name: '吃得爽快，再看一次' })).toBeFocused()
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('')
  await expect(app(page)).not.toHaveAttribute('inert', '')
  await paper(page).focus()
  await page.keyboard.press('ArrowRight')
  await expect(paper(page)).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(page.getByRole('button', { name: '收回信封' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(app(page)).toHaveAttribute('data-phase', 'floating')
  await expect(page.getByRole('button', { name: '打開生日信' })).toBeFocused()
  await expect(page.locator('.paper-scene')).toHaveCount(0)
  await page.keyboard.press('Space')
  await expect(app(page)).toHaveAttribute('data-phase', 'expanded')
  await expect(page.locator('#letter-title')).toBeFocused()
})

test('動畫完成事件遺失與快速重複點擊仍能收斂到可操作狀態', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.addInitScript(() => {
    for (const type of ['animationend', 'transitionend']) document.addEventListener(type, (event) => event.stopImmediatePropagation(), true)
  })
  await openLetter(page)
  await paper(page).focus()
  await page.keyboard.press('ArrowLeft')
  await paper(page).dispatchEvent('keydown', { key: 'ArrowLeft', bubbles: true })
  await expect(app(page)).toHaveAttribute('data-flipping', 'false')
  await expect(app(page)).toHaveAttribute('data-side', 'back')
  await page.getByRole('button', { name: '吃得爽快，點擊拆開' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: '返回三份禮物' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await flip(page, 'front')
  await expect(page.locator('.paper-scene')).toHaveCount(1)
  await page.getByRole('button', { name: '收回信封' }).dblclick()
  await expect(app(page)).toHaveAttribute('data-phase', 'floating')
  await expect(page.locator('.paper-scene')).toHaveCount(0)
  await expect(page.getByRole('button', { name: '打開生日信' })).toBeFocused()
  await page.getByRole('button', { name: '打開生日信' }).click()
  await expect(app(page)).toHaveAttribute('data-phase', 'expanded')
  await page.getByRole('button', { name: '收回信封' }).click()
  await expect(app(page)).toHaveAttribute('data-phase', 'returning')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(app(page)).toHaveAttribute('data-phase', 'floating')
  await expect(page.getByRole('button', { name: '打開生日信' })).toBeFocused()
  await page.getByRole('button', { name: '打開生日信' }).click()
  await expect(app(page)).toHaveAttribute('data-phase', 'expanded')
  await expect(app(page)).toHaveAttribute('data-side', 'front')
})

test('正反面都可收回信封，反向動畫依序完成並能再次開信', async ({ page }) => {
  test.setTimeout(60_000)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await openLetter(page)
  await flip(page, 'back')
  await page.getByRole('button', { name: '吃得爽快，點擊拆開' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)

  for (const side of ['back', 'front'] as const) {
    if (side === 'front') await flip(page, 'front')
    await page.evaluate(() => {
      const main = document.querySelector('main')!
      main.setAttribute('data-phase-log', '')
      const observer = new MutationObserver(() => {
        const phase = main.getAttribute('data-phase')
        main.setAttribute('data-phase-log', `${main.getAttribute('data-phase-log')} ${phase}`)
        if (phase === 'returning') {
          const arrival = main.querySelector<HTMLElement>('.paper-arrival')
          const buttons = [...main.querySelectorAll<HTMLButtonElement>('.page-return-button')]
          const running = arrival?.dataset.returning === 'true' && arrival.getAnimations().some(animation => animation.playState === 'running')
          main.setAttribute('data-return-check', String(Boolean(running) && buttons.length === 0))
          buttons[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        }
        if (phase === 'floating') observer.disconnect()
      })
      observer.observe(main, { attributes: true, attributeFilter: ['data-phase'] })
    })
    const returnButton = page.getByRole('button', { name: '收回信封' })
    await expect(returnButton).toBeInViewport()
    await returnButton.click()
    await expect(app(page)).toHaveAttribute('data-phase', 'floating')
    await expect(app(page)).toHaveAttribute('data-side', 'front')
    await expect(app(page)).toHaveAttribute('data-phase-log', ' returning inserting closing floating')
    await expect(app(page)).toHaveAttribute('data-return-check', 'true')
    await expect(page.locator('.paper-scene')).toHaveCount(0)
    await expect(page.getByRole('button', { name: '打開生日信' })).toBeFocused()
    await expect(page.locator('.envelope-card')).toHaveCSS('animation-name', 'none')
    await page.getByRole('button', { name: '打開生日信' }).click()
    await expect(app(page)).toHaveAttribute('data-phase', 'expanded')
    await expect(page.locator('#letter-title')).toBeFocused()
    expect(await page.locator('[data-scroll-face="front"]').evaluate(element => element.scrollTop)).toBe(0)
    await flip(page, 'back')
    await expect(page.getByRole('button', { name: '吃得爽快，再看一次' })).toBeVisible()
  }
  expect(errors).toEqual([])
})
