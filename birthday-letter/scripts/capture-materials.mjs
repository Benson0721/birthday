import { chromium, webkit } from 'playwright'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const output = new URL('../docs/screenshots/', import.meta.url)
const baseURL = process.env.PREVIEW_URL ?? 'http://127.0.0.1:5173/'
const evidence = []

for (const [engine, viewport, name] of [
  [chromium, { width: 1440, height: 1100 }, 'desktop'],
  [chromium, { width: 390, height: 844 }, 'mobile'],
  [webkit, { width: 390, height: 844 }, 'webkit-mobile'],
]) {
  const browser = await engine.launch()
  try {
    const page = await browser.newPage({ viewport, isMobile: name !== 'desktop', hasTouch: name !== 'desktop' })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })
    await page.goto(new URL('materials.html', baseURL).href)
    await page.locator('.asset').last().waitFor({ state: 'visible' })
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode())) })
    const images = await page.evaluate(() => [...document.images].map(image => {
      const canvas = document.createElement('canvas')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const context = canvas.getContext('2d')
      context.drawImage(image, 0, 0)
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
      let transparent = 0, visible = 0
      for (let index = 3; index < pixels.length; index += 4) {
        if (pixels[index] === 0) transparent++
        else visible++
      }
      return { file: image.src.split('/').at(-1), width: canvas.width, height: canvas.height, transparent, visible }
    }))
    if (images.length !== 6 || images.some(image => image.width !== 1254 || image.height !== 1254 || !image.transparent || !image.visible)) throw new Error('Invalid image dimensions or transparency')
    if (!(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))) throw new Error('Horizontal overflow')
    await page.screenshot({ path: fileURLToPath(new URL(`materials-${name}.png`, output)), fullPage: true, scale: 'css' })
    for (const tone of ['lavender', 'checker', 'cream']) {
      await page.locator(`button[data-tone="${tone}"]`).click()
      if (await page.locator('body').getAttribute('data-tone') !== tone || await page.locator(`button[data-tone="${tone}"]`).getAttribute('aria-pressed') !== 'true') throw new Error('Preview tone switch failed')
    }
    if (name === 'desktop') {
      const pngWait = page.waitForEvent('download')
      await page.locator('.asset .download').first().click()
      const png = await pngWait
      const bytes = await readFile(await png.path())
      const original = await readFile(new URL('../public/artwork/birthday-collection/lavender.png', import.meta.url))
      if (png.suggestedFilename() !== 'lavender.png' || !bytes.equals(original)) throw new Error('PNG download changed the image')
      const zipWait = page.waitForEvent('download')
      await page.locator('.all').click()
      const zip = await zipWait
      const archive = await readFile(await zip.path())
      if (zip.suggestedFilename() !== 'birthday-materials.zip' || archive.subarray(0, 2).toString() !== 'PK') throw new Error('ZIP download failed')
    } else {
      await page.setViewportSize({ width: 320, height: 568 })
      if (!(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))) throw new Error('320px gallery overflow')
    }
    if (errors.length) throw new Error(JSON.stringify(errors))
    evidence.push({ name, viewport, images, errors, toneSwitches: true, downloads: name === 'desktop' ? 'PNG and ZIP verified' : 'not repeated' })
  } finally {
    await browser.close()
  }
}
await writeFile(new URL('materials-check.json', output), JSON.stringify(evidence, null, 2) + '\n')
console.log(JSON.stringify(evidence, null, 2))
