import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export interface BundleInfo {
  name: string;
  size: number;
  gzipSize?: number;
  parseTime?: number;
  url: string;
  type: 'js' | 'css' | 'other';
  isThirdParty: boolean;
  chunks?: string[];
}

export interface BundleAnalysis {
  totalSize: number;
  totalGzipSize: number;
  jsSize: number;
  cssSize: number;
  bundles: BundleInfo[];
  thirdPartySize: number;
  chunkGroups: Record<string, BundleInfo[]>;
  recommendations: string[];
}

/**
 * Analyze bundle sizes from network requests
 */
export async function analyzeBundleSizes(page: Page, baseUrl: string): Promise<BundleAnalysis> {
  const bundles: BundleInfo[] = [];
  const firstPartyDomains = [new URL(baseUrl).hostname, 'localhost', '127.0.0.1'];
  
  // Intercept responses to collect bundle information
  const responseHandler = async (response: any) => {
    const url = response.url();
    const request = response.request();
    
    // Only analyze JS and CSS files
    if (!url.match(/\.(js|css|mjs)(\?.*)?$/)) {
      return;
    }
    
    const headers = response.headers();
    const size = parseInt(headers['content-length'] || '0');
    const contentEncoding = headers['content-encoding'];
    const isThirdParty = !firstPartyDomains.some(domain => url.includes(domain));
    
    // Determine actual size and gzip size
    let actualSize = size;
    let gzipSize = size;
    
    if (contentEncoding === 'gzip' || contentEncoding === 'br') {
      // The content-length is already the compressed size
      gzipSize = size;
      // Try to get uncompressed size from response
      try {
        const buffer = await response.body();
        actualSize = buffer.length;
      } catch {
        // Estimate uncompressed size (rough approximation)
        actualSize = size * 3;
      }
    }
    
    const bundleInfo: BundleInfo = {
      name: url.split('/').pop()?.split('?')[0] || 'unknown',
      size: actualSize,
      gzipSize: gzipSize,
      url: url,
      type: url.endsWith('.css') ? 'css' : 'js',
      isThirdParty,
    };
    
    // Extract chunk information from filename
    const chunkMatch = url.match(/chunk\.([a-f0-9]+)\./);
    if (chunkMatch) {
      bundleInfo.chunks = [chunkMatch[1]];
    }
    
    bundles.push(bundleInfo);
  };
  
  page.on('response', responseHandler);
  
  // Navigate and wait for all resources to load
  await page.goto(baseUrl);
  await page.waitForLoadState('networkidle');
  
  // Remove listener
  page.off('response', responseHandler);
  
  // Analyze the collected bundles
  return performBundleAnalysis(bundles);
}

/**
 * Analyze webpack stats JSON if available
 */
export async function analyzeWebpackStats(statsPath: string): Promise<BundleAnalysis | null> {
  if (!fs.existsSync(statsPath)) {
    return null;
  }
  
  try {
    const stats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));
    const bundles: BundleInfo[] = [];
    
    // Extract bundle information from webpack stats
    if (stats.assets) {
      stats.assets.forEach((asset: any) => {
        if (asset.name.match(/\.(js|css)$/)) {
          bundles.push({
            name: asset.name,
            size: asset.size,
            gzipSize: asset.gzipSize,
            url: `/${asset.name}`,
            type: asset.name.endsWith('.css') ? 'css' : 'js',
            isThirdParty: false,
            chunks: asset.chunks,
          });
        }
      });
    }
    
    return performBundleAnalysis(bundles);
  } catch (error) {
    console.error('Failed to analyze webpack stats:', error);
    return null;
  }
}

/**
 * Perform analysis on collected bundle data
 */
function performBundleAnalysis(bundles: BundleInfo[]): BundleAnalysis {
  const analysis: BundleAnalysis = {
    totalSize: 0,
    totalGzipSize: 0,
    jsSize: 0,
    cssSize: 0,
    bundles: bundles.sort((a, b) => b.size - a.size),
    thirdPartySize: 0,
    chunkGroups: {},
    recommendations: [],
  };
  
  // Calculate totals
  bundles.forEach(bundle => {
    analysis.totalSize += bundle.size;
    analysis.totalGzipSize += bundle.gzipSize || bundle.size;
    
    if (bundle.type === 'js') {
      analysis.jsSize += bundle.size;
    } else if (bundle.type === 'css') {
      analysis.cssSize += bundle.size;
    }
    
    if (bundle.isThirdParty) {
      analysis.thirdPartySize += bundle.size;
    }
    
    // Group by chunk
    if (bundle.chunks) {
      bundle.chunks.forEach(chunk => {
        if (!analysis.chunkGroups[chunk]) {
          analysis.chunkGroups[chunk] = [];
        }
        analysis.chunkGroups[chunk].push(bundle);
      });
    }
  });
  
  // Generate recommendations
  analysis.recommendations = generateBundleRecommendations(analysis);
  
  return analysis;
}

/**
 * Generate recommendations based on bundle analysis
 */
function generateBundleRecommendations(analysis: BundleAnalysis): string[] {
  const recommendations: string[] = [];
  
  // Check total bundle size
  if (analysis.totalSize > 5 * 1024 * 1024) {
    recommendations.push(`Total bundle size (${(analysis.totalSize / 1024 / 1024).toFixed(2)} MB) exceeds 5MB. Consider code splitting.`);
  }
  
  // Check individual bundle sizes
  const largeBundles = analysis.bundles.filter(b => b.size > 1024 * 1024);
  if (largeBundles.length > 0) {
    recommendations.push(`${largeBundles.length} bundles exceed 1MB. Consider splitting: ${largeBundles.map(b => b.name).join(', ')}`);
  }
  
  // Check compression
  const compressionRatio = analysis.totalGzipSize / analysis.totalSize;
  if (compressionRatio > 0.4) {
    recommendations.push(`Poor compression ratio (${(compressionRatio * 100).toFixed(1)}%). Ensure gzip/brotli is enabled.`);
  }
  
  // Check third-party size
  const thirdPartyRatio = analysis.thirdPartySize / analysis.totalSize;
  if (thirdPartyRatio > 0.5) {
    recommendations.push(`Third-party code accounts for ${(thirdPartyRatio * 100).toFixed(1)}% of bundle. Consider lazy loading.`);
  }
  
  // Check CSS size
  if (analysis.cssSize > 500 * 1024) {
    recommendations.push(`CSS bundle is large (${(analysis.cssSize / 1024).toFixed(0)} KB). Consider CSS purging.`);
  }
  
  // Check for duplicate chunks
  const chunkSizes = Object.entries(analysis.chunkGroups).map(([chunk, bundles]) => ({
    chunk,
    count: bundles.length,
    totalSize: bundles.reduce((sum, b) => sum + b.size, 0),
  }));
  
  const duplicateChunks = chunkSizes.filter(c => c.count > 1);
  if (duplicateChunks.length > 0) {
    recommendations.push(`Found ${duplicateChunks.length} chunks loaded multiple times. Check for duplicate imports.`);
  }
  
  return recommendations;
}

/**
 * Calculate bundle size budget status
 */
export function checkBundleBudget(
  analysis: BundleAnalysis,
  budget: {
    totalSize?: number;
    jsSize?: number;
    cssSize?: number;
    chunkSize?: number;
  }
): {
  passed: boolean;
  violations: string[];
} {
  const violations: string[] = [];
  
  if (budget.totalSize && analysis.totalSize > budget.totalSize) {
    violations.push(`Total size ${(analysis.totalSize / 1024).toFixed(0)} KB exceeds budget ${(budget.totalSize / 1024).toFixed(0)} KB`);
  }
  
  if (budget.jsSize && analysis.jsSize > budget.jsSize) {
    violations.push(`JS size ${(analysis.jsSize / 1024).toFixed(0)} KB exceeds budget ${(budget.jsSize / 1024).toFixed(0)} KB`);
  }
  
  if (budget.cssSize && analysis.cssSize > budget.cssSize) {
    violations.push(`CSS size ${(analysis.cssSize / 1024).toFixed(0)} KB exceeds budget ${(budget.cssSize / 1024).toFixed(0)} KB`);
  }
  
  if (budget.chunkSize) {
    const oversizedChunks = analysis.bundles.filter(b => b.size > budget.chunkSize!);
    if (oversizedChunks.length > 0) {
      violations.push(`${oversizedChunks.length} chunks exceed size budget of ${(budget.chunkSize / 1024).toFixed(0)} KB`);
    }
  }
  
  return {
    passed: violations.length === 0,
    violations,
  };
}

/**
 * Generate bundle size report
 */
export function generateBundleReport(analysis: BundleAnalysis): string {
  let report = '# Bundle Size Analysis Report\n\n';
  
  report += '## Summary\n';
  report += `- Total Size: ${(analysis.totalSize / 1024 / 1024).toFixed(2)} MB\n`;
  report += `- Gzipped Size: ${(analysis.totalGzipSize / 1024 / 1024).toFixed(2)} MB\n`;
  report += `- JS Size: ${(analysis.jsSize / 1024 / 1024).toFixed(2)} MB\n`;
  report += `- CSS Size: ${(analysis.cssSize / 1024).toFixed(0)} KB\n`;
  report += `- Third-party Size: ${(analysis.thirdPartySize / 1024).toFixed(0)} KB\n`;
  report += `- Compression Ratio: ${((1 - analysis.totalGzipSize / analysis.totalSize) * 100).toFixed(1)}%\n`;
  
  report += '\n## Largest Bundles\n';
  analysis.bundles.slice(0, 10).forEach((bundle, index) => {
    report += `${index + 1}. ${bundle.name}: ${(bundle.size / 1024).toFixed(0)} KB`;
    if (bundle.gzipSize) {
      report += ` (${(bundle.gzipSize / 1024).toFixed(0)} KB gzipped)`;
    }
    if (bundle.isThirdParty) {
      report += ' [third-party]';
    }
    report += '\n';
  });
  
  if (analysis.recommendations.length > 0) {
    report += '\n## Recommendations\n';
    analysis.recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
  }
  
  return report;
}