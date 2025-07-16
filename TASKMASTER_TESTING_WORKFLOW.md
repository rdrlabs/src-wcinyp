# Taskmaster Testing Workflow Guide

## Overview

This guide explains how to use Taskmaster with the phased testing plan to evolve development safely and effectively with maximum yield.

## Quick Start

### 1. Setup Aliases (One Time)
```bash
./scripts/setup-taskmaster-aliases.sh
source ~/.zshrc
```

### 2. Basic Workflow
```bash
# Get your next task
tmn

# See current task details
tmc

# Run tests for current task phase
tmt

# Validate task completion
tmv

# Mark task complete
tmd <task-id>
```

## Phased Implementation Structure

### Phase 1: Browser Automation (Tasks 1-5)
**Goal**: Enable AI to validate client-side rendering

```bash
# Start Phase 1
tm next

# Example workflow for Task 1 (Install Playwright)
npm install --save-dev @playwright/test
npx playwright install
tmv  # Validate installation
tmd 1  # Mark complete
```

### Phase 2: Visual Testing (Tasks 6-9)
**Goal**: Catch visual regressions

```bash
# After Phase 1 complete
tm next  # Will get Task 6

# Run visual tests once set up
npm run test:visual
```

### Phase 3: Production Hardening (Tasks 10-14)
**Goal**: Ensure reliability with coverage and CI

```bash
# Final phase
npm run test:coverage
npm run test:ci
```

## Task Validation

Each task has specific acceptance criteria. The test helper checks these automatically:

```bash
# Check if current task meets criteria
tmv

# Example output:
✅ Checking acceptance criteria for task #3...
  ✓ Fumadocs tests created
  ✓ All tests pass
✅ Task #3 passes acceptance criteria!
You can mark it complete with: task-master complete 3
```

## Integration with Claude Code

When using Claude Code for development:

1. **Before Starting Work**:
   ```bash
   tmn  # Get next task
   # Share task details with Claude Code
   ```

2. **During Development**:
   ```bash
   tmt  # Run tests to verify changes
   # Claude Code can see test results
   ```

3. **Before Completing**:
   ```bash
   tmv  # Validate acceptance criteria
   # Only mark complete when all pass
   ```

## Test Commands by Phase

### Phase 1 Commands
```bash
npm run test:e2e        # Run all E2E tests
npm run test:fumadocs   # Run only Fumadocs tests
npm run test:e2e:debug  # Debug with UI
```

### Phase 2 Commands
```bash
npm run test:visual     # Run visual regression tests
# Update baselines when needed:
cp tests/visual/current/*.png tests/visual/baseline/
```

### Phase 3 Commands
```bash
npm run test:coverage   # Generate coverage report
npm run test:ci         # Run all tests for CI
npm run test:all        # Everything including visual
```

## Common Workflows

### Starting Fresh
```bash
# See all tasks
tml

# Get first pending task
tmn

# Start working
code .  # or use Claude Code
```

### Checking Progress
```bash
# See completed vs pending
tml | grep -E "(completed|pending)" | sort | uniq -c

# Get current phase status
tml | grep "phase.*1" | grep pending  # Phase 1 remaining
```

### Handling Blocked Tasks
```bash
# If a task is blocked
tm defer <task-id> --reason "Waiting for X"

# Move to next available
tmn
```

## Benefits of This Workflow

### 1. **Progressive Enhancement**
- Each phase builds on the previous
- No breaking changes to existing tests
- Can stop at any phase with value

### 2. **AI-Optimized Development**
- Clear pass/fail signals for Claude Code
- Self-documenting through test names
- No manual verification needed

### 3. **Maximum Yield**
- Immediate feedback on changes
- Catch regressions instantly
- Build confidence progressively

### 4. **No Steps Backward**
- Existing 387 tests keep passing
- Each tool justified by value
- Incremental adoption

## Troubleshooting

### Task Master Not Working
```bash
# Check version
task-master --version

# Verify tasks loaded
cat .taskmaster/tasks/tasks.json | jq '.tasks | length'
# Should show: 14
```

### Tests Not Running
```bash
# Check if in correct directory
pwd  # Should be in project root

# Verify test scripts exist
npm run  # Lists all available scripts
```

### Validation Failing
```bash
# Run validation with details
./scripts/taskmaster-test-helper.sh validate

# Check specific acceptance criteria in tasks.json
cat .taskmaster/tasks/tasks.json | jq '.tasks[] | select(.id == 3)'
```

## Best Practices

1. **Complete Tasks in Order**
   - Dependencies are set up for a reason
   - Each task enables the next

2. **Run Tests Frequently**
   - After every significant change
   - Before marking tasks complete

3. **Update Documentation**
   - When you discover new patterns
   - When you solve tricky problems

4. **Commit After Each Task**
   - Creates clear history
   - Easy to rollback if needed

## Next Steps

1. Run `tmn` to get your first testing task
2. Follow the acceptance criteria
3. Use `tmv` to validate before completing
4. Proceed through all three phases

By the end, you'll have:
- ✅ Full E2E testing with Playwright
- ✅ Visual regression testing
- ✅ 80%+ code coverage
- ✅ CI/CD integration
- ✅ Confidence to refactor anything

Start now: `tmn` 🚀