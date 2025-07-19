import { Page, CDPSession } from '@playwright/test';

export interface WebVitalsMetrics {
  FCP?: number;
  LCP?: number;
  CLS?: number;
  FID?: number;
  TTFB?: number;
  INP?: number;
  customMetrics?: Record<string, number>;
}

export interface PerformanceMetrics extends WebVitalsMetrics {
  navigationStart: number;
  domContentLoaded: number;
  loadComplete: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  totalBlockingTime?: number;
  timeToInteractive?: number;
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

export async function capturePerformanceMetrics(page: Page): Promise<PerformanceMetrics> {
  // Inject Web Vitals library and capture metrics
  const metrics = await page.evaluate(() => {
    return new Promise<PerformanceMetrics>((resolve) => {
      // Capture navigation timing
      const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      // Capture paint timing
      const paintTiming = performance.getEntriesByType('paint');
      const fcp = paintTiming.find(entry => entry.name === 'first-contentful-paint');
      const fp = paintTiming.find(entry => entry.name === 'first-paint');
      
      // Capture LCP
      let lcp = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        lcp = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Capture memory if available
      const memory = (performance as any).memory;
      
      // Wait for load complete then resolve
      if (document.readyState === 'complete') {
        setTimeout(() => {
          resolve({
            navigationStart: navTiming.fetchStart,
            domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.fetchStart,
            loadComplete: navTiming.loadEventEnd - navTiming.fetchStart,
            firstPaint: fp?.startTime,
            firstContentfulPaint: fcp?.startTime,
            largestContentfulPaint: lcp,
            TTFB: navTiming.responseStart - navTiming.fetchStart,
            FCP: fcp?.startTime,
            LCP: lcp,
            memoryUsage: memory ? {
              usedJSHeapSize: memory.usedJSHeapSize,
              totalJSHeapSize: memory.totalJSHeapSize,
              jsHeapSizeLimit: memory.jsHeapSizeLimit,
            } : undefined,
          });
        }, 100);
      } else {
        window.addEventListener('load', () => {
          setTimeout(() => {
            resolve({
              navigationStart: navTiming.fetchStart,
              domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.fetchStart,
              loadComplete: navTiming.loadEventEnd - navTiming.fetchStart,
              firstPaint: fp?.startTime,
              firstContentfulPaint: fcp?.startTime,
              largestContentfulPaint: lcp,
              TTFB: navTiming.responseStart - navTiming.fetchStart,
              FCP: fcp?.startTime,
              LCP: lcp,
              memoryUsage: memory ? {
                usedJSHeapSize: memory.usedJSHeapSize,
                totalJSHeapSize: memory.totalJSHeapSize,
                jsHeapSizeLimit: memory.jsHeapSizeLimit,
              } : undefined,
            });
          }, 100);
        });
      }
    });
  });
  
  return metrics;
}

export async function captureWebVitals(page: Page): Promise<WebVitalsMetrics> {
  // Inject web-vitals library
  await page.addScriptTag({
    url: 'https://unpkg.com/web-vitals@3/dist/web-vitals.iife.js'
  });
  
  return await page.evaluate(() => {
    return new Promise<WebVitalsMetrics>((resolve) => {
      const metrics: WebVitalsMetrics = {};
      
      (window as any).webVitals.onFCP((metric: any) => {
        metrics.FCP = metric.value;
      });
      
      (window as any).webVitals.onLCP((metric: any) => {
        metrics.LCP = metric.value;
      });
      
      (window as any).webVitals.onCLS((metric: any) => {
        metrics.CLS = metric.value;
      });
      
      (window as any).webVitals.onFID((metric: any) => {
        metrics.FID = metric.value;
      });
      
      (window as any).webVitals.onTTFB((metric: any) => {
        metrics.TTFB = metric.value;
      });
      
      (window as any).webVitals.onINP((metric: any) => {
        metrics.INP = metric.value;
      });
      
      // Wait for metrics to be captured
      setTimeout(() => resolve(metrics), 5000);
    });
  });
}

export async function measurePageWeight(page: Page): Promise<number> {
  const client = await page.context().newCDPSession(page);
  await client.send('Network.enable');
  
  let totalBytes = 0;
  
  client.on('Network.loadingFinished', async (event) => {
    const response = await client.send('Network.getResponseBody', {
      requestId: event.requestId
    }).catch(() => ({ body: '', base64Encoded: false }));
    
    if (response.body) {
      totalBytes += response.base64Encoded 
        ? Buffer.from(response.body, 'base64').length 
        : response.body.length;
    }
  });
  
  await page.reload();
  await page.waitForLoadState('networkidle');
  
  return totalBytes;
}

export async function captureRenderBlockingResources(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const resources: string[] = [];
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    entries.forEach(entry => {
      // Check if resource blocked rendering (loaded before FCP)
      const fcp = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcp && entry.responseEnd < fcp.startTime) {
        if (entry.name.includes('.css') || 
            (entry.name.includes('.js') && !entry.name.includes('async') && !entry.name.includes('defer'))) {
          resources.push(entry.name);
        }
      }
    });
    
    return resources;
  });
}

// Keep existing helper functions for backward compatibility
export async function measurePerformance(page: any, name: string) {
  const metrics = await capturePerformanceMetrics(page);
  return {
    domContentLoaded: metrics.domContentLoaded,
    loadComplete: metrics.loadComplete,
    firstPaint: metrics.firstPaint,
    firstContentfulPaint: metrics.firstContentfulPaint,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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