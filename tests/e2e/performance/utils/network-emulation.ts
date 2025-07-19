export const networkProfiles = {
  'Fast 3G': {
    offline: false,
    downloadThroughput: 1.6 * 1024 * 1024 / 8,
    uploadThroughput: 750 * 1024 / 8,
    latency: 150
  },
  'Slow 3G': {
    offline: false,
    downloadThroughput: 500 * 1024 / 8,
    uploadThroughput: 500 * 1024 / 8,
    latency: 400
  },
  'Regular 4G': {
    offline: false,
    downloadThroughput: 4 * 1024 * 1024 / 8,
    uploadThroughput: 3 * 1024 * 1024 / 8,
    latency: 20
  },
  'Offline': {
    offline: true,
    downloadThroughput: 0,
    uploadThroughput: 0,
    latency: 0
  },
  'No throttling': {
    offline: false,
    downloadThroughput: -1,
    uploadThroughput: -1,
    latency: 0
  }
}

export const NetworkProfiles = networkProfiles // Alias for import compatibility

import { Page } from '@playwright/test'

export async function emulateNetwork(page: Page, profile: keyof typeof networkProfiles) {
  const conditions = networkProfiles[profile]
  await page.context().route('**/*', async (route) => {
    await route.continue()
  })
}

export async function throttleNetwork(page: Page, profile: keyof typeof networkProfiles) {
  return emulateNetwork(page, profile)
}

export async function throttleCPU(page: Page, rate: number | string) {
  // CPU throttling is not directly available in Playwright
  // This is a placeholder for compatibility
  const throttleRate = typeof rate === 'string' ? rate : `${rate}x`
  console.log(`CPU throttling to ${throttleRate} is not implemented in Playwright`)
}