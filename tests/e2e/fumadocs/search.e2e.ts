import { test, expect } from '@playwright/test';

test.describe('Fumadocs Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // First navigate to home and use demo mode
    await page.goto('/');
    
    // Click "Continue with Demo Mode" if login screen appears
    const demoButton = page.locator('button:has-text("Continue with Demo Mode")');
    if (await demoButton.isVisible({ timeout: 5000 })) {
      await demoButton.click();
      await page.waitForLoadState('networkidle');
    }
    
    // Navigate to the knowledge base
    await page.goto('/knowledge');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
  });

  test('search dialog opens with keyboard shortcut', async ({ page }) => {
    // Press Cmd+K (Mac) or Ctrl+K (Windows/Linux)
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+K' : 'Control+K');
    
    // Check if search dialog is visible
    const searchDialog = page.locator('[role="dialog"]').filter({ has: page.locator('input[type="search"]') });
    await expect(searchDialog).toBeVisible();
    
    // Check if search input is focused
    const searchInput = searchDialog.locator('input[type="search"]');
    await expect(searchInput).toBeFocused();
  });

  test('search dialog opens via button click', async ({ page }) => {
    // Find and click the search button
    const searchButton = page.locator('button').filter({ hasText: /search/i }).first();
    await searchButton.click();
    
    // Check if search dialog is visible
    const searchDialog = page.locator('[role="dialog"]').filter({ has: page.locator('input[type="search"]') });
    await expect(searchDialog).toBeVisible();
  });

  test('search returns relevant results', async ({ page }) => {
    // Open search
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+K' : 'Control+K');
    
    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill('MDX');
    
    // Wait for search results
    await page.waitForTimeout(500);
    
    // Check if results contain MDX-related pages
    const results = page.locator('[role="option"]');
    await expect(results).toHaveCount(3, { timeout: 5000 });
    
    // Verify at least one result mentions MDX
    const mdxResult = results.filter({ hasText: /MDX/i });
    await expect(mdxResult.first()).toBeVisible();
  });

  test('search navigation with keyboard', async ({ page }) => {
    // Open search
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+K' : 'Control+K');
    
    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill('features');
    
    // Wait for results
    await page.waitForTimeout(500);
    
    // Navigate with arrow keys
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    
    // Check if second result is highlighted
    const results = page.locator('[role="option"]');
    const secondResult = results.nth(1);
    await expect(secondResult).toHaveAttribute('aria-selected', 'true');
    
    // Press Enter to navigate to the page
    await page.keyboard.press('Enter');
    
    // Verify navigation occurred
    await expect(page).toHaveURL(/features/);
  });

  test('search closes with Escape key', async ({ page }) => {
    // Open search
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+K' : 'Control+K');
    
    const searchDialog = page.locator('[role="dialog"]').filter({ has: page.locator('input[type="search"]') });
    await expect(searchDialog).toBeVisible();
    
    // Press Escape
    await page.keyboard.press('Escape');
    
    // Check if dialog is closed
    await expect(searchDialog).not.toBeVisible();
  });

  test('search highlights matching text', async ({ page }) => {
    // Open search
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+K' : 'Control+K');
    
    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill('provider');
    
    // Wait for results
    await page.waitForTimeout(500);
    
    // Check if matching text is highlighted
    const results = page.locator('[role="option"]');
    const highlightedText = results.locator('mark, [class*="highlight"]');
    await expect(highlightedText.first()).toBeVisible();
  });

  test('search shows no results message', async ({ page }) => {
    // Open search
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+K' : 'Control+K');
    
    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill('xyznonexistentterm123');
    
    // Wait for search to complete
    await page.waitForTimeout(500);
    
    // Check for no results message
    const noResults = page.locator('text=/no results|nothing found/i');
    await expect(noResults).toBeVisible();
  });

  test('search works across different doc sections', async ({ page }) => {
    // Open search
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+K' : 'Control+K');
    
    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill('guide');
    
    // Wait for results
    await page.waitForTimeout(500);
    
    const results = page.locator('[role="option"]');
    await expect(results).toHaveCount(3, { timeout: 5000 });
    
    // Check if results span different sections
    const guideResults = results.filter({ hasText: /guide/i });
    await expect(guideResults).toHaveCount(3, { timeout: 5000 });
  });
});