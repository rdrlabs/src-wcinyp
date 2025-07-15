#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { PerformanceReporter, PerformanceReport } from './utils/performance-reporter';
import { TrendAnalyzer } from './utils/trend-analyzer';
import { program } from 'commander';

// Define command line options
program
  .name('performance-report')
  .description('Generate performance reports from test results')
  .version('1.0.0')
  .option('-i, --input <path>', 'Input JSON file with test results', 'test-results/performance-results.json')
  .option('-o, --output <path>', 'Output directory for reports', 'test-results/performance')
  .option('-f, --format <type>', 'Report format (json|html|csv|all)', 'all')
  .option('-b, --baseline', 'Update performance baseline')
  .option('-t, --trends', 'Analyze trends from historical data')
  .option('-d, --days <number>', 'Number of days to look back for trends', '7')
  .parse();

const options = program.opts();

async function generateReports() {
  console.log('🚀 Performance Report Generator');
  console.log('================================\n');
  
  // Initialize reporter and analyzer
  const reporter = new PerformanceReporter(options.output);
  const analyzer = new TrendAnalyzer(path.join(options.output, 'history'));
  
  // Load test results
  let testResults: PerformanceReport[] = [];
  
  if (fs.existsSync(options.input)) {
    console.log(`📊 Loading test results from: ${options.input}`);
    const data = JSON.parse(fs.readFileSync(options.input, 'utf-8'));
    testResults = Array.isArray(data) ? data : [data];
  } else {
    // Generate sample data for demonstration
    console.log('⚠️  No test results found, generating sample data...');
    testResults = generateSampleData();
  }
  
  console.log(`✅ Loaded ${testResults.length} test results\n`);
  
  // Add results to reporter
  testResults.forEach(result => {
    reporter.addReport(result);
    
    // Also add to trend analyzer
    analyzer.addDataPoint(result, {
      commit: process.env.GITHUB_SHA || 'local',
      branch: process.env.GITHUB_REF_NAME || 'main',
      buildId: process.env.GITHUB_RUN_ID || Date.now().toString(),
    });
  });
  
  // Generate reports based on format
  const formats = options.format === 'all' ? ['json', 'html', 'csv'] : [options.format];
  
  for (const format of formats) {
    console.log(`📝 Generating ${format.toUpperCase()} report...`);
    
    switch (format) {
      case 'json':
        const jsonPath = reporter.generateJSONReport();
        console.log(`   ✅ JSON report saved to: ${jsonPath}`);
        break;
        
      case 'html':
        const htmlPath = reporter.generateHTMLReport();
        console.log(`   ✅ HTML dashboard saved to: ${htmlPath}`);
        console.log(`   📌 Open in browser: file://${path.resolve(htmlPath)}`);
        break;
        
      case 'csv':
        const csvPath = reporter.generateCSVReport();
        console.log(`   ✅ CSV report saved to: ${csvPath}`);
        break;
    }
  }
  
  // Analyze trends if requested
  if (options.trends) {
    console.log(`\n📈 Analyzing performance trends (last ${options.days} days)...`);
    
    try {
      const trends = analyzer.analyzeTrends(undefined, undefined, parseInt(options.days));
      
      console.log('\n📊 Performance Trends:');
      Object.entries(trends).forEach(([metric, analysis]) => {
        const icon = analysis.trend === 'improving' ? '📈' : 
                     analysis.trend === 'degrading' ? '📉' : 
                     analysis.trend === 'volatile' ? '📊' : '➡️';
        
        console.log(`   ${icon} ${metric}: ${analysis.trend} (${analysis.changePercent > 0 ? '+' : ''}${analysis.changePercent.toFixed(1)}%)`);
        console.log(`      Current: ${analysis.currentValue}, Average: ${analysis.averageValue.toFixed(0)}`);
      });
    } catch (error: any) {
      console.log(`   ⚠️  ${error.message}`);
    }
    
    // Check for regressions
    console.log('\n🔍 Checking for performance regressions...');
    
    testResults.forEach(result => {
      const regressions = analyzer.detectRegressions(result.metrics, result.url, result.device);
      
      if (regressions.length > 0) {
        console.log(`\n⚠️  Regressions detected for ${result.url} (${result.device}):`);
        regressions.forEach(alert => {
          const icon = alert.severity === 'critical' ? '🔴' : 
                       alert.severity === 'warning' ? '🟡' : '🟢';
          console.log(`   ${icon} ${alert.message}`);
        });
      }
    });
  }
  
  // Update baseline if requested
  if (options.baseline) {
    console.log('\n📐 Updating performance baseline...');
    
    const baselineMetrics: Record<string, any> = {};
    testResults.forEach(result => {
      const key = `${result.url}_${result.device}`;
      baselineMetrics[key] = result.metrics;
    });
    
    analyzer.updateBaseline(baselineMetrics, '1.0.0');
    console.log('   ✅ Baseline updated successfully');
  }
  
  console.log('\n✨ Report generation complete!');
}

function generateSampleData(): PerformanceReport[] {
  const pages = ['/', '/documents', '/providers', '/directory', '/knowledge'];
  const devices = ['desktop', 'mobile'];
  const networks = ['WiFi', '4G', '3G'];
  
  const reports: PerformanceReport[] = [];
  
  pages.forEach(page => {
    devices.forEach(device => {
      networks.forEach(network => {
        // Generate realistic metrics with some variation
        const baseMetrics = {
          FCP: 1200 + Math.random() * 800,
          LCP: 2000 + Math.random() * 1500,
          TTI: 3000 + Math.random() * 2000,
          TBT: 100 + Math.random() * 200,
          CLS: Math.random() * 0.2,
          INP: 150 + Math.random() * 150,
          TTFB: 500 + Math.random() * 500,
        };
        
        // Adjust for device and network
        if (device === 'mobile') {
          Object.keys(baseMetrics).forEach(key => {
            if (key !== 'CLS') {
              baseMetrics[key as keyof typeof baseMetrics] *= 1.5;
            }
          });
        }
        
        if (network === '3G') {
          Object.keys(baseMetrics).forEach(key => {
            if (key !== 'CLS') {
              baseMetrics[key as keyof typeof baseMetrics] *= 2;
            }
          });
        } else if (network === '4G') {
          Object.keys(baseMetrics).forEach(key => {
            if (key !== 'CLS') {
              baseMetrics[key as keyof typeof baseMetrics] *= 1.3;
            }
          });
        }
        
        reports.push({
          timestamp: new Date().toISOString(),
          testName: `${page}-${device}-${network}`,
          url: page,
          device,
          network,
          metrics: {
            FCP: Math.round(baseMetrics.FCP),
            LCP: Math.round(baseMetrics.LCP),
            TTI: Math.round(baseMetrics.TTI),
            TBT: Math.round(baseMetrics.TBT),
            CLS: parseFloat(baseMetrics.CLS.toFixed(4)),
            INP: Math.round(baseMetrics.INP),
            TTFB: Math.round(baseMetrics.TTFB),
          },
          resourceMetrics: {
            totalSize: 2000000 + Math.random() * 3000000,
            totalDuration: 3000 + Math.random() * 2000,
            resourceCount: 50 + Math.floor(Math.random() * 50),
            byType: {
              script: 10 + Math.floor(Math.random() * 10),
              stylesheet: 5 + Math.floor(Math.random() * 5),
              image: 20 + Math.floor(Math.random() * 20),
              font: 3 + Math.floor(Math.random() * 3),
            },
          },
          bundleMetrics: {
            totalSize: 3000000 + Math.random() * 2000000,
            jsSize: 2000000 + Math.random() * 1000000,
            cssSize: 200000 + Math.random() * 300000,
            thirdPartySize: 500000 + Math.random() * 1000000,
          },
          memoryMetrics: {
            initialHeap: 30000000 + Math.random() * 10000000,
            finalHeap: 40000000 + Math.random() * 20000000,
            peakHeap: 50000000 + Math.random() * 30000000,
            leaks: Math.random() > 0.9,
          },
        });
      });
    });
  });
  
  return reports;
}

// Run the report generator
generateReports().catch(console.error);