# Performance Testing Guide

## Overview

This guide covers the performance testing infrastructure for the WCINYP application, including Web Vitals measurement, performance budgets, and continuous monitoring.

## Table of Contents

- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Running Performance Tests](#running-performance-tests)
- [Performance Budgets](#performance-budgets)
- [Analyzing Results](#analyzing-results)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Quick Start

### Run All Performance Tests
```bash
npm run test:performance
```

### Run Specific Profile
```bash
# Desktop only
npm run test:perf

# Mobile only
npm run test:perf:mobile

# Slow network (3G)
npm run test:perf:slow
```

### Generate Report
```bash
npm run perf:generate-report -- --trends
```

### Update Baseline
```bash
npm run perf:baseline
```

## Architecture

### Core Components

1. **Performance Helpers** (`tests/e2e/performance/utils/performance-helpers.ts`)
   - Web Vitals measurement using Performance Observer API
   - Resource timing collection
   - Page load detection

2. **Network Emulation** (`tests/e2e/performance/utils/network-emulation.ts`)
   - Simulates different network conditions
   - CPU throttling for mobile devices
   - Uses Chrome DevTools Protocol

3. **Bundle Analyzer** (`tests/e2e/performance/utils/bundle-analyzer.ts`)
   - Analyzes JavaScript bundle sizes
   - Tracks third-party scripts
   - Code splitting effectiveness

4. **Performance Reporter** (`tests/e2e/performance/utils/performance-reporter.ts`)
   - Generates JSON, HTML, and CSV reports
   - Aggregates metrics across tests
   - Creates interactive dashboards

5. **Trend Analyzer** (`tests/e2e/performance/utils/trend-analyzer.ts`)
   - Historical data tracking
   - Regression detection
   - Performance forecasting

### Test Structure

```
tests/e2e/performance/
├── utils/                    # Helper utilities
├── budgets/                  # Performance budget configs
├── homepage-perf.spec.ts     # Homepage tests
├── fumadocs-perf.spec.ts     # Documentation tests
├── search-perf.spec.ts       # Search functionality
├── auth-perf.spec.ts         # Authentication flow
├── resource-loading.spec.ts  # Resource analysis
├── advanced-perf.spec.ts     # JS execution metrics
├── memory-usage.spec.ts      # Memory profiling
└── reporting.spec.ts         # Report generation tests
```

## Running Performance Tests

### Basic Usage

```bash
# Run all performance tests with report
./scripts/run-performance-tests.sh

# Run specific profile without report
./scripts/run-performance-tests.sh --profile desktop --no-report

# Run in headed mode for debugging
./scripts/run-performance-tests.sh --headed

# Update baseline after tests
./scripts/run-performance-tests.sh --update-baseline
```

### Environment-Specific Commands

#### Local Development
```bash
# Quick check without report
npm run perf:check

# Debug specific test
npm run test:perf:debug

# With trace collection
npm run test:perf:trace
```

#### CI Environment
```bash
# Automated CI run
npm run test:performance:ci

# GitHub Actions will automatically:
# - Install browsers
# - Run all profiles
# - Compare against baseline
# - Upload artifacts
# - Comment on PRs
```

## Performance Budgets

### Global Budgets

Located in `performance-budgets.json`:

```json
{
  "global": {
    "FCP": { "target": 1200, "max": 1800 },
    "LCP": { "target": 2000, "max": 2500 },
    "TTI": { "target": 3000, "max": 3800 },
    "TBT": { "target": 100, "max": 200 },
    "CLS": { "target": 0.05, "max": 0.1 },
    "INP": { "target": 150, "max": 200 },
    "TTFB": { "target": 500, "max": 800 }
  }
}
```

### Device-Specific Budgets

- **Desktop**: Stricter thresholds (`budgets/desktop-budgets.json`)
- **Mobile**: Relaxed thresholds (`budgets/mobile-budgets.json`)
- **Network-based**: 3G, 4G, WiFi specific targets

### Page-Specific Budgets

```json
{
  "pages": {
    "/": { "LCP": { "max": 2000 } },
    "/documents": { "TTI": { "max": 4000 } },
    "/knowledge": { "FCP": { "max": 1500 } }
  }
}
```

## Analyzing Results

### Performance Dashboard

After running tests, open the HTML dashboard:

```bash
open test-results/performance/performance-dashboard.html
```

The dashboard includes:
- Web Vitals overview with charts
- Performance by page breakdown
- Device comparison (radar chart)
- Percentile analysis (P50, P75, P90, P95)
- Budget violation alerts

### Trend Analysis

```bash
# Generate report with 7-day trends
npm run perf:generate-report:trends

# Check for regressions
node -e "
const analyzer = require('./tests/e2e/performance/utils/trend-analyzer');
const trends = analyzer.analyzeTrends('/', 'desktop', 7);
console.log(trends);
"
```

### Understanding Metrics

See [WEB_VITALS_GUIDE.md](./WEB_VITALS_GUIDE.md) for detailed metric explanations.

Quick reference:
- **FCP** < 1.8s (First Contentful Paint)
- **LCP** < 2.5s (Largest Contentful Paint)
- **TTI** < 3.8s (Time to Interactive)
- **TBT** < 200ms (Total Blocking Time)
- **CLS** < 0.1 (Cumulative Layout Shift)
- **INP** < 200ms (Interaction to Next Paint)

## CI/CD Integration

### GitHub Actions

The workflow (`.github/workflows/performance.yml`) runs on:
- Pull requests
- Pushes to main
- Daily schedule
- Manual trigger

Features:
- Baseline comparison
- PR comments with results
- Artifact storage
- Lighthouse integration

### Netlify Integration

Add to `netlify.toml`:

```toml
[[plugins]]
  package = "@netlify/plugin-lighthouse"
  
  [plugins.inputs]
    output_path = "reports/lighthouse.html"
    
  [plugins.inputs.thresholds]
    performance = 0.9
    accessibility = 0.9
    best-practices = 0.9
    seo = 0.9
```

## Troubleshooting

### Common Issues

#### Tests Timing Out
```bash
# Increase timeout in playwright.config.ts
timeout: 60000  # 60 seconds

# Or use debug mode
PWDEBUG=1 npm run test:perf
```

#### Flaky Metrics
```javascript
// Add retry logic in test
test.describe.configure({ retries: 2 });

// Wait for stable metrics
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1000); // Allow CLS to settle
```

#### Memory Leaks
```javascript
// Enable memory profiling
const memory = await page.evaluate(() => performance.memory);
console.log('Heap size:', memory.usedJSHeapSize);
```

#### Network Emulation Not Working
```bash
# Ensure Chrome flags are set
--enable-precise-memory-info
--disable-dev-shm-usage
```

### Debug Commands

```bash
# Verbose logging
DEBUG=pw:api npm run test:perf

# Save trace
npm run test:perf:trace

# View trace
npx playwright show-trace trace.zip

# Check browser console
page.on('console', msg => console.log(msg.text()));
```

## Best Practices

### 1. Test Isolation

```javascript
test.beforeEach(async ({ page }) => {
  // Clear cache and cookies
  await page.context().clearCookies();
  await page.context().clearPermissions();
});
```

### 2. Stable Measurements

```javascript
// Wait for all resources
await waitForPageLoad(page);

// Multiple samples
const samples = [];
for (let i = 0; i < 3; i++) {
  await page.reload();
  const metrics = await capturePerformanceMetrics(page);
  samples.push(metrics);
}
const avgMetrics = calculateAverage(samples);
```

### 3. Real User Monitoring

```javascript
// Add RUM to production
import { onCLS, onFCP, onLCP } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    metric_id: metric.id,
  });
}

onCLS(sendToAnalytics);
onFCP(sendToAnalytics);
onLCP(sendToAnalytics);
```

### 4. Performance Budget Enforcement

```javascript
// In your test
const budget = await loadBudget(page.url(), device);
Object.entries(metrics).forEach(([metric, value]) => {
  const threshold = budget[metric]?.max;
  expect(value).toBeLessThanOrEqual(threshold);
});
```

### 5. Progressive Enhancement

```javascript
// Test with JavaScript disabled
await page.setJavaScriptEnabled(false);
await page.goto('/');
// Ensure critical content still loads
```

## Example Test Patterns

### Basic Performance Test

```javascript
test('homepage performance', async ({ page }) => {
  await page.goto('/');
  await waitForPageLoad(page);
  
  const metrics = await capturePerformanceMetrics(page);
  const budget = await loadBudget('/', 'desktop');
  
  assertBudget(metrics, budget);
});
```

### Network Condition Test

```javascript
test('3G performance', async ({ page }) => {
  await throttleNetwork(page, '3G');
  await page.goto('/documents');
  
  const metrics = await capturePerformanceMetrics(page);
  expect(metrics.LCP).toBeLessThan(4000); // Relaxed for 3G
});
```

### Resource Analysis

```javascript
test('bundle size analysis', async ({ page }) => {
  await page.goto('/');
  const analysis = await analyzeBundleSizes(page);
  
  expect(analysis.totalSize).toBeLessThan(500 * 1024); // 500KB
  expect(analysis.thirdPartySize).toBeLessThan(100 * 1024); // 100KB
});
```

### Memory Profiling

```javascript
test('memory usage', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Memory API only in Chrome');
  
  const profile = await profileMemoryUsage(page, async () => {
    // Perform actions
    await page.click('[data-testid="open-modal"]');
    await page.click('[data-testid="close-modal"]');
  });
  
  expect(profile.leaks).toBe(false);
});
```

## Next Steps

1. **Set up monitoring**: Integrate with DataDog, New Relic, or similar
2. **Add custom metrics**: Track business-specific performance indicators
3. **Implement A/B testing**: Compare performance impact of features
4. **Create performance dashboard**: Real-time monitoring interface
5. **Automate optimization**: Auto-generate performance PRs

For more information on Web Vitals, see [WEB_VITALS_GUIDE.md](./WEB_VITALS_GUIDE.md).