#!/usr/bin/env node
/**
 * Weekly Test Report Generator
 * Analyzes test data from the past week and generates a comprehensive report
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Returns the ISO date strings for the start and end of the past 7-day period.
 * @return {{start: string, end: string}} An object with `start` and `end` properties representing the date range.
 */
function getWeekDates() {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return {
    start: weekAgo.toISOString().split('T')[0],
    end: now.toISOString().split('T')[0]
  };
}

/**
 * Reads and parses a JSON file from the specified path.
 * @param {string} filePath - Path to the JSON file.
 * @return {Object|null} The parsed JSON object, or null if reading or parsing fails.
 */
function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    return null;
  }
}

/**
 * Calculates the percentage change from a previous value to a current value.
 * @param {number} current - The current value.
 * @param {number} previous - The previous value to compare against.
 * @return {string|number} The percentage change rounded to one decimal place, or 0 if the previous value is missing or zero.
 */
function calculateTrend(current, previous) {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous * 100).toFixed(1);
}

/**
 * Aggregates weekly test metrics from test result summaries, coverage data, and flaky test reports.
 * 
 * Collects total test runs, total tests, passed and failed test counts, flaky test count, and coverage percentage from the past week. Calculates the overall pass rate as a percentage.
 * 
 * @returns {Object} An object containing totalRuns, totalTests, passedTests, failedTests, flakyTests, averageDuration, coveragePercent, and passRate.
 */
function collectTestMetrics() {
  const metrics = {
    totalRuns: 0,
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    flakyTests: 0,
    averageDuration: 0,
    coveragePercent: 0
  };

  // Read test results
  const resultsDir = path.join(process.cwd(), 'test-results');
  if (fs.existsSync(resultsDir)) {
    const files = fs.readdirSync(resultsDir)
      .filter(f => f.startsWith('daily-summary-') && f.endsWith('.json'));
    
    files.forEach(file => {
      const data = readJsonFile(path.join(resultsDir, file));
      if (data?.health) {
        metrics.totalRuns++;
        metrics.totalTests += data.health.unit_tests?.total || 0;
        metrics.passedTests += data.health.unit_tests?.passed || 0;
        metrics.failedTests += data.health.unit_tests?.failed || 0;
      }
    });
  }

  // Read coverage
  const coverage = readJsonFile('coverage/coverage-summary.json');
  if (coverage?.total) {
    metrics.coveragePercent = coverage.total.lines.pct;
  }

  // Read flaky tests
  const flakyReport = readJsonFile('test-results/flaky-tests.json');
  if (flakyReport) {
    metrics.flakyTests = flakyReport.flakyTests || 0;
  }

  // Calculate pass rate
  metrics.passRate = metrics.totalTests > 0 
    ? ((metrics.passedTests / metrics.totalTests) * 100).toFixed(1)
    : 0;

  return metrics;
}

/**
 * Collects and summarizes performance testing metrics from the performance report.
 * @return {Object|null} An object containing average metrics, any budget violations, and budget compliance status, or `null` if the report is unavailable.
 */
function collectPerformanceMetrics() {
  const perfReport = readJsonFile('test-results/performance/performance-report.json');
  if (!perfReport) return null;

  const metrics = perfReport.aggregated?.summary?.averageMetrics;
  const violations = perfReport.aggregated?.violations || [];

  return {
    metrics,
    violations,
    budgetCompliance: violations.length === 0
  };
}

/**
 * Collects CI run metrics from the past week using the GitHub CLI.
 *
 * Retrieves recent CI runs, filters them to include only those from the last 7 days, and calculates the total number of runs, success rate, failed runs, and average duration in minutes.
 * @returns {Object|null} An object containing CI metrics, or `null` if data could not be retrieved.
 */
function collectCIMetrics() {
  try {
    // Get CI runs from the past week
    const runs = JSON.parse(
      execSync('gh run list --limit 50 --json conclusion,createdAt,durationMs', { encoding: 'utf-8' })
    );

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekRuns = runs.filter(run => new Date(run.createdAt) > weekAgo);

    const successful = weekRuns.filter(r => r.conclusion === 'success').length;
    const failed = weekRuns.filter(r => r.conclusion === 'failure').length;
    const avgDuration = weekRuns.reduce((sum, r) => sum + (r.durationMs || 0), 0) / weekRuns.length / 1000 / 60;

    return {
      totalRuns: weekRuns.length,
      successRate: ((successful / weekRuns.length) * 100).toFixed(1),
      failedRuns: failed,
      averageDuration: avgDuration.toFixed(1)
    };
  } catch (error) {
    console.error('Could not fetch CI metrics:', error.message);
    return null;
  }
}

/**
 * Identifies issues in test, performance, and CI metrics based on predefined thresholds.
 *
 * Evaluates metrics for failing tests, low coverage, excessive flaky tests, performance budget violations, and high CI failure rates, returning a list of issue descriptions.
 *
 * @param {Object} metrics - Aggregated test metrics for the week.
 * @param {Object} [perfMetrics] - Performance metrics, including budget violations.
 * @param {Object} [ciMetrics] - CI metrics, including failed run counts.
 * @return {string[]} List of identified issue descriptions.
 */
function identifyIssues(metrics, perfMetrics, ciMetrics) {
  const issues = [];

  // Test failures
  if (metrics.failedTests > 0) {
    issues.push(`${metrics.failedTests} tests are consistently failing`);
  }

  // Coverage drop
  if (metrics.coveragePercent < 80) {
    issues.push(`Test coverage is below 80% (currently ${metrics.coveragePercent}%)`);
  }

  // Flaky tests
  if (metrics.flakyTests > 5) {
    issues.push(`${metrics.flakyTests} flaky tests detected - reliability concern`);
  }

  // Performance violations
  if (perfMetrics?.violations?.length > 0) {
    issues.push(`${perfMetrics.violations.length} performance budget violations`);
  }

  // CI failures
  if (ciMetrics?.failedRuns > 5) {
    issues.push(`High CI failure rate: ${ciMetrics.failedRuns} failed runs this week`);
  }

  return issues;
}

/**
 * Generates a Markdown-formatted weekly test report summarizing test, CI/CD, and performance metrics.
 * 
 * The report includes tables for test metrics, CI/CD performance, and performance testing results, as well as lists of identified issues, improvements, and recommended actions. It conditionally displays sections based on the availability of CI and performance data, and provides placeholders for historical trends and the next report due date.
 * 
 * @param {Object} data - The aggregated report data, including week dates, metrics, performance metrics, CI metrics, issues, and improvements.
 * @return {string} The complete Markdown report as a string.
 */
function generateMarkdownReport(data) {
  const { week, metrics, perfMetrics, ciMetrics, issues, improvements } = data;

  return `# Weekly Test Report - Week of ${week.start}

Generated: ${new Date().toLocaleString()}

## 📊 Test Metrics

| Metric | Value | Trend |
|--------|-------|-------|
| Total Test Runs | ${metrics.totalRuns} | - |
| Total Tests | ${metrics.totalTests} | - |
| Pass Rate | ${metrics.passRate}% | - |
| Coverage | ${metrics.coveragePercent}% | - |
| Flaky Tests | ${metrics.flakyTests} | - |

## 🚀 CI/CD Performance

${ciMetrics ? `
| Metric | Value |
|--------|-------|
| Total Runs | ${ciMetrics.totalRuns} |
| Success Rate | ${ciMetrics.successRate}% |
| Failed Runs | ${ciMetrics.failedRuns} |
| Avg Duration | ${ciMetrics.averageDuration} min |
` : 'CI metrics not available'}

## 🎯 Performance Testing

${perfMetrics ? `
### Core Web Vitals (Average)
| Metric | Value | Budget | Status |
|--------|-------|--------|--------|
| FCP | ${perfMetrics.metrics.FCP}ms | 1800ms | ${perfMetrics.metrics.FCP <= 1800 ? '✅' : '❌'} |
| LCP | ${perfMetrics.metrics.LCP}ms | 2500ms | ${perfMetrics.metrics.LCP <= 2500 ? '✅' : '❌'} |
| TTI | ${perfMetrics.metrics.TTI}ms | 3800ms | ${perfMetrics.metrics.TTI <= 3800 ? '✅' : '❌'} |
| CLS | ${perfMetrics.metrics.CLS} | 0.1 | ${perfMetrics.metrics.CLS <= 0.1 ? '✅' : '❌'} |

${perfMetrics.violations.length > 0 ? `
### ⚠️ Performance Violations
${perfMetrics.violations.map(v => `- ${v.page}: ${v.metric} exceeded budget`).join('\n')}
` : '✅ All performance metrics within budget'}
` : 'Performance metrics not available'}

## 🔴 Issues Identified

${issues.length > 0 ? issues.map(issue => `- ${issue}`).join('\n') : '✅ No critical issues identified'}

## 💚 Improvements

${improvements.length > 0 ? improvements.map(imp => `- ${imp}`).join('\n') : 'No significant improvements to report'}

## 📋 Recommended Actions

1. **Immediate Actions:**
   ${issues.length > 0 ? issues.slice(0, 3).map((issue, i) => `- Address: ${issue}`).join('\n   ') : '- Continue monitoring test health'}

2. **This Week's Focus:**
   - Review and fix any flaky tests
   - Improve coverage for files below 70%
   - Optimize slow-running tests

3. **Long-term Goals:**
   - Maintain test coverage above 85%
   - Keep CI success rate above 95%
   - Reduce average test duration

## 📈 Historical Trends

\`\`\`
Week-over-week changes:
- Test Count: [Track manually]
- Coverage: [Track manually]
- CI Duration: [Track manually]
\`\`\`

---

*Next report due: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}*
`;
}

/**
 * Generates a comprehensive weekly test report by aggregating test, performance, and CI metrics from the past week.
 *
 * Collects data from test result files, coverage summaries, performance reports, and CI run history. Identifies issues based on predefined thresholds, generates a Markdown and JSON report, saves them to the reports directory, and prints a summary to the console.
 *
 * @returns {Object} The complete report data object containing week dates, metrics, performance metrics, CI metrics, identified issues, and improvements.
 */
function generateWeeklyReport() {
  console.log('📊 Generating Weekly Test Report...\n');

  const week = getWeekDates();
  const metrics = collectTestMetrics();
  const perfMetrics = collectPerformanceMetrics();
  const ciMetrics = collectCIMetrics();
  
  // Analyze data
  const issues = identifyIssues(metrics, perfMetrics, ciMetrics);
  const improvements = []; // TODO: Compare with previous week

  // Generate report
  const reportData = {
    week,
    metrics,
    perfMetrics,
    ciMetrics,
    issues,
    improvements
  };

  const markdown = generateMarkdownReport(reportData);

  // Save report
  const reportsDir = path.join(process.cwd(), 'test-results', 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const filename = `weekly-report-${week.end}.md`;
  const filepath = path.join(reportsDir, filename);
  
  fs.writeFileSync(filepath, markdown);
  console.log(`✅ Report saved to: ${filepath}`);

  // Also save JSON data
  const jsonPath = path.join(reportsDir, `weekly-report-${week.end}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(reportData, null, 2));

  // Print summary
  console.log('\n📋 Summary:');
  console.log(`- Test Pass Rate: ${metrics.passRate}%`);
  console.log(`- Coverage: ${metrics.coveragePercent}%`);
  console.log(`- Issues Found: ${issues.length}`);
  
  if (issues.length > 0) {
    console.log('\n⚠️  Action Required:');
    issues.forEach(issue => console.log(`  - ${issue}`));
  }

  return reportData;
}

// Run if called directly
if (require.main === module) {
  generateWeeklyReport();
}

module.exports = { generateWeeklyReport };