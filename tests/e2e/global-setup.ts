import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for Playwright tests
 * This runs once before all tests
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');
  
  // Pre-warm the application
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Visit main pages to warm up Next.js cache
    const baseURL = config.projects[0].use?.baseURL || 'http://localhost:3000';
    console.log(`Pre-warming application at ${baseURL}...`);
    
    const pagesToWarm = ['/', '/documents', '/directory', '/knowledge'];
    
    for (const path of pagesToWarm) {
      await page.goto(`${baseURL}${path}`, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
      console.log(`✓ Pre-warmed ${path}`);
    }
    
    // Store auth state if needed
    if (process.env.TEST_USER_EMAIL && process.env.TEST_USER_PASSWORD) {
      console.log('Setting up test authentication...');
      await page.goto(`${baseURL}/login`);
      // Add login logic here if needed
      await page.context().storageState({ path: 'test-auth.json' });
      console.log('✓ Test authentication saved');
    }
    
  } catch (error) {
    console.error('Error during global setup:', error);
  } finally {
    await browser.close();
  }
  
  console.log('✅ Global setup complete');
}

export default globalSetup;