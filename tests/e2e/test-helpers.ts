import { Page } from '@playwright/test';

export async function loginWithDemoMode(page: Page) {
  // Navigate to home page
  await page.goto('/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check if we're on a login page
  const demoButton = page.locator('button:has-text("Continue with Demo Mode")');
  
  try {
    // Wait for demo button to be visible and click it
    await demoButton.waitFor({ state: 'visible', timeout: 5000 });
    await demoButton.click();
    
    // Wait for navigation after clicking demo mode
    await page.waitForURL((url) => !url.pathname.includes('sign-in'), {
      timeout: 10000,
      waitUntil: 'networkidle'
    });
  } catch (error) {
    // If no demo button or already logged in, continue
    console.log('Demo mode button not found or already authenticated');
  }
}

export async function navigateToFumadocs(page: Page, path: string = '') {
  // Ensure we're logged in with demo mode
  await loginWithDemoMode(page);
  
  // Navigate to the Fumadocs page
  const fullPath = path ? `/knowledge/docs/${path}` : '/knowledge';
  await page.goto(fullPath);
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // If we're redirected to login again, try demo mode again
  if (page.url().includes('sign-in')) {
    const demoButton = page.locator('button:has-text("Continue with Demo Mode")');
    if (await demoButton.isVisible()) {
      await demoButton.click();
      await page.waitForLoadState('networkidle');
      // Try navigation again
      await page.goto(fullPath);
      await page.waitForLoadState('networkidle');
    }
  }
}