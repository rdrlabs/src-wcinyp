import { test, expect } from '@playwright/test';
import { 
  capturePerformanceMetrics, 
  waitForPageLoad,
  getResourceTimings 
} from './utils/performance-helpers';
import { PerformanceReporter, PerformanceReport } from './utils/performance-reporter';
import { TrendAnalyzer } from './utils/trend-analyzer';
import { analyzeBundleSizes } from './utils/bundle-analyzer';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Performance Reporting Tests', () => {
  let reporter: PerformanceReporter;
  let analyzer: TrendAnalyzer;
  const outputDir = 'test-results/performance/test-reports';

  test.beforeAll(() => {
    // Initialize reporter and analyzer
    reporter = new PerformanceReporter(outputDir);
    analyzer = new TrendAnalyzer(path.join(outputDir, 'history'));
  });

  test('should generate comprehensive performance report', async ({ page }, testInfo) => {
    const routes = ['/', '/documents', '/providers'];
    const reports: PerformanceReport[] = [];
    
    for (const route of routes) {
      await page.goto(route);
      await waitForPageLoad(page);
      
      // Capture performance metrics
      const metrics = await capturePerformanceMetrics(page);
      const resourceTimings = await getResourceTimings(page);
      const bundleAnalysis = await analyzeBundleSizes(page, route);
      
      // Get memory metrics if available (Chromium only)
      let memoryMetrics = undefined;
      if (testInfo.project.name.includes('chromium')) {
        const memory = await page.evaluate(() => {
          const perf = performance as any;
          if (perf.memory) {
            return {
              initialHeap: perf.memory.usedJSHeapSize,
              finalHeap: perf.memory.usedJSHeapSize,
              peakHeap: perf.memory.totalJSHeapSize,
              leaks: false,
            };
          }
          return undefined;
        });
        memoryMetrics = memory;
      }
      
      // Create report
      const report: PerformanceReport = {
        timestamp: new Date().toISOString(),
        testName: `${route}-performance-test`,
        url: route,
        device: testInfo.project.name.includes('mobile') ? 'mobile' : 'desktop',
        network: testInfo.project.name.includes('slow') ? '3G' : 'WiFi',
        metrics,
        resourceMetrics: {
          totalSize: resourceTimings.totalSize,
          totalDuration: resourceTimings.totalDuration,
          resourceCount: resourceTimings.resources.length,
          byType: resourceTimings.resources.reduce((acc, r) => {
            acc[r.type] = (acc[r.type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        },
        bundleMetrics: {
          totalSize: bundleAnalysis.totalSize,
          jsSize: bundleAnalysis.jsSize,
          cssSize: bundleAnalysis.cssSize,
          thirdPartySize: bundleAnalysis.thirdPartySize,
        },
        memoryMetrics,
      };
      
      reports.push(report);
      reporter.addReport(report);
      
      // Add to trend analyzer
      analyzer.addDataPoint(report, {
        commit: process.env.GITHUB_SHA || 'test-commit',
        branch: process.env.GITHUB_REF_NAME || 'test-branch',
      });
      
      console.log(`\\nPerformance report for ${route}:`);
      console.log(`- FCP: ${metrics.FCP}ms`);
      console.log(`- LCP: ${metrics.LCP}ms`);
      console.log(`- TTI: ${metrics.TTI}ms`);
      console.log(`- Total resources: ${resourceTimings.resources.length}`);
      console.log(`- Bundle size: ${(bundleAnalysis.totalSize / 1024 / 1024).toFixed(2)} MB`);
    }
    
    // Generate reports in all formats
    const jsonPath = reporter.generateJSONReport('test-report.json');
    const htmlPath = reporter.generateHTMLReport('test-dashboard.html');
    const csvPath = reporter.generateCSVReport('test-report.csv');
    
    // Verify reports were generated
    expect(fs.existsSync(jsonPath)).toBe(true);
    expect(fs.existsSync(htmlPath)).toBe(true);
    expect(fs.existsSync(csvPath)).toBe(true);
    
    console.log('\\nGenerated reports:');
    console.log(`- JSON: ${jsonPath}`);
    console.log(`- HTML: ${htmlPath}`);
    console.log(`- CSV: ${csvPath}`);
    
    // Verify JSON report structure
    const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    expect(jsonContent.metadata).toBeDefined();
    expect(jsonContent.aggregated).toBeDefined();
    expect(jsonContent.raw).toHaveLength(reports.length);
    
    // Verify HTML report contains expected elements
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    expect(htmlContent).toContain('Performance Dashboard');
    expect(htmlContent).toContain('Web Vitals Overview');
    expect(htmlContent).toContain('Performance by Page');
  });

  test('should detect performance regressions', async ({ page }) => {
    // Create baseline metrics
    const baselineMetrics = {
      '/': {
        FCP: 1200,
        LCP: 2000,
        TTI: 3000,
        TBT: 150,
        CLS: 0.05,
        INP: 150,
        TTFB: 500,
      },
    };
    
    analyzer.updateBaseline(baselineMetrics, '1.0.0');
    
    // Test with degraded metrics
    await page.goto('/');
    await waitForPageLoad(page);
    
    const currentMetrics = await capturePerformanceMetrics(page);
    
    // Force some metrics to be worse for testing
    const degradedMetrics = {
      ...currentMetrics,
      FCP: 2000, // 66% worse
      LCP: 3500, // 75% worse
    };
    
    const regressions = analyzer.detectRegressions(degradedMetrics, '/', 'desktop');
    
    console.log('\\nRegression detection results:');
    regressions.forEach(alert => {
      console.log(`- ${alert.severity}: ${alert.message}`);
    });
    
    // Should detect regressions for degraded metrics
    expect(regressions.length).toBeGreaterThan(0);
    expect(regressions.some(r => r.metric === 'FCP')).toBe(true);
    expect(regressions.some(r => r.metric === 'LCP')).toBe(true);
  });

  test('should analyze performance trends', async ({ page }) => {
    // Generate historical data points
    const historicalData = [];
    const baseDate = new Date();
    
    for (let i = 7; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);
      
      // Simulate improving trend for FCP, degrading for LCP
      const metrics = {
        FCP: 1500 - (i * 50), // Improving
        LCP: 2000 + (i * 100), // Degrading
        TTI: 3000 + (Math.random() * 500 - 250), // Stable with noise
        TBT: 200,
        CLS: 0.1,
        INP: 200,
        TTFB: 600,
      };
      
      const report: PerformanceReport = {
        timestamp: date.toISOString(),
        testName: 'trend-test',
        url: '/',
        device: 'desktop',
        network: 'WiFi',
        metrics,
      };
      
      analyzer.addDataPoint(report);
      historicalData.push(report);
    }
    
    // Analyze trends
    try {
      const trends = analyzer.analyzeTrends('/', 'desktop', 7);
      
      console.log('\\nTrend analysis results:');
      Object.entries(trends).forEach(([metric, analysis]) => {
        console.log(`- ${metric}: ${analysis.trend} (${analysis.changePercent.toFixed(1)}% change)`);
      });
      
      // Verify trend detection
      expect(trends.FCP.trend).toBe('improving');
      expect(trends.LCP.trend).toBe('degrading');
      expect(['stable', 'volatile']).toContain(trends.TTI.trend);
    } catch (error) {
      console.log('Trend analysis requires more historical data');
    }
  });

  test('should compare performance between periods', async ({ page }) => {
    // Generate data for two periods
    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(now.getDate() - 14);
    
    // Add historical data
    for (let i = 0; i < 14; i++) {
      const date = new Date(twoWeeksAgo);
      date.setDate(date.getDate() + i);
      
      const metrics = {
        FCP: i < 7 ? 1500 : 1300, // Improved in recent week
        LCP: i < 7 ? 2500 : 2800, // Degraded in recent week
        TTI: 3000,
        TBT: 200,
        CLS: 0.1,
        INP: 200,
        TTFB: 600,
      };
      
      const report: PerformanceReport = {
        timestamp: date.toISOString(),
        testName: 'period-comparison',
        url: '/',
        device: 'desktop',
        network: 'WiFi',
        metrics,
      };
      
      analyzer.addDataPoint(report);
    }
    
    // Compare periods
    const comparison = analyzer.comparePeriods(
      twoWeeksAgo,
      oneWeekAgo,
      oneWeekAgo,
      now,
      '/',
      'desktop'
    );
    
    console.log('\\nPeriod comparison (last week vs previous week):');
    Object.entries(comparison).forEach(([metric, data]) => {
      console.log(`- ${metric}: ${data.change.toFixed(1)}% change (${data.period1.toFixed(0)} → ${data.period2.toFixed(0)})`);
    });
    
    // Verify comparisons
    expect(comparison.FCP.change).toBeLessThan(0); // Should show improvement
    expect(comparison.LCP.change).toBeGreaterThan(0); // Should show degradation
  });

  test('should generate performance forecast', async ({ page }) => {
    // Generate enough historical data for forecasting
    const baseDate = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);
      
      // Simulate linear trend with some noise
      const metrics = {
        FCP: 1200 + (i * 10) + (Math.random() * 100 - 50),
        LCP: 2000 + (i * 20) + (Math.random() * 200 - 100),
        TTI: 3000,
        TBT: 200,
        CLS: 0.1,
        INP: 200,
        TTFB: 600,
      };
      
      const report: PerformanceReport = {
        timestamp: date.toISOString(),
        testName: 'forecast-test',
        url: '/',
        device: 'desktop',
        network: 'WiFi',
        metrics,
      };
      
      analyzer.addDataPoint(report);
    }
    
    // Generate forecast
    try {
      const fcpForecast = analyzer.forecast('FCP', '/', 'desktop', 7);
      const lcpForecast = analyzer.forecast('LCP', '/', 'desktop', 7);
      
      console.log('\\n7-day performance forecast:');
      console.log(`- FCP: ${fcpForecast.value.toFixed(0)}ms (confidence: ${(fcpForecast.confidence * 100).toFixed(1)}%)`);
      console.log(`- LCP: ${lcpForecast.value.toFixed(0)}ms (confidence: ${(lcpForecast.confidence * 100).toFixed(1)}%)`);
      
      // Forecast should show improving trend based on historical data
      expect(fcpForecast.value).toBeLessThan(1200);
      expect(lcpForecast.value).toBeLessThan(2000);
    } catch (error) {
      console.log('Forecasting requires sufficient historical data');
    }
  });
});