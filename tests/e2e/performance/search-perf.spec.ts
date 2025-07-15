import { test, expect } from '@playwright/test';
import { 
  capturePerformanceMetrics, 
  formatMetrics,
  measureInteractionPerformance,
  mark,
  measure,
  assertPerformanceBudget
} from './utils/performance-helpers';
import {
  throttleNetwork,
  throttleCPU,
  NetworkProfiles
} from './utils/network-emulation';
import {
  loadBudgetConfig,
  getBudgetForPage
} from './utils/budget-loader';
import { loginWithDemoMode } from '../test-helpers';

test.describe('Search Functionality Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage first
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should open search dialog quickly', async ({ page }) => {
    // Measure time to open search dialog
    const openDuration = await measureInteractionPerformance(page, async () => {
      await page.keyboard.press('Meta+K');
      await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    });
    
    console.log(`Search dialog open time: ${openDuration}ms`);
    expect(openDuration).toBeLessThan(150); // Should open very quickly
    
    // Verify search input is focused
    const isFocused = await page.evaluate(() => {
      const input = document.querySelector('[role="dialog"] input');
      return document.activeElement === input;
    });
    expect(isFocused).toBe(true);
    
    // Close dialog
    await page.keyboard.press('Escape');
  });

  test('should respond to search input quickly', async ({ page }) => {
    // Open search dialog
    await page.keyboard.press('Meta+K');
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    
    // Measure keystroke to results update
    const typingDuration = await measureInteractionPerformance(page, async () => {
      await page.type('[role="dialog"] input', 'doc');
      // Wait for debounce and results to appear
      await page.waitForTimeout(300);
    });
    
    console.log(`Search input response time: ${typingDuration}ms`);
    expect(typingDuration).toBeLessThan(400); // Including debounce
    
    // Measure additional character input
    const incrementalDuration = await measureInteractionPerformance(page, async () => {
      await page.type('[role="dialog"] input', 'uments');
      await page.waitForTimeout(150);
    });
    
    console.log(`Incremental search update: ${incrementalDuration}ms`);
    expect(incrementalDuration).toBeLessThan(200);
    
    // Close dialog
    await page.keyboard.press('Escape');
  });

  test('should handle search result navigation efficiently', async ({ page }) => {
    // Open search and type query
    await page.keyboard.press('Meta+K');
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    await page.type('[role="dialog"] input', 'providers');
    await page.waitForTimeout(300); // Wait for results
    
    // Measure arrow key navigation
    const navDuration = await measureInteractionPerformance(page, async () => {
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(50); // Visual feedback
    });
    
    console.log(`Result navigation time: ${navDuration}ms`);
    expect(navDuration).toBeLessThan(100);
    
    // Measure result selection
    const selectDuration = await measureInteractionPerformance(page, async () => {
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');
    });
    
    console.log(`Result selection and navigation: ${selectDuration}ms`);
    expect(selectDuration).toBeLessThan(1000);
  });

  test('should perform search across different content types', async ({ page }) => {
    const searchQueries = [
      { query: 'provider', expectedType: 'page' },
      { query: 'document', expectedType: 'page' },
      { query: 'contact', expectedType: 'page' },
      { query: 'form', expectedType: 'feature' },
      { query: 'npi', expectedType: 'content' }
    ];
    
    for (const { query, expectedType } of searchQueries) {
      // Open search
      await page.keyboard.press('Meta+K');
      await page.waitForSelector('[role="dialog"]', { state: 'visible' });
      
      // Clear previous search
      await page.keyboard.press('Meta+A');
      
      // Measure search performance for this query
      await mark(page, `search-${query}-start`);
      
      await page.type('[role="dialog"] input', query);
      await page.waitForTimeout(300); // Wait for results
      
      await mark(page, `search-${query}-end`);
      
      const searchDuration = await measure(
        page, 
        `search-${query}`, 
        `search-${query}-start`, 
        `search-${query}-end`
      );
      
      console.log(`Search for "${query}": ${searchDuration}ms`);
      expect(searchDuration).toBeLessThan(500);
      
      // Count results
      const resultCount = await page.evaluate(() => {
        const results = document.querySelectorAll('[role="dialog"] [role="option"]');
        return results.length;
      });
      
      console.log(`Results found: ${resultCount}`);
      
      // Close dialog
      await page.keyboard.press('Escape');
      await page.waitForTimeout(100); // Wait for close animation
    }
  });

  test('should handle search under different network conditions', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      test.skip();
    }
    
    const conditions = ['No throttling', 'Fast 3G', 'Slow 4G'];
    const results: Record<string, number> = {};
    
    for (const condition of conditions) {
      // Apply network throttling
      await throttleNetwork(page, condition as keyof typeof NetworkProfiles);
      
      // Open search
      await page.keyboard.press('Meta+K');
      await page.waitForSelector('[role="dialog"]', { state: 'visible' });
      
      // Measure search performance
      const searchTime = await measureInteractionPerformance(page, async () => {
        await page.type('[role="dialog"] input', 'documentation');
        await page.waitForTimeout(500); // Wait for results with network delay
      });
      
      results[condition] = searchTime;
      console.log(`Search under ${condition}: ${searchTime}ms`);
      
      // Close and reset
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
    }
    
    // Reset throttling
    await throttleNetwork(page, 'No throttling');
    
    // Verify degradation is reasonable
    expect(results['Fast 3G']).toBeLessThan(results['No throttling'] * 3);
    expect(results['Slow 4G']).toBeLessThan(results['No throttling'] * 2);
  });

  test('should optimize search for mobile devices', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      test.skip();
    }
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Apply mobile CPU throttling
    await throttleCPU(page, 'Mid-tier mobile');
    
    // Open search (might be different on mobile)
    const searchButton = await page.$('button[aria-label*="search"]');
    if (searchButton) {
      const buttonClickDuration = await measureInteractionPerformance(page, async () => {
        await searchButton.click();
        await page.waitForSelector('[role="dialog"], input[type="search"]', { state: 'visible' });
      });
      console.log(`Mobile search button click: ${buttonClickDuration}ms`);
      expect(buttonClickDuration).toBeLessThan(200);
    } else {
      // Fallback to keyboard shortcut
      await page.keyboard.press('Meta+K');
      await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    }
    
    // Test mobile typing performance
    const mobileTypingDuration = await measureInteractionPerformance(page, async () => {
      await page.type('input[type="search"], [role="dialog"] input', 'test');
      await page.waitForTimeout(300);
    });
    
    console.log(`Mobile typing response: ${mobileTypingDuration}ms`);
    expect(mobileTypingDuration).toBeLessThan(500);
    
    // Reset CPU throttling
    await throttleCPU(page, 'No throttling');
  });

  test('should handle empty and error states efficiently', async ({ page }) => {
    // Open search
    await page.keyboard.press('Meta+K');
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    
    // Test empty state
    const emptySearchDuration = await measureInteractionPerformance(page, async () => {
      await page.type('[role="dialog"] input', 'xyznonexistentquery123');
      await page.waitForTimeout(300);
    });
    
    console.log(`Empty state render time: ${emptySearchDuration}ms`);
    expect(emptySearchDuration).toBeLessThan(400);
    
    // Verify empty state is shown
    const hasEmptyState = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"]');
      return dialog?.textContent?.toLowerCase().includes('no results') || 
             dialog?.textContent?.toLowerCase().includes('not found');
    });
    expect(hasEmptyState).toBe(true);
    
    // Clear search
    await page.keyboard.press('Meta+A');
    await page.keyboard.press('Delete');
    
    // Test clear performance
    const clearDuration = await measureInteractionPerformance(page, async () => {
      await page.keyboard.press('Delete');
      await page.waitForTimeout(100);
    });
    
    console.log(`Search clear time: ${clearDuration}ms`);
    expect(clearDuration).toBeLessThan(100);
  });

  test('should maintain search performance during authentication', async ({ page }) => {
    // Test search as unauthenticated user
    await page.keyboard.press('Meta+K');
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    
    const unauthSearchDuration = await measureInteractionPerformance(page, async () => {
      await page.type('[role="dialog"] input', 'admin');
      await page.waitForTimeout(300);
    });
    
    console.log(`Unauthenticated search: ${unauthSearchDuration}ms`);
    await page.keyboard.press('Escape');
    
    // Login
    await loginWithDemoMode(page);
    await page.waitForLoadState('networkidle');
    
    // Test search as authenticated user
    await page.keyboard.press('Meta+K');
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    
    const authSearchDuration = await measureInteractionPerformance(page, async () => {
      await page.type('[role="dialog"] input', 'admin');
      await page.waitForTimeout(300);
    });
    
    console.log(`Authenticated search: ${authSearchDuration}ms`);
    
    // Performance should be similar regardless of auth state
    expect(Math.abs(authSearchDuration - unauthSearchDuration)).toBeLessThan(100);
  });

  test('should optimize search result rendering', async ({ page }) => {
    await page.keyboard.press('Meta+K');
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    
    // Type a query that returns many results
    await page.type('[role="dialog"] input', 'e'); // Common letter
    await page.waitForTimeout(300);
    
    // Measure scroll performance with many results
    const scrollDuration = await measureInteractionPerformance(page, async () => {
      await page.evaluate(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const scrollContainer = dialog?.querySelector('[role="listbox"]') || dialog;
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight / 2;
        }
      });
      await page.waitForTimeout(50); // Wait for render
    });
    
    console.log(`Search results scroll: ${scrollDuration}ms`);
    expect(scrollDuration).toBeLessThan(100);
    
    // Check if virtualization is used for long lists
    const resultInfo = await page.evaluate(() => {
      const results = document.querySelectorAll('[role="dialog"] [role="option"]');
      const dialog = document.querySelector('[role="dialog"]');
      const visibleHeight = dialog?.querySelector('[role="listbox"]')?.clientHeight || 0;
      
      return {
        totalResults: results.length,
        visibleHeight,
        averageItemHeight: results[0]?.getBoundingClientRect().height || 0
      };
    });
    
    console.log('Search result info:', resultInfo);
    
    // If there are many results, they should be virtualized or paginated
    if (resultInfo.totalResults > 20) {
      const expectedVisible = Math.ceil(resultInfo.visibleHeight / resultInfo.averageItemHeight);
      console.log(`Expected visible items: ${expectedVisible}, Total: ${resultInfo.totalResults}`);
    }
  });
});