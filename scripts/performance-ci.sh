#!/bin/bash
# CI Performance Test Script
# Runs performance tests in CI environment with strict thresholds

set -e

# Colors for output (works in most CI environments)
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🚀 CI Performance Test Runner"
echo "======================================"

# CI environment detection
if [ -n "$CI" ] || [ -n "$GITHUB_ACTIONS" ] || [ -n "$NETLIFY" ]; then
  echo "Running in CI environment"
  export CI=true
else
  echo "Running in local environment"
fi

# Install browsers if needed (for CI)
if [ "$CI" == "true" ]; then
  echo "Installing Playwright browsers..."
  npx playwright install chromium
fi

# Clean previous results
rm -rf test-results/performance

# Run performance tests
echo -e "\n${YELLOW}Running performance tests...${NC}"

# Run desktop tests
npm run test:perf || {
  echo -e "${RED}Desktop performance tests failed${NC}"
  exit 1
}

# Run mobile tests
npm run test:perf:mobile || {
  echo -e "${RED}Mobile performance tests failed${NC}"
  exit 1
}

# Run slow network tests
npm run test:perf:slow || {
  echo -e "${RED}Slow network performance tests failed${NC}"
  exit 1
}

# Generate report
echo -e "\n${YELLOW}Generating performance report...${NC}"
npm run perf:generate-report -- --trends

# Check against baseline if it exists
if [ -f "performance-baselines/main-baseline.json" ]; then
  echo -e "\n${YELLOW}Comparing against baseline...${NC}"
  
  node -e "
    const fs = require('fs');
    const path = require('path');
    
    // Read current results
    const reportPath = path.join('test-results', 'performance', 'performance-report.json');
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    
    // Read baseline
    const baselinePath = 'performance-baselines/main-baseline.json';
    const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf-8'));
    
    let hasRegressions = false;
    const regressions = [];
    
    // Compare each metric
    report.raw.forEach(result => {
      const key = \`\${result.url}_\${result.device}\`;
      const baselineMetrics = baseline.metrics[key];
      
      if (baselineMetrics) {
        Object.entries(result.metrics).forEach(([metric, value]) => {
          const baselineValue = baselineMetrics[metric];
          const threshold = baseline.thresholds[metric];
          
          if (threshold) {
            const changePercent = ((value - baselineValue) / baselineValue) * 100;
            
            if (changePercent > threshold.critical) {
              hasRegressions = true;
              regressions.push({
                page: result.url,
                device: result.device,
                metric,
                current: value,
                baseline: baselineValue,
                change: changePercent.toFixed(1),
                severity: 'critical'
              });
            } else if (changePercent > threshold.warning) {
              regressions.push({
                page: result.url,
                device: result.device,
                metric,
                current: value,
                baseline: baselineValue,
                change: changePercent.toFixed(1),
                severity: 'warning'
              });
            }
          }
        });
      }
    });
    
    if (regressions.length > 0) {
      console.log('\\n⚠️  Performance regressions detected:\\n');
      regressions.forEach(r => {
        const icon = r.severity === 'critical' ? '🔴' : '🟡';
        console.log(\`\${icon} \${r.page} (\${r.device}) - \${r.metric}: \${r.current}ms (baseline: \${r.baseline}ms, +\${r.change}%)\`);
      });
      
      if (hasRegressions) {
        console.log('\\n❌ Critical performance regressions found!');
        process.exit(1);
      } else {
        console.log('\\n⚠️  Non-critical performance warnings found');
      }
    } else {
      console.log('\\n✅ No performance regressions detected');
    }
  " || {
    echo -e "\n${RED}Performance regressions detected!${NC}"
    exit 1
  }
fi

# Upload artifacts if in CI
if [ "$CI" == "true" ] && [ -n "$GITHUB_ACTIONS" ]; then
  echo -e "\n${YELLOW}Uploading test artifacts...${NC}"
  
  # Create artifact summary
  cat > test-results/performance/summary.md << EOF
# Performance Test Results

## Summary
- Total Tests: $(find test-results/performance -name "*.json" | wc -l)
- Report: [View Dashboard](test-results/performance/performance-dashboard.html)

## Metrics
\`\`\`json
$(cat test-results/performance/performance-report.json | jq '.aggregated.summary')
\`\`\`
EOF

  echo "::notice title=Performance Test Complete::View the performance dashboard in the artifacts"
fi

echo -e "\n${GREEN}✅ CI performance tests complete!${NC}"

# Exit with appropriate code
exit 0