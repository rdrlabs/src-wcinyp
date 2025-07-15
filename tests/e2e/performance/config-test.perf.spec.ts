import { test, expect } from '@playwright/test';
import { NETWORK_PROFILES, PERFORMANCE_SCENARIOS } from './config/network-profiles';

test.describe('Performance Configuration Verification', () => {
  test('should run with performance-desktop project', async ({ page, browserName }, testInfo) => {
    console.log(`Running on project: ${testInfo.project.name}`);
    console.log(`Browser: ${browserName}`);
    console.log(`Viewport: ${page.viewportSize()?.width}x${page.viewportSize()?.height}`);
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verify performance APIs are available
    const hasPerformanceAPIs = await page.evaluate(() => {
      return {
        performanceObserver: typeof PerformanceObserver !== 'undefined',
        memory: 'memory' in performance,
        navigation: 'navigation' in performance,
        timing: 'timing' in performance,
      };
    });
    
    console.log('Performance APIs:', hasPerformanceAPIs);
    
    // Verify project-specific settings
    if (testInfo.project.name === 'performance-desktop') {
      expect(page.viewportSize()?.width).toBe(1920);
      expect(page.viewportSize()?.height).toBe(1080);
      expect(hasPerformanceAPIs.memory).toBe(true); // Should be enabled with --enable-precise-memory-info
    }
  });

  test('should capture traces for performance tests', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Perform some actions to generate trace data
    await page.click('a[href="/documents"]');
    await page.waitForLoadState('networkidle');
    
    await page.goBack();
    await page.waitForLoadState('networkidle');
    
    console.log(`Test artifacts will be saved to: ${testInfo.outputPath()}`);
    console.log(`Trace enabled: ${testInfo.project.use?.trace}`);
    console.log(`Video enabled: ${testInfo.project.use?.video}`);
  });

  test('should handle different network profiles', async ({ page, context }, testInfo) => {
    // Only run on Chromium-based browsers
    if (!testInfo.project.name.includes('chromium') && !testInfo.project.name.includes('performance')) {
      test.skip();
    }
    
    console.log('Testing network profiles...');
    
    // Test applying different network conditions
    const profiles = ['WiFi', 'Regular 4G', 'Fast 3G'];
    
    for (const profileName of profiles) {
      console.log(`\\nTesting ${profileName} profile:`);
      const profile = NETWORK_PROFILES[profileName];
      console.log(`- Download: ${(profile.downloadThroughput * 8 / 1000000).toFixed(2)} Mbps`);
      console.log(`- Upload: ${(profile.uploadThroughput * 8 / 1000000).toFixed(2)} Mbps`);
      console.log(`- Latency: ${profile.latency}ms`);
      
      // Note: Actual network throttling is applied in individual tests
      // This test just verifies the configuration is accessible
      expect(profile).toBeDefined();
      expect(profile.downloadThroughput).toBeGreaterThan(0);
    }
  });

  test('should work with performance scenarios', async ({ page }, testInfo) => {
    console.log('Available performance scenarios:');
    
    Object.entries(PERFORMANCE_SCENARIOS).forEach(([name, scenario]) => {
      console.log(`\\n${name}:`);
      console.log(`- Network: ${scenario.network.name}`);
      console.log(`- CPU throttling: ${scenario.cpu}x`);
      console.log(`- Viewport: ${scenario.viewport.width}x${scenario.viewport.height}`);
    });
    
    // Verify scenarios are properly configured
    expect(Object.keys(PERFORMANCE_SCENARIOS).length).toBeGreaterThan(0);
    
    // Test navigation with current configuration
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const timing = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
        loadComplete: nav.loadEventEnd - nav.loadEventStart,
        responseTime: nav.responseEnd - nav.requestStart,
      };
    });
    
    console.log('\\nPage timing:', timing);
  });

  test('should generate performance reports', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Capture some performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      return {
        navigationTiming: {
          fetchStart: navigation.fetchStart,
          responseEnd: navigation.responseEnd,
          domComplete: navigation.domComplete,
          loadEventEnd: navigation.loadEventEnd,
        },
        resourceCount: resources.length,
        totalResourceSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
        totalResourceDuration: Math.max(...resources.map(r => r.responseEnd)),
      };
    });
    
    console.log('Performance metrics:', JSON.stringify(metrics, null, 2));
    
    // The JSON reporter configured in playwright.config.ts will save these results
    expect(metrics.resourceCount).toBeGreaterThan(0);
    expect(metrics.totalResourceSize).toBeGreaterThan(0);
  });

  test('should work with extended timeouts', async ({ page }, testInfo) => {
    // Log timeout configurations
    console.log('Timeout configurations:');
    console.log(`- Test timeout: ${testInfo.timeout}ms`);
    console.log(`- Navigation timeout: ${page.context().browser()?.version() ? '30000ms (configured)' : 'default'}`);
    console.log(`- Action timeout: ${page.context().browser()?.version() ? '10000ms (configured)' : 'default'}`);
    
    // Test with a potentially slow operation
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    console.log(`Page load time: ${loadTime}ms`);
    
    // Should complete within configured navigation timeout
    expect(loadTime).toBeLessThan(30000);
  });
});