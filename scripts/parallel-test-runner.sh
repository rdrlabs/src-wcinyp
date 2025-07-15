#!/bin/bash
# Parallel Test Runner
# Optimizes test execution by running different test suites in parallel

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Parallel Test Runner${NC}"
echo "======================================"

# Start timer
START_TIME=$(date +%s)

# Create results directory
mkdir -p test-results/parallel

# Function to run test suite
run_suite() {
  local suite_name=$1
  local test_command=$2
  local log_file="test-results/parallel/${suite_name}.log"
  
  echo -e "${YELLOW}Starting ${suite_name}...${NC}"
  
  if $test_command > "$log_file" 2>&1; then
    echo -e "${GREEN}✅ ${suite_name} passed${NC}"
    return 0
  else
    echo -e "${RED}❌ ${suite_name} failed${NC}"
    return 1
  fi
}

# Export function for parallel execution
export -f run_suite
export GREEN YELLOW RED NC

# Define test suites
SUITES=(
  "unit:npm test -- --run"
  "e2e-chromium:npx playwright test --project=chromium"
  "e2e-firefox:npx playwright test --project=firefox"
  "e2e-webkit:npx playwright test --project=webkit"
  "visual:npm run test:visual"
  "fumadocs:npm run test:fumadocs"
  "performance:npm run test:perf"
)

# Run tests in parallel
echo -e "\n${YELLOW}Running ${#SUITES[@]} test suites in parallel...${NC}\n"

# Use GNU parallel if available, otherwise fall back to background processes
if command -v parallel &> /dev/null; then
  printf '%s\n' "${SUITES[@]}" | parallel -j 4 --colsep ':' run_suite {1} {2}
  PARALLEL_EXIT=$?
else
  # Fallback to background processes
  PIDS=()
  FAILED_SUITES=()
  
  for suite in "${SUITES[@]}"; do
    IFS=':' read -r name command <<< "$suite"
    run_suite "$name" "$command" &
    PIDS+=($!)
  done
  
  # Wait for all processes
  PARALLEL_EXIT=0
  for i in "${!PIDS[@]}"; do
    if ! wait "${PIDS[$i]}"; then
      PARALLEL_EXIT=1
      IFS=':' read -r name _ <<< "${SUITES[$i]}"
      FAILED_SUITES+=("$name")
    fi
  done
fi

# Calculate duration
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

# Generate summary
echo -e "\n${GREEN}📊 Test Summary${NC}"
echo "======================================"
echo -e "Total duration: ${MINUTES}m ${SECONDS}s"

# Check for failures
if [ $PARALLEL_EXIT -ne 0 ]; then
  echo -e "\n${RED}❌ Some test suites failed!${NC}"
  
  if [ ${#FAILED_SUITES[@]} -gt 0 ]; then
    echo -e "\nFailed suites:"
    for suite in "${FAILED_SUITES[@]}"; do
      echo -e "  - ${suite}"
      echo -e "    Log: test-results/parallel/${suite}.log"
    done
  fi
  
  exit 1
else
  echo -e "\n${GREEN}✅ All test suites passed!${NC}"
  
  # Run flaky test detection
  if [ -f "scripts/detect-flaky-tests.js" ]; then
    echo -e "\n${YELLOW}Analyzing for flaky tests...${NC}"
    node scripts/detect-flaky-tests.js
  fi
fi

# Merge coverage reports if they exist
if [ -d "coverage" ]; then
  echo -e "\n${YELLOW}Merging coverage reports...${NC}"
  npx nyc merge coverage coverage/merged
  npx nyc report --reporter=lcov --reporter=text
fi

echo -e "\n${GREEN}✨ Parallel test run complete!${NC}"