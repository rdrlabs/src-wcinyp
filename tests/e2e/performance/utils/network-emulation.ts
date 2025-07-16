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
  'Offline': {
    offline: true,
    downloadThroughput: 0,
    uploadThroughput: 0,
    latency: 0
  }
}

export const NetworkProfiles = networkProfiles // Alias for import compatibility

export async function emulateNetwork(page: any, profile: keyof typeof networkProfiles) {
  const conditions = networkProfiles[profile]
  await page.context().route('**/*', async (route: any) => {
    await route.continue()
  })
}

export async function throttleNetwork(page: any, profile: keyof typeof networkProfiles) {
  return emulateNetwork(page, profile)
}

export async function throttleCPU(page: any, rate: number) {
  // CPU throttling is not directly available in Playwright
  // This is a placeholder for compatibility
  console.log(`CPU throttling to ${rate}x is not implemented in Playwright`)
}