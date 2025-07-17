# WCINYP Testing Plan

## Overview
This plan provides a phased approach to implementing comprehensive testing for the WCINYP application, with special focus on validating Fumadocs implementation for AI-assisted development.

## Philosophy: Progressive Enhancement

- **Build on what works** - Leverage existing Vitest setup
- **Add incrementally** - Phase tools to avoid disruption  
- **Focus on value** - Prioritize tests that catch real issues
- **AI-first design** - Tests that provide clear pass/fail signals

## Current State
- ✅ Vitest + React Testing Library configured
- ✅ 387 passing tests
- ✅ Feature flag testing utilities
- ✅ Jest-DOM matchers
- ❌ No browser automation
- ❌ No visual regression testing
- ❌ Limited Fumadocs validation

## Phase 1: Browser Automation (Week 1)
**Goal**: Enable AI to validate client-side rendering

### Setup
```bash
npm install --save-dev @playwright/test
```

### Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    headless: true, // Critical for AI
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

### Key Tests

#### 1. Fumadocs Component Rendering
```typescript
// tests/e2e/fumadocs/validate-rendering.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Fumadocs Rendering Validation', () => {
  test('MDX components render correctly', async ({ page }) => {
    await page.goto('/knowledge/docs/fumadocs-demo/playground');
    
    // Wait for hydration
    await page.waitForLoadState('networkidle');
    
    // Validate Callout renders
    const callout = page.locator('.callout').first();
    await expect(callout).toBeVisible();
    await expect(callout).toHaveClass(/callout/);
    
    // Validate Cards grid
    const cards = page.locator('[class*="cards"]').first();
    await expect(cards).toBeVisible();
    const cardCount = await cards.locator('[class*="card"]').count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test('Math formulas render with KaTeX', async ({ page }) => {
    await page.goto('/knowledge/docs/fumadocs-demo/mdx-features');
    await page.waitForLoadState('networkidle');
    
    // KaTeX creates specific class structure
    const mathInline = page.locator('.katex').first();
    await expect(mathInline).toBeVisible();
    
    // Verify block math
    const mathBlock = page.locator('.katex-display').first();
    await expect(mathBlock).toBeVisible();
  });

  test('Syntax highlighting works', async ({ page }) => {
    await page.goto('/knowledge/docs/fumadocs-demo/mdx-features');
    
    // Shiki adds data attributes
    const codeBlock = page.locator('pre code').first();
    await expect(codeBlock).toBeVisible();
    await expect(codeBlock).toHaveAttribute('data-language');
  });
});
```

#### 2. Search Functionality
```typescript
// tests/e2e/fumadocs/search.spec.ts
test.describe('Fumadocs Search', () => {
  test('keyboard shortcut opens search', async ({ page }) => {
    await page.goto('/knowledge');
    
    // Press Cmd+K (Mac) or Ctrl+K (Windows/Linux)
    await page.keyboard.press('Meta+k');
    
    const searchDialog = page.locator('[role="dialog"]');
    await expect(searchDialog).toBeVisible();
    
    const searchInput = page.locator('input[placeholder*="Search"]');
    await expect(searchInput).toBeFocused();
  });

  test('search returns relevant results', async ({ page }) => {
    await page.goto('/knowledge');
    await page.keyboard.press('Meta+k');
    
    await page.fill('input[placeholder*="Search"]', 'MDX');
    await page.waitForTimeout(500); // Debounce
    
    const results = page.locator('[class*="search-result"]');
    await expect(results.first()).toBeVisible();
  });
});
```

#### 3. Test Utilities
```typescript
// src/test/fumadocs-validator.ts
import { Page } from '@playwright/test';

export async function validateFumadocsPage(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
  
  // Check core layout elements
  const sidebar = page.locator('[class*="sidebar"]');
  const content = page.locator('main');
  const toc = page.locator('[class*="toc"]');
  
  return {
    hasSidebar: await sidebar.isVisible(),
    hasContent: await content.isVisible(),
    hasTOC: await toc.isVisible(),
    hasSearch: await page.locator('[class*="search"]').isVisible(),
  };
}

export async function waitForMDXHydration(page: Page) {
  // Wait for React hydration
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(100);
  
  // Check for hydration errors
  const errors = await page.locator('.error-boundary').count();
  if (errors > 0) {
    throw new Error('MDX hydration failed');
  }
}
```

### Success Criteria
- All Fumadocs pages load without errors
- MDX components render with correct styling
- Interactive features work as expected
- No hydration mismatches

## Phase 2: Visual Validation (Week 2)
**Goal**: Catch visual regressions

### Setup
```bash
npm install --save-dev pixelmatch pngjs
```

### Visual Test Helper
```typescript
// src/test/visual-validator.ts
import { Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'fs/promises';
import path from 'path';

export async function captureAndCompare(
  page: Page, 
  name: string,
  threshold = 0.1
) {
  const screenshotBuffer = await page.screenshot({ fullPage: true });
  const baselinePath = path.join('tests/visual/baseline', `${name}.png`);
  const currentPath = path.join('tests/visual/current', `${name}.png`);
  const diffPath = path.join('tests/visual/diff', `${name}-diff.png`);
  
  // Ensure directories exist
  await fs.mkdir(path.dirname(baselinePath), { recursive: true });
  await fs.mkdir(path.dirname(currentPath), { recursive: true });
  await fs.mkdir(path.dirname(diffPath), { recursive: true });
  
  // Save current screenshot
  await fs.writeFile(currentPath, screenshotBuffer);
  
  // Compare if baseline exists
  try {
    const baselineBuffer = await fs.readFile(baselinePath);
    const baseline = PNG.sync.read(baselineBuffer);
    const current = PNG.sync.read(screenshotBuffer);
    
    const { width, height } = baseline;
    const diff = new PNG({ width, height });
    
    const diffPixels = pixelmatch(
      baseline.data,
      current.data,
      diff.data,
      width,
      height,
      { threshold }
    );
    
    if (diffPixels > 0) {
      await fs.writeFile(diffPath, PNG.sync.write(diff));
    }
    
    return { 
      matches: diffPixels === 0, 
      diffPixels,
      diffPercentage: (diffPixels / (width * height)) * 100
    };
  } catch (error) {
    // Create baseline if it doesn't exist
    await fs.writeFile(baselinePath, screenshotBuffer);
    return { matches: true, diffPixels: 0, diffPercentage: 0 };
  }
}
```

### Visual Tests
```typescript
// tests/e2e/visual/fumadocs-visual.spec.ts
test.describe('Fumadocs Visual Regression', () => {
  test('documentation page layout', async ({ page }) => {
    await page.goto('/knowledge/docs/getting-started/introduction');
    await waitForMDXHydration(page);
    
    const result = await captureAndCompare(page, 'docs-introduction');
    expect(result.diffPercentage).toBeLessThan(1); // Allow 1% difference
  });

  test('MDX playground components', async ({ page }) => {
    await page.goto('/knowledge/docs/fumadocs-demo/playground');
    await waitForMDXHydration(page);
    
    const result = await captureAndCompare(page, 'mdx-playground');
    expect(result.diffPercentage).toBeLessThan(1);
  });
});
```

### Success Criteria
- Visual changes are intentional
- No unexpected layout shifts
- Consistent rendering across runs
- Baseline images tracked in git

## Phase 3: Production Hardening (Week 3)
**Goal**: Ensure reliability

### Setup
```bash
npm install --save-dev @vitest/coverage-v8 @vitest/ui
```

### CI-Optimized Test Commands
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:ui": "playwright test --ui",
    "test:fumadocs": "playwright test tests/e2e/fumadocs",
    "test:visual": "playwright test tests/e2e/visual",
    "test:ci": "npm run test && npm run test:e2e -- --reporter=github",
    "test:all": "npm run test:ci && npm run test:visual"
  }
}
```

### Coverage Configuration
```typescript
// vitest.config.ts (updated)
export default defineConfig({
  // ... existing config
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

### Performance Benchmarks
```typescript
// tests/e2e/performance/fumadocs-perf.spec.ts
test.describe('Fumadocs Performance', () => {
  test('documentation loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/knowledge/docs/getting-started/introduction');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // 3 seconds max
  });

  test('search responds quickly', async ({ page }) => {
    await page.goto('/knowledge');
    await page.keyboard.press('Meta+k');
    
    const startTime = Date.now();
    await page.fill('input[placeholder*="Search"]', 'test query');
    await page.waitForSelector('[class*="search-result"]');
    
    const searchTime = Date.now() - startTime;
    expect(searchTime).toBeLessThan(500); // 500ms max
  });
});
```

### Success Criteria
- 80%+ code coverage maintained
- All tests pass in CI
- No performance regressions
- Visual tests stable

## AI Development Benefits

### Immediate Value
1. **Validation Without Vision**
   - Playwright provides concrete pass/fail signals
   - Screenshots on failure show what went wrong
   - No need to guess if features work

2. **Confident Refactoring**
   - Run tests after every change
   - Catch breaking changes immediately
   - Maintain backward compatibility

3. **Documentation Through Tests**
   - Tests show expected behavior
   - Examples of component usage
   - Clear success criteria

### Long-term Value
1. **Regression Prevention**
   - Visual tests catch style changes
   - E2E tests catch workflow breaks
   - Unit tests catch logic errors

2. **Faster Development**
   - No manual verification needed
   - Automated quality gates
   - Quick feedback loops

## Implementation Checklist

### Week 1: Browser Automation
- [ ] Install Playwright
- [ ] Create playwright.config.ts
- [ ] Write Fumadocs validation tests
- [ ] Create test utilities
- [ ] Add test:e2e script
- [ ] Verify all tests pass

### Week 2: Visual Testing
- [ ] Install pixelmatch and pngjs
- [ ] Create visual test helpers
- [ ] Capture baseline screenshots
- [ ] Implement comparison logic
- [ ] Add visual tests to CI
- [ ] Document visual test process

### Week 3: Production Hardening
- [ ] Add coverage reporting
- [ ] Create CI workflow
- [ ] Add performance tests
- [ ] Set coverage thresholds
- [ ] Optimize test execution
- [ ] Document maintenance process

## Common Issues and Solutions

### Issue: Tests fail on CI but pass locally
**Solution**: Ensure consistent environment
```yaml
# .github/workflows/test.yml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps
- name: Run tests
  env:
    CI: true
  run: npm run test:ci
```

### Issue: Visual tests are flaky
**Solution**: Increase stability
```typescript
// Disable animations
await page.addStyleTag({
  content: `
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  `
});
```

### Issue: Tests are slow
**Solution**: Optimize execution
```typescript
// Run in parallel
test.describe.parallel('Independent tests', () => {
  test('test 1', async ({ page }) => {});
  test('test 2', async ({ page }) => {});
});
```

## Maintenance

### Daily
- Run tests before committing
- Update tests with new features
- Fix failing tests immediately

### Weekly
- Review test coverage
- Update visual baselines if needed
- Clean up obsolete tests

### Monthly
- Audit test performance
- Review and refactor test utilities
- Update testing documentation

## Integration with Taskmaster

This testing plan integrates with Taskmaster to provide:
1. Task validation before marking complete
2. Automated test runs for each phase
3. Clear success criteria for each task
4. Progress tracking through test results

## Conclusion

This phased approach ensures:
- ✅ No disruption to existing tests
- ✅ Progressive value delivery
- ✅ AI-friendly test design
- ✅ Sustainable maintenance
- ✅ Maximum development velocity

Start with Phase 1 and see immediate benefits. Each phase builds on the previous, creating a comprehensive testing safety net that enables confident, rapid development.