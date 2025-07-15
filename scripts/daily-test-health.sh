#!/bin/bash
# Daily Test Health Check Script
# Run this every morning to get a quick health status

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Daily Test Health Check ===${NC}"
echo -e "Date: $(date)"
echo "======================================"

# command_exists checks if a given command is available in the system PATH.
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 1. Check CI Status
echo -e "\n${YELLOW}1. Checking CI Status...${NC}"
if command_exists gh; then
    echo "Recent CI runs:"
    gh run list --limit 5 --json status,conclusion,name,createdAt | \
    jq -r '.[] | "\(.createdAt | split("T")[0]) \(.name): \(.conclusion // .status)"'
    
    FAILED_COUNT=$(gh run list --limit 20 --json conclusion | jq '[.[] | select(.conclusion == "failure")] | length')
    if [ "$FAILED_COUNT" -gt 3 ]; then
        echo -e "${RED}⚠️  Warning: $FAILED_COUNT failed runs in recent history${NC}"
    else
        echo -e "${GREEN}✅ CI health looks good${NC}"
    fi
else
    echo "GitHub CLI not installed. Skipping CI check."
fi

# 2. Run Quick Test Suite
echo -e "\n${YELLOW}2. Running quick test validation...${NC}"
if [ -f "scripts/parallel-test-runner.sh" ]; then
    # Run only unit tests for quick check
    npm test -- --run --reporter=json > test-results/daily-check.json 2>&1 || true
    
    # Parse results
    if [ -f "test-results/daily-check.json" ]; then
        TOTAL=$(jq '.numTotalTests // 0' test-results/daily-check.json)
        PASSED=$(jq '.numPassedTests // 0' test-results/daily-check.json)
        FAILED=$(jq '.numFailedTests // 0' test-results/daily-check.json)
        
        if [ "$FAILED" -eq 0 ]; then
            echo -e "${GREEN}✅ All unit tests passing ($PASSED/$TOTAL)${NC}"
        else
            echo -e "${RED}❌ $FAILED tests failing ($PASSED/$TOTAL passed)${NC}"
        fi
    fi
else
    npm test -- --run || echo -e "${YELLOW}Some tests failed${NC}"
fi

# 3. Check for Flaky Tests
echo -e "\n${YELLOW}3. Analyzing flaky tests...${NC}"
if [ -f "scripts/detect-flaky-tests.js" ]; then
    node scripts/detect-flaky-tests.js
else
    echo "Flaky test detector not found"
fi

# 4. Performance Metrics
echo -e "\n${YELLOW}4. Recent Performance Metrics...${NC}"
if [ -f "test-results/performance/performance-report.json" ]; then
    PERF_DATE=$(jq -r '.metadata.generatedAt // "unknown"' test-results/performance/performance-report.json 2>/dev/null | cut -d'T' -f1)
    echo "Last performance test: $PERF_DATE"
    
    # Check if metrics are within budget
    jq -r '.aggregated.violations[]? | "  ⚠️  \(.page): \(.metric) = \(.value)ms (threshold: \(.threshold)ms)"' \
        test-results/performance/performance-report.json 2>/dev/null || echo -e "${GREEN}  ✅ All metrics within budget${NC}"
else
    echo "No recent performance data found"
fi

# 5. Test Coverage
echo -e "\n${YELLOW}5. Test Coverage Summary...${NC}"
if [ -f "coverage/coverage-summary.json" ]; then
    TOTAL_COV=$(jq '.total.lines.pct' coverage/coverage-summary.json)
    echo "Overall coverage: ${TOTAL_COV}%"
    
    # Find files with low coverage
    echo "Files with coverage < 70%:"
    jq -r 'to_entries[] | select(.key != "total") | select(.value.lines.pct < 70) | "  - \(.key): \(.value.lines.pct)%"' \
        coverage/coverage-summary.json 2>/dev/null || echo "  None found"
else
    echo "No coverage data available. Run: npm run test:coverage"
fi

# 6. Generate Summary
echo -e "\n${BLUE}=== Summary ===${NC}"
echo "Generated at: $(date '+%Y-%m-%d %H:%M:%S')"

# Create summary file
SUMMARY_FILE="test-results/daily-summary-$(date +%Y%m%d).json"
cat > "$SUMMARY_FILE" << EOF
{
  "date": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "health": {
    "ci_failures": ${FAILED_COUNT:-0},
    "unit_tests": {
      "total": ${TOTAL:-0},
      "passed": ${PASSED:-0},
      "failed": ${FAILED:-0}
    },
    "coverage": ${TOTAL_COV:-0}
  }
}
EOF

echo -e "${GREEN}Summary saved to: $SUMMARY_FILE${NC}"

# 7. Action Items
echo -e "\n${YELLOW}📋 Action Items:${NC}"
if [ "${FAILED:-0}" -gt 0 ]; then
    echo -e "  ${RED}• Fix failing unit tests${NC}"
fi
if [ "${FAILED_COUNT:-0}" -gt 3 ]; then
    echo -e "  ${RED}• Investigate CI failures${NC}"
fi
if [ "${TOTAL_COV:-100}" -lt "80" ]; then
    echo -e "  ${YELLOW}• Improve test coverage (currently ${TOTAL_COV}%)${NC}"
fi

echo -e "\n${GREEN}✨ Daily health check complete!${NC}"