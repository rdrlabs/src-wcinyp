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

export async function measureInteractionPerformance(page: any, interaction: string | (() => Promise<void>)): Promise<number> {
  const start = Date.now()
  
  if (typeof interaction === 'string') {
    await page.click(interaction)
  } else {
    await interaction()
  }
  
  const end = Date.now()
  return end - start
}

export function mark(pageOrName: any, name?: string) {
  // Handle both (page, name) and (name) signatures
  const markName = name || pageOrName
  if (typeof performance !== 'undefined') {
    performance.mark(markName)
  }
}

export function measure(pageOrName: any, nameOrStart?: string, startOrEnd?: string, endMark?: string): number {
  // Handle both (page, name, start, end) and (name, start, end) signatures
  let name: string, start: string, end: string
  
  if (endMark) {
    // Called with (page, name, start, end)
    name = nameOrStart!
    start = startOrEnd!
    end = endMark
  } else {
    // Called with (name, start, end)
    name = pageOrName
    start = nameOrStart!
    end = startOrEnd!
  }
  
  if (typeof performance !== 'undefined') {
    performance.measure(name, start, end)
    const entries = performance.getEntriesByName(name)
    if (entries.length > 0) {
      return entries[entries.length - 1].duration
    }
  }
  return 0
}

export function assertPerformanceBudget(metrics: any, budget: any) {
  const failures: string[] = []
  for (const [key, value] of Object.entries(budget)) {
    const metricValue = metrics[key]
    const budgetValue = value as number
    if (typeof metricValue === 'number' && typeof budgetValue === 'number' && metricValue > budgetValue) {
      failures.push(`${key}: ${metricValue}ms exceeded budget of ${budgetValue}ms`)
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