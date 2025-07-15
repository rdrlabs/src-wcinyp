#!/bin/bash
# Update Performance Baseline Script
# Updates the performance baseline from latest test results

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}📐 Performance Baseline Updater${NC}"
echo "======================================"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo -e "${RED}Error: Not in a git repository${NC}"
  exit 1
fi

# Get current git information
CURRENT_BRANCH=$(git branch --show-current)
CURRENT_COMMIT=$(git rev-parse --short HEAD)
HAS_CHANGES=$(git status --porcelain)

echo -e "${BLUE}Current branch: $CURRENT_BRANCH${NC}"
echo -e "${BLUE}Current commit: $CURRENT_COMMIT${NC}"

# Warn if there are uncommitted changes
if [ -n "$HAS_CHANGES" ]; then
  echo -e "${YELLOW}⚠️  Warning: You have uncommitted changes${NC}"
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Baseline update cancelled${NC}"
    exit 1
  fi
fi

# Check if performance results exist
if [ ! -f "test-results/performance/performance-report.json" ]; then
  echo -e "${YELLOW}No performance results found. Running performance tests first...${NC}"
  ./scripts/run-performance-tests.sh --profile all --no-report
fi

# Backup existing baseline
if [ -f "test-results/performance/history/performance-baseline.json" ]; then
  BACKUP_FILE="test-results/performance/history/baseline-backup-$(date +%Y%m%d-%H%M%S).json"
  cp test-results/performance/history/performance-baseline.json "$BACKUP_FILE"
  echo -e "${GREEN}✅ Existing baseline backed up to: $BACKUP_FILE${NC}"
fi

# Extract metrics from latest results
echo -e "\n${YELLOW}Extracting metrics from latest test results...${NC}"

# Create a Node.js script to process the results
node -e "
const fs = require('fs');
const path = require('path');

try {
  // Read the performance report
  const reportPath = path.join('test-results', 'performance', 'performance-report.json');
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
  
  // Extract metrics by page and device
  const baselineMetrics = {};
  
  report.raw.forEach(result => {
    const key = \`\${result.url}_\${result.device}\`;
    baselineMetrics[key] = result.metrics;
  });
  
  // Create baseline object
  const baseline = {
    version: process.env.npm_package_version || '1.0.0',
    createdAt: new Date().toISOString(),
    gitCommit: '$CURRENT_COMMIT',
    gitBranch: '$CURRENT_BRANCH',
    metrics: baselineMetrics,
    thresholds: {
      FCP: { warning: 20, critical: 50 },
      LCP: { warning: 20, critical: 50 },
      TTI: { warning: 20, critical: 50 },
      TBT: { warning: 30, critical: 100 },
      CLS: { warning: 30, critical: 100 },
      INP: { warning: 20, critical: 50 },
      TTFB: { warning: 20, critical: 50 }
    }
  };
  
  // Ensure history directory exists
  const historyDir = path.join('test-results', 'performance', 'history');
  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true });
  }
  
  // Write baseline file
  const baselinePath = path.join(historyDir, 'performance-baseline.json');
  fs.writeFileSync(baselinePath, JSON.stringify(baseline, null, 2));
  
  console.log('✅ Baseline updated successfully');
  console.log('\\nBaseline metrics:');
  Object.entries(baselineMetrics).forEach(([key, metrics]) => {
    console.log(\`  \${key}:\`);
    console.log(\`    - FCP: \${metrics.FCP}ms\`);
    console.log(\`    - LCP: \${metrics.LCP}ms\`);
    console.log(\`    - TTI: \${metrics.TTI}ms\`);
  });
  
} catch (error) {
  console.error('Error updating baseline:', error.message);
  process.exit(1);
}
" || {
  echo -e "${RED}Failed to update baseline${NC}"
  exit 1
}

# Update the baseline using the trend analyzer
echo -e "\n${YELLOW}Updating baseline via trend analyzer...${NC}"
npm run perf:update-baseline

# Copy baseline to version control if needed
BASELINE_VC_PATH="performance-baselines/${CURRENT_BRANCH}-baseline.json"
if [ ! -d "performance-baselines" ]; then
  mkdir -p performance-baselines
fi

cp test-results/performance/history/performance-baseline.json "$BASELINE_VC_PATH"
echo -e "${GREEN}✅ Baseline copied to: $BASELINE_VC_PATH${NC}"

# Show summary
echo -e "\n${GREEN}📊 Baseline Update Summary${NC}"
echo "======================================"
echo -e "Branch: ${BLUE}$CURRENT_BRANCH${NC}"
echo -e "Commit: ${BLUE}$CURRENT_COMMIT${NC}"
echo -e "Timestamp: ${BLUE}$(date)${NC}"
echo -e "Baseline file: ${BLUE}$BASELINE_VC_PATH${NC}"

# Suggest next steps
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Review the baseline metrics above"
echo "2. Commit the baseline file:"
echo -e "   ${BLUE}git add $BASELINE_VC_PATH${NC}"
echo -e "   ${BLUE}git commit -m \"chore: update performance baseline for $CURRENT_BRANCH\"${NC}"
echo "3. Future tests will compare against this baseline"

echo -e "\n${GREEN}✨ Baseline update complete!${NC}"