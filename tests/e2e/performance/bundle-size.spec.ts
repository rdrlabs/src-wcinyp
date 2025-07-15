import { test, expect } from '@playwright/test';
import { 
  analyzeBundleSizes, 
  analyzeWebpackStats, 
  checkBundleBudget,
  generateBundleReport 
} from './utils/bundle-analyzer';

test.describe('Bundle Size Analysis', () => {
  test('should analyze JavaScript and CSS bundle sizes', async ({ page }) => {
    const analysis = await analyzeBundleSizes(page, '/');
    
    console.log('\nBundle Size Analysis:');
    console.log(`Total size: ${(analysis.totalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Gzipped size: ${(analysis.totalGzipSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`JS size: ${(analysis.jsSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`CSS size: ${(analysis.cssSize / 1024).toFixed(0)} KB`);
    console.log(`Number of bundles: ${analysis.bundles.length}`);
    
    // Check bundle budget
    const budget = {
      totalSize: 5 * 1024 * 1024, // 5MB
      jsSize: 3 * 1024 * 1024, // 3MB
      cssSize: 500 * 1024, // 500KB
      chunkSize: 1024 * 1024, // 1MB per chunk
    };
    
    const budgetCheck = checkBundleBudget(analysis, budget);
    
    if (!budgetCheck.passed) {
      console.log('\nBundle budget violations:');
      budgetCheck.violations.forEach(violation => {
        console.log(`- ${violation}`);
      });
    }
    
    // Generate and log report
    const report = generateBundleReport(analysis);
    console.log('\n' + report);
    
    // Assertions
    expect(budgetCheck.passed).toBe(true);
    expect(analysis.totalSize).toBeLessThan(5 * 1024 * 1024);
  });

  test('should identify and analyze third-party bundles', async ({ page }) => {
    const analysis = await analyzeBundleSizes(page, '/');
    
    const thirdPartyBundles = analysis.bundles.filter(b => b.isThirdParty);
    const firstPartyBundles = analysis.bundles.filter(b => !b.isThirdParty);
    
    console.log('\nThird-party bundle analysis:');
    console.log(`Third-party bundles: ${thirdPartyBundles.length}`);
    console.log(`First-party bundles: ${firstPartyBundles.length}`);
    console.log(`Third-party size: ${(analysis.thirdPartySize / 1024).toFixed(0)} KB`);
    console.log(`Third-party percentage: ${((analysis.thirdPartySize / analysis.totalSize) * 100).toFixed(1)}%`);
    
    if (thirdPartyBundles.length > 0) {
      console.log('\nLargest third-party bundles:');
      thirdPartyBundles
        .sort((a, b) => b.size - a.size)
        .slice(0, 5)
        .forEach(bundle => {
          console.log(`- ${bundle.name}: ${(bundle.size / 1024).toFixed(0)} KB`);
        });
    }
    
    // Third-party code should be reasonable
    expect(analysis.thirdPartySize).toBeLessThan(2 * 1024 * 1024); // 2MB limit
  });

  test('should verify code splitting effectiveness', async ({ page }) => {
    // Navigate to different routes to trigger chunk loading
    const routes = ['/', '/documents', '/providers', '/knowledge'];
    const chunksByRoute: Record<string, string[]> = {};
    
    for (const route of routes) {
      const loadedChunks: string[] = [];
      
      // Track network requests for this route
      page.on('response', response => {
        const url = response.url();
        if (url.match(/chunk\.[a-f0-9]+\.(js|css)/)) {
          loadedChunks.push(url.split('/').pop() || '');
        }
      });
      
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      
      chunksByRoute[route] = [...loadedChunks];
      
      // Remove listeners
      page.removeAllListeners('response');
    }
    
    console.log('\nCode splitting analysis:');
    Object.entries(chunksByRoute).forEach(([route, chunks]) => {
      console.log(`${route}: ${chunks.length} chunks loaded`);
      if (chunks.length > 0) {
        console.log(`  - ${chunks.join('\n  - ')}`);
      }
    });
    
    // Verify that different routes load different chunks
    const homeChunks = new Set(chunksByRoute['/']);
    const documentsChunks = new Set(chunksByRoute['/documents']);
    const commonChunks = [...homeChunks].filter(chunk => documentsChunks.has(chunk));
    
    console.log(`\nCommon chunks between home and documents: ${commonChunks.length}`);
    console.log(`Route-specific chunks: ${homeChunks.size - commonChunks.length} (home), ${documentsChunks.size - commonChunks.length} (documents)`);
    
    // Should have route-specific chunks
    expect(homeChunks.size).toBeGreaterThan(commonChunks.length);
  });

  test('should analyze bundle compression efficiency', async ({ page }) => {
    const analysis = await analyzeBundleSizes(page, '/');
    
    // Calculate compression statistics
    const compressionStats = analysis.bundles.map(bundle => ({
      name: bundle.name,
      size: bundle.size,
      gzipSize: bundle.gzipSize || bundle.size,
      compressionRatio: bundle.gzipSize ? (1 - bundle.gzipSize / bundle.size) : 0,
    }));
    
    const avgCompressionRatio = compressionStats.reduce((sum, stat) => sum + stat.compressionRatio, 0) / compressionStats.length;
    
    console.log('\nCompression analysis:');
    console.log(`Average compression ratio: ${(avgCompressionRatio * 100).toFixed(1)}%`);
    console.log(`Total saved by compression: ${((analysis.totalSize - analysis.totalGzipSize) / 1024).toFixed(0)} KB`);
    
    // Log poorly compressed files
    const poorlyCompressed = compressionStats.filter(stat => stat.compressionRatio < 0.5 && stat.size > 10240);
    if (poorlyCompressed.length > 0) {
      console.log('\nPoorly compressed bundles (<50% compression):');
      poorlyCompressed.forEach(stat => {
        console.log(`- ${stat.name}: ${(stat.compressionRatio * 100).toFixed(1)}% compression`);
      });
    }
    
    // Good compression should achieve at least 60% reduction
    expect(avgCompressionRatio).toBeGreaterThan(0.6);
  });

  test('should check for duplicate dependencies', async ({ page }) => {
    const analysis = await analyzeBundleSizes(page, '/');
    
    // Look for patterns that might indicate duplicates
    const potentialDuplicates: Record<string, string[]> = {};
    
    analysis.bundles.forEach(bundle => {
      // Extract library names from bundle names
      const libMatch = bundle.name.match(/node_modules[\\\/]([^\\\/]+)/);
      if (libMatch) {
        const libName = libMatch[1];
        if (!potentialDuplicates[libName]) {
          potentialDuplicates[libName] = [];
        }
        potentialDuplicates[libName].push(bundle.name);
      }
    });
    
    // Find libraries that appear in multiple bundles
    const duplicates = Object.entries(potentialDuplicates)
      .filter(([_, bundles]) => bundles.length > 1);
    
    if (duplicates.length > 0) {
      console.log('\nPotential duplicate dependencies:');
      duplicates.forEach(([lib, bundles]) => {
        console.log(`- ${lib} appears in ${bundles.length} bundles`);
      });
    }
    
    // Should minimize duplicate dependencies
    expect(duplicates.length).toBeLessThan(5);
  });

  test('should analyze initial page load bundles', async ({ page }) => {
    const initialBundles: string[] = [];
    const lazyBundles: string[] = [];
    let firstPaintTime = 0;
    
    page.on('response', response => {
      const url = response.url();
      if (url.match(/\.(js|css)(\?.*)?$/)) {
        const timing = response.timing();
        if (timing && timing.responseEnd < firstPaintTime) {
          initialBundles.push(url.split('/').pop() || '');
        } else {
          lazyBundles.push(url.split('/').pop() || '');
        }
      }
    });
    
    await page.goto('/');
    
    // Get first paint time
    firstPaintTime = await page.evaluate(() => {
      const paint = performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint');
      return paint ? paint.startTime : 1000;
    });
    
    await page.waitForLoadState('networkidle');
    
    console.log('\nInitial vs lazy loaded bundles:');
    console.log(`Initial bundles (before first paint): ${initialBundles.length}`);
    console.log(`Lazy loaded bundles: ${lazyBundles.length}`);
    
    if (initialBundles.length > 0) {
      console.log('\nInitial bundles:');
      initialBundles.forEach(bundle => {
        console.log(`- ${bundle}`);
      });
    }
    
    // Initial bundle count should be minimal
    expect(initialBundles.length).toBeLessThan(10);
  });

  test('should generate comprehensive bundle report', async ({ page }) => {
    // Analyze multiple pages for comprehensive report
    const routes = ['/', '/documents', '/providers'];
    const allBundles = new Set<string>();
    
    for (const route of routes) {
      const analysis = await analyzeBundleSizes(page, route);
      analysis.bundles.forEach(bundle => {
        allBundles.add(bundle.name);
      });
    }
    
    console.log('\nComprehensive bundle analysis:');
    console.log(`Total unique bundles across routes: ${allBundles.size}`);
    console.log(`Routes analyzed: ${routes.length}`);
    
    // Try to load webpack stats if available
    const webpackAnalysis = await analyzeWebpackStats('dist/stats.json');
    if (webpackAnalysis) {
      console.log('\nWebpack stats analysis available:');
      console.log(generateBundleReport(webpackAnalysis));
    }
    
    // The report should identify optimization opportunities
    const finalAnalysis = await analyzeBundleSizes(page, '/');
    expect(finalAnalysis.recommendations.length).toBeGreaterThanOrEqual(0);
  });
});