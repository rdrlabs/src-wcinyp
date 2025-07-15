import { test, expect } from '@playwright/test';
import { 
  capturePerformanceMetrics, 
  formatMetrics,
  measureInteractionPerformance,
  getResourceTimings,
  assertPerformanceBudget,
  waitForPageLoad,
  getMemoryUsage
} from './utils/performance-helpers';
import {
  throttleNetwork,
  throttleCPU,
  runWithConditions,
  NetworkProfiles,
  testWithNetworkConditions
} from './utils/network-emulation';
import {
  loadBudgetConfig,
  getBudgetForPage,
  loadBudgetForDevice,
  generateBudgetReport,
  getPerformanceRating
} from './utils/budget-loader';

test.describe('Homepage Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up performance monitoring
    await page.coverage.startJSCoverage();
    await page.coverage.startCSSCoverage();
  });

  test.afterEach(async ({ page }) => {
    // Get coverage data for analysis
    const jsCoverage = await page.coverage.stopJSCoverage();
    const cssCoverage = await page.coverage.stopCSSCoverage();
    
    // Calculate unused bytes
    let totalJS = 0;
    let usedJS = 0;
    for (const entry of jsCoverage) {
      if (entry.source) {
        totalJS += entry.source.length;
      }
      // Coverage data structure varies by Playwright version
    }
    
    if (totalJS > 0) {
      console.log(`JS Coverage: ${((usedJS / totalJS) * 100).toFixed(2)}% used`);
    }
  });

  test('should meet homepage performance budget', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Capture metrics
    const metrics = await capturePerformanceMetrics(page);
    console.log('Homepage Metrics:', formatMetrics(metrics));
    
    // Load budget and assert
    const config = loadBudgetConfig('performance-budgets.json');
    const budget = getBudgetForPage(config, 'homepage');
    
    const result = assertPerformanceBudget(metrics, budget);
    expect(result.passed).toBe(true);
    
    if (!result.passed) {
      console.error('Budget violations:', result.violations);
    }
    
    // Generate report
    const report = generateBudgetReport(metrics, budget, 'homepage');
    console.log(report);
  });

  test('should perform well on mobile devices', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      test.skip();
    }
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Apply mobile throttling
    await throttleNetwork(page, 'Fast 3G');
    await throttleCPU(page, 'Mid-tier mobile');
    
    await page.goto('/');
    await waitForPageLoad(page);
    
    const metrics = await capturePerformanceMetrics(page);
    console.log('Mobile Metrics:', formatMetrics(metrics));
    
    // Load mobile budget
    const mobileBudget = loadBudgetForDevice('mobile');
    const budget = getBudgetForPage(mobileBudget, 'homepage', { network: 'Fast 3G' });
    
    const result = assertPerformanceBudget(metrics, budget);
    expect(result.passed).toBe(true);
    
    // Reset throttling
    await throttleNetwork(page, 'No throttling');
    await throttleCPU(page, 'No throttling');
  });

  test('should handle different network conditions', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      test.skip();
    }
    
    const profiles: Array<keyof typeof NetworkProfiles> = ['Slow 3G', 'Fast 3G', 'Slow 4G'];
    
    const results = await testWithNetworkConditions(page, profiles, async (profile) => {
      await page.goto('/');
      await waitForPageLoad(page);
      
      const metrics = await capturePerformanceMetrics(page);
      const mobileBudget = loadBudgetForDevice('mobile');
      const budget = getBudgetForPage(mobileBudget, 'homepage', { network: profile as any });
      
      const result = assertPerformanceBudget(metrics, budget);
      
      return {
        metrics,
        budgetPassed: result.passed,
        violations: result.violations
      };
    });
    
    // Log results for each network condition
    Object.entries(results).forEach(([profile, data]) => {
      console.log(`\\n${profile} Results:`);
      console.log(formatMetrics(data.metrics));
      console.log(`Budget: ${data.budgetPassed ? 'PASSED' : 'FAILED'}`);
      if (!data.budgetPassed) {
        console.log('Violations:', data.violations);
      }
    });
  });

  test('should measure interaction performance', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Measure navigation interactions
    const navClickDuration = await measureInteractionPerformance(page, async () => {
      await page.click('a[href="/documents"]');
      await page.waitForLoadState('networkidle');
    });
    
    console.log(`Navigation to documents: ${navClickDuration}ms`);
    expect(navClickDuration).toBeLessThan(300); // INP budget
    
    // Go back to homepage
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Measure search interaction
    const searchDuration = await measureInteractionPerformance(page, async () => {
      await page.keyboard.press('Meta+K');
      await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    });
    
    console.log(`Search dialog open: ${searchDuration}ms`);
    expect(searchDuration).toBeLessThan(200); // Strict INP for search
  });

  test('should track resource loading performance', async ({ page }) => {
    await page.goto('/');
    await waitForPageLoad(page);
    
    const resourceTimings = await getResourceTimings(page);
    console.log('Resource Summary:', {
      totalSize: `${(resourceTimings.totalSize / 1024).toFixed(2)} KB`,
      totalDuration: `${resourceTimings.totalDuration}ms`,
      resourceCount: resourceTimings.resources.length
    });
    
    // Check against resource budget
    const config = loadBudgetConfig('performance-budgets.json');
    const homepageConfig = config.pages?.homepage;
    
    if (homepageConfig && 'resources' in homepageConfig && homepageConfig.resources) {
      expect(resourceTimings.totalSize).toBeLessThanOrEqual(homepageConfig.resources.totalSize);
    }
    
    // Log slowest resources
    console.log('\\nSlowest Resources:');
    resourceTimings.resources.slice(0, 5).forEach(resource => {
      console.log(`- ${resource.name}: ${resource.duration}ms (${(resource.size / 1024).toFixed(2)} KB)`);
    });
  });

  test('should maintain performance under stress', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      test.skip();
    }
    
    // Apply heavy throttling
    await throttleCPU(page, 6); // 6x slowdown
    await throttleNetwork(page, 'Slow 3G');
    
    await page.goto('/');
    await waitForPageLoad(page);
    
    const metrics = await capturePerformanceMetrics(page);
    const config = loadBudgetConfig('performance-budgets.json');
    const ratings = getPerformanceRating(metrics, config);
    
    console.log('Performance under stress:');
    console.log(formatMetrics(metrics));
    console.log('\\nRatings:', ratings);
    
    // Even under stress, critical metrics should not be "poor"
    expect(ratings.FCP).not.toBe('poor');
    expect(ratings.TTFB).not.toBe('poor');
    
    // Reset throttling
    await throttleCPU(page, 1);
    await throttleNetwork(page, 'No throttling');
  });

  test('should measure memory usage patterns', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      test.skip();
    }
    
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Initial memory
    const initialMemory = await getMemoryUsage(page);
    console.log('Initial memory:', initialMemory);
    
    // Navigate through the app
    await page.click('a[href="/documents"]');
    await waitForPageLoad(page);
    
    await page.click('a[href="/providers"]');
    await waitForPageLoad(page);
    
    await page.click('a[href="/directory"]');
    await waitForPageLoad(page);
    
    // Final memory
    const finalMemory = await getMemoryUsage(page);
    console.log('Final memory:', finalMemory);
    
    if (initialMemory && finalMemory) {
      const memoryIncrease = finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize;
      console.log(`Memory increase: ${memoryIncrease} MB`);
      
      // Memory should not increase dramatically
      expect(memoryIncrease).toBeLessThan(50); // 50MB threshold
    }
  });

  test('should perform well with concurrent requests', async ({ page }) => {
    // Start monitoring network
    const requests: string[] = [];
    page.on('request', request => {
      requests.push(request.url());
    });
    
    const startTime = Date.now();
    await page.goto('/');
    await waitForPageLoad(page);
    const loadTime = Date.now() - startTime;
    
    console.log(`Page loaded in ${loadTime}ms with ${requests.length} requests`);
    
    // Analyze request parallelization
    const domains = new Set(requests.map(url => new URL(url).hostname));
    console.log(`Requests spread across ${domains.size} domains`);
    
    // Good parallelization means multiple domains
    expect(domains.size).toBeGreaterThan(1);
    expect(loadTime).toBeLessThan(3000); // 3s max for homepage
  });
});