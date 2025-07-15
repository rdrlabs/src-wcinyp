import { test, expect } from '@playwright/test';
import {
  waitForMDXHydration,
  validateFumadocsPage,
  validateSyntaxHighlighting,
  validateMathRendering,
  navigateToFumdocsPage,
  getPageHeadings,
  captureDebugScreenshot
} from '@/test/fumadocs-validator';

test('test utilities can be imported', async () => {
  // Just verify the imports work
  expect(waitForMDXHydration).toBeDefined();
  expect(validateFumadocsPage).toBeDefined();
  expect(validateSyntaxHighlighting).toBeDefined();
  expect(validateMathRendering).toBeDefined();
  expect(navigateToFumdocsPage).toBeDefined();
  expect(getPageHeadings).toBeDefined();
  expect(captureDebugScreenshot).toBeDefined();
});