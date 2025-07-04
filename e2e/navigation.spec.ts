import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    // Start at home page
    await page.goto('/');
    await expect(page).toHaveTitle(/WCINYP Admin Dashboard/);
    
    // Navigate to Documents
    await page.click('text=Documents');
    await expect(page).toHaveURL('/documents');
    await expect(page.locator('h1')).toContainText('Document Hub');
    
    // Navigate to Providers
    await page.click('text=Providers');
    await expect(page).toHaveURL('/providers');
    await expect(page.locator('h1')).toContainText('Provider Directory');
    
    // Navigate to Forms
    await page.click('text=Forms');
    await expect(page).toHaveURL('/forms');
    await expect(page.locator('h1')).toContainText('Form Builder');
    
    // Navigate to Reports
    await page.click('text=Reports');
    await expect(page).toHaveURL('/reports');
    await expect(page.locator('h1')).toContainText('Reports');
    
    // Navigate back to home
    await page.click('text=WCINYP Admin');
    await expect(page).toHaveURL('/');
  });
  
  test('should display feature cards on home page', async ({ page }) => {
    await page.goto('/');
    
    // Check all feature cards are visible
    await expect(page.locator('text=Document Hub')).toBeVisible();
    await expect(page.locator('text=Provider Directory')).toBeVisible();
    await expect(page.locator('text=Form Builder')).toBeVisible();
    await expect(page.locator('text=Reports')).toBeVisible();
    
    // Check stats are displayed
    await expect(page.locator('text=156 documents')).toBeVisible();
    await expect(page.locator('text=42 providers')).toBeVisible();
    await expect(page.locator('text=12 templates')).toBeVisible();
    await expect(page.locator('text=8 reports')).toBeVisible();
  });
});