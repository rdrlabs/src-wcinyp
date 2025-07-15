#!/bin/bash
# Run Performance Tests Script
# Executes performance tests with different configurations

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Performance Test Runner${NC}"
echo "======================================"

# Parse command line arguments
PROFILE="all"
HEADLESS="true"
REPORT="true"
BASELINE="false"

while [[ $# -gt 0 ]]; do
  case $1 in
    --profile)
      PROFILE="$2"
      shift 2
      ;;
    --headed)
      HEADLESS="false"
      shift
      ;;
    --no-report)
      REPORT="false"
      shift
      ;;
    --update-baseline)
      BASELINE="true"
      shift
      ;;
    -h|--help)
      echo "Usage: ./run-performance-tests.sh [options]"
      echo ""
      echo "Options:"
      echo "  --profile <name>    Run specific profile (desktop, mobile, slow, all)"
      echo "  --headed           Run tests in headed mode"
      echo "  --no-report        Skip report generation"
      echo "  --update-baseline  Update performance baseline after tests"
      echo "  -h, --help         Show this help message"
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

# Create results directory
mkdir -p test-results/performance

# run_tests runs performance tests for the specified profile in either headless or headed mode.
run_tests() {
  local profile=$1
  echo -e "\n${YELLOW}Running $profile performance tests...${NC}"
  
  if [ "$HEADLESS" == "true" ]; then
    npm run test:perf:$profile
  else
    PWDEBUG=1 npm run test:perf:$profile
  fi
}

# Run tests based on profile
if [ "$PROFILE" == "all" ]; then
  echo -e "${GREEN}Running all performance test profiles...${NC}"
  
  # Run each profile
  for profile in desktop mobile slow; do
    run_tests $profile
  done
else
  run_tests $PROFILE
fi

# Generate report if requested
if [ "$REPORT" == "true" ]; then
  echo -e "\n${YELLOW}Generating performance report...${NC}"
  npm run perf:generate-report -- --trends
  
  # Open HTML report
  if command -v open &> /dev/null; then
    open test-results/performance/performance-dashboard.html
  elif command -v xdg-open &> /dev/null; then
    xdg-open test-results/performance/performance-dashboard.html
  else
    echo -e "${GREEN}Report generated at: test-results/performance/performance-dashboard.html${NC}"
  fi
fi

# Update baseline if requested
if [ "$BASELINE" == "true" ]; then
  echo -e "\n${YELLOW}Updating performance baseline...${NC}"
  npm run perf:update-baseline
fi

echo -e "\n${GREEN}✨ Performance tests complete!${NC}"

# Check for regressions
if [ -f "test-results/performance/performance-report.json" ]; then
  # Use node to check for regressions
  node -e "
    const report = require('./test-results/performance/performance-report.json');
    const violations = report.aggregated.violations;
    if (violations && violations.length > 0) {
      console.log('\\n⚠️  Performance violations detected:');
      violations.forEach(v => {
        console.log(\`   - \${v.page}: \${v.metric} = \${v.value}ms (threshold: \${v.threshold}ms)\`);
      });
      process.exit(1);
    }
  " || {
    echo -e "\n${RED}❌ Performance regressions detected!${NC}"
    exit 1
  }
fi

echo -e "${GREEN}✅ All performance tests passed!${NC}"