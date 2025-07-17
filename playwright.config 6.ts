import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only - smart retry for flaky tests */
  retries: process.env.CI ? 2 : 1,
  /* Optimize workers for CI - use 4 workers for better parallelization */
  workers: process.env.CI ? 4 : '50%',
  /* Shard tests across multiple machines if SHARD env var is set */
  shard: process.env.SHARD ? {
    total: parseInt(process.env.TOTAL_SHARDS || '1'),
    current: parseInt(process.env.SHARD || '1')
  } : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? [
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['github'],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ] : [
    ['html'],
    ['json', { outputFile: 'test-results/performance-report.json' }],
    ['list'],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Screenshot on failure - AI-friendly for debugging */
    screenshot: 'only-on-failure',

    /* Run in headless mode - AI-friendly for automation */
    headless: true,

    /* Set viewport for consistent testing */
    viewport: { width: 1280, height: 720 },

    /* Performance-specific settings */
    video: process.env.RECORD_VIDEO === 'true' ? 'on' : 'off',
    
    /* Capture console logs */
    ignoreHTTPSErrors: true,
    
    /* Extended timeout for performance tests */
    navigationTimeout: 30000,
    actionTimeout: 10000,
  },

  /* Configure projects for major browsers */
  projects: [
    // Standard browser tests
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Performance-specific test projects
    {
      name: 'performance-desktop',
      testMatch: /.*\.perf\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        // Enable performance features
        launchOptions: {
          args: [
            '--enable-precise-memory-info',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
          ],
        },
        // Capture more detailed traces for performance tests
        trace: 'on',
        video: 'retain-on-failure',
      },
    },

    {
      name: 'performance-mobile',
      testMatch: /.*\.perf\.spec\.ts$/,
      use: {
        ...devices['Pixel 5'],
        // Mobile CPU throttling
        launchOptions: {
          args: ['--enable-precise-memory-info'],
          slowMo: 250, // Simulate slower device
        },
        // Mobile network conditions are applied in tests
        trace: 'on',
        video: 'retain-on-failure',
      },
    },

    {
      name: 'performance-slow-network',
      testMatch: /.*\.perf\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        // Network conditions will be applied in individual tests
        launchOptions: {
          args: ['--enable-precise-memory-info'],
        },
        // Extended timeouts for slow network
        navigationTimeout: 60000,
        actionTimeout: 20000,
        trace: 'on',
        video: 'retain-on-failure',
      },
    },

    // Device-specific performance tests
    {
      name: 'performance-tablet',
      testMatch: /.*\.perf\.spec\.ts$/,
      use: {
        ...devices['iPad Pro'],
        trace: 'on',
        video: 'retain-on-failure',
      },
    },

    {
      name: 'performance-mobile-safari',
      testMatch: /.*\.perf\.spec\.ts$/,
      use: {
        ...devices['iPhone 13'],
        trace: 'on',
        video: 'retain-on-failure',
      },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Performance test specific configuration */
  expect: {
    // Extended timeout for performance assertions
    timeout: 10000,
  },

  /* Global timeout for performance tests */
  timeout: process.env.CI ? 60000 : 120000, // 1 minute on CI, 2 minutes locally

  /* Output folder for test results */
  outputDir: 'test-results/',

  /* Limit the number of failures to fail fast */
  maxFailures: process.env.CI ? 10 : undefined,

  /* Global setup/teardown */
  globalSetup: process.env.CI ? './tests/e2e/global-setup.ts' : undefined,
  globalTeardown: process.env.CI ? './tests/e2e/global-teardown.ts' : undefined,

  /* Preserve output for debugging */
  preserveOutput: 'failures-only',

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});