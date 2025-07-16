import { Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Visual testing configuration
 */
export interface VisualTestConfig {
  threshold?: number;  // Pixel difference threshold (0-1)
  includeAA?: boolean; // Include anti-aliasing differences
  alpha?: number;      // Opacity threshold (0-1)
  diffColor?: [number, number, number]; // RGB diff color
}

/**
 * Default configuration for visual tests
 */
const DEFAULT_CONFIG: VisualTestConfig = {
  threshold: 0.1,     // 10% difference allowed
  includeAA: false,   // Ignore anti-aliasing
  alpha: 0.1,         // Minimal alpha difference
  diffColor: [255, 0, 0] // Red diff pixels
};

/**
 * Ensure directory exists
 */
async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    // Directory already exists or other error
    if ((error as any).code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * Get paths for visual test images
 */
function getImagePaths(testName: string) {
  const baseDir = 'tests/visual';
  return {
    baseline: path.join(baseDir, 'baseline', `${testName}.png`),
    current: path.join(baseDir, 'current', `${testName}.png`),
    diff: path.join(baseDir, 'diff', `${testName}.png`)
  };
}

/**
 * Capture and compare screenshots
 * @param page - Playwright page instance
 * @param testName - Name for the test/screenshot
 * @param config - Visual test configuration
 * @returns true if images match, false if they differ
 */
export async function captureAndCompare(
  page: Page,
  testName: string,
  config: VisualTestConfig = {}
): Promise<boolean> {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const paths = getImagePaths(testName);
  
  // Ensure directories exist
  await ensureDir(path.dirname(paths.baseline));
  await ensureDir(path.dirname(paths.current));
  await ensureDir(path.dirname(paths.diff));
  
  // Capture current screenshot
  await page.screenshot({ 
    path: paths.current,
    fullPage: true,
    animations: 'disabled' // Disable animations for consistency
  });
  
  // Check if baseline exists
  try {
    await fs.access(paths.baseline);
  } catch {
    // No baseline, copy current as baseline
    console.log(`No baseline found for ${testName}, creating baseline...`);
    await fs.copyFile(paths.current, paths.baseline);
    return true; // First run always passes
  }
  
  // Load images
  const [baselineBuffer, currentBuffer] = await Promise.all([
    fs.readFile(paths.baseline),
    fs.readFile(paths.current)
  ]);
  
  const baseline = PNG.sync.read(baselineBuffer);
  const current = PNG.sync.read(currentBuffer);
  
  // Check dimensions
  if (baseline.width !== current.width || baseline.height !== current.height) {
    console.error(`Image dimensions differ for ${testName}:
      Baseline: ${baseline.width}x${baseline.height}
      Current: ${current.width}x${current.height}`);
    return false;
  }
  
  // Create diff image
  const diff = new PNG({ width: baseline.width, height: baseline.height });
  
  // Compare images
  const numDiffPixels = pixelmatch(
    baseline.data,
    current.data,
    diff.data,
    baseline.width,
    baseline.height,
    {
      threshold: mergedConfig.threshold,
      includeAA: mergedConfig.includeAA,
      alpha: mergedConfig.alpha,
      diffColor: mergedConfig.diffColor,
      diffColorAlt: [0, 255, 0], // Green for anti-aliasing
      diffMask: false
    }
  );
  
  // Calculate difference percentage
  const totalPixels = baseline.width * baseline.height;
  const diffPercentage = (numDiffPixels / totalPixels) * 100;
  
  // Save diff image if there are differences
  if (numDiffPixels > 0) {
    const diffBuffer = PNG.sync.write(diff);
    await fs.writeFile(paths.diff, diffBuffer);
    console.log(`Visual difference detected for ${testName}: ${diffPercentage.toFixed(2)}% (${numDiffPixels} pixels)`);
    return false;
  }
  
  console.log(`Visual test passed for ${testName}`);
  return true;
}

/**
 * Update baseline image
 * @param testName - Name of the test to update
 */
export async function updateBaseline(testName: string): Promise<void> {
  const paths = getImagePaths(testName);
  
  try {
    await fs.access(paths.current);
    await fs.copyFile(paths.current, paths.baseline);
    console.log(`Updated baseline for ${testName}`);
  } catch (error) {
    throw new Error(`Cannot update baseline for ${testName}: current image not found`);
  }
}

/**
 * Clean up test images
 * @param testName - Name of the test to clean
 * @param keepBaseline - Whether to keep the baseline image
 */
export async function cleanupTestImages(
  testName: string,
  keepBaseline: boolean = true
): Promise<void> {
  const paths = getImagePaths(testName);
  
  const filesToDelete = [paths.current, paths.diff];
  if (!keepBaseline) {
    filesToDelete.push(paths.baseline);
  }
  
  for (const file of filesToDelete) {
    try {
      await fs.unlink(file);
    } catch (error) {
      // Ignore if file doesn't exist
      if ((error as any).code !== 'ENOENT') {
        throw error;
      }
    }
  }
}

/**
 * Compare specific regions of a page
 * @param page - Playwright page instance
 * @param selector - CSS selector for the element to compare
 * @param testName - Name for the test
 * @param config - Visual test configuration
 */
export async function captureAndCompareElement(
  page: Page,
  selector: string,
  testName: string,
  config: VisualTestConfig = {}
): Promise<boolean> {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible' });
  
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const paths = getImagePaths(testName);
  
  // Ensure directories exist
  await ensureDir(path.dirname(paths.baseline));
  await ensureDir(path.dirname(paths.current));
  await ensureDir(path.dirname(paths.diff));
  
  // Capture element screenshot
  await element.screenshot({ 
    path: paths.current,
    animations: 'disabled'
  });
  
  // Rest of the logic is the same as captureAndCompare
  try {
    await fs.access(paths.baseline);
  } catch {
    console.log(`No baseline found for ${testName}, creating baseline...`);
    await fs.copyFile(paths.current, paths.baseline);
    return true;
  }
  
  const [baselineBuffer, currentBuffer] = await Promise.all([
    fs.readFile(paths.baseline),
    fs.readFile(paths.current)
  ]);
  
  const baseline = PNG.sync.read(baselineBuffer);
  const current = PNG.sync.read(currentBuffer);
  
  if (baseline.width !== current.width || baseline.height !== current.height) {
    console.error(`Element dimensions differ for ${testName}`);
    return false;
  }
  
  const diff = new PNG({ width: baseline.width, height: baseline.height });
  
  const numDiffPixels = pixelmatch(
    baseline.data,
    current.data,
    diff.data,
    baseline.width,
    baseline.height,
    {
      threshold: mergedConfig.threshold,
      includeAA: mergedConfig.includeAA,
      alpha: mergedConfig.alpha,
      diffColor: mergedConfig.diffColor,
      diffColorAlt: [0, 255, 0],
      diffMask: false
    }
  );
  
  if (numDiffPixels > 0) {
    const diffBuffer = PNG.sync.write(diff);
    await fs.writeFile(paths.diff, diffBuffer);
    const totalPixels = baseline.width * baseline.height;
    const diffPercentage = (numDiffPixels / totalPixels) * 100;
    console.log(`Element visual difference for ${testName}: ${diffPercentage.toFixed(2)}%`);
    return false;
  }
  
  console.log(`Element visual test passed for ${testName}`);
  return true;
}

/**
 * Batch update baselines
 * @param testNames - Array of test names to update
 */
export async function updateBaselines(testNames: string[]): Promise<void> {
  for (const testName of testNames) {
    await updateBaseline(testName);
  }
}

/**
 * Get all failed visual tests
 */
export async function getFailedTests(): Promise<string[]> {
  const diffDir = 'tests/visual/diff';
  try {
    const files = await fs.readdir(diffDir);
    return files
      .filter(f => f.endsWith('.png'))
      .map(f => f.replace('.png', ''));
  } catch {
    return [];
  }
}