import { test as base } from '@playwright/test';

/**
 * Extended test with smart retry logic for flaky tests
 */
export const test = base.extend({
  // Auto-retry flaky operations
  autoRetry: async ({}, use) => {
    await use(async (fn: () => Promise<any>, options = {}) => {
      const { retries = 3, delay = 1000 } = options;
      
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          return await fn();
        } catch (error) {
          if (attempt === retries) {
            throw error;
          }
          console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    });
  },
  
  // Smart wait for stability
  waitForStability: async ({ page }, use) => {
    await use(async () => {
      // Wait for no network activity
      await page.waitForLoadState('networkidle');
      
      // Wait for no DOM mutations
      await page.evaluate(() => {
        return new Promise(resolve => {
          let timeout: NodeJS.Timeout;
          const observer = new MutationObserver(() => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              observer.disconnect();
              resolve(undefined);
            }, 500);
          });
          
          observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
          });
          
          // Initial timeout
          timeout = setTimeout(() => {
            observer.disconnect();
            resolve(undefined);
          }, 500);
        });
      });
    });
  }
});

/**
 * Mark test as potentially flaky
 */
export function flakyTest(testFn: any, retries = 3) {
  return test.describe('Potentially flaky', () => {
    test.describe.configure({ retries });
    testFn();
  });
}

/**
 * Wait helpers for common flaky scenarios
 */
export const waitHelpers = {
  // Wait for animation to complete
  async waitForAnimation(page: any, selector: string) {
    await page.waitForSelector(selector);
    await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return;
      
      return Promise.all(
        element.getAnimations({ subtree: true })
          .map(animation => animation.finished)
      );
    }, selector);
  },
  
  // Wait for lazy-loaded content
  async waitForLazyLoad(page: any, selector: string, timeout = 5000) {
    await page.waitForSelector(selector, { 
      state: 'visible',
      timeout 
    });
    
    // Additional wait for content to stabilize
    await page.waitForTimeout(100);
  },
  
  // Wait for React to finish rendering
  async waitForReact(page: any) {
    await page.waitForFunction(() => {
      const reactRoot = document.querySelector('#__next') || document.querySelector('#root');
      if (!reactRoot) return true;
      
      // Check if React is done by looking for pending updates
      const fiber = (reactRoot as any)._reactRootContainer?._internalRoot;
      return !fiber || fiber.pendingTime === 0;
    });
  }
};