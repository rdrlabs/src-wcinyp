#!/usr/bin/env node
/**
 * Test Health Dashboard Generator
 * Creates an HTML dashboard with test metrics and trends
 */

const fs = require('fs');
const path = require('path');

function generateDashboardHTML(data) {
  const { metrics, trends, recentFailures, flakyTests } = data;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Health Dashboard - WCINYP</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: #f5f7fa;
            color: #333;
        }
        .container { max-width: 1400px; margin: 0 auto; padding: 20px; }
        h1 { margin-bottom: 30px; color: #2c3e50; }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .metric-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            text-align: center;
        }
        
        .metric-value {
            font-size: 36px;
            font-weight: bold;
            margin: 10px 0;
        }
        
        .metric-label {
            color: #7f8c8d;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .metric-trend {
            font-size: 14px;
            margin-top: 10px;
        }
        
        .trend-up { color: #27ae60; }
        .trend-down { color: #e74c3c; }
        .trend-neutral { color: #95a5a6; }
        
        .chart-container {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            margin-bottom: 30px;
        }
        
        .chart-wrapper {
            position: relative;
            height: 300px;
        }
        
        .issues-section {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            margin-bottom: 30px;
        }
        
        .issue-item {
            padding: 15px;
            margin-bottom: 10px;
            border-left: 4px solid #e74c3c;
            background: #fff5f5;
            border-radius: 5px;
        }
        
        .flaky-test {
            padding: 10px;
            margin-bottom: 8px;
            background: #fffbf0;
            border-left: 4px solid #f39c12;
            border-radius: 5px;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
        }
        
        .status-passing { background: #d4edda; color: #155724; }
        .status-failing { background: #f8d7da; color: #721c24; }
        .status-flaky { background: #fff3cd; color: #856404; }
        
        .timestamp {
            text-align: center;
            color: #7f8c8d;
            margin-top: 40px;
            font-size: 14px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ecf0f1;
        }
        
        th {
            background: #f8f9fa;
            font-weight: 600;
            color: #2c3e50;
        }
        
        .health-score {
            font-size: 48px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
        
        .score-excellent { color: #27ae60; }
        .score-good { color: #3498db; }
        .score-fair { color: #f39c12; }
        .score-poor { color: #e74c3c; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 Test Health Dashboard</h1>
        
        <!-- Overall Health Score -->
        <div class="metric-card" style="max-width: 300px; margin: 0 auto 40px;">
            <div class="metric-label">Overall Health Score</div>
            <div class="health-score ${getScoreClass(metrics.healthScore)}">${metrics.healthScore}%</div>
            <div class="status-badge ${getHealthStatus(metrics.healthScore)}">${getHealthLabel(metrics.healthScore)}</div>
        </div>
        
        <!-- Key Metrics -->
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-label">Test Pass Rate</div>
                <div class="metric-value" style="color: ${metrics.passRate >= 95 ? '#27ae60' : '#e74c3c'};">
                    ${metrics.passRate}%
                </div>
                <div class="metric-trend ${getTrendClass(metrics.passRateTrend)}">
                    ${formatTrend(metrics.passRateTrend)} vs last week
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-label">Code Coverage</div>
                <div class="metric-value" style="color: ${metrics.coverage >= 80 ? '#27ae60' : '#f39c12'};">
                    ${metrics.coverage}%
                </div>
                <div class="metric-trend ${getTrendClass(metrics.coverageTrend)}">
                    ${formatTrend(metrics.coverageTrend)} vs last week
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-label">Flaky Tests</div>
                <div class="metric-value" style="color: ${metrics.flakyCount <= 3 ? '#27ae60' : '#e74c3c'};">
                    ${metrics.flakyCount}
                </div>
                <div class="metric-trend ${getTrendClass(-metrics.flakyTrend)}">
                    ${formatTrend(metrics.flakyTrend)} vs last week
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-label">CI Success Rate</div>
                <div class="metric-value" style="color: ${metrics.ciSuccess >= 90 ? '#27ae60' : '#e74c3c'};">
                    ${metrics.ciSuccess}%
                </div>
                <div class="metric-trend ${getTrendClass(metrics.ciSuccessTrend)}">
                    ${formatTrend(metrics.ciSuccessTrend)} vs last week
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-label">Avg Test Duration</div>
                <div class="metric-value">${metrics.avgDuration}s</div>
                <div class="metric-trend ${getTrendClass(-metrics.durationTrend)}">
                    ${formatTrend(metrics.durationTrend)} vs last week
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-label">Total Tests</div>
                <div class="metric-value">${metrics.totalTests}</div>
                <div class="metric-trend ${getTrendClass(metrics.testCountTrend)}">
                    ${formatTrend(metrics.testCountTrend, '+')} new this week
                </div>
            </div>
        </div>
        
        <!-- Trend Charts -->
        <div class="chart-container">
            <h2>📈 Weekly Trends</h2>
            <div class="chart-wrapper">
                <canvas id="trendsChart"></canvas>
            </div>
        </div>
        
        <!-- Coverage by File -->
        <div class="chart-container">
            <h2>📊 Coverage Distribution</h2>
            <div class="chart-wrapper">
                <canvas id="coverageChart"></canvas>
            </div>
        </div>
        
        <!-- Recent Failures -->
        ${recentFailures.length > 0 ? `
        <div class="issues-section">
            <h2>❌ Recent Test Failures</h2>
            ${recentFailures.map(failure => `
                <div class="issue-item">
                    <strong>${failure.test}</strong>
                    <div style="color: #7f8c8d; font-size: 14px; margin-top: 5px;">
                        ${failure.file} • Failed ${failure.count} times • Last: ${failure.lastSeen}
                    </div>
                    ${failure.error ? `<pre style="margin-top: 10px; font-size: 12px; overflow-x: auto;">${failure.error}</pre>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        <!-- Flaky Tests -->
        ${flakyTests.length > 0 ? `
        <div class="issues-section">
            <h2>🔄 Flaky Tests</h2>
            <table>
                <thead>
                    <tr>
                        <th>Test</th>
                        <th>File</th>
                        <th>Pass Rate</th>
                        <th>Last 7 Days</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${flakyTests.map(test => `
                        <tr>
                            <td>${test.name}</td>
                            <td><code>${test.file}</code></td>
                            <td>
                                <span class="status-badge ${test.passRate >= 80 ? 'status-flaky' : 'status-failing'}">
                                    ${test.passRate}%
                                </span>
                            </td>
                            <td>${test.recentRuns}</td>
                            <td><a href="#" onclick="alert('View test history')">Investigate</a></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        ` : ''}
        
        <div class="timestamp">
            Last updated: ${new Date().toLocaleString()}
        </div>
    </div>
    
    <script>
        // Trends Chart
        const trendsCtx = document.getElementById('trendsChart').getContext('2d');
        new Chart(trendsCtx, {
            type: 'line',
            data: {
                labels: ${JSON.stringify(trends.labels)},
                datasets: [{
                    label: 'Pass Rate',
                    data: ${JSON.stringify(trends.passRate)},
                    borderColor: '#27ae60',
                    tension: 0.1
                }, {
                    label: 'Coverage',
                    data: ${JSON.stringify(trends.coverage)},
                    borderColor: '#3498db',
                    tension: 0.1
                }, {
                    label: 'CI Success',
                    data: ${JSON.stringify(trends.ciSuccess)},
                    borderColor: '#9b59b6',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: value => value + '%'
                        }
                    }
                }
            }
        });
        
        // Coverage Chart
        const coverageCtx = document.getElementById('coverageChart').getContext('2d');
        new Chart(coverageCtx, {
            type: 'bar',
            data: {
                labels: ['0-50%', '50-70%', '70-80%', '80-90%', '90-100%'],
                datasets: [{
                    label: 'Number of Files',
                    data: ${JSON.stringify(metrics.coverageDistribution)},
                    backgroundColor: ['#e74c3c', '#f39c12', '#f1c40f', '#3498db', '#27ae60']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Helper functions
        function getScoreClass(score) {
            if (score >= 90) return 'score-excellent';
            if (score >= 75) return 'score-good';
            if (score >= 60) return 'score-fair';
            return 'score-poor';
        }
        
        function getHealthStatus(score) {
            if (score >= 90) return 'status-passing';
            if (score >= 75) return 'status-flaky';
            return 'status-failing';
        }
        
        function getHealthLabel(score) {
            if (score >= 90) return 'Excellent';
            if (score >= 75) return 'Good';
            if (score >= 60) return 'Fair';
            return 'Needs Attention';
        }
        
        function getTrendClass(trend) {
            if (trend > 0) return 'trend-up';
            if (trend < 0) return 'trend-down';
            return 'trend-neutral';
        }
        
        function formatTrend(trend, prefix = '') {
            if (trend > 0) return prefix + '+' + Math.abs(trend) + '%';
            if (trend < 0) return '-' + Math.abs(trend) + '%';
            return 'No change';
        }
    </script>
</body>
</html>`;
}

// Collect dashboard data
function collectDashboardData() {
  // Mock data - replace with actual data collection
  const data = {
    metrics: {
      healthScore: 85,
      passRate: 96.5,
      passRateTrend: 2.1,
      coverage: 82.3,
      coverageTrend: -0.5,
      flakyCount: 4,
      flakyTrend: -1,
      ciSuccess: 91.2,
      ciSuccessTrend: 3.4,
      avgDuration: 124,
      durationTrend: -5.2,
      totalTests: 1243,
      testCountTrend: 23,
      coverageDistribution: [2, 5, 8, 15, 25]
    },
    trends: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      passRate: [94.2, 95.1, 96.3, 95.8, 96.5, 96.5, 96.5],
      coverage: [81.5, 81.8, 82.0, 82.1, 82.3, 82.3, 82.3],
      ciSuccess: [88.0, 89.5, 90.0, 90.8, 91.2, 91.2, 91.2]
    },
    recentFailures: [
      {
        test: 'should handle authentication timeout',
        file: 'tests/e2e/auth.spec.ts',
        count: 3,
        lastSeen: '2 hours ago',
        error: 'Timeout: Page.waitForSelector: Timeout 30000ms exceeded'
      }
    ],
    flakyTests: [
      {
        name: 'search autocomplete suggestions',
        file: 'tests/e2e/search.spec.ts',
        passRate: 78,
        recentRuns: '11/14 passed'
      },
      {
        name: 'modal animation completion',
        file: 'tests/e2e/ui/modal.spec.ts',
        passRate: 85,
        recentRuns: '12/14 passed'
      }
    ]
  };

  // Calculate health score
  data.metrics.healthScore = Math.round(
    (data.metrics.passRate * 0.3) +
    (data.metrics.coverage * 0.3) +
    (data.metrics.ciSuccess * 0.2) +
    ((100 - data.metrics.flakyCount * 5) * 0.2)
  );

  return data;
}

// Main function
function generateDashboard() {
  console.log('📊 Generating Test Health Dashboard...\n');

  const data = collectDashboardData();
  const html = generateDashboardHTML(data);

  // Save dashboard
  const outputPath = path.join(process.cwd(), 'test-results', 'test-dashboard.html');
  fs.writeFileSync(outputPath, html);

  console.log(`✅ Dashboard saved to: ${outputPath}`);
  console.log(`\n📈 Health Score: ${data.metrics.healthScore}%`);
  console.log(`   Pass Rate: ${data.metrics.passRate}%`);
  console.log(`   Coverage: ${data.metrics.coverage}%`);
  console.log(`   Flaky Tests: ${data.metrics.flakyCount}`);

  return outputPath;
}

// Helper functions in template
function getScoreClass(score) {
  if (score >= 90) return 'score-excellent';
  if (score >= 75) return 'score-good';
  if (score >= 60) return 'score-fair';
  return 'score-poor';
}

function getHealthStatus(score) {
  if (score >= 90) return 'status-passing';
  if (score >= 75) return 'status-flaky';
  return 'status-failing';
}

function getHealthLabel(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Needs Attention';
}

function getTrendClass(trend) {
  if (trend > 0) return 'trend-up';
  if (trend < 0) return 'trend-down';
  return 'trend-neutral';
}

function formatTrend(trend, prefix = '') {
  if (trend > 0) return (prefix || '') + '+' + Math.abs(trend) + '%';
  if (trend < 0) return '-' + Math.abs(trend) + '%';
  return 'No change';
}

// Run if called directly
if (require.main === module) {
  generateDashboard();
}

module.exports = { generateDashboard };