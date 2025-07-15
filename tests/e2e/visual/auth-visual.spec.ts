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

test.describe('Authentication Visual Tests', () => {
  test('login page visual', async ({ page }) => {
    await page.goto('/');
    
    // Wait for login form to be visible
    await page.waitForSelector('button:has-text("Continue with Demo Mode")', { 
      state: 'visible',
      timeout: 10000 
    });
    
    // Capture login page
    const isMatch = await captureAndCompare(page, 'login-page', {
      threshold: 0.1,
      fullPage: true
    });
    
    expect(isMatch).toBeTruthy();
  });

  test('authenticated home page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for and click demo mode button
    const demoButton = page.locator('button:has-text("Continue with Demo Mode")');
    await demoButton.waitFor({ state: 'visible', timeout: 10000 });
    await demoButton.click();
    
    // Wait for navigation after login
    await page.waitForURL('**', { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    // Wait for main content after authentication
    await page.waitForSelector('nav, header, main, [data-testid="navbar"]', { 
      state: 'visible',
      timeout: 10000 
    });
    
    // Small delay to ensure everything is loaded
    await page.waitForTimeout(1000);
    
    const isMatch = await captureAndCompare(page, 'authenticated-home', {
      threshold: 0.1,
      fullPage: true
    });
    
    expect(isMatch).toBeTruthy();
  });
});