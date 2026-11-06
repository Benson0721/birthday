import { chromium, webkit } from 'playwright'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const output = new URL('../docs/screenshots/', import.meta.url)
const evidence = []

for (const [engine, viewport, name] of [
  [chromium, { width: 1440, height: 900 }, 'desktop'],
  [chromium, { width: 390, height: 844 }, 'mobile'],
  [chromium, { width: 320, height: 568 }, 'small-mobile'],
  [webkit, { width: 390, height: 844 }, 'webkit-mobile'],
]) {
  const browser = await engine.launch()
  try {
    const page = await browser.newPage({ viewport, isMobile: name !== 'desktop', hasTouch: name !== 'desktop' })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto(process.env.PREVIEW_URL ?? 'http://127.0.0.1:5173/')
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())) })
    const bounds = await page.locator('.envelope-assembly').boundingBox()
    if (!bounds || bounds.x < -1 || bounds.x + bounds.width > viewport.width + 1) throw new Error(`Envelope exceeds viewport: ${name}`)
    await page.screenshot({ path: fileURLToPath(new URL(`envelope-${name}.png`, output)), scale: 'css' })
    await page.locator('.envelope-trigger').click()
    await page.waitForFunction(() => document.querySelector('main')?.dataset.phase === 'expanded')
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())) })
    if (name === 'desktop') {
      await page.locator('.paper-scene').focus()
      await page.keyboard.press('ArrowLeft')
      await page.waitForFunction(() => document.querySelector('main')?.dataset.side === 'back' && document.querySelector('.paper-flipper')?.dataset.flipping === 'false')
    }
    const face = name === 'desktop' ? 'back' : 'front'
    await page.screenshot({ path: fileURLToPath(new URL(`return-control-${name}.png`, output)), scale: 'css' })
    await page.locator(`.paper-${face} .paper-return-button`).click()

    for (const [phase, selector, fraction] of [
      ['returning', '.paper-arrival', .42],
      ['inserting', '.envelope-card', .45],
      ['closing', '.envelope-flap', .52],
    ]) {
      await page.waitForFunction(phase => document.querySelector('main')?.dataset.phase === phase, phase)
      const animation = page.locator(selector)
      await animation.evaluate((element, fraction) => {
        for (const animation of element.getAnimations()) {
          animation.pause()
          animation.currentTime = Number(animation.effect.getTiming().duration) * fraction
        }
        element.getBoundingClientRect()
      }, fraction)
      if (phase === 'returning') {
        await page.locator('.envelope-scene, .envelope-card').evaluateAll(elements => {
          for (const element of elements) for (const animation of element.getAnimations()) {
            animation.pause()
            animation.currentTime = Math.min(Number(animation.effect.getTiming().duration), 700 * .42)
          }
        })
      }
      await page.screenshot({ path: fileURLToPath(new URL(`return-${phase}-${name}.png`, output)), scale: 'css' })
      await animation.evaluate(element => { for (const animation of element.getAnimations()) animation.finish() })
    }
    await page.waitForFunction(() => document.querySelector('main')?.dataset.phase === 'floating')
    await page.waitForFunction(() => getComputedStyle(document.querySelector('.envelope-intro')).opacity === '1' && getComputedStyle(document.querySelector('.envelope-seal')).opacity === '1')
    await page.screenshot({ path: fileURLToPath(new URL(`return-closed-${name}.png`, output)), scale: 'css' })
    evidence.push({ name, viewport, returnedFrom: face, errors, phase: await page.locator('main').getAttribute('data-phase') })
    if (errors.length) throw new Error(JSON.stringify(errors))
  } finally {
    await browser.close()
  }
}
await writeFile(new URL('return-visual-check.json', output), JSON.stringify(evidence, null, 2) + '\n')
console.log(JSON.stringify(evidence, null, 2))
