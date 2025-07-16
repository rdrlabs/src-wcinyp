import { test, expect } from '@playwright/test';
import { 
  capturePerformanceMetrics, 
  formatMetrics,
  measureInteractionPerformance,
  mark,
  measure,
  assertPerformanceBudget,
  waitForPageLoad,
  getResourceTimings
} from './utils/performance-helpers';
import {
  throttleNetwork,
  throttleCPU,
  NetworkProfiles
} from './utils/network-emulation';
import {
  loadBudgetConfig,
  getBudgetForPage,
  generateBudgetReport
} from './utils/budget-loader';

test.describe('Authentication Flow Performance Tests', () => {
  test('should load login page efficiently', async ({ page }) => {
    await page.goto('/login');
    await waitForPageLoad(page);
    
    const metrics = await capturePerformanceMetrics(page);
    console.log('Login Page Metrics:', formatMetrics(metrics));
    
    // Login page should be lightweight
    expect(metrics.FCP).toBeLessThan(1500);
    expect(metrics.LCP).toBeLessThan(2000);
    expect(metrics.CLS).toBeLessThan(0.05);
    
    // Check resource usage
    const resourceTimings = await getResourceTimings(page);
    console.log('Login page resources:', {
      totalSize: `${(resourceTimings.totalSize / 1024).toFixed(2)} KB`,
      totalDuration: `${resourceTimings.totalDuration}ms`
    });
    
    // Login page should have minimal resources
    expect(resourceTimings.totalSize).toBeLessThan(1048576); // 1MB max
  });

  test('should handle demo mode login efficiently', async ({ page }) => {
    await page.goto('/login');
    await waitForPageLoad(page);
    
    // Mark start of login flow
    await mark(page, 'loginStart');
    
    // Measure demo mode button click
    const demoClickDuration = await measureInteractionPerformance(page, async () => {
      await page.click('button:has-text("Continue with Demo Mode")');
      // Wait for navigation or state change
      await page.waitForURL((url) => !url.pathname.includes('/login'), { 
        timeout: 5000 
      }).catch(() => {
        // If URL doesn't change, wait for auth state
        return page.waitForTimeout(1000);
      });
    });
    
    console.log(`Demo mode login: ${demoClickDuration}ms`);
    
    // Mark end of login flow
    await mark(page, 'loginEnd');
    
    const totalLoginDuration = await measure(page, 'loginFlow', 'loginStart', 'loginEnd');
    console.log(`Total login flow: ${totalLoginDuration}ms`);
    
    // Login should complete quickly
    expect(totalLoginDuration).toBeLessThan(3000);
  });

  test('should maintain performance during auth state changes', async ({ page }) => {
    // Start on homepage
    await page.goto('/');
    await waitForPageLoad(page);
    
    // Capture initial metrics
    const initialMetrics = await capturePerformanceMetrics(page);
    console.log('Initial metrics:', formatMetrics(initialMetrics));
    
    // Navigate to login
    const loginNavDuration = await measureInteractionPerformance(page, async () => {
      await page.goto('/login');
      await waitForPageLoad(page);
    });
    
    console.log(`Navigation to login: ${loginNavDuration}ms`);
    
    // Perform demo login
    const loginDuration = await measureInteractionPerformance(page, async () => {
      await page.click('button:has-text("Continue with Demo Mode")');
      await page.waitForURL((url) => !url.pathname.includes('/login'), { 
        timeout: 5000 
      }).catch(() => page.waitForTimeout(1000));
    });
    
    console.log(`Login duration: ${loginDuration}ms`);
    
    // Capture post-auth metrics
    await waitForPageLoad(page);
    const postAuthMetrics = await capturePerformanceMetrics(page);
    console.log('Post-auth metrics:', formatMetrics(postAuthMetrics));
    
    // Performance shouldn't degrade significantly after auth
    expect(postAuthMetrics.FCP).toBeLessThan(initialMetrics.FCP * 1.5);
  });

  test('should handle logout efficiently', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.click('button:has-text("Continue with Demo Mode")');
    await page.waitForURL((url) => !url.pathname.includes('/login'), { 
      timeout: 5000 
    }).catch(() => page.waitForTimeout(1000));
    await waitForPageLoad(page);
    
    // Find and measure logout
    const logoutDuration = await measureInteractionPerformance(page, async () => {
      // Look for logout button in various possible locations
      const logoutButton = await page.locator('button:has-text("Logout"), button:has-text("Sign out"), [aria-label*="logout"]').first();
      
      if (await logoutButton.count() > 0) {
        await logoutButton.click();
        // Wait for redirect to login or home
        await page.waitForURL((url) => 
          url.pathname === '/' || url.pathname === '/login', 
          { timeout: 3000 }
        ).catch(() => page.waitForTimeout(1000));
      }
    });
    
    if (logoutDuration > 0) {
      console.log(`Logout duration: ${logoutDuration}ms`);
      expect(logoutDuration).toBeLessThan(2000);
    }
  });

  test('should optimize auth checks on protected routes', async ({ page }) => {
    // Try to access a potentially protected route
    const protectedRoutes = ['/admin', '/dashboard', '/settings'];
    
    for (const route of protectedRoutes) {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      
      if (response && response.status() !== 404) {
        await waitForPageLoad(page);
        
        const metrics = await capturePerformanceMetrics(page);
        console.log(`${route} metrics:`, formatMetrics(metrics));
        
        // Auth checks shouldn't significantly delay page load
        expect(metrics.TTFB).toBeLessThan(1000);
        expect(metrics.FCP).toBeLessThan(2000);
        
        // Check if redirected to login
        const currentUrl = page.url();
        console.log(`${route} -> ${currentUrl}`);
      }
    }
  });

  test('should handle auth under poor network conditions', async ({ page, browserName }) => {
    if (browserName !== 'chromium') {
      test.skip();
    }
    
    // Apply 3G network conditions
    await throttleNetwork(page, 'Fast 3G');
    await throttleCPU(page, 'Mid-tier mobile');
    
    await page.goto('/login');
    await waitForPageLoad(page);
    
    // Measure login under throttled conditions
    const throttledLoginDuration = await measureInteractionPerformance(page, async () => {
      await page.click('button:has-text("Continue with Demo Mode")');
      await page.waitForURL((url) => !url.pathname.includes('/login'), { 
        timeout: 10000 
      }).catch(() => page.waitForTimeout(2000));
    });
    
    console.log(`3G login duration: ${throttledLoginDuration}ms`);
    
    // Should still complete within reasonable time
    expect(throttledLoginDuration).toBeLessThan(6000);
    
    // Reset throttling
    await throttleNetwork(page, 'No throttling');
    await throttleCPU(page, 'No throttling');
  });

  test('should maintain session efficiently', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.click('button:has-text("Continue with Demo Mode")');
    await page.waitForURL((url) => !url.pathname.includes('/login'), { 
      timeout: 5000 
    }).catch(() => page.waitForTimeout(1000));
    await waitForPageLoad(page);
    
    // Navigate through multiple pages to test session persistence
    const routes = ['/', '/documents', '/providers', '/directory'];
    const navigationMetrics: Record<string, number> = {};
    
    for (const route of routes) {
      const navDuration = await measureInteractionPerformance(page, async () => {
        await page.goto(route);
        await waitForPageLoad(page);
      });
      
      navigationMetrics[route] = navDuration;
      console.log(`Navigation to ${route}: ${navDuration}ms`);
      
      // Check if still authenticated (no redirect to login)
      expect(page.url()).not.toContain('/login');
    }
    
    // Navigation should remain fast with active session
    Object.values(navigationMetrics).forEach(duration => {
      expect(duration).toBeLessThan(2000);
    });
  });

  test('should optimize auth UI components', async ({ page }) => {
    await page.goto('/login');
    await waitForPageLoad(page);
    
    // Measure form interaction performance
    const formInteractions = {
      emailFocus: 0,
      passwordFocus: 0,
      showPassword: 0,
      submitHover: 0
    };
    
    // Measure email input focus
    formInteractions.emailFocus = await measureInteractionPerformance(page, async () => {
      const emailInput = await page.$('input[type="email"], input[name="email"]');
      if (emailInput) {
        await emailInput.focus();
      }
    });
    
    // Measure password input focus
    formInteractions.passwordFocus = await measureInteractionPerformance(page, async () => {
      const passwordInput = await page.$('input[type="password"], input[name="password"]');
      if (passwordInput) {
        await passwordInput.focus();
      }
    });
    
    // Measure show/hide password toggle (if exists)
    const toggleButton = await page.$('button[aria-label*="password"]');
    if (toggleButton) {
      formInteractions.showPassword = await measureInteractionPerformance(page, async () => {
        await toggleButton.click();
        await page.waitForTimeout(50);
      });
    }
    
    console.log('Form interaction metrics:', formInteractions);
    
    // All interactions should be instant
    Object.entries(formInteractions).forEach(([interaction, duration]) => {
      if (duration > 0) {
        expect(duration).toBeLessThan(100);
      }
    });
  });

  test('should handle auth errors gracefully', async ({ page }) => {
    await page.goto('/login');
    await waitForPageLoad(page);
    
    // Try to submit empty form (if traditional login exists)
    const submitButton = await page.$('button[type="submit"]');
    if (submitButton) {
      const errorDisplayDuration = await measureInteractionPerformance(page, async () => {
        await submitButton.click();
        // Wait for error message
        await page.waitForSelector('[role="alert"], .error-message', { 
          state: 'visible',
          timeout: 2000 
        }).catch(() => {});
      });
      
      console.log(`Error display duration: ${errorDisplayDuration}ms`);
      if (errorDisplayDuration > 0) {
        expect(errorDisplayDuration).toBeLessThan(500);
      }
    }
    
    // Measure recovery from error state
    const recoveryDuration = await measureInteractionPerformance(page, async () => {
      // Click demo mode to recover
      await page.click('button:has-text("Continue with Demo Mode")');
      await page.waitForURL((url) => !url.pathname.includes('/login'), { 
        timeout: 5000 
      }).catch(() => page.waitForTimeout(1000));
    });
    
    console.log(`Recovery duration: ${recoveryDuration}ms`);
    expect(recoveryDuration).toBeLessThan(3000);
  });
});