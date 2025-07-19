import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('Starting global test setup...');
  
  // Set up test environment variables
  process.env.NEXT_PUBLIC_DEMO_MODE = 'false';
  process.env.CI = 'true';
  
  // Any other global setup needed for E2E tests
  console.log('Global test setup complete');
  
  return async () => {
    console.log('Global test teardown');
  };
}

export default globalSetup;