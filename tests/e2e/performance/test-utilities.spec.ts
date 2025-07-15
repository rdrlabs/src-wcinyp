import { test, expect } from '@playwright/test';
import { 
  capturePerformanceMetrics, 
  formatMetrics,
  measureInteractionPerformance,
  getResourceTimings,
  assertPerformanceBudget,
  mark,
  measure,
  getMemoryUsage
} from './utils/performance-helpers';
import {
  throttleNetwork,
  throttleCPU,
  NetworkProfiles,
  formatNetworkProfile
} from './utils/network-emulation';
import {
  loadBudgetConfig,
  getBudgetForPage,
  loadBudgetForDevice,
  assertBudgets,
  getPerformanceRating,
  generateBudgetReport,
  validateBudgetFiles
} from './utils/budget-loader';
import { loginWithDemoMode } from '../test-helpers';

test.describe('Performance Utilities Test', () => {
  test('should capture Web Vitals metrics', async ({ page }) => {
    // Navigate to a page
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Capture metrics
    const metrics = await capturePerformanceMetrics(page);
    console.log(formatMetrics(metrics));
    
    // Verify all metrics are captured
    expect(metrics).toHaveProperty('FCP');
    expect(metrics).toHaveProperty('LCP');
    expect(metrics).toHaveProperty('TTI');
    expect(metrics).toHaveProperty('TBT');
    expect(metrics).toHaveProperty('CLS');
    expect(metrics).toHaveProperty('INP');
    expect(metrics).toHaveProperty('TTFB');
    
    // Verify metrics are reasonable numbers
    expect(metrics.FCP).toBeGreaterThanOrEqual(0);
    expect(metrics.LCP).toBeGreaterThanOrEqual(0);
    expect(metrics.TTI).toBeGreaterThanOrEqual(0);
    expect(metrics.TBT).toBeGreaterThanOrEqual(0);
    expect(metrics.CLS).toBeGreaterThanOrEqual(0);
    expect(metrics.INP).toBeGreaterThanOrEqual(0);
    expect(metrics.TTFB).toBeGreaterThanOrEqual(0);
  });

  test('should measure interaction performance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Measure search interaction
    const searchDuration = await measureInteractionPerformance(page, async () => {
      await page.keyboard.press('Meta+K');
    });
    
    console.log(`Search interaction took: ${searchDuration}ms`);
    expect(searchDuration).toBeGreaterThan(0);
    expect(searchDuration).toBeLessThan(1000); // Should be under 1 second
  });

  test('should get resource timings', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const resourceTimings = await getResourceTimings(page);
    console.log('Resource Timings:', resourceTimings);
    
    expect(resourceTimings.totalSize).toBeGreaterThanOrEqual(0);
    expect(resourceTimings.totalDuration).toBeGreaterThanOrEqual(0);
    expect(resourceTimings.resources).toBeInstanceOf(Array);
  });

  test('should assert performance budget', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const metrics = await capturePerformanceMetrics(page);
    const budget = {
      FCP: 2000,
      LCP: 3000,
      CLS: 0.1
    };
    
    const result = assertPerformanceBudget(metrics, budget);
    console.log('Budget check:', result);
    
    if (!result.passed) {
      console.log('Budget violations:', result.violations);
    }
  });

  test('should measure custom marks', async ({ page }) => {
    await page.goto('/');
    
    // Create custom timing marks
    await mark(page, 'customStart');
    await page.waitForLoadState('networkidle');
    await mark(page, 'customEnd');
    
    const navigationDuration = await measure(
      page, 
      'navigation', 
      'customStart', 
      'customEnd'
    );
    
    console.log(`Navigation duration: ${navigationDuration}ms`);
    expect(navigationDuration).toBeGreaterThan(0);
  });

  test('should get memory usage (Chromium only)', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      test.skip();
    }
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const memory = await getMemoryUsage(page);
    if (memory) {
      console.log('Memory usage:', memory);
      expect(memory.usedJSHeapSize).toBeGreaterThan(0);
      expect(memory.totalJSHeapSize).toBeGreaterThan(0);
    }
  });

  test('should apply network throttling', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      test.skip();
    }

    // Test with different network conditions
    const profiles: Array<keyof typeof NetworkProfiles> = ['Fast 3G', 'Slow 4G'];
    
    for (const profile of profiles) {
      console.log(`Testing with ${formatNetworkProfile(profile)}`);
      await throttleNetwork(page, profile);
      
      const startTime = Date.now();
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      console.log(`Page load time with ${profile}: ${loadTime}ms`);
      
      // Reset throttling
      await throttleNetwork(page, 'No throttling');
    }
  });

  test('should apply CPU throttling', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      test.skip();
    }
    
    await loginWithDemoMode(page);
    
    // Apply CPU throttling
    await throttleCPU(page, 'Low-end mobile');
    
    // Measure interaction with throttled CPU
    const throttledDuration = await measureInteractionPerformance(page, async () => {
      await page.keyboard.press('Meta+K');
      await page.keyboard.press('Escape');
    });
    
    console.log(`Interaction with throttled CPU: ${throttledDuration}ms`);
    
    // Reset CPU throttling
    await throttleCPU(page, 'No throttling');
  });
});

test.describe('Performance Budget Tests', () => {
  test('should load budget configurations', async () => {
    // Test loading main budget file
    const mainBudget = loadBudgetConfig('performance-budgets.json');
    expect(mainBudget).toBeDefined();
    expect(mainBudget.global).toBeDefined();
    expect(mainBudget.pages).toBeDefined();
    expect(mainBudget.percentiles).toBeDefined();
    
    // Test loading device-specific budgets
    const mobileBudget = loadBudgetForDevice('mobile');
    expect(mobileBudget.networkConditions).toBeDefined();
    expect(mobileBudget.deviceProfiles).toBeDefined();
    
    const desktopBudget = loadBudgetForDevice('desktop');
    expect(desktopBudget.networkConditions).toBeDefined();
    expect(desktopBudget.screenResolutions).toBeDefined();
  });

  test('should get budget for specific page and conditions', async () => {
    const config = loadBudgetConfig('performance-budgets.json');
    
    // Get budget for homepage
    const homepageBudget = getBudgetForPage(config, 'homepage');
    expect(homepageBudget.FCP).toBe(1500);
    expect(homepageBudget.LCP).toBe(2000);
    
    // Get budget for documents page
    const documentsBudget = getBudgetForPage(config, 'documents');
    expect(documentsBudget.FCP).toBe(1800);
    expect(documentsBudget.LCP).toBe(2500);
    
    // Get budget with percentile
    const p90Budget = getBudgetForPage(config, 'homepage', { percentile: 'p90' });
    expect(p90Budget.FCP).toBe(2400);
    expect(p90Budget.LCP).toBe(3500);
  });

  test('should validate budget files', async () => {
    const validation = await validateBudgetFiles();
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  test('should assert budgets against metrics', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const metrics = await capturePerformanceMetrics(page);
    const config = loadBudgetConfig('performance-budgets.json');
    const budget = getBudgetForPage(config, 'homepage');
    
    // Test single budget assertion
    const result = assertPerformanceBudget(metrics, budget);
    console.log('Budget assertion result:', result);
    
    // Test multiple budget assertions
    const budgets = [
      getBudgetForPage(config, 'homepage'),
      getBudgetForPage(config, 'homepage', { percentile: 'p75' }),
      getBudgetForPage(config, 'homepage', { percentile: 'p90' })
    ];
    
    const multiResult = assertBudgets(metrics, budgets);
    console.log('Multiple budget assertion:', multiResult);
  });

  test('should get performance rating', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const metrics = await capturePerformanceMetrics(page);
    const config = loadBudgetConfig('performance-budgets.json');
    
    const ratings = getPerformanceRating(metrics, config);
    console.log('Performance ratings:', ratings);
    
    // Verify all metrics have ratings
    expect(ratings.FCP).toMatch(/^(good|needs-improvement|poor)$/);
    expect(ratings.LCP).toMatch(/^(good|needs-improvement|poor)$/);
    expect(ratings.CLS).toMatch(/^(good|needs-improvement|poor)$/);
  });

  test('should generate budget report', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const metrics = await capturePerformanceMetrics(page);
    const config = loadBudgetConfig('performance-budgets.json');
    const budget = getBudgetForPage(config, 'homepage');
    
    const report = generateBudgetReport(metrics, budget, 'homepage', {
      network: 'WiFi',
      device: 'Desktop'
    });
    
    console.log(report);
    expect(report).toContain('Performance Budget Report: homepage');
    expect(report).toContain('FCP:');
    expect(report).toContain('LCP:');
  });

  test('should handle mobile-specific budgets', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      test.skip();
    }
    
    const mobileBudget = loadBudgetForDevice('mobile');
    
    // Test 3G budget
    const budget3G = getBudgetForPage(mobileBudget, 'homepage', { network: 'Fast 3G' });
    expect(budget3G).toBeDefined();
    
    // Test device profile budget
    const lowEndBudget = mobileBudget.deviceProfiles?.['low-end'];
    expect(lowEndBudget?.cpuThrottling).toBe(6);
    expect(lowEndBudget?.webVitals.FCP).toBe(4000);
  });

  test('should handle desktop-specific budgets', async () => {
    const desktopBudget = loadBudgetForDevice('desktop');
    
    // Test fiber network budget
    const fiberBudget = desktopBudget.networkConditions?.['Fiber'];
    expect(fiberBudget?.webVitals.FCP).toBe(800);
    expect(fiberBudget?.webVitals.TTFB).toBe(200);
    
    // Test 4K resolution budget
    const budget4K = desktopBudget.screenResolutions?.['4K'];
    expect(budget4K?.webVitals.FCP).toBe(1600);
  });
});