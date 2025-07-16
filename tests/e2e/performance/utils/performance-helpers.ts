export async function measurePerformance(page: any, name: string) {
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as any
    const paint = performance.getEntriesByType('paint')
    
    return {
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
      loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
      firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
      firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
    }
  })
  
  return metrics
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export async function capturePerformanceMetrics(page: any) {
  return measurePerformance(page, 'page')
}

export function formatMetrics(metrics: any): string {
  return JSON.stringify(metrics, null, 2)
}

export async function measureInteractionPerformance(page: any, selector: string) {
  const start = Date.now()
  await page.click(selector)
  const end = Date.now()
  return { duration: end - start }
}

export function mark(name: string) {
  if (typeof performance !== 'undefined') {
    performance.mark(name)
  }
}

export function measure(name: string, startMark: string, endMark: string) {
  if (typeof performance !== 'undefined') {
    performance.measure(name, startMark, endMark)
  }
}

export function assertPerformanceBudget(metrics: any, budget: any) {
  const failures: string[] = []
  for (const [key, value] of Object.entries(budget)) {
    if (metrics[key] > value) {
      failures.push(`${key}: ${metrics[key]}ms exceeded budget of ${value}ms`)
    }
  }
  if (failures.length > 0) {
    throw new Error(`Performance budget exceeded:\n${failures.join('\n')}`)
  }
}

export async function waitForPageLoad(page: any) {
  await page.waitForLoadState('networkidle')
}

export async function getResourceTimings(page: any) {
  return page.evaluate(() => {
    return performance.getEntriesByType('resource').map(r => ({
      name: r.name,
      duration: r.duration,
      size: (r as any).transferSize || 0
    }))
  })
}