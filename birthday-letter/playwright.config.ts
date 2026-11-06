import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/letter.spec.ts',
  fullyParallel: true,
  // Font loading and compositing can take longer on busy development machines.
  timeout: 60_000,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // Keep browser startup stable on development machines with limited resources.
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium-desktop', use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } } },
    { name: 'chromium-small-mobile', use: { browserName: 'chromium', viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true } },
    { name: 'chromium-mobile', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: 'chromium-tablet', use: { browserName: 'chromium', viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: 'chromium-large-desktop', use: { browserName: 'chromium', viewport: { width: 1920, height: 1080 } } },
    { name: 'chromium-reduced-motion', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' } },
    { name: 'webkit-mobile', use: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } } },
    // Physical mouse gestures react to window blur. Run these serially after
    // other browsers, so another test page cannot steal focus mid-gesture.
    { name: 'chromium-drag', testMatch: '**/paper-drag.spec.ts', dependencies: ['chromium-desktop', 'chromium-small-mobile', 'chromium-mobile', 'chromium-tablet', 'chromium-large-desktop', 'chromium-reduced-motion', 'webkit-mobile'], use: { browserName: 'chromium', viewport: { width: 1440, height: 900 } } },
    { name: 'webkit-drag', testMatch: '**/paper-drag.spec.ts', dependencies: ['chromium-drag'], use: { browserName: 'webkit', viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: 'npm run preview',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 30_000,
  },
})
