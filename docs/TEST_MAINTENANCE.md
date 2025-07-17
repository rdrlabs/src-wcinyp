# Test Maintenance Guide

## Overview

This guide outlines the daily, weekly, and monthly tasks required to maintain a healthy test suite for the WCINYP application. Following these practices ensures reliable tests, fast CI/CD pipelines, and early detection of issues.

## Table of Contents

- [Daily Tasks](#daily-tasks)
- [Weekly Review Process](#weekly-review-process)
- [Monthly Audit Checklist](#monthly-audit-checklist)
- [Troubleshooting Guide](#troubleshooting-guide)
- [Best Practices](#best-practices)
- [Emergency Procedures](#emergency-procedures)

## Daily Tasks

### 1. Monitor CI Dashboard (5-10 minutes)

**Morning Check:**
```bash
# Check CI status
gh run list --limit 10

# View failed runs
gh run list --status failure --limit 5
```

**Actions:**
- Review any failed builds from overnight
- Check for patterns in failures
- Re-run flaky tests if needed

### 2. Review Test Results (10-15 minutes)

**Check test health:**
```bash
# Run flaky test detection
npm run test:flaky

# View recent test trends
cat test-results/summary.json | jq '.failed, .flaky'
```

**Key metrics to monitor:**
- Test pass rate (should be > 95%)
- Average test duration
- Number of flaky tests
- New test failures

### 3. Triage New Failures (15-30 minutes)

**For each failure:**
1. Check if it's environment-specific
2. Verify if it's a flaky test
3. Determine if it's a regression
4. Create or update issue

**Quick triage template:**
```markdown
## Test Failure: [Test Name]

**First seen:** [Date]
**Frequency:** [Once/Intermittent/Consistent]
**Environment:** [Local/CI/Specific Browser]

**Error:**
```
[Error message]
```

**Suspected cause:**
- [ ] Recent code change
- [ ] Infrastructure issue
- [ ] Test needs update
- [ ] Flaky test

**Action:** [Fix/Investigate/Monitor]
```

### 4. Update Test Status Board (5 minutes)

Maintain a test health dashboard:
```bash
# Generate daily report
node scripts/generate-test-report.js --daily

# Update status in README or dashboard
echo "Test Health: $(date +%Y-%m-%d)" >> test-health.log
echo "- Pass Rate: X%" >> test-health.log
echo "- Flaky Tests: Y" >> test-health.log
```

## Weekly Review Process

### Monday: Test Coverage Review (30 minutes)

```bash
# Generate coverage report
npm run test:coverage

# Check coverage trends
git diff HEAD~7 coverage/coverage-summary.json
```

**Review checklist:**
- [ ] Overall coverage > 80%
- [ ] No files below 70% coverage
- [ ] New code has tests
- [ ] Critical paths have 90%+ coverage

**Coverage improvement template:**
```markdown
## Coverage Improvement Plan - Week [X]

### Low Coverage Files:
1. `src/components/X.tsx` - Current: 45%, Target: 80%
   - Missing: Error cases, edge conditions
   - Owner: @developer
   - Due: [Date]

### Action Items:
- [ ] Add tests for error boundaries
- [ ] Cover authentication edge cases
- [ ] Test loading states
```

### Wednesday: Performance Check (45 minutes)

```bash
# Run performance tests
npm run test:perf:all

# Compare with baseline
npm run perf:generate-report -- --trends
```

**Performance checklist:**
- [ ] All metrics within budget
- [ ] No regression > 10%
- [ ] Bundle size stable
- [ ] Memory usage normal

**If regressions found:**
1. Identify the commit that introduced it
2. Run bisect if needed
3. Create high-priority issue
4. Consider reverting if critical

### Friday: Test Suite Optimization (1 hour)

**1. Analyze slow tests:**
```bash
# Find slowest tests
npx playwright test --reporter=json | jq '.suites[].specs[] | select(.duration > 5000)'

# Profile test execution
time npm run test:parallel
```

**2. Clean up obsolete tests:**
```bash
# Find unused test utilities
npm run lint -- --rule unused-imports

# Check for duplicate tests
grep -r "test\|it\|describe" tests/ | sort | uniq -d
```

**3. Update flaky test list:**
```javascript
// tests/e2e/flaky-tests.json
{
  "knownFlaky": [
    {
      "test": "search functionality > autocomplete",
      "reason": "Race condition with debounce",
      "tracking": "ISSUE-123",
      "retries": 3
    }
  ]
}
```

## Monthly Audit Checklist

### First Monday of Month: Comprehensive Audit (2-3 hours)

#### 1. Test Infrastructure Health

```bash
# Update dependencies
npm outdated
npm audit

# Update Playwright
npm update @playwright/test
npx playwright install
```

**Checklist:**
- [ ] All dependencies up to date
- [ ] No security vulnerabilities
- [ ] Playwright browsers current
- [ ] CI images updated

#### 2. Test Data Management

```bash
# Clean old test artifacts
find test-results -mtime +30 -delete

# Archive performance baselines
tar -czf baselines-$(date +%Y%m).tar.gz performance-baselines/
```

**Data checklist:**
- [ ] Remove old screenshots
- [ ] Archive test reports
- [ ] Update test fixtures
- [ ] Refresh test databases

#### 3. Documentation Review

**Update these documents:**
- [ ] Test strategy document
- [ ] Onboarding guide for tests
- [ ] CI/CD documentation
- [ ] Known issues list

#### 4. Metrics and Reporting

Generate monthly report:
```markdown
# Test Health Report - [Month Year]

## Executive Summary
- Total Tests: X
- Pass Rate: Y%
- Average Duration: Z minutes
- Flaky Test Count: N

## Trends
- Coverage: ↑ 2% from last month
- Performance: ↓ 5% slower (investigating)
- Reliability: ↑ Fewer flaky tests

## Achievements
- Reduced CI time by 30%
- Added 50 new tests
- Fixed 10 flaky tests

## Action Items for Next Month
1. Improve auth test coverage
2. Optimize slow visual tests
3. Implement mutation testing
```

### Test Inventory Audit

```bash
# Count tests by type
echo "Unit tests: $(find src -name "*.test.ts*" | wc -l)"
echo "E2E tests: $(find tests/e2e -name "*.spec.ts" | wc -l)"
echo "Visual tests: $(find tests/e2e/visual -name "*.spec.ts" | wc -l)"

# Find tests without assertions
grep -r "test\|it" tests/ | grep -v "expect\|assert"
```

### Cost Analysis

Monitor CI costs:
```bash
# GitHub Actions minutes used
gh api /repos/${GITHUB_REPOSITORY}/actions/runners

# Artifact storage
du -sh .github/workflows/artifacts/
```

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. Sudden Test Failures After Deploy

```bash
# Quick diagnosis
git diff HEAD~1 -- src/ tests/
npm run test:parallel

# Rollback if critical
git revert HEAD
npm run build && npm test
```

#### 2. CI Timeout Issues

**Symptoms:** Tests pass locally but timeout in CI

**Solutions:**
```javascript
// Increase specific test timeout
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 1 minute
  // test code
});

// Add wait conditions
await page.waitForLoadState('networkidle');
await page.waitForSelector('.content', { state: 'visible' });
```

#### 3. Flaky Visual Tests

**Symptoms:** Visual tests fail intermittently

**Solutions:**
```javascript
// Add stability wait
await page.evaluate(() => {
  // Wait for fonts
  return document.fonts.ready;
});

// Disable animations
await page.addStyleTag({
  content: `
    *, *::before, *::after {
      animation-duration: 0s !important;
      transition-duration: 0s !important;
    }
  `
});
```

#### 4. Memory Leaks in Tests

**Detection:**
```bash
# Monitor memory usage
NODE_OPTIONS="--max-old-space-size=4096" npm test

# Profile specific test
node --inspect npm test -- --grep "memory intensive"
```

**Solutions:**
```javascript
test.afterEach(async ({ page }) => {
  // Clean up event listeners
  await page.evaluate(() => {
    window.removeAllEventListeners?.();
  });
  
  // Clear storage
  await page.context().clearCookies();
  await page.context().clearPermissions();
});
```

### Emergency Procedures

#### All Tests Failing

1. **Check infrastructure:**
   ```bash
   # Verify test server is running
   curl http://localhost:3000/health
   
   # Check disk space
   df -h
   
   # Check process limits
   ulimit -a
   ```

2. **Emergency skip:**
   ```javascript
   // Temporarily skip failing suite
   test.describe.skip('Broken suite', () => {
     // tests
   });
   ```

3. **Rollback strategy:**
   ```bash
   # Find last working commit
   git bisect start
   git bisect bad HEAD
   git bisect good HEAD~20
   npm test
   ```

#### CI Pipeline Blocked

1. **Quick unblock:**
   ```yaml
   # .github/workflows/test.yml
   continue-on-error: true  # Temporary!
   ```

2. **Parallel investigation:**
   - Create hotfix branch
   - Disable failing tests
   - Deploy fix
   - Investigate root cause

## Best Practices

### 1. Test Hygiene

- **Name tests clearly:** `should [do something] when [condition]`
- **One assertion per test** when possible
- **Use data-testid** for reliable selectors
- **Clean up after tests** (data, files, state)

### 2. Performance

- **Parallelize everything:** Use sharding and workers
- **Reuse contexts:** Share browser contexts when safe
- **Mock external services:** Avoid network calls
- **Use test.step():** For better debugging

### 3. Reliability

- **Explicit waits:** Never use arbitrary timeouts
- **Retry mechanisms:** For known flaky operations
- **Deterministic data:** Use fixed seeds for random data
- **Isolated tests:** No dependencies between tests

### 4. Maintenance

- **Regular updates:** Keep dependencies current
- **Prune dead code:** Remove unused tests/utilities
- **Document patterns:** Share knowledge in team
- **Monitor metrics:** Track trends over time

## Automation Scripts

### Daily Health Check
```bash
#!/bin/bash
# daily-test-health.sh

echo "=== Daily Test Health Check ==="
date

# Run quick test suite
npm run test:ci:fast

# Check for flaky tests
npm run test:flaky

# Generate summary
node << EOF
const results = require('./test-results/summary.json');
console.log(\`Pass rate: \${(results.passed/results.total*100).toFixed(1)}%\`);
console.log(\`Duration: \${(results.duration/1000/60).toFixed(1)} minutes\`);
console.log(\`Flaky tests: \${results.flaky || 0}\`);
EOF
```

### Weekly Report Generator
```javascript
// scripts/weekly-test-report.js
const fs = require('fs');
const path = require('path');

function generateWeeklyReport() {
  const report = {
    week: new Date().toISOString().split('T')[0],
    metrics: {
      totalRuns: 0,
      passRate: 0,
      averageDuration: 0,
      flakyTests: [],
      slowestTests: []
    },
    improvements: [],
    issues: []
  };
  
  // Analyze test results from the week
  // ... implementation
  
  // Generate markdown report
  const markdown = `# Weekly Test Report - ${report.week}
  
## Metrics
- Total test runs: ${report.metrics.totalRuns}
- Pass rate: ${report.metrics.passRate}%
- Average duration: ${report.metrics.averageDuration} minutes

## Issues
${report.issues.map(i => `- ${i}`).join('\n')}

## Improvements
${report.improvements.map(i => `- ${i}`).join('\n')}
`;
  
  fs.writeFileSync(`reports/weekly-${report.week}.md`, markdown);
}
```

## Resources

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Test Automation Patterns](https://testautomationpatterns.org)
- [CI/CD Optimization Guide](../CI_OPTIMIZATION.md)
- [Performance Testing Guide](./PERFORMANCE_TESTING.md)

---

**Remember:** A well-maintained test suite is a reliable test suite. Invest time in maintenance to save time on debugging!