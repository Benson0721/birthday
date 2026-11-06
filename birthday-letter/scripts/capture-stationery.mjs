import { chromium, webkit } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const output = new URL('../docs/screenshots/', import.meta.url)
await mkdir(output, { recursive: true })
const evidence = []

async function ready(page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map(image => image.decode()))
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  })
}

async function capture(page, name) {
  await ready(page)
  await page.screenshot({ path: fileURLToPath(new URL(name, output)), scale: 'css' })
}

async function settle(page, side) {
  await page.waitForFunction(side => {
    const paper = document.querySelector('.paper-flipper')
    return paper?.dataset.side === side && paper.dataset.flipping === 'false' && paper.dataset.dragging === 'false'
  }, side)
  await page.locator('.paper-scene').evaluate(element => element.getBoundingClientRect())
}

for (const [engine, viewport, name] of [
  [chromium, { width: 1440, height: 900 }, 'desktop'],
  [chromium, { width: 390, height: 844 }, 'mobile'],
  [chromium, { width: 320, height: 568 }, 'small-mobile'],
  [webkit, { width: 390, height: 844 }, 'webkit-mobile'],
]) {
  const browser = await engine.launch()
  try {
    const context = await browser.newContext({ viewport, isMobile: name !== 'desktop', hasTouch: name !== 'desktop' })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })
    await page.goto(process.env.PREVIEW_URL ?? 'http://127.0.0.1:5173/')
    await page.locator('.envelope-trigger').waitFor({ state: 'visible' })
    await capture(page, `envelope-${name}.png`)
    await page.locator('.envelope-trigger').click()
    await page.waitForFunction(() => document.querySelector('main')?.dataset.phase === 'expanded')
    await settle(page, 'front')
    await capture(page, `letter-${name}.png`)

    const assets = await page.evaluate(async () => Promise.all(['birthday-collection/happy-duck', 'puppy-kitten'].map(async name => {
      const image = new Image()
      image.src = new URL(`artwork/${name}.png`, location.href).href
      await image.decode()
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0)
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
      let transparent = 0, partial = 0, opaque = 0
      for (let index = 3; index < pixels.length; index += 4) {
        const alpha = pixels[index]
        if (alpha === 0) transparent++
        else if (alpha === 255) opaque++
        else partial++
      }
      return { name, width: canvas.width, height: canvas.height, transparent, partial, opaque }
    })))

    await page.locator('[data-scroll-face="front"]').evaluate(element => { element.scrollTop = element.scrollHeight })
    await capture(page, `letter-ending-${name}.png`)
    await page.locator('[data-scroll-face="front"]').evaluate(element => { element.scrollTop = 0 })

    if (name === 'desktop') {
      const bounds = await page.locator('.paper-scene').boundingBox()
      const x = bounds.x + bounds.width * .72
      const y = bounds.y + 18
      await page.mouse.move(x, y)
      await page.mouse.down()
      await page.mouse.move(x - bounds.width * .28, y + 12, { steps: 12 })
      await page.waitForFunction(() => Math.abs(parseFloat(document.querySelector('.paper-flipper').style.getPropertyValue('--paper-angle'))) > 40)
      await capture(page, 'mouse-drag-front-angle.png')
      await page.mouse.move(x - bounds.width * .62, y + 24, { steps: 12 })
      await page.waitForFunction(() => document.querySelector('.paper-flipper')?.dataset.visibleFace === 'back')
      await capture(page, 'mouse-drag-preview.png')
      await page.mouse.up()
      await settle(page, 'back')
      await capture(page, 'mouse-drag-back.png')
    } else {
      await page.locator('.paper-scene').focus()
      await page.keyboard.press('ArrowLeft')
      await settle(page, 'back')
    }
    await capture(page, `gifts-${name}.png`)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
    if (overflow) throw new Error(`Horizontal overflow: ${name}`)
    for (const [id, imageName] of [['thai', 'food'], ['steam', 'gift'], ['mystery', 'mystery']]) {
      await page.locator(`[data-gift="${id}"]`).click()
      await page.locator('dialog[open]').waitFor({ state: 'visible' })
      await page.locator('dialog').evaluate(async element => { await Promise.all(element.getAnimations().map(animation => animation.finished)) })
      await capture(page, `${imageName}-${name}.png`)
      await page.locator('.gift-overlay-header button').click()
      await page.locator('dialog').waitFor({ state: 'detached' })
    }
    evidence.push({ name, viewport, assets, errors })
    if (errors.length) throw new Error(JSON.stringify(errors))
  } finally {
    await browser.close()
  }
}
await writeFile(new URL('stationery-visual-check.json', output), JSON.stringify(evidence, null, 2) + '\n')
console.log(JSON.stringify(evidence, null, 2))
