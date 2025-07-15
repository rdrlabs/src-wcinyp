import { test, expect } from '@playwright/test';
import { waitForPageLoad } from './utils/performance-helpers';

interface ResourceTiming {
  name: string;
  type: string;
  size: number;
  duration: number;
  startTime: number;
  responseEnd: number;
  priority: string;
  protocol: string;
  cached: boolean;
  compressed: boolean;
}

interface ResourceAnalysis {
  totalResources: number;
  totalSize: number;
  byType: Record<string, { count: number; size: number; avgDuration: number }>;
  criticalPath: ResourceTiming[];
  renderBlocking: ResourceTiming[];
  thirdParty: ResourceTiming[];
  largestResources: ResourceTiming[];
  slowestResources: ResourceTiming[];
}

test.describe('Resource Loading Performance', () => {
  test('should analyze resource waterfall', async ({ page }) => {
    // Collect resource timings
    const resourceTimings: ResourceTiming[] = [];
    
    page.on('response', async response => {
      const request = response.request();
      const timing = response.timing();
      
      if (timing) {
        resourceTimings.push({
          name: response.url(),
          type: request.resourceType(),
          size: parseInt(response.headers()['content-length'] || '0'),
          duration: timing.responseEnd - timing.requestStart,
          startTime: timing.requestStart,
          responseEnd: timing.responseEnd,
          priority: request.headers()['priority'] || 'unknown',
          protocol: response.headers()[':protocol'] || 'http/1.1',
          cached: response.fromCache(),
          compressed: response.headers()['content-encoding'] === 'gzip' || 
                      response.headers()['content-encoding'] === 'br',
        });
      }
    });
    
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Analyze resource loading patterns
    const analysis = analyzeResources(resourceTimings);
    
    console.log('Resource Loading Analysis:');
    console.log(`Total resources: ${analysis.totalResources}`);
    console.log(`Total size: ${(analysis.totalSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Log resource breakdown by type
    console.log('\nResources by type:');
    Object.entries(analysis.byType).forEach(([type, stats]) => {
      console.log(`- ${type}: ${stats.count} files, ${(stats.size / 1024).toFixed(2)} KB, avg ${stats.avgDuration.toFixed(0)}ms`);
    });
    
    // Check for performance issues
    expect(analysis.renderBlocking.length).toBeLessThan(5);
    expect(analysis.totalSize).toBeLessThan(5 * 1024 * 1024); // 5MB limit
    
    // Log critical path
    console.log('\nCritical path resources:');
    analysis.criticalPath.slice(0, 5).forEach(resource => {
      console.log(`- ${resource.type}: ${resource.name.split('/').pop()} (${resource.duration}ms)`);
    });
  });

  test('should identify render-blocking resources', async ({ page }) => {
    await page.goto('/');
    
    const renderBlockingResources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const navigationStart = performance.timing.navigationStart;
      const firstPaint = performance.getEntriesByName('first-paint')[0]?.startTime || 0;
      
      return entries
        .filter(entry => {
          // Resources that finish before first paint are potentially render-blocking
          const finishTime = entry.responseEnd;
          return finishTime < firstPaint && 
                 (entry.initiatorType === 'link' || entry.initiatorType === 'script');
        })
        .map(entry => ({
          name: entry.name,
          type: entry.initiatorType,
          duration: entry.duration,
          size: entry.transferSize,
          renderBlocking: true,
        }));
    });
    
    console.log(`Found ${renderBlockingResources.length} render-blocking resources:`);
    renderBlockingResources.forEach(resource => {
      console.log(`- ${resource.type}: ${resource.name.split('/').pop()} (${resource.duration.toFixed(0)}ms)`);
    });
    
    // Critical CSS and JS should be minimal
    const blockingCSS = renderBlockingResources.filter(r => r.type === 'link');
    const blockingJS = renderBlockingResources.filter(r => r.type === 'script');
    
    expect(blockingCSS.length).toBeLessThanOrEqual(2);
    expect(blockingJS.length).toBeLessThanOrEqual(1);
  });

  test('should analyze resource priorities', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      test.skip();
    }
    
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');
    
    const resourcePriorities: Record<string, string> = {};
    
    client.on('Network.requestWillBeSent', (params) => {
      resourcePriorities[params.requestId] = params.request.initialPriority || 'Medium';
    });
    
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Get resource details with priorities
    const resources = await page.evaluate(() => {
      return (performance.getEntriesByType('resource') as PerformanceResourceTiming[])
        .map(entry => ({
          name: entry.name,
          type: entry.initiatorType,
          startTime: entry.startTime,
          duration: entry.duration,
        }));
    });
    
    // Analyze priority distribution
    const priorityStats = Object.values(resourcePriorities).reduce((acc, priority) => {
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('Resource priorities:');
    Object.entries(priorityStats).forEach(([priority, count]) => {
      console.log(`- ${priority}: ${count} resources`);
    });
    
    // Critical resources should have high priority
    const criticalResources = resources.filter(r => 
      r.name.includes('.css') || 
      (r.name.includes('.js') && r.startTime < 1000)
    );
    
    console.log(`Critical resources: ${criticalResources.length}`);
  });

  test('should measure resource loading parallelization', async ({ page }) => {
    const resourceTimeline: Array<{time: number, active: number}> = [];
    const activeRequests = new Set<string>();
    
    page.on('request', request => {
      activeRequests.add(request.url());
      resourceTimeline.push({
        time: Date.now(),
        active: activeRequests.size,
      });
    });
    
    page.on('response', response => {
      activeRequests.delete(response.url());
      resourceTimeline.push({
        time: Date.now(),
        active: activeRequests.size,
      });
    });
    
    const startTime = Date.now();
    await page.goto('/');
    await waitForPageLoad(page);
    const loadTime = Date.now() - startTime;
    
    // Analyze parallelization
    const maxParallel = Math.max(...resourceTimeline.map(point => point.active));
    const avgParallel = resourceTimeline.reduce((sum, point) => sum + point.active, 0) / resourceTimeline.length;
    
    console.log('Resource loading parallelization:');
    console.log(`- Max parallel requests: ${maxParallel}`);
    console.log(`- Average parallel requests: ${avgParallel.toFixed(1)}`);
    console.log(`- Total load time: ${loadTime}ms`);
    
    // Good parallelization should use 6+ connections
    expect(maxParallel).toBeGreaterThanOrEqual(6);
  });

  test('should identify unused CSS and JavaScript', async ({ page }) => {
    // Start coverage
    await page.coverage.startCSSCoverage();
    await page.coverage.startJSCoverage();
    
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Interact with the page to trigger more code execution
    await page.keyboard.press('Meta+K'); // Open search
    await page.keyboard.press('Escape'); // Close search
    
    // Stop coverage
    const cssCoverage = await page.coverage.stopCSSCoverage();
    const jsCoverage = await page.coverage.stopJSCoverage();
    
    // Analyze CSS coverage
    let totalCSS = 0;
    let usedCSS = 0;
    const unusedCSSFiles: Array<{url: string, unused: number}> = [];
    
    for (const entry of cssCoverage) {
      if (entry.text) {
        totalCSS += entry.text.length;
        let covered = 0;
        
        for (const range of entry.ranges) {
          covered += range.end - range.start;
        }
        
        usedCSS += covered;
        const unusedPercent = ((entry.text.length - covered) / entry.text.length) * 100;
        
        if (unusedPercent > 50) {
          unusedCSSFiles.push({
            url: entry.url.split('/').pop() || entry.url,
            unused: unusedPercent,
          });
        }
      }
    }
    
    // Analyze JS coverage
    let totalJS = 0;
    let usedJS = 0;
    const unusedJSFiles: Array<{url: string, unused: number}> = [];
    
    for (const entry of jsCoverage) {
      if (entry.source) {
        totalJS += entry.source.length;
        let covered = 0;
        
        // JS coverage structure is different
        for (const func of entry.functions) {
          for (const range of func.ranges) {
            covered += range.endOffset - range.startOffset;
          }
        }
        
        usedJS += covered;
        const unusedPercent = ((entry.source.length - covered) / entry.source.length) * 100;
        
        if (unusedPercent > 50) {
          unusedJSFiles.push({
            url: entry.url.split('/').pop() || entry.url,
            unused: unusedPercent,
          });
        }
      }
    }
    
    console.log('\nCode coverage analysis:');
    console.log(`CSS: ${((usedCSS / totalCSS) * 100).toFixed(1)}% used`);
    console.log(`JS: ${((usedJS / totalJS) * 100).toFixed(1)}% used`);
    
    if (unusedCSSFiles.length > 0) {
      console.log('\nCSS files with >50% unused code:');
      unusedCSSFiles.forEach(file => {
        console.log(`- ${file.url}: ${file.unused.toFixed(1)}% unused`);
      });
    }
    
    if (unusedJSFiles.length > 0) {
      console.log('\nJS files with >50% unused code:');
      unusedJSFiles.forEach(file => {
        console.log(`- ${file.url}: ${file.unused.toFixed(1)}% unused`);
      });
    }
  });

  test('should analyze third-party resources', async ({ page }) => {
    const firstPartyDomains = ['localhost', '127.0.0.1', 'wcinyp'];
    const thirdPartyResources: ResourceTiming[] = [];
    
    page.on('response', async response => {
      const url = new URL(response.url());
      const isThirdParty = !firstPartyDomains.some(domain => 
        url.hostname.includes(domain)
      );
      
      if (isThirdParty) {
        const timing = response.timing();
        if (timing) {
          thirdPartyResources.push({
            name: response.url(),
            type: response.request().resourceType(),
            size: parseInt(response.headers()['content-length'] || '0'),
            duration: timing.responseEnd - timing.requestStart,
            startTime: timing.requestStart,
            responseEnd: timing.responseEnd,
            priority: 'unknown',
            protocol: response.headers()[':protocol'] || 'http/1.1',
            cached: response.fromCache(),
            compressed: false,
          });
        }
      }
    });
    
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Group by domain
    const byDomain = thirdPartyResources.reduce((acc, resource) => {
      const domain = new URL(resource.name).hostname;
      if (!acc[domain]) {
        acc[domain] = { count: 0, size: 0, duration: 0 };
      }
      acc[domain].count++;
      acc[domain].size += resource.size;
      acc[domain].duration += resource.duration;
      return acc;
    }, {} as Record<string, { count: number; size: number; duration: number }>);
    
    console.log('Third-party resources by domain:');
    Object.entries(byDomain).forEach(([domain, stats]) => {
      console.log(`- ${domain}: ${stats.count} requests, ${(stats.size / 1024).toFixed(2)} KB, ${stats.duration.toFixed(0)}ms total`);
    });
    
    // Calculate third-party impact
    const totalThirdPartySize = thirdPartyResources.reduce((sum, r) => sum + r.size, 0);
    const totalThirdPartyTime = Math.max(...thirdPartyResources.map(r => r.responseEnd)) - 
                               Math.min(...thirdPartyResources.map(r => r.startTime));
    
    console.log(`\nThird-party impact:`);
    console.log(`- Total size: ${(totalThirdPartySize / 1024).toFixed(2)} KB`);
    console.log(`- Loading time: ${totalThirdPartyTime.toFixed(0)}ms`);
    console.log(`- Number of domains: ${Object.keys(byDomain).length}`);
    
    // Third-party resources should be limited
    expect(Object.keys(byDomain).length).toBeLessThan(10);
    expect(totalThirdPartySize).toBeLessThan(1024 * 1024); // 1MB limit
  });
});

function analyzeResources(resources: ResourceTiming[]): ResourceAnalysis {
  const byType = resources.reduce((acc, resource) => {
    if (!acc[resource.type]) {
      acc[resource.type] = { count: 0, size: 0, totalDuration: 0, avgDuration: 0 };
    }
    acc[resource.type].count++;
    acc[resource.type].size += resource.size;
    acc[resource.type].totalDuration += resource.duration;
    return acc;
  }, {} as Record<string, { count: number; size: number; totalDuration: number; avgDuration: number }>);
  
  // Calculate averages
  Object.values(byType).forEach(stats => {
    stats.avgDuration = stats.totalDuration / stats.count;
  });
  
  // Identify critical path (resources that block rendering)
  const criticalPath = resources
    .filter(r => r.type === 'stylesheet' || (r.type === 'script' && r.startTime < 1000))
    .sort((a, b) => a.startTime - b.startTime);
  
  // Identify render-blocking resources
  const renderBlocking = resources.filter(r => 
    (r.type === 'stylesheet' || r.type === 'script') && 
    r.responseEnd < 2000 // Finished loading within first 2 seconds
  );
  
  // Identify third-party resources
  const thirdParty = resources.filter(r => {
    const url = new URL(r.name);
    return !url.hostname.includes('localhost') && !url.hostname.includes('127.0.0.1');
  });
  
  return {
    totalResources: resources.length,
    totalSize: resources.reduce((sum, r) => sum + r.size, 0),
    byType,
    criticalPath,
    renderBlocking,
    thirdParty,
    largestResources: [...resources].sort((a, b) => b.size - a.size).slice(0, 10),
    slowestResources: [...resources].sort((a, b) => b.duration - a.duration).slice(0, 10),
  };
}