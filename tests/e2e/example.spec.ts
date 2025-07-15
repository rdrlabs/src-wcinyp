import { test, expect } from '@playwright/test';

test('basic test to verify Playwright setup', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/WCINYP/);
});