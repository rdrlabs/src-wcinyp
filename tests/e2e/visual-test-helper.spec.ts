import { test, expect } from '@playwright/test';
import {
  captureAndCompare,
  captureAndCompareElement,
  updateBaseline,
  cleanupTestImages,
  getFailedTests
} from '@/test/visual-validator';

test('visual test helper functions are available', async () => {
  // Just verify the imports work
  expect(captureAndCompare).toBeDefined();
  expect(captureAndCompareElement).toBeDefined();
  expect(updateBaseline).toBeDefined();
  expect(cleanupTestImages).toBeDefined();
  expect(getFailedTests).toBeDefined();
});

test('visual test directories exist', async ({ page }) => {
  // Test that our directory structure is created
  const fs = await import('fs/promises');
  const path = await import('path');
  
  const dirs = ['baseline', 'current', 'diff'].map(
    dir => path.join('tests/visual', dir)
  );
  
  for (const dir of dirs) {
    const exists = await fs.access(dir).then(() => true).catch(() => false);
    expect(exists).toBeTruthy();
  }
});