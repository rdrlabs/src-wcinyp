import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Global teardown for Playwright tests
 * This runs once after all tests complete
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test teardown...');
  
  // Clean up temporary files
  const tempFiles = ['test-auth.json'];
  for (const file of tempFiles) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`✓ Cleaned up ${file}`);
    }
  }
  
  // Generate test summary
  const resultsPath = path.join('test-results', 'results.json');
  if (fs.existsSync(resultsPath)) {
    try {
      const results = JSON.parse(fs.readFileSync(resultsPath, 'utf-8'));
      const summary = {
        total: results.stats?.total || 0,
        passed: results.stats?.expected || 0,
        failed: results.stats?.unexpected || 0,
        flaky: results.stats?.flaky || 0,
        duration: results.stats?.duration || 0
      };
      
      console.log('\n📊 Test Summary:');
      console.log(`Total: ${summary.total}`);
      console.log(`Passed: ${summary.passed} ✅`);
      console.log(`Failed: ${summary.failed} ❌`);
      console.log(`Flaky: ${summary.flaky} 🔄`);
      console.log(`Duration: ${(summary.duration / 1000).toFixed(2)}s`);
      
      // Write summary for CI
      if (process.env.CI) {
        fs.writeFileSync(
          path.join('test-results', 'summary.json'),
          JSON.stringify(summary, null, 2)
        );
      }
    } catch (error) {
      console.error('Could not generate test summary:', error);
    }
  }
  
  console.log('✅ Global teardown complete');
}

export default globalTeardown;