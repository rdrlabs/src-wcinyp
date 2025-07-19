import { Page } from '@playwright/test'

export interface PerformanceMetrics {
  FCP: number
  LCP: number
  CLS: number
  FID: number
  TTFB: number
  domContentLoaded: number
  loadComplete: number
  [key: string]: number
}

interface PerformanceBudget {
  FCP?: number
  LCP?: number
  CLS?: number
  FID?: number
  TTFB?: number
  totalSize?: number
  resourceCount?: number
}

export async function measurePerformance(page: Page, name: string) {
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

export async function capturePerformanceMetrics(page: Page): Promise<PerformanceMetrics> {
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const paint = performance.getEntriesByType('paint')
    const largestContentfulPaint = performance.getEntriesByType('largest-contentful-paint')[0] as any
    
    // Calculate CLS
    let cls = 0
    const entries = performance.getEntriesByType('layout-shift') as any[]
    entries.forEach(entry => {
      if (!entry.hadRecentInput) {
        cls += entry.value
      }
    })
    
    // Calculate FID (simulated)
    const firstInput = performance.getEntriesByType('first-input')[0] as any
    
    return {
      FCP: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      LCP: largestContentfulPaint?.startTime || 0,
      CLS: cls,
      FID: firstInput?.processingStart - firstInput?.startTime || 0,
      TTFB: navigation?.responseStart - navigation?.requestStart || 0,
      domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || 0,
      loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart || 0
    }
  })
  
  return metrics
}

export function formatMetrics(metrics: PerformanceMetrics | Record<string, number>): string {
  return JSON.stringify(metrics, null, 2)
}

export async function measureInteractionPerformance(page: Page, interaction: string | (() => Promise<void>)): Promise<number> {
  const start = Date.now()
  
  if (typeof interaction === 'string') {
    await page.click(interaction)
  } else {
    await interaction()
  }
  
  const end = Date.now()
  return end - start
}

export async function mark(page: Page, name: string) {
  await page.evaluate((markName) => {
    performance.mark(markName)
  }, name)
}

export async function measure(page: Page, name: string, startMark: string, endMark: string): Promise<number> {
  return await page.evaluate(({ measureName, start, end }) => {
    performance.measure(measureName, start, end)
    const entries = performance.getEntriesByName(measureName)
    if (entries.length > 0) {
      return entries[entries.length - 1].duration
    }
    return 0
  }, { measureName: name, start: startMark, end: endMark })
}

export function assertPerformanceBudget(metrics: PerformanceMetrics | Record<string, number>, budget: PerformanceBudget) {
  const failures: string[] = []
  const results: { metric: string; actual: number; budget: number; passed: boolean }[] = []
  
  for (const [key, value] of Object.entries(budget)) {
    const metricValue = (metrics as any)[key]
    const budgetValue = value as number
    
    if (typeof metricValue === 'number' && typeof budgetValue === 'number') {
      const passed = metricValue <= budgetValue
      results.push({
        metric: key,
        actual: metricValue,
        budget: budgetValue,
        passed
      })
      
      if (!passed) {
        failures.push(`${key}: ${metricValue}ms exceeded budget of ${budgetValue}ms`)
      }
    }
  }
  
  return {
    passed: failures.length === 0,
    failures,
    results
  }
}

export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle')
}

export async function getResourceTimings(page: Page) {
  const resources = await page.evaluate(() => {
    return performance.getEntriesByType('resource').map(r => ({
      name: r.name,
      duration: r.duration,
      size: (r as any).transferSize || 0,
      initiatorType: (r as any).initiatorType || 'other'
    }))
  })
  
  const totalSize = resources.reduce((sum, r) => sum + r.size, 0)
  const totalDuration = Math.max(...resources.map(r => r.duration), 0)
  
  return {
    resources,
    totalSize,
    totalDuration
  }
}