import { Page, BrowserContext } from '@playwright/test';

/**
 * Performance metrics interface for Web Vitals
 */
export interface PerformanceMetrics {
  FCP: number;  // First Contentful Paint (ms)
  LCP: number;  // Largest Contentful Paint (ms)
  TTI: number;  // Time to Interactive (ms)
  TBT: number;  // Total Blocking Time (ms)
  CLS: number;  // Cumulative Layout Shift (score)
  INP: number;  // Interaction to Next Paint (ms)
  TTFB: number; // Time to First Byte (ms)
}

/**
 * Performance budget interface
 */
export interface PerformanceBudget {
  FCP?: number;
  LCP?: number;
  TTI?: number;
  TBT?: number;
  CLS?: number;
  INP?: number;
  TTFB?: number;
}

/**
 * Capture comprehensive performance metrics using Performance Observer API
 */
export async function capturePerformanceMetrics(page: Page): Promise<PerformanceMetrics> {
  const metrics = await page.evaluate(() => {
    return new Promise<PerformanceMetrics>((resolve) => {
      let fcp = 0;
      let lcp = 0;
      let cls = 0;
      let ttfb = 0;
      let tti = 0;
      let tbt = 0;
      let inp = 0;

      // Get navigation timing for TTFB and TTI
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        ttfb = Math.round(navigation.responseStart - navigation.fetchStart);
        tti = Math.round(navigation.domInteractive - navigation.fetchStart);
      }

      // Get FCP from paint timing
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        fcp = Math.round(fcpEntry.startTime);
      }

      // Set up observers for other metrics
      let observersComplete = 0;
      const totalObservers = 3;

      function checkComplete() {
        observersComplete++;
        if (observersComplete === totalObservers) {
          // Calculate TBT (simplified - actual TBT requires more complex calculation)
          const longTasks = performance.getEntriesByType('longtask');
          tbt = longTasks.reduce((total, task) => {
            const blockingTime = Math.max(0, task.duration - 50);
            return total + blockingTime;
          }, 0);

          resolve({
            FCP: fcp,
            LCP: lcp,
            TTI: tti,
            TBT: Math.round(tbt),
            CLS: parseFloat(cls.toFixed(4)),
            INP: inp,
            TTFB: ttfb
          });
        }
      }

      // LCP Observer
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          lcp = Math.round(lastEntry.startTime);
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        // Auto-complete after timeout
        setTimeout(() => {
          lcpObserver.disconnect();
          checkComplete();
        }, 5000);
      } catch (e) {
        checkComplete();
      }

      // CLS Observer
      try {
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            // Only count layout shifts without recent input
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value;
            }
          });
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
        // Auto-complete after timeout
        setTimeout(() => {
          clsObserver.disconnect();
          checkComplete();
        }, 5000);
      } catch (e) {
        checkComplete();
      }

      // INP Observer (Event Timing API)
      try {
        let maxDuration = 0;
        const inpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.duration > maxDuration) {
              maxDuration = entry.duration;
              inp = Math.round(maxDuration);
            }
          });
        });
        inpObserver.observe({ type: 'event', buffered: true });
        // Auto-complete after timeout
        setTimeout(() => {
          inpObserver.disconnect();
          checkComplete();
        }, 5000);
      } catch (e) {
        checkComplete();
      }
    });
  });

  return metrics;
}

/**
 * Assert that performance metrics meet the specified budget
 */
export function assertPerformanceBudget(
  metrics: PerformanceMetrics,
  budget: PerformanceBudget
): { passed: boolean; violations: string[] } {
  const violations: string[] = [];

  Object.entries(budget).forEach(([metric, threshold]) => {
    const actualValue = metrics[metric as keyof PerformanceMetrics];
    if (actualValue > threshold) {
      violations.push(
        `${metric} exceeded budget: ${actualValue}${metric === 'CLS' ? '' : 'ms'} > ${threshold}${metric === 'CLS' ? '' : 'ms'}`
      );
    }
  });

  return {
    passed: violations.length === 0,
    violations
  };
}

/**
 * Wait for page to be fully loaded and idle
 */
export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  // Additional wait for any lazy-loaded content
  await page.waitForTimeout(1000);
}

/**
 * Measure interaction performance (click, type, etc.)
 */
export async function measureInteractionPerformance(
  page: Page,
  interaction: () => Promise<void>
): Promise<number> {
  const startTime = await page.evaluate(() => performance.now());
  
  await interaction();
  
  // Wait for the next paint
  const duration = await page.evaluate((start) => {
    return new Promise<number>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve(performance.now() - start);
        });
      });
    });
  }, startTime);

  return Math.round(duration);
}

/**
 * Get detailed resource timing information
 */
export async function getResourceTimings(page: Page): Promise<{
  totalSize: number;
  totalDuration: number;
  resources: Array<{
    name: string;
    type: string;
    size: number;
    duration: number;
  }>;
}> {
  return await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const resourceData = resources.map(resource => ({
      name: resource.name.split('/').pop() || resource.name,
      type: resource.initiatorType,
      size: resource.transferSize || 0,
      duration: Math.round(resource.duration)
    }));

    const totalSize = resourceData.reduce((sum, r) => sum + r.size, 0);
    const totalDuration = Math.max(...resourceData.map(r => r.duration), 0);

    return {
      totalSize,
      totalDuration,
      resources: resourceData.sort((a, b) => b.duration - a.duration).slice(0, 10) // Top 10 slowest
    };
  });
}

/**
 * Format performance metrics for console output
 */
export function formatMetrics(metrics: PerformanceMetrics): string {
  return `
Performance Metrics:
  TTFB: ${metrics.TTFB}ms
  FCP:  ${metrics.FCP}ms
  LCP:  ${metrics.LCP}ms
  TTI:  ${metrics.TTI}ms
  TBT:  ${metrics.TBT}ms
  CLS:  ${metrics.CLS}
  INP:  ${metrics.INP}ms
`;
}

/**
 * Create a performance mark for custom timing
 */
export async function mark(page: Page, markName: string): Promise<void> {
  await page.evaluate((name) => {
    performance.mark(name);
  }, markName);
}

/**
 * Measure between two marks
 */
export async function measure(
  page: Page,
  measureName: string,
  startMark: string,
  endMark: string
): Promise<number> {
  return await page.evaluate((name, start, end) => {
    performance.measure(name, start, end);
    const measures = performance.getEntriesByName(name, 'measure');
    return measures.length > 0 ? Math.round(measures[0].duration) : 0;
  }, measureName, startMark, endMark);
}

/**
 * Get memory usage information (Chrome/Chromium only)
 */
export async function getMemoryUsage(page: Page): Promise<{
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
} | null> {
  return await page.evaluate(() => {
    // Type assertion for Chrome-specific API
    const memory = (performance as any).memory;
    if (!memory) return null;
    
    return {
      usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1024 / 1024), // Convert to MB
      totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1024 / 1024),
      jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
    };
  });
}