import { test, expect } from '@playwright/test';

test.describe('Basic Application Tests', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Should show either the app or login page
    await expect(page).toHaveTitle(/WCINYP/);
    
    // Check for main content or login form
    const hasLoginForm = await page.locator('button:has-text("Continue with Demo Mode")').isVisible();
    const hasMainContent = await page.locator('nav').isVisible();
    
    expect(hasLoginForm || hasMainContent).toBeTruthy();
  });

  test('can access demo mode', async ({ page }) => {
    await page.goto('/');
    
    const demoButton = page.locator('button:has-text("Continue with Demo Mode")');
    if (await demoButton.isVisible({ timeout: 5000 })) {
      await demoButton.click();
      
      // Should redirect after demo login
      await expect(page).not.toHaveURL(/sign-in/, { timeout: 10000 });
    } else {
      // Already in demo mode or authenticated
      expect(page.url()).not.toContain('sign-in');
    }
  });

  test('navigation structure exists', async ({ page }) => {
    await page.goto('/');
    
    // Handle demo mode if needed
    const demoButton = page.locator('button:has-text("Continue with Demo Mode")');
    if (await demoButton.isVisible({ timeout: 5000 })) {
      await demoButton.click();
      await page.waitForLoadState('networkidle');
    }
    
    // Check for navigation elements
    const nav = page.locator('nav');
    await expect(nav).toBeVisible({ timeout: 10000 });
  });

  test('documents page is accessible', async ({ page }) => {
    await page.goto('/');
    
    // Handle demo mode
    const demoButton = page.locator('button:has-text("Continue with Demo Mode")');
    if (await demoButton.isVisible({ timeout: 5000 })) {
      await demoButton.click();
      await page.waitForLoadState('networkidle');
    }
    
    // Try to navigate to documents
    await page.goto('/documents');
    
    // Should not be on login page
    expect(page.url()).not.toContain('sign-in');
  });
});