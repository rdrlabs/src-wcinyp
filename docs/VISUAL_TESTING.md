# Visual Testing Documentation

## Overview

This guide covers the visual regression testing system implemented for the WCINYP application. Visual regression testing helps catch unintended UI changes by comparing screenshots of the application against known-good baseline images.

## Architecture

### Tools and Technologies
- **Playwright**: Browser automation and screenshot capture
- **pixelmatch**: Pixel-by-pixel image comparison
- **pngjs**: PNG image manipulation
- **TypeScript**: Type-safe test utilities

### Directory Structure
```
tests/
├── e2e/
│   └── visual/
│       ├── fumadocs-visual.spec.ts    # Main visual tests
│       └── auth-visual.spec.ts         # Authentication flow tests
└── visual/
    ├── baseline/   # Known-good screenshots
    ├── current/    # Latest test run screenshots
    └── diff/       # Difference images (failures only)

src/test/
└── visual-validator.ts  # Visual testing utilities
```

## Getting Started

### Running Visual Tests

```bash
# Run all visual tests
npm run test:visual

# Run specific test file
npm run test:visual tests/e2e/visual/auth-visual.spec.ts

# Run with specific browser
npm run test:visual -- --project=chromium

# Debug mode (headed browser)
npm run test:visual -- --debug
```

### Creating New Visual Tests

```typescript
import { test, expect } from '@playwright/test';
import { captureAndCompare } from '@/test/visual-validator';

test('my component visual test', async ({ page }) => {
  // Navigate to the page
  await page.goto('/my-page');
  
  // Wait for content to load
  await page.waitForSelector('.my-component', { state: 'visible' });
  
  // Capture and compare
  const isMatch = await captureAndCompare(page, 'my-component-test', {
    threshold: 0.1,  // 10% difference allowed
    fullPage: true   // Capture entire page
  });
  
  expect(isMatch).toBeTruthy();
});
```

## Baseline Management

### Understanding Baselines

Baselines are the "expected" screenshots that new captures are compared against. They represent the desired visual state of your application.

### Creating Initial Baselines

When a test runs for the first time, it automatically creates a baseline:

```
No baseline found for login-page, creating baseline...
```

The baseline is saved to `tests/visual/baseline/login-page.png`.

### Updating Baselines

When intentional UI changes are made, baselines need to be updated:

```bash
# Update all baselines (runs special test)
npm run test:visual:update

# Manual update for specific test
# 1. Delete the old baseline
rm tests/visual/baseline/my-test.png
# 2. Run the test to create new baseline
npm run test:visual -- -g "my test name"
```

### Reviewing Baseline Changes

Before updating baselines:
1. Review the diff images in `tests/visual/diff/`
2. Verify changes are intentional
3. Check with designers/product owners if needed
4. Update baselines only after confirmation

### Version Control Best Practices

```bash
# Add baseline changes with clear commit message
git add tests/visual/baseline/
git commit -m "Update visual baselines: [describe what changed]"

# Example:
git commit -m "Update visual baselines: new button styles on login page"
```

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. Authentication Flow Issues

**Problem**: Tests fail at login screen
```typescript
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded
```

**Solution**: Ensure authentication is handled in beforeEach:
```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  const demoButton = page.locator('button:has-text("Continue with Demo Mode")');
  if (await demoButton.isVisible({ timeout: 5000 })) {
    await demoButton.click();
    await page.waitForLoadState('domcontentloaded');
  }
});
```

#### 2. Animation-Related Failures

**Problem**: Tests fail due to animations in progress

**Solution**: Disable animations:
```typescript
test.use({
  launchOptions: {
    args: ['--force-prefers-reduced-motion']
  }
});

// Also inject CSS
await page.addStyleTag({
  content: `
    *, *::before, *::after {
      animation-duration: 0s !important;
      transition-duration: 0s !important;
    }
  `
});
```

#### 3. Dynamic Content

**Problem**: Timestamps, random data cause failures

**Solution**: Use masking:
```typescript
const isMatch = await captureAndCompare(page, 'dashboard', {
  threshold: 0.1,
  mask: ['.timestamp', '.random-data']  // Ignore these selectors
});
```

#### 4. Cross-Browser Differences

**Problem**: Tests pass in Chrome but fail in Firefox

**Solution**: 
- Use browser-specific baselines if needed
- Increase threshold for cross-browser tests
- Focus on Chromium for visual tests

#### 5. Flaky Tests

**Problem**: Tests randomly fail

**Solution**: Add explicit waits:
```typescript
// Wait for specific content
await page.waitForSelector('.content-loaded');

// Wait for network idle
await page.waitForLoadState('networkidle');

// Add small delay for rendering
await page.waitForTimeout(500);
```

### Debugging Techniques

1. **View Test Report**:
   ```bash
   # After test failure, report opens automatically
   # Or manually open:
   npx playwright show-report
   ```

2. **Debug Mode**:
   ```bash
   # Run with Playwright Inspector
   npm run test:visual -- --debug
   ```

3. **View Diff Images**:
   - Failed tests generate diff images in `tests/visual/diff/`
   - Red pixels indicate differences
   - Use image viewer to inspect

4. **Capture Specific State**:
   ```typescript
   // Capture after specific action
   await page.click('.menu-button');
   await page.waitForTimeout(300); // Wait for menu animation
   await captureAndCompare(page, 'menu-open');
   ```

## Best Practices

### 1. Test Stability

**Consistent Viewport**:
```typescript
test.use({
  viewport: { width: 1280, height: 720 }
});
```

**Disable Animations**:
- Use `--force-prefers-reduced-motion`
- Inject animation-disabling CSS
- Wait for animations to complete

**Handle Async Content**:
```typescript
// Wait for data to load
await page.waitForSelector('[data-loaded="true"]');

// Or wait for specific text
await page.waitForText('Welcome');
```

### 2. Threshold Configuration

- **0.0**: Exact match (not recommended)
- **0.01-0.05**: Tight match for critical UI
- **0.1**: Default, allows minor rendering differences
- **0.2+**: Loose match for dynamic content

```typescript
// Critical UI elements
await captureAndCompareElement(page, '.logo', 'logo', {
  threshold: 0.05
});

// Dynamic content areas
await captureAndCompare(page, 'dashboard', {
  threshold: 0.15
});
```

### 3. Element vs Full Page

**Element-specific** (preferred for components):
```typescript
await captureAndCompareElement(
  page,
  '.navbar',
  'navbar-component',
  { threshold: 0.1 }
);
```

**Full page** (for overall layout):
```typescript
await captureAndCompare(page, 'homepage', {
  fullPage: true,
  threshold: 0.1
});
```

### 4. Handling Dynamic Content

**Mask dynamic areas**:
```typescript
await captureAndCompare(page, 'dashboard', {
  mask: ['.timestamp', '.user-avatar', '[data-dynamic]']
});
```

**Mock dynamic data**:
```typescript
// Override Date for consistent timestamps
await page.addInitScript(() => {
  Date.now = () => new Date('2024-01-01').getTime();
});
```

### 5. CI/CD Integration

**Separate visual tests in CI**:
```yaml
# .github/workflows/visual-tests.yml
- name: Run Visual Tests
  run: npm run test:visual
  
- name: Upload Failed Diffs
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: visual-test-diffs
    path: tests/visual/diff/
```

**Store baselines in Git LFS**:
```bash
# .gitattributes
tests/visual/baseline/*.png filter=lfs diff=lfs merge=lfs -text
```

### 6. Team Collaboration

**Review Process**:
1. Developer makes UI changes
2. Updates visual tests
3. Runs tests locally to generate diffs
4. Shares diffs with team for review
5. Updates baselines after approval
6. Commits baselines with descriptive message

**Communication**:
- Tag UI changes in PRs: `[visual-change]`
- Include before/after screenshots in PR description
- Document why baselines were updated

## Quick Reference

### Commands
```bash
# Run all visual tests
npm run test:visual

# Run specific test
npm run test:visual -- -g "login page"

# Update all baselines
npm run test:visual:update

# Debug mode
npm run test:visual -- --debug

# Specific browser
npm run test:visual -- --project=chromium
```

### Common Patterns
```typescript
// Basic visual test
const isMatch = await captureAndCompare(page, 'test-name');

// With options
const isMatch = await captureAndCompare(page, 'test-name', {
  threshold: 0.1,
  fullPage: true,
  mask: ['.dynamic-content']
});

// Element-specific
const isMatch = await captureAndCompareElement(
  page,
  '.my-element',
  'element-name'
);

// Update baseline programmatically
await updateBaseline(page, 'test-name');

// Cleanup old images
await cleanupTestImages('test-name');
```

### Configuration Options

```typescript
interface VisualTestConfig {
  threshold?: number;        // 0-1, default: 0.1
  includeAA?: boolean;      // Include anti-aliasing, default: false
  alpha?: number;           // Alpha threshold, default: 0.1
  diffColor?: [R, G, B];    // Diff highlight color, default: [255, 0, 0]
  fullPage?: boolean;       // Capture full page, default: false
  mask?: string[];          // Selectors to mask
}
```

## Next Steps

1. **Expand test coverage**: Add visual tests for all critical user paths
2. **CI integration**: Set up automated visual testing in CI pipeline
3. **Performance**: Add visual performance metrics
4. **Accessibility**: Combine with accessibility testing
5. **Component library**: Create visual tests for design system components

## Related Documentation

- [Playwright Documentation](https://playwright.dev)
- [Testing Plan](../TESTING_PLAN.md)
- [Taskmaster Testing Workflow](../TASKMASTER_TESTING_WORKFLOW.md)