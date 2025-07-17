import { test, expect } from '@playwright/test';

test.describe('Fumadocs MDX Rendering', () => {
  test.beforeEach(async ({ page }) => {
    // First navigate to home and use demo mode
    await page.goto('/');
    
    // Click "Continue with Demo Mode" if login screen appears
    const demoButton = page.locator('button:has-text("Continue with Demo Mode")');
    if (await demoButton.isVisible({ timeout: 5000 })) {
      await demoButton.click();
      await page.waitForLoadState('networkidle');
    }
    
    // Navigate to the MDX features demo page
    await page.goto('/knowledge/docs/fumadocs-demo/mdx-features');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
  });

  test('renders basic markdown elements correctly', async ({ page }) => {
    // Check headings
    await expect(page.locator('h1').first()).toContainText('MDX Features in Fumadocs');
    await expect(page.locator('h2')).toContainText('Basic Markdown');
    
    // Check text formatting
    await expect(page.locator('strong')).toContainText('Bold text');
    await expect(page.locator('em')).toContainText('Italic text');
    
    // Check lists
    await expect(page.locator('ul > li').first()).toContainText('First item');
    await expect(page.locator('ol > li').first()).toContainText('First step');
    
    // Check task list
    const taskList = page.locator('ul').filter({ hasText: 'Completed task' });
    await expect(taskList.locator('input[type="checkbox"]').first()).toBeChecked();
  });

  test('renders code blocks with syntax highlighting', async ({ page }) => {
    // Check for code blocks
    const codeBlocks = page.locator('pre code');
    await expect(codeBlocks).toHaveCount(10, { timeout: 10000 });
    
    // Check JavaScript code block
    const jsCodeBlock = page.locator('pre').filter({ hasText: 'function greet' });
    await expect(jsCodeBlock).toBeVisible();
    await expect(jsCodeBlock).toHaveAttribute('data-language', 'javascript');
    
    // Check TypeScript code block with title
    const tsCodeBlock = page.locator('pre').filter({ hasText: 'export function formatDate' });
    await expect(tsCodeBlock).toBeVisible();
    const titleElement = tsCodeBlock.locator('..//div[contains(@class, "title")]');
    await expect(titleElement).toContainText('utils/formatter.ts');
    
    // Check line highlighting
    const highlightedBlock = page.locator('pre').filter({ hasText: 'function MyComponent' });
    await expect(highlightedBlock).toBeVisible();
    const highlightedLines = highlightedBlock.locator('[data-highlighted="true"]');
    await expect(highlightedLines).toHaveCount(5); // Lines 2, 4-6
  });

  test('renders tables correctly', async ({ page }) => {
    // Find the features table
    const table = page.locator('table').filter({ hasText: 'Feature' });
    await expect(table).toBeVisible();
    
    // Check table headers
    await expect(table.locator('th').first()).toContainText('Feature');
    await expect(table.locator('th').nth(1)).toContainText('Support');
    await expect(table.locator('th').nth(2)).toContainText('Notes');
    
    // Check table data
    await expect(table.locator('td').first()).toContainText('MDX');
    await expect(table.locator('td').nth(1)).toContainText('✅');
  });

  test('renders KaTeX math expressions', async ({ page }) => {
    // Check inline math
    const inlineMath = page.locator('.katex').filter({ hasText: 'E' });
    await expect(inlineMath.first()).toBeVisible();
    await expect(inlineMath.first()).toContainText('E=mc');
    
    // Check block math
    const blockMath = page.locator('.katex-display');
    await expect(blockMath.first()).toBeVisible();
    // KaTeX should render the binomial coefficient formula
    await expect(blockMath.first()).toContainText('n!');
  });

  test('renders MDX components correctly', async ({ page }) => {
    // Check Callout component
    const callout = page.locator('[role="alert"]').filter({ hasText: "Today's date is:" });
    await expect(callout).toBeVisible();
    
    // Check Tabs component
    const tabs = page.locator('[role="tablist"]').first();
    await expect(tabs).toBeVisible();
    
    // Check tab buttons
    await expect(tabs.locator('[role="tab"]').first()).toContainText('String Props');
    await expect(tabs.locator('[role="tab"]').nth(1)).toContainText('Number Props');
    
    // Click on a tab and check content changes
    await tabs.locator('[role="tab"]').nth(1).click();
    await expect(page.locator('[role="tabpanel"]').filter({ hasText: 'count={42}' })).toBeVisible();
  });

  test('renders frontmatter table correctly', async ({ page }) => {
    // Check the frontmatter fields table
    const frontmatterTable = page.locator('table').filter({ hasText: 'Field' });
    await expect(frontmatterTable).toBeVisible();
    
    // Verify required fields are marked
    const titleRow = frontmatterTable.locator('tr').filter({ hasText: 'title' });
    await expect(titleRow.locator('td').nth(3)).toContainText('✅');
  });

  test('supports dark mode rendering', async ({ page }) => {
    // Toggle dark mode
    const themeToggle = page.locator('button[aria-label*="theme"]').first();
    await themeToggle.click();
    
    // Wait for theme change
    await page.waitForTimeout(500);
    
    // Check if dark mode is applied
    const html = page.locator('html');
    await expect(html).toHaveAttribute('class', /dark/);
    
    // Verify code blocks still visible in dark mode
    const codeBlock = page.locator('pre code').first();
    await expect(codeBlock).toBeVisible();
  });
});