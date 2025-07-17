import { Page, expect } from '@playwright/test';

/**
 * Fumadocs validation utilities for AI-friendly testing
 */

/**
 * Wait for MDX content to fully hydrate on the page
 * @param page - Playwright page instance
 * @param timeout - Maximum time to wait for hydration
 */
export async function waitForMDXHydration(page: Page, timeout: number = 10000): Promise<void> {
  // Wait for React to finish hydrating
  await page.waitForLoadState('networkidle');
  
  // Wait for any MDX-specific elements to be ready
  await page.waitForFunction(
    () => {
      // Check if KaTeX elements are rendered
      const katexElements = document.querySelectorAll('.katex');
      const allKatexReady = Array.from(katexElements).every(
        el => el.textContent && el.textContent.length > 0
      );
      
      // Check if code blocks are highlighted
      const codeBlocks = document.querySelectorAll('pre code');
      const allCodeReady = Array.from(codeBlocks).every(
        el => el.classList.length > 0 || el.querySelector('[class*="token"]')
      );
      
      return allKatexReady && allCodeReady;
    },
    { timeout }
  );
}

/**
 * Validate that a Fumadocs page has loaded correctly
 * @param page - Playwright page instance
 * @param options - Validation options
 */
export async function validateFumadocsPage(
  page: Page,
  options: {
    title?: string;
    hasTOC?: boolean;
    hasBreadcrumb?: boolean;
    hasSearch?: boolean;
    hasContent?: boolean;
  } = {}
) {
  const {
    title,
    hasTOC = true,
    hasBreadcrumb = true,
    hasSearch = true,
    hasContent = true
  } = options;

  // Wait for the page to be ready
  await waitForMDXHydration(page);

  // Validate title if provided
  if (title) {
    await expect(page).toHaveTitle(new RegExp(title));
  }

  // Check for table of contents
  if (hasTOC) {
    const toc = page.locator('[data-toc], nav:has(a[href^="#"]), aside:has(a[href^="#"])');
    await expect(toc).toBeVisible({ timeout: 5000 });
  }

  // Check for breadcrumb navigation
  if (hasBreadcrumb) {
    const breadcrumb = page.locator('nav[aria-label*="breadcrumb"], [data-breadcrumb]');
    await expect(breadcrumb).toBeVisible({ timeout: 5000 });
  }

  // Check for search functionality
  if (hasSearch) {
    const searchButton = page.locator('button[aria-label*="search"], button:has-text("Search")');
    await expect(searchButton).toBeVisible({ timeout: 5000 });
  }

  // Check for main content area
  if (hasContent) {
    const content = page.locator('main, article, [role="main"]');
    await expect(content).toBeVisible();
    
    // Ensure content has actual text
    const textContent = await content.textContent();
    expect(textContent?.trim().length).toBeGreaterThan(100);
  }
}

/**
 * Check if syntax highlighting is working correctly
 * @param page - Playwright page instance
 * @param codeSelector - Selector for code blocks
 */
export async function validateSyntaxHighlighting(
  page: Page,
  codeSelector: string = 'pre code'
): Promise<void> {
  const codeBlocks = page.locator(codeSelector);
  const count = await codeBlocks.count();
  
  expect(count).toBeGreaterThan(0);
  
  // Check each code block has syntax highlighting
  for (let i = 0; i < count; i++) {
    const codeBlock = codeBlocks.nth(i);
    
    // Check for language class or data attribute
    const hasLanguage = await codeBlock.evaluate(el => {
      const parent = el.parentElement;
      return (
        el.className.includes('language-') ||
        parent?.className.includes('language-') ||
        parent?.hasAttribute('data-language')
      );
    });
    
    expect(hasLanguage).toBeTruthy();
    
    // Check for syntax tokens
    const tokens = codeBlock.locator('[class*="token"], [class*="hljs"]');
    const tokenCount = await tokens.count();
    expect(tokenCount).toBeGreaterThan(0);
  }
}

/**
 * Validate KaTeX math rendering
 * @param page - Playwright page instance
 */
export async function validateMathRendering(page: Page): Promise<void> {
  // Check inline math
  const inlineMath = page.locator('.katex:not(.katex-display)');
  const inlineCount = await inlineMath.count();
  
  if (inlineCount > 0) {
    for (let i = 0; i < inlineCount; i++) {
      const mathElement = inlineMath.nth(i);
      await expect(mathElement).toBeVisible();
      
      // Check it has actual math content
      const mathML = mathElement.locator('.katex-mathml');
      await expect(mathML).toHaveCount(1);
    }
  }
  
  // Check display math
  const displayMath = page.locator('.katex-display');
  const displayCount = await displayMath.count();
  
  if (displayCount > 0) {
    for (let i = 0; i < displayCount; i++) {
      const mathElement = displayMath.nth(i);
      await expect(mathElement).toBeVisible();
      
      // Display math should be centered
      const iscentered = await mathElement.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.textAlign === 'center' || styles.display === 'block';
      });
      expect(iscentered).toBeTruthy();
    }
  }
}

/**
 * Navigate to a Fumadocs page with authentication handling
 * @param page - Playwright page instance
 * @param path - Path relative to /knowledge/docs/
 */
export async function navigateToFumdocsPage(
  page: Page,
  path: string
): Promise<void> {
  const fullUrl = `/knowledge/docs/${path}`;
  
  // Try to navigate directly
  await page.goto(fullUrl);
  
  // Handle authentication if needed
  const demoButton = page.locator('button:has-text("Continue with Demo Mode")');
  if (await demoButton.isVisible({ timeout: 3000 })) {
    await demoButton.click();
    await page.waitForLoadState('networkidle');
    
    // Navigate again after auth
    await page.goto(fullUrl);
  }
  
  // Wait for content to load
  await waitForMDXHydration(page);
}

/**
 * Get all headings from a Fumadocs page
 * @param page - Playwright page instance
 * @returns Array of heading texts organized by level
 */
export async function getPageHeadings(page: Page): Promise<{
  h1: string[];
  h2: string[];
  h3: string[];
  h4: string[];
}> {
  await waitForMDXHydration(page);
  
  const headings = {
    h1: await page.locator('h1').allTextContents(),
    h2: await page.locator('h2').allTextContents(),
    h3: await page.locator('h3').allTextContents(),
    h4: await page.locator('h4').allTextContents(),
  };
  
  // Clean up the text content
  Object.keys(headings).forEach(key => {
    headings[key as keyof typeof headings] = headings[key as keyof typeof headings]
      .map(text => text.trim())
      .filter(text => text.length > 0);
  });
  
  return headings;
}

/**
 * Test helper to capture screenshots with consistent naming
 * @param page - Playwright page instance
 * @param name - Screenshot name
 * @param fullPage - Whether to capture full page
 */
export async function captureDebugScreenshot(
  page: Page,
  name: string,
  fullPage: boolean = true
): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({
    path: `test-results/debug-${name}-${timestamp}.png`,
    fullPage
  });
}