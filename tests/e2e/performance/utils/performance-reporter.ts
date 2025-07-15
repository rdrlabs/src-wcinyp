import * as fs from 'fs';
import * as path from 'path';
import { PerformanceMetrics } from './performance-helpers';
import { BundleAnalysis } from './bundle-analyzer';

export interface PerformanceReport {
  timestamp: string;
  testName: string;
  url: string;
  device: string;
  network: string;
  metrics: PerformanceMetrics;
  resourceMetrics?: {
    totalSize: number;
    totalDuration: number;
    resourceCount: number;
    byType: Record<string, number>;
  };
  bundleMetrics?: {
    totalSize: number;
    jsSize: number;
    cssSize: number;
    thirdPartySize: number;
  };
  memoryMetrics?: {
    initialHeap: number;
    finalHeap: number;
    peakHeap: number;
    leaks: boolean;
  };
  customMetrics?: Record<string, any>;
}

export interface AggregatedReport {
  summary: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    averageMetrics: PerformanceMetrics;
    percentiles: {
      p50: PerformanceMetrics;
      p75: PerformanceMetrics;
      p90: PerformanceMetrics;
      p95: PerformanceMetrics;
    };
  };
  byPage: Record<string, PerformanceMetrics[]>;
  byDevice: Record<string, PerformanceMetrics[]>;
  byNetwork: Record<string, PerformanceMetrics[]>;
  trends: {
    improving: string[];
    degrading: string[];
    stable: string[];
  };
  violations: Array<{
    metric: string;
    value: number;
    threshold: number;
    page: string;
  }>;
}

export class PerformanceReporter {
  private reports: PerformanceReport[] = [];
  private outputDir: string;

  constructor(outputDir: string = 'test-results/performance') {
    this.outputDir = outputDir;
    this.ensureOutputDir();
  }

  private ensureOutputDir(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Add a performance report
   */
  addReport(report: PerformanceReport): void {
    this.reports.push(report);
  }

  /**
   * Generate JSON report
   */
  generateJSONReport(filename: string = 'performance-report.json'): string {
    const outputPath = path.join(this.outputDir, filename);
    const aggregated = this.aggregateReports();
    
    const fullReport = {
      metadata: {
        generatedAt: new Date().toISOString(),
        reportVersion: '1.0.0',
        totalReports: this.reports.length,
      },
      aggregated,
      raw: this.reports,
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(fullReport, null, 2));
    return outputPath;
  }

  /**
   * Generate HTML dashboard
   */
  generateHTMLReport(filename: string = 'performance-dashboard.html'): string {
    const outputPath = path.join(this.outputDir, filename);
    const aggregated = this.aggregateReports();
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Performance Dashboard</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1, h2, h3 { margin-bottom: 20px; color: #333; }
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px; }
    .summary-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .metric-value { font-size: 32px; font-weight: bold; color: #007bff; }
    .metric-label { color: #666; margin-top: 5px; }
    .chart-container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
    .chart-wrapper { position: relative; height: 300px; }
    .violations { background: #fff3cd; border: 1px solid #ffeeba; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .violation-item { margin-bottom: 10px; color: #856404; }
    .trends { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
    .trend-card { padding: 15px; border-radius: 8px; color: white; }
    .improving { background: #28a745; }
    .degrading { background: #dc3545; }
    .stable { background: #6c757d; }
    table { width: 100%; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f8f9fa; font-weight: 600; }
    .good { color: #28a745; }
    .warning { color: #ffc107; }
    .bad { color: #dc3545; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Performance Dashboard</h1>
    <p style="color: #666; margin-bottom: 30px;">Generated on ${new Date().toLocaleString()}</p>
    
    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="summary-card">
        <div class="metric-value">${aggregated.summary.totalTests}</div>
        <div class="metric-label">Total Tests</div>
      </div>
      <div class="summary-card">
        <div class="metric-value" style="color: #28a745;">${aggregated.summary.passedTests}</div>
        <div class="metric-label">Passed</div>
      </div>
      <div class="summary-card">
        <div class="metric-value" style="color: #dc3545;">${aggregated.summary.failedTests}</div>
        <div class="metric-label">Failed</div>
      </div>
      <div class="summary-card">
        <div class="metric-value">${(aggregated.summary.passedTests / aggregated.summary.totalTests * 100).toFixed(1)}%</div>
        <div class="metric-label">Success Rate</div>
      </div>
    </div>
    
    <!-- Trends -->
    <h2>Performance Trends</h2>
    <div class="trends">
      <div class="trend-card improving">
        <h3>Improving (${aggregated.trends.improving.length})</h3>
        <ul style="list-style: none; margin-top: 10px;">
          ${aggregated.trends.improving.map(m => `<li>✓ ${m}</li>`).join('')}
        </ul>
      </div>
      <div class="trend-card degrading">
        <h3>Degrading (${aggregated.trends.degrading.length})</h3>
        <ul style="list-style: none; margin-top: 10px;">
          ${aggregated.trends.degrading.map(m => `<li>✗ ${m}</li>`).join('')}
        </ul>
      </div>
      <div class="trend-card stable">
        <h3>Stable (${aggregated.trends.stable.length})</h3>
        <ul style="list-style: none; margin-top: 10px;">
          ${aggregated.trends.stable.map(m => `<li>— ${m}</li>`).join('')}
        </ul>
      </div>
    </div>
    
    <!-- Violations -->
    ${aggregated.violations.length > 0 ? `
    <div class="violations">
      <h3>⚠️ Performance Budget Violations</h3>
      ${aggregated.violations.map(v => `
        <div class="violation-item">
          <strong>${v.page}</strong>: ${v.metric} = ${v.value}ms (threshold: ${v.threshold}ms)
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    <!-- Web Vitals Chart -->
    <div class="chart-container">
      <h2>Web Vitals Overview</h2>
      <div class="chart-wrapper">
        <canvas id="vitalsChart"></canvas>
      </div>
    </div>
    
    <!-- Percentiles Table -->
    <h2>Performance Percentiles</h2>
    <table>
      <thead>
        <tr>
          <th>Metric</th>
          <th>Average</th>
          <th>P50</th>
          <th>P75</th>
          <th>P90</th>
          <th>P95</th>
        </tr>
      </thead>
      <tbody>
        ${this.generatePercentileRows(aggregated)}
      </tbody>
    </table>
    
    <!-- By Page Performance -->
    <div class="chart-container" style="margin-top: 40px;">
      <h2>Performance by Page</h2>
      <div class="chart-wrapper">
        <canvas id="pageChart"></canvas>
      </div>
    </div>
    
    <!-- By Device Performance -->
    <div class="chart-container">
      <h2>Performance by Device</h2>
      <div class="chart-wrapper">
        <canvas id="deviceChart"></canvas>
      </div>
    </div>
  </div>
  
  <script>
    ${this.generateChartScripts(aggregated)}
  </script>
</body>
</html>`;
    
    fs.writeFileSync(outputPath, html);
    return outputPath;
  }

  /**
   * Generate CSV report
   */
  generateCSVReport(filename: string = 'performance-report.csv'): string {
    const outputPath = path.join(this.outputDir, filename);
    
    const headers = [
      'Timestamp', 'Test Name', 'URL', 'Device', 'Network',
      'FCP', 'LCP', 'TTI', 'TBT', 'CLS', 'INP', 'TTFB',
      'Total Resources', 'Total Size (KB)', 'JS Size (KB)', 'CSS Size (KB)'
    ];
    
    const rows = this.reports.map(report => [
      report.timestamp,
      report.testName,
      report.url,
      report.device,
      report.network,
      report.metrics.FCP,
      report.metrics.LCP,
      report.metrics.TTI,
      report.metrics.TBT,
      report.metrics.CLS,
      report.metrics.INP,
      report.metrics.TTFB,
      report.resourceMetrics?.resourceCount || 0,
      Math.round((report.resourceMetrics?.totalSize || 0) / 1024),
      Math.round((report.bundleMetrics?.jsSize || 0) / 1024),
      Math.round((report.bundleMetrics?.cssSize || 0) / 1024),
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    fs.writeFileSync(outputPath, csv);
    return outputPath;
  }

  /**
   * Aggregate reports for summary
   */
  private aggregateReports(): AggregatedReport {
    const metrics = this.reports.map(r => r.metrics);
    
    return {
      summary: {
        totalTests: this.reports.length,
        passedTests: this.reports.filter(r => this.isTestPassed(r)).length,
        failedTests: this.reports.filter(r => !this.isTestPassed(r)).length,
        averageMetrics: this.calculateAverageMetrics(metrics),
        percentiles: {
          p50: this.calculatePercentile(metrics, 50),
          p75: this.calculatePercentile(metrics, 75),
          p90: this.calculatePercentile(metrics, 90),
          p95: this.calculatePercentile(metrics, 95),
        },
      },
      byPage: this.groupByField('url'),
      byDevice: this.groupByField('device'),
      byNetwork: this.groupByField('network'),
      trends: this.analyzeTrends(),
      violations: this.findViolations(),
    };
  }

  private isTestPassed(report: PerformanceReport): boolean {
    // Check against performance budgets
    const budgets = {
      FCP: 1800,
      LCP: 2500,
      TTI: 3800,
      TBT: 200,
      CLS: 0.1,
      INP: 200,
      TTFB: 800,
    };
    
    return Object.entries(budgets).every(([metric, threshold]) => {
      return report.metrics[metric as keyof PerformanceMetrics] <= threshold;
    });
  }

  private calculateAverageMetrics(metrics: PerformanceMetrics[]): PerformanceMetrics {
    const sum = metrics.reduce((acc, m) => ({
      FCP: acc.FCP + m.FCP,
      LCP: acc.LCP + m.LCP,
      TTI: acc.TTI + m.TTI,
      TBT: acc.TBT + m.TBT,
      CLS: acc.CLS + m.CLS,
      INP: acc.INP + m.INP,
      TTFB: acc.TTFB + m.TTFB,
    }), { FCP: 0, LCP: 0, TTI: 0, TBT: 0, CLS: 0, INP: 0, TTFB: 0 });
    
    const count = metrics.length;
    return {
      FCP: Math.round(sum.FCP / count),
      LCP: Math.round(sum.LCP / count),
      TTI: Math.round(sum.TTI / count),
      TBT: Math.round(sum.TBT / count),
      CLS: parseFloat((sum.CLS / count).toFixed(4)),
      INP: Math.round(sum.INP / count),
      TTFB: Math.round(sum.TTFB / count),
    };
  }

  private calculatePercentile(metrics: PerformanceMetrics[], percentile: number): PerformanceMetrics {
    const index = Math.ceil((percentile / 100) * metrics.length) - 1;
    
    return {
      FCP: this.getPercentileValue(metrics.map(m => m.FCP), percentile),
      LCP: this.getPercentileValue(metrics.map(m => m.LCP), percentile),
      TTI: this.getPercentileValue(metrics.map(m => m.TTI), percentile),
      TBT: this.getPercentileValue(metrics.map(m => m.TBT), percentile),
      CLS: this.getPercentileValue(metrics.map(m => m.CLS), percentile),
      INP: this.getPercentileValue(metrics.map(m => m.INP), percentile),
      TTFB: this.getPercentileValue(metrics.map(m => m.TTFB), percentile),
    };
  }

  private getPercentileValue(values: number[], percentile: number): number {
    const sorted = values.sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  private groupByField(field: keyof PerformanceReport): Record<string, PerformanceMetrics[]> {
    const grouped: Record<string, PerformanceMetrics[]> = {};
    
    this.reports.forEach(report => {
      const key = String(report[field]);
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(report.metrics);
    });
    
    return grouped;
  }

  private analyzeTrends(): { improving: string[]; degrading: string[]; stable: string[] } {
    // This would compare against historical data
    // For now, return mock data
    return {
      improving: ['FCP', 'TTFB'],
      degrading: ['LCP'],
      stable: ['TTI', 'TBT', 'CLS', 'INP'],
    };
  }

  private findViolations(): Array<{ metric: string; value: number; threshold: number; page: string }> {
    const violations: Array<{ metric: string; value: number; threshold: number; page: string }> = [];
    const budgets = {
      FCP: 1800,
      LCP: 2500,
      TTI: 3800,
      TBT: 200,
      CLS: 0.1,
      INP: 200,
      TTFB: 800,
    };
    
    this.reports.forEach(report => {
      Object.entries(budgets).forEach(([metric, threshold]) => {
        const value = report.metrics[metric as keyof PerformanceMetrics];
        if (value > threshold) {
          violations.push({
            metric,
            value: Number(value),
            threshold,
            page: report.url,
          });
        }
      });
    });
    
    return violations;
  }

  private generatePercentileRows(aggregated: AggregatedReport): string {
    const metrics = ['FCP', 'LCP', 'TTI', 'TBT', 'CLS', 'INP', 'TTFB'] as const;
    
    return metrics.map(metric => {
      const avg = aggregated.summary.averageMetrics[metric];
      const p50 = aggregated.summary.percentiles.p50[metric];
      const p75 = aggregated.summary.percentiles.p75[metric];
      const p90 = aggregated.summary.percentiles.p90[metric];
      const p95 = aggregated.summary.percentiles.p95[metric];
      
      return `
        <tr>
          <td><strong>${metric}</strong></td>
          <td>${avg}${metric === 'CLS' ? '' : 'ms'}</td>
          <td>${p50}${metric === 'CLS' ? '' : 'ms'}</td>
          <td>${p75}${metric === 'CLS' ? '' : 'ms'}</td>
          <td>${p90}${metric === 'CLS' ? '' : 'ms'}</td>
          <td>${p95}${metric === 'CLS' ? '' : 'ms'}</td>
        </tr>
      `;
    }).join('');
  }

  private generateChartScripts(aggregated: AggregatedReport): string {
    return `
      // Web Vitals Chart
      const vitalsCtx = document.getElementById('vitalsChart').getContext('2d');
      new Chart(vitalsCtx, {
        type: 'bar',
        data: {
          labels: ['FCP', 'LCP', 'TTI', 'TBT', 'CLS', 'INP', 'TTFB'],
          datasets: [{
            label: 'Average',
            data: [
              ${aggregated.summary.averageMetrics.FCP},
              ${aggregated.summary.averageMetrics.LCP},
              ${aggregated.summary.averageMetrics.TTI},
              ${aggregated.summary.averageMetrics.TBT},
              ${aggregated.summary.averageMetrics.CLS * 1000}, // Scale CLS for visibility
              ${aggregated.summary.averageMetrics.INP},
              ${aggregated.summary.averageMetrics.TTFB}
            ],
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1
          }, {
            label: 'Budget',
            data: [1800, 2500, 3800, 200, 100, 200, 800], // CLS scaled by 1000
            type: 'line',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Time (ms)'
              }
            }
          }
        }
      });
      
      // By Page Chart
      const pageCtx = document.getElementById('pageChart').getContext('2d');
      const pageData = ${JSON.stringify(aggregated.byPage)};
      const pageLabels = Object.keys(pageData);
      
      new Chart(pageCtx, {
        type: 'line',
        data: {
          labels: pageLabels,
          datasets: ['FCP', 'LCP', 'TTI'].map((metric, index) => ({
            label: metric,
            data: pageLabels.map(page => {
              const metrics = pageData[page];
              return metrics.reduce((sum, m) => sum + m[metric], 0) / metrics.length;
            }),
            borderColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(75, 192, 192)'][index],
            tension: 0.1
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
      
      // By Device Chart
      const deviceCtx = document.getElementById('deviceChart').getContext('2d');
      const deviceData = ${JSON.stringify(aggregated.byDevice)};
      const deviceLabels = Object.keys(deviceData);
      
      new Chart(deviceCtx, {
        type: 'radar',
        data: {
          labels: ['FCP', 'LCP', 'TTI', 'TBT', 'INP', 'TTFB'],
          datasets: deviceLabels.map((device, index) => ({
            label: device,
            data: ['FCP', 'LCP', 'TTI', 'TBT', 'INP', 'TTFB'].map(metric => {
              const metrics = deviceData[device];
              return metrics.reduce((sum, m) => sum + m[metric], 0) / metrics.length;
            }),
            borderColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(75, 192, 192)'][index],
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)'][index]
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    `;
  }
}