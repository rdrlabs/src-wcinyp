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

export async function emulateNetwork(page: any, profile: keyof typeof networkProfiles) {
  const conditions = networkProfiles[profile]
  await page.context().route('**/*', async (route: any) => {
    await route.continue()
  })
}