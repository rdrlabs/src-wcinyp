#!/usr/bin/env node
/**
 * Detect flaky tests by analyzing test results
 * Identifies tests that pass/fail inconsistently
 */

const fs = require('fs');
const path = require('path');

// Configuration
const FLAKY_THRESHOLD = 0.8; // Test is flaky if it fails 20%+ of the time
const MIN_RUNS = 3; // Minimum runs needed to determine flakiness

/**
 * Analyze test results to find flaky tests
 */
function analyzeFlakyTests() {
  const resultsDir = path.join(process.cwd(), 'test-results');
  const flakyReportPath = path.join(resultsDir, 'flaky-tests.json');
  
  // Read all test result files
  const resultFiles = fs.readdirSync(resultsDir)
    .filter(file => file.endsWith('.json') && file !== 'flaky-tests.json');
  
  const testRuns = new Map();
  
  // Aggregate test results
  resultFiles.forEach(file => {
    try {
      const results = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf-8'));
      
      if (results.suites) {
        processResults(results.suites, testRuns);
      }
    } catch (error) {
      console.error(`Error reading ${file}:`, error.message);
    }
  });
  
  // Identify flaky tests
  const flakyTests = [];
  
  testRuns.forEach((runs, testName) => {
    if (runs.length >= MIN_RUNS) {
      const passCount = runs.filter(r => r.status === 'passed').length;
      const passRate = passCount / runs.length;
      
      if (passRate > 0 && passRate < FLAKY_THRESHOLD) {
        flakyTests.push({
          name: testName,
          file: runs[0].file,
          passRate: (passRate * 100).toFixed(1),
          totalRuns: runs.length,
          passed: passCount,
          failed: runs.length - passCount,
          lastFailure: runs.find(r => r.status === 'failed')?.error
        });
      }
    }
  });
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    totalTests: testRuns.size,
    flakyTests: flakyTests.length,
    tests: flakyTests.sort((a, b) => parseFloat(a.passRate) - parseFloat(b.passRate))
  };
  
  // Save report
  fs.writeFileSync(flakyReportPath, JSON.stringify(report, null, 2));
  
  // Output summary
  console.log('🔍 Flaky Test Detection Report');
  console.log('================================');
  console.log(`Total tests analyzed: ${report.totalTests}`);
  console.log(`Flaky tests found: ${report.flakyTests}`);
  
  if (flakyTests.length > 0) {
    console.log('\n⚠️  Flaky Tests:');
    flakyTests.forEach((test, index) => {
      console.log(`\n${index + 1}. ${test.name}`);
      console.log(`   File: ${test.file}`);
      console.log(`   Pass rate: ${test.passRate}% (${test.passed}/${test.totalRuns})`);
      if (test.lastFailure) {
        console.log(`   Last failure: ${test.lastFailure}`);
      }
    });
    
    console.log('\n💡 Recommendations:');
    console.log('1. Add retry logic to flaky tests');
    console.log('2. Increase timeouts if tests are timing out');
    console.log('3. Add explicit waits for dynamic content');
    console.log('4. Check for race conditions in async operations');
  } else {
    console.log('\n✅ No flaky tests detected!');
  }
  
  return report;
}

/**
 * Process test results recursively
 */
function processResults(suites, testRuns, parentFile = '') {
  suites.forEach(suite => {
    const file = suite.file || parentFile;
    
    if (suite.specs) {
      suite.specs.forEach(spec => {
        spec.tests?.forEach(test => {
          const testKey = `${file}::${suite.title}::${spec.title}::${test.title}`;
          
          if (!testRuns.has(testKey)) {
            testRuns.set(testKey, []);
          }
          
          testRuns.get(testKey).push({
            status: test.status,
            duration: test.duration,
            file: file,
            error: test.error?.message || test.error
          });
        });
      });
    }
    
    if (suite.suites) {
      processResults(suite.suites, testRuns, file);
    }
  });
}

// Run if called directly
if (require.main === module) {
  analyzeFlakyTests();
}

module.exports = { analyzeFlakyTests };