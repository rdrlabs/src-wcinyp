import { test, expect } from '@playwright/test';
import { waitForPageLoad } from './utils/performance-helpers';

interface MemorySnapshot {
  timestamp: number;
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface MemoryLeakDetection {
  hasLeak: boolean;
  growthRate: number;
  snapshots: MemorySnapshot[];
  recommendation: string;
}

test.describe('Memory Usage Performance Tests', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Memory API only available in Chromium');

  test('should track heap memory usage over time', async ({ page }) => {
    // Enable memory info
    const context = await page.context();
    
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Take memory snapshots over time
    const snapshots: MemorySnapshot[] = [];
    const duration = 30000; // 30 seconds
    const interval = 2000; // 2 seconds
    
    console.log('Starting memory monitoring...');
    
    for (let elapsed = 0; elapsed < duration; elapsed += interval) {
      const memory = await page.evaluate(() => {
        const perf = performance as any;
        if (perf.memory) {
          return {
            timestamp: Date.now(),
            usedJSHeapSize: perf.memory.usedJSHeapSize,
            totalJSHeapSize: perf.memory.totalJSHeapSize,
            jsHeapSizeLimit: perf.memory.jsHeapSizeLimit,
          };
        }
        return null;
      });
      
      if (memory) {
        snapshots.push(memory);
        console.log(`Snapshot ${snapshots.length}: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB used`);
      }
      
      // Perform some actions to potentially trigger memory changes
      if (elapsed % 6000 === 0) {
        await page.click('a[href="/documents"]');
        await waitForPageLoad(page);
        await page.goBack();
        await waitForPageLoad(page);
      }
      
      await page.waitForTimeout(interval);
    }
    
    // Analyze memory trend
    const analysis = analyzeMemoryTrend(snapshots);
    
    console.log('\nMemory usage analysis:');
    console.log(`- Initial memory: ${(snapshots[0].usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Final memory: ${(snapshots[snapshots.length - 1].usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Growth rate: ${analysis.growthRate.toFixed(2)} KB/s`);
    console.log(`- Potential leak: ${analysis.hasLeak ? 'YES' : 'NO'}`);
    console.log(`- Recommendation: ${analysis.recommendation}`);
    
    // Memory growth should be minimal
    expect(analysis.growthRate).toBeLessThan(100); // Less than 100 KB/s growth
    expect(analysis.hasLeak).toBe(false);
  });

  test('should detect memory leaks during navigation', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    const initialMemory = await getMemoryUsage(page);
    console.log(`Initial memory: ${(initialMemory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Navigate through multiple pages
    const routes = ['/documents', '/providers', '/directory', '/knowledge'];
    const memoryAfterEachRoute: Record<string, number> = {};
    
    for (let i = 0; i < 3; i++) { // 3 cycles
      console.log(`\nNavigation cycle ${i + 1}:`);
      
      for (const route of routes) {
        await page.goto(route);
        await waitForPageLoad(page);
        
        // Force garbage collection if possible
        await page.evaluate(() => {
          if (window.gc) {
            window.gc();
          }
        });
        
        await page.waitForTimeout(1000);
        
        const memory = await getMemoryUsage(page);
        const key = `${route}_cycle${i}`;
        memoryAfterEachRoute[key] = memory.usedJSHeapSize;
        
        console.log(`${route}: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
      }
    }
    
    // Check if memory increases with each cycle
    const routeMemoryGrowth: Record<string, number[]> = {};
    
    routes.forEach(route => {
      routeMemoryGrowth[route] = [];
      for (let i = 0; i < 3; i++) {
        const key = `${route}_cycle${i}`;
        routeMemoryGrowth[route].push(memoryAfterEachRoute[key]);
      }
    });
    
    // Analyze growth patterns
    console.log('\nMemory growth analysis by route:');
    routes.forEach(route => {
      const growth = routeMemoryGrowth[route];
      const avgGrowth = (growth[2] - growth[0]) / 2;
      console.log(`${route}: ${(avgGrowth / 1024 / 1024).toFixed(2)} MB average growth`);
      
      // Memory should not continuously grow
      expect(avgGrowth).toBeLessThan(5 * 1024 * 1024); // Less than 5MB growth
    });
  });

  test('should monitor garbage collection impact', async ({ page }) => {
    // Enable GC monitoring
    await page.addInitScript(() => {
      const gcEvents: Array<{ timestamp: number; duration: number; collected: number }> = [];
      let lastHeapSize = 0;
      
      // Monitor memory changes that might indicate GC
      setInterval(() => {
        const perf = performance as any;
        if (perf.memory) {
          const currentHeapSize = perf.memory.usedJSHeapSize;
          const collected = lastHeapSize - currentHeapSize;
          
          if (collected > 1024 * 1024) { // More than 1MB collected
            gcEvents.push({
              timestamp: Date.now(),
              duration: 0, // Can't measure exact duration without Chrome flags
              collected: collected,
            });
          }
          
          lastHeapSize = currentHeapSize;
        }
      }, 100);
      
      (window as any).__gcEvents = gcEvents;
    });
    
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Generate garbage by creating and discarding objects
    await page.evaluate(() => {
      const arrays = [];
      for (let i = 0; i < 100; i++) {
        arrays.push(new Array(10000).fill(Math.random()));
      }
      // Arrays go out of scope and should be collected
    });
    
    // Wait for potential GC
    await page.waitForTimeout(5000);
    
    // Create more garbage
    await page.evaluate(() => {
      for (let i = 0; i < 50; i++) {
        const obj = {} as any;
        for (let j = 0; j < 1000; j++) {
          obj[`prop${j}`] = new Array(100).fill(j);
        }
        // Object goes out of scope
      }
    });
    
    await page.waitForTimeout(5000);
    
    const gcEvents = await page.evaluate(() => (window as any).__gcEvents);
    
    console.log('Garbage collection events:');
    if (gcEvents.length > 0) {
      gcEvents.forEach((event: any, index: number) => {
        console.log(`GC ${index + 1}: Collected ${(event.collected / 1024 / 1024).toFixed(2)} MB`);
      });
    } else {
      console.log('No significant GC events detected');
    }
    
    // Get final memory state
    const finalMemory = await getMemoryUsage(page);
    console.log(`\nFinal heap size: ${(finalMemory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
  });

  test('should profile memory by component type', async ({ page }) => {
    // Take heap snapshot using CDP
    const client = await page.context().newCDPSession(page);
    await client.send('HeapProfiler.enable');
    
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Take initial snapshot
    console.log('Taking heap snapshot...');
    await client.send('HeapProfiler.takeHeapSnapshot', {
      reportProgress: false,
      treatGlobalObjectsAsRoots: true,
    });
    
    // Collect memory statistics
    const memoryStats = await page.evaluate(() => {
      const stats = {
        dom: 0,
        js: 0,
        strings: 0,
        arrays: 0,
        objects: 0,
      };
      
      // Estimate DOM memory
      stats.dom = document.getElementsByTagName('*').length * 1000; // Rough estimate
      
      // Get performance memory if available
      const perf = performance as any;
      if (perf.memory) {
        stats.js = perf.memory.usedJSHeapSize;
      }
      
      return stats;
    });
    
    console.log('Memory breakdown (estimates):');
    console.log(`- DOM nodes: ~${(memoryStats.dom / 1024).toFixed(2)} KB`);
    console.log(`- JS heap: ${(memoryStats.js / 1024 / 1024).toFixed(2)} MB`);
    
    // Check for detached DOM nodes
    const detachedNodes = await page.evaluate(() => {
      const allNodes = document.getElementsByTagName('*');
      let detached = 0;
      
      for (let i = 0; i < allNodes.length; i++) {
        const node = allNodes[i];
        if (!document.body.contains(node) && node !== document.documentElement) {
          detached++;
        }
      }
      
      return detached;
    });
    
    console.log(`\nDetached DOM nodes: ${detachedNodes}`);
    expect(detachedNodes).toBe(0);
  });

  test('should measure memory impact of specific features', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    const measurements: Record<string, { before: number; after: number; impact: number }> = {};
    
    // Measure search feature memory impact
    const beforeSearch = await getMemoryUsage(page);
    await page.keyboard.press('Meta+K');
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    await page.waitForTimeout(1000);
    const afterSearch = await getMemoryUsage(page);
    await page.keyboard.press('Escape');
    
    measurements.search = {
      before: beforeSearch.usedJSHeapSize,
      after: afterSearch.usedJSHeapSize,
      impact: afterSearch.usedJSHeapSize - beforeSearch.usedJSHeapSize,
    };
    
    // Measure navigation menu memory impact (if exists)
    const beforeNav = await getMemoryUsage(page);
    const menuButton = await page.$('button[aria-label*="menu"]');
    if (menuButton) {
      await menuButton.click();
      await page.waitForTimeout(1000);
      const afterNav = await getMemoryUsage(page);
      
      measurements.navigation = {
        before: beforeNav.usedJSHeapSize,
        after: afterNav.usedJSHeapSize,
        impact: afterNav.usedJSHeapSize - beforeNav.usedJSHeapSize,
      };
      
      // Close menu
      await menuButton.click();
    }
    
    // Navigate to a heavy page
    const beforeHeavyPage = await getMemoryUsage(page);
    await page.goto('/providers');
    await waitForPageLoad(page);
    const afterHeavyPage = await getMemoryUsage(page);
    
    measurements.providersPage = {
      before: beforeHeavyPage.usedJSHeapSize,
      after: afterHeavyPage.usedJSHeapSize,
      impact: afterHeavyPage.usedJSHeapSize - beforeHeavyPage.usedJSHeapSize,
    };
    
    console.log('Feature memory impact:');
    Object.entries(measurements).forEach(([feature, data]) => {
      console.log(`- ${feature}: ${(data.impact / 1024 / 1024).toFixed(2)} MB`);
    });
    
    // Individual features shouldn't use excessive memory
    Object.values(measurements).forEach(data => {
      expect(data.impact).toBeLessThan(10 * 1024 * 1024); // Less than 10MB per feature
    });
  });

  test('should track memory during extended session', async ({ page }) => {
    // Simulate extended user session
    const sessionDuration = 60000; // 1 minute
    const checkInterval = 10000; // 10 seconds
    const actions = [
      () => page.goto('/'),
      () => page.goto('/documents'),
      () => page.goto('/providers'),
      () => page.keyboard.press('Meta+K'),
      () => page.keyboard.press('Escape'),
      () => page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)),
      () => page.evaluate(() => window.scrollTo(0, 0)),
    ];
    
    await page.goto('/');
    await waitForPageLoad(page);
    
    const memorySnapshots: MemorySnapshot[] = [];
    const startTime = Date.now();
    let actionIndex = 0;
    
    console.log('Starting extended session simulation...');
    
    while (Date.now() - startTime < sessionDuration) {
      // Perform random action
      const action = actions[actionIndex % actions.length];
      await action();
      await page.waitForTimeout(2000);
      
      // Take memory snapshot
      const memory = await getMemoryUsage(page);
      memorySnapshots.push({
        timestamp: Date.now() - startTime,
        ...memory,
      });
      
      console.log(`${Math.floor((Date.now() - startTime) / 1000)}s: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
      
      actionIndex++;
      await page.waitForTimeout(checkInterval - 2000);
    }
    
    // Analyze session memory pattern
    const initialMemory = memorySnapshots[0].usedJSHeapSize;
    const finalMemory = memorySnapshots[memorySnapshots.length - 1].usedJSHeapSize;
    const maxMemory = Math.max(...memorySnapshots.map(s => s.usedJSHeapSize));
    const avgMemory = memorySnapshots.reduce((sum, s) => sum + s.usedJSHeapSize, 0) / memorySnapshots.length;
    
    console.log('\nExtended session memory analysis:');
    console.log(`- Initial: ${(initialMemory / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Final: ${(finalMemory / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Peak: ${(maxMemory / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Average: ${(avgMemory / 1024 / 1024).toFixed(2)} MB`);
    console.log(`- Growth: ${((finalMemory - initialMemory) / 1024 / 1024).toFixed(2)} MB`);
    
    // Memory should stabilize over time
    const growthRate = (finalMemory - initialMemory) / sessionDuration * 1000; // bytes per second
    expect(growthRate).toBeLessThan(50 * 1024); // Less than 50KB/s growth
  });
});

async function getMemoryUsage(page: any): Promise<MemorySnapshot> {
  const memory = await page.evaluate(() => {
    const perf = performance as any;
    if (perf.memory) {
      return {
        timestamp: Date.now(),
        usedJSHeapSize: perf.memory.usedJSHeapSize,
        totalJSHeapSize: perf.memory.totalJSHeapSize,
        jsHeapSizeLimit: perf.memory.jsHeapSizeLimit,
      };
    }
    return {
      timestamp: Date.now(),
      usedJSHeapSize: 0,
      totalJSHeapSize: 0,
      jsHeapSizeLimit: 0,
    };
  });
  
  return memory;
}

function analyzeMemoryTrend(snapshots: MemorySnapshot[]): MemoryLeakDetection {
  if (snapshots.length < 2) {
    return {
      hasLeak: false,
      growthRate: 0,
      snapshots,
      recommendation: 'Not enough data to analyze',
    };
  }
  
  // Calculate growth rate using linear regression
  const n = snapshots.length;
  const times = snapshots.map((s, i) => i);
  const memories = snapshots.map(s => s.usedJSHeapSize);
  
  const sumX = times.reduce((a, b) => a + b, 0);
  const sumY = memories.reduce((a, b) => a + b, 0);
  const sumXY = times.reduce((sum, x, i) => sum + x * memories[i], 0);
  const sumX2 = times.reduce((sum, x) => sum + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Growth rate in bytes per millisecond
  const growthRate = slope * (2000 / 1024); // Convert to KB/s (snapshots every 2s)
  
  // Detect leak based on consistent growth
  const hasLeak = growthRate > 10 && // More than 10 KB/s
                  memories[n-1] > memories[0] * 1.5; // 50% increase
  
  let recommendation = '';
  if (hasLeak) {
    recommendation = 'Potential memory leak detected. Investigate event listeners and object retention.';
  } else if (growthRate > 5) {
    recommendation = 'Moderate memory growth detected. Monitor for longer periods.';
  } else {
    recommendation = 'Memory usage appears stable.';
  }
  
  return {
    hasLeak,
    growthRate,
    snapshots,
    recommendation,
  };
}