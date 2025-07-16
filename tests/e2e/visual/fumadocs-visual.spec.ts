import { test, expect } from '@playwright/test';
import {
  captureAndCompare,
  captureAndCompareElement,
  updateBaseline
} from '@/test/visual-validator';

// Disable animations for stable screenshots
test.use({
  // Consistent viewport size
  viewport: { width: 1280, height: 720 },
  // Disable animations
  launchOptions: {
    args: ['--force-prefers-reduced-motion']
  }
});

test.beforeEach(async ({ page }) => {
  // Inject CSS to disable animations
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `
  });
  
  // Handle authentication by using demo mode
  await page.goto('/');
  const demoButton = page.locator('button:has-text("Continue with Demo Mode")');
  if (await demoButton.isVisible({ timeout: 5000 })) {
    await demoButton.click();
    // Wait for navigation after login
    await page.waitForLoadState('domcontentloaded');
  }
});

test.describe('Fumadocs Visual Regression Tests', () => {
  test('documentation home page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for any main content to be visible
    await page.waitForSelector('main, [role="main"], .container, .page', { 
      state: 'visible',
      timeout: 10000 
    });
    
    const isMatch = await captureAndCompare(page, 'home-page', {
      threshold: 0.1,
      fullPage: true
    });
    
    expect(isMatch).toBeTruthy();
  });

  test('knowledge base introduction page', async ({ page }) => {
    await page.goto('/knowledge');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for content to be visible
    await page.waitForSelector('main', { state: 'visible' });
    await page.waitForTimeout(500); // Small delay for hydration
    
    const isMatch = await captureAndCompare(page, 'knowledge-intro', {
      threshold: 0.1,
      fullPage: true
    });
    
    expect(isMatch).toBeTruthy();
  });

  test('documents page', async ({ page }) => {
    await page.goto('/documents');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for content to load
    await page.waitForSelector('main', { state: 'visible' });
    await page.waitForTimeout(1000); // Wait for data loading
    
    const isMatch = await captureAndCompare(page, 'documents-page', {
      threshold: 0.1,
      fullPage: true
    });
    
    expect(isMatch).toBeTruthy();
  });

  test('providers directory page', async ({ page }) => {
    await page.goto('/providers');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for content to load
    await page.waitForSelector('main', { state: 'visible' });
    await page.waitForTimeout(1000); // Wait for data loading
    
    const isMatch = await captureAndCompare(page, 'providers-page', {
      threshold: 0.1,
      fullPage: true
    });
    
    expect(isMatch).toBeTruthy();
  });

  test('search functionality visual', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Open search dialog using Command+K
    await page.keyboard.press('Meta+K');
    
    // Wait for search dialog to appear
    await page.waitForSelector('[data-cmdk-root], [role="dialog"]', { state: 'visible' });
    await page.waitForTimeout(300); // Wait for animation
    
    const isMatch = await captureAndCompare(page, 'search-dialog', {
      threshold: 0.1,
      mask: ['[data-cmdk-list]'] // Mask dynamic content
    });
    
    expect(isMatch).toBeTruthy();
    
    // Close dialog
    await page.keyboard.press('Escape');
  });

  test('dark mode theme', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Toggle dark mode by clicking theme button
    const themeButton = page.locator('button').filter({ hasText: /theme|dark|light/i }).first();
    if (await themeButton.isVisible()) {
      await themeButton.click();
      await page.waitForTimeout(300); // Wait for menu
      
      // Try to click dark mode option
      const darkOption = page.locator('button, [role="menuitem"]').filter({ hasText: /dark/i }).first();
      if (await darkOption.isVisible()) {
        await darkOption.click();
      }
    }
    
    await page.waitForTimeout(500); // Wait for theme transition
    
    const isMatch = await captureAndCompare(page, 'home-page-dark', {
      threshold: 0.1,
      fullPage: true
    });
    
    expect(isMatch).toBeTruthy();
  });

  test('responsive mobile view', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const isMatch = await captureAndCompare(page, 'home-page-mobile', {
      threshold: 0.1,
      fullPage: true
    });
    
    expect(isMatch).toBeTruthy();
  });

  test('contact directory page', async ({ page }) => {
    await page.goto('/directory');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for content to load
    await page.waitForSelector('main', { state: 'visible' });
    await page.waitForTimeout(1000);
    
    const isMatch = await captureAndCompare(page, 'directory-page', {
      threshold: 0.1,
      fullPage: true
    });
    
    expect(isMatch).toBeTruthy();
  });

  test('navigation components', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Test navbar
    const navbar = page.locator('nav').first();
    if (await navbar.isVisible()) {
      const isMatch = await captureAndCompareElement(
        page,
        'nav',
        'navbar-component',
        { threshold: 0.1 }
      );
      expect(isMatch).toBeTruthy();
    }
    
    // Test footer
    const footer = page.locator('footer').first();
    if (await footer.isVisible()) {
      const isMatch = await captureAndCompareElement(
        page,
        'footer',
        'footer-component',
        { threshold: 0.1 }
      );
      expect(isMatch).toBeTruthy();
    }
  });
});

// Utility to update baselines when needed
test.describe('Baseline Management', () => {
  test.skip('update all baselines', async ({ page }) => {
    // Skip by default - run with --grep "update all baselines" to execute
    const pagesToUpdate = [
      { url: '/', name: 'home-page' },
      { url: '/knowledge', name: 'knowledge-intro' },
      { url: '/documents', name: 'documents-page' },
      { url: '/providers', name: 'providers-page' },
      { url: '/directory', name: 'directory-page' }
    ];
    
    for (const pageInfo of pagesToUpdate) {
      await page.goto(pageInfo.url);
      await page.waitForLoadState('networkidle');
      await updateBaseline(page, pageInfo.name);
    }
  });
});