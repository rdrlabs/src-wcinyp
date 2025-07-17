import { test, expect } from '@playwright/test';
import { 
  capturePerformanceMetrics, 
  formatMetrics,
  measureInteractionPerformance,
  getResourceTimings,
  assertPerformanceBudget,
  waitForPageLoad,
  mark,
  measure
} from './utils/performance-helpers';
import {
  throttleNetwork,
  throttleCPU,
  NetworkProfiles
} from './utils/network-emulation';
import {
  loadBudgetConfig,
  getBudgetForPage,
  generateBudgetReport
} from './utils/budget-loader';

test.describe('Fumadocs Documentation Performance Tests', () => {
  const KNOWLEDGE_BASE_URL = '/knowledge';
  const SAMPLE_DOC_URL = '/knowledge/getting-started';

  test('should meet knowledge base performance budget', async ({ page }) => {
    await page.goto(KNOWLEDGE_BASE_URL);
    await waitForPageLoad(page);
    
    // Wait for Fumadocs to fully render
    await page.waitForSelector('[data-testid="sidebar"]', { state: 'visible' });
    await page.waitForSelector('main article', { state: 'visible' });
    
    const metrics = await capturePerformanceMetrics(page);
    console.log('Knowledge Base Metrics:', formatMetrics(metrics));
    
    // Load budget and assert
    const config = loadBudgetConfig('performance-budgets.json');
    const budget = getBudgetForPage(config, 'knowledge');
    
    const result = assertPerformanceBudget(metrics, budget);
    expect(result.passed).toBe(true);
    
    const report = generateBudgetReport(metrics, budget, 'knowledge');
    console.log(report);
  });

  test('should render MDX content efficiently', async ({ page }) => {
    // Mark start of navigation
    await mark(page, 'docNavStart');
    
    await page.goto(SAMPLE_DOC_URL);
    await waitForPageLoad(page);
    
    // Wait for MDX content to render
    await page.waitForSelector('article', { state: 'visible' });
    await page.waitForSelector('pre code', { state: 'visible' }); // Code blocks
    
    // Mark end of navigation
    await mark(page, 'docNavEnd');
    
    const navDuration = await measure(page, 'docNavigation', 'docNavStart', 'docNavEnd');
    console.log(`Document navigation duration: ${navDuration}ms`);
    
    // Capture metrics after MDX rendering
    const metrics = await capturePerformanceMetrics(page);
    console.log('Document Page Metrics:', formatMetrics(metrics));
    
    // MDX pages should still be performant
    expect(metrics.FCP).toBeLessThan(2000);
    expect(metrics.LCP).toBeLessThan(3000);
    expect(navDuration).toBeLessThan(4000);
  });

  test('should handle sidebar navigation efficiently', async ({ page }) => {
    await page.goto(KNOWLEDGE_BASE_URL);
    await waitForPageLoad(page);
    
    // Measure sidebar toggle performance
    const toggleDuration = await measureInteractionPerformance(page, async () => {
      // Find and click sidebar toggle (if exists)
      const toggleButton = await page.$('button[aria-label*="sidebar"]');
      if (toggleButton) {
        await toggleButton.click();
        await page.waitForTimeout(300); // Wait for animation
      }
    });
    
    console.log(`Sidebar toggle duration: ${toggleDuration}ms`);
    if (toggleDuration > 0) {
      expect(toggleDuration).toBeLessThan(200);
    }
    
    // Measure navigation between docs
    const navDuration = await measureInteractionPerformance(page, async () => {
      // Click on a different doc in sidebar
      const docLinks = await page.$$('[data-testid="sidebar"] a[href^="/knowledge"]');
      if (docLinks.length > 1) {
        await docLinks[1].click();
        await page.waitForLoadState('networkidle');
      }
    });
    
    console.log(`Doc-to-doc navigation: ${navDuration}ms`);
    expect(navDuration).toBeLessThan(500);
  });

  test('should optimize search functionality', async ({ page }) => {
    await page.goto(KNOWLEDGE_BASE_URL);
    await waitForPageLoad(page);
    
    // Measure search open performance
    const searchOpenDuration = await measureInteractionPerformance(page, async () => {
      await page.keyboard.press('Meta+K');
      await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    });
    
    console.log(`Search dialog open: ${searchOpenDuration}ms`);
    expect(searchOpenDuration).toBeLessThan(150);
    
    // Measure search input performance
    const searchInputDuration = await measureInteractionPerformance(page, async () => {
      await page.type('[role="dialog"] input', 'getting started');
      // Wait for search results
      await page.waitForTimeout(300);
    });
    
    console.log(`Search input response: ${searchInputDuration}ms`);
    expect(searchInputDuration).toBeLessThan(300);
    
    // Close search
    await page.keyboard.press('Escape');
  });

  test('should handle code syntax highlighting efficiently', async ({ page }) => {
    // Navigate to a page with code blocks
    await page.goto(SAMPLE_DOC_URL);
    await waitForPageLoad(page);
    
    // Measure time to render code blocks
    const codeRenderStart = Date.now();
    await page.waitForSelector('pre code', { state: 'visible' });
    
    // Check if syntax highlighting is applied
    const hasHighlighting = await page.evaluate(() => {
      const codeBlocks = document.querySelectorAll('pre code');
      return Array.from(codeBlocks).some(block => 
        block.querySelector('span') !== null || 
        block.className.includes('language-')
      );
    });
    
    const codeRenderDuration = Date.now() - codeRenderStart;
    console.log(`Code blocks rendered in: ${codeRenderDuration}ms`);
    console.log(`Syntax highlighting applied: ${hasHighlighting}`);
    
    expect(codeRenderDuration).toBeLessThan(500);
    expect(hasHighlighting).toBe(true);
  });

  test('should perform well on mobile documentation viewing', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      test.skip();
    }
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    // Apply mobile network conditions
    await throttleNetwork(page, 'Regular 4G');
    await throttleCPU(page, 'Mid-tier mobile');
    
    await page.goto(KNOWLEDGE_BASE_URL);
    await waitForPageLoad(page);
    
    const metrics = await capturePerformanceMetrics(page);
    console.log('Mobile Documentation Metrics:', formatMetrics(metrics));
    
    // Mobile budgets are more lenient
    expect(metrics.FCP).toBeLessThan(3000);
    expect(metrics.LCP).toBeLessThan(4500);
    expect(metrics.CLS).toBeLessThan(0.2);
    
    // Test mobile-specific interactions
    const mobileMenuDuration = await measureInteractionPerformance(page, async () => {
      // Look for mobile menu button
      const menuButton = await page.$('button[aria-label*="menu"]');
      if (menuButton) {
        await menuButton.click();
        await page.waitForTimeout(300);
      }
    });
    
    if (mobileMenuDuration > 0) {
      console.log(`Mobile menu toggle: ${mobileMenuDuration}ms`);
      expect(mobileMenuDuration).toBeLessThan(300);
    }
    
    // Reset throttling
    await throttleNetwork(page, 'No throttling');
    await throttleCPU(page, 'No throttling');
  });

  test('should handle table of contents efficiently', async ({ page }) => {
    await page.goto(SAMPLE_DOC_URL);
    await waitForPageLoad(page);
    
    // Check if TOC exists
    const tocExists = await page.$('[data-testid="toc"], nav[aria-label*="table of contents"]');
    
    if (tocExists) {
      // Measure TOC interaction
      const tocClickDuration = await measureInteractionPerformance(page, async () => {
        const tocLink = await page.$('[data-testid="toc"] a, nav[aria-label*="table of contents"] a');
        if (tocLink) {
          await tocLink.click();
          // Wait for smooth scroll
          await page.waitForTimeout(500);
        }
      });
      
      console.log(`TOC navigation: ${tocClickDuration}ms`);
      expect(tocClickDuration).toBeLessThan(600);
    }
  });

  test('should optimize resource loading for documentation', async ({ page }) => {
    await page.goto(KNOWLEDGE_BASE_URL);
    await waitForPageLoad(page);
    
    const resourceTimings = await getResourceTimings(page);
    console.log('Documentation Resource Summary:', {
      totalSize: `${(resourceTimings.totalSize / 1024).toFixed(2)} KB`,
      totalDuration: `${resourceTimings.totalDuration}ms`,
      resourceCount: resourceTimings.resources.length
    });
    
    // Documentation should be lighter than main app pages
    expect(resourceTimings.totalSize).toBeLessThan(1835008); // From knowledge budget
    
    // Analyze resource types
    const resourceTypes = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const types: Record<string, number> = {};
      
      resources.forEach(resource => {
        types[resource.initiatorType] = (types[resource.initiatorType] || 0) + 1;
      });
      
      return types;
    });
    
    console.log('Resource breakdown:', resourceTypes);
    
    // Should have minimal image resources for text-heavy docs
    expect(resourceTypes.img || 0).toBeLessThan(10);
  });

  test('should maintain performance across documentation sections', async ({ page }) => {
    const sections = [
      '/knowledge',
      '/knowledge/getting-started',
      '/knowledge/components',
      '/knowledge/api-reference'
    ];
    
    const sectionMetrics: Record<string, any> = {};
    
    for (const section of sections) {
      // Skip if section doesn't exist
      const response = await page.goto(section, { waitUntil: 'domcontentloaded' });
      if (!response || response.status() === 404) {
        console.log(`Skipping ${section} (404)`);
        continue;
      }
      
      await waitForPageLoad(page);
      
      const metrics = await capturePerformanceMetrics(page);
      sectionMetrics[section] = metrics;
      
      console.log(`\\n${section} metrics:`);
      console.log(formatMetrics(metrics));
    }
    
    // All sections should meet the knowledge budget
    const config = loadBudgetConfig('performance-budgets.json');
    const budget = getBudgetForPage(config, 'knowledge');
    
    Object.entries(sectionMetrics).forEach(([section, metrics]) => {
      const result = assertPerformanceBudget(metrics, budget);
      console.log(`${section}: ${result.passed ? 'PASSED' : 'FAILED'}`);
      expect(result.passed).toBe(true);
    });
  });
});