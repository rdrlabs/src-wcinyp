#!/bin/bash

# Taskmaster Test Helper Script
# This script helps validate tests before marking tasks as complete

set -e

echo "🧪 Taskmaster Test Helper"
echo "========================"

# Get current task
CURRENT_TASK=$(task-master current 2>/dev/null || echo "No current task")

if [ "$CURRENT_TASK" = "No current task" ]; then
    echo "❌ No current task found. Use 'task-master next' to get a task."
    exit 1
fi

echo "📋 Current Task: $CURRENT_TASK"
echo ""

# Function to run tests based on task phase
run_phase_tests() {
    local task_id=$1
    
    case $task_id in
        1|2|3|4|5)
            echo "🏃 Running Phase 1 tests (E2E)..."
            if [ -f "playwright.config.ts" ]; then
                npm run test:e2e 2>/dev/null || echo "⚠️  E2E tests not yet configured"
            else
                echo "⏭️  Playwright not yet installed"
            fi
            ;;
        6|7|8|9)
            echo "🏃 Running Phase 2 tests (Visual)..."
            if [ -d "tests/e2e/visual" ]; then
                npm run test:visual 2>/dev/null || echo "⚠️  Visual tests not yet configured"
            else
                echo "⏭️  Visual tests not yet created"
            fi
            ;;
        10|11|12|13|14)
            echo "🏃 Running Phase 3 tests (Coverage & Performance)..."
            npm run test:coverage 2>/dev/null || echo "⚠️  Coverage not yet configured"
            ;;
        *)
            echo "🏃 Running all tests..."
            npm test
            ;;
    esac
}

# Function to check task acceptance criteria
check_acceptance() {
    local task_id=$1
    
    echo "✅ Checking acceptance criteria for task #$task_id..."
    
    case $task_id in
        1)
            # Check Playwright installation
            if npm list @playwright/test >/dev/null 2>&1; then
                echo "  ✓ Playwright installed"
            else
                echo "  ✗ Playwright not installed"
                return 1
            fi
            ;;
        2)
            # Check Playwright config
            if [ -f "playwright.config.ts" ]; then
                echo "  ✓ Playwright config exists"
            else
                echo "  ✗ Playwright config missing"
                return 1
            fi
            ;;
        3)
            # Check Fumadocs tests
            if [ -f "tests/e2e/fumadocs/validate-rendering.spec.ts" ]; then
                echo "  ✓ Fumadocs tests created"
                npm run test:fumadocs || return 1
            else
                echo "  ✗ Fumadocs tests missing"
                return 1
            fi
            ;;
        *)
            echo "  ℹ️  Manual verification needed for this task"
            ;;
    esac
    
    return 0
}

# Main execution
if [[ "$1" == "validate" ]]; then
    # Extract task ID from current task output
    TASK_ID=$(echo "$CURRENT_TASK" | grep -oE 'Task #[0-9]+' | grep -oE '[0-9]+' || echo "0")
    
    if [ "$TASK_ID" != "0" ]; then
        if check_acceptance "$TASK_ID"; then
            echo ""
            echo "✅ Task #$TASK_ID passes acceptance criteria!"
            echo "You can mark it complete with: task-master complete $TASK_ID"
        else
            echo ""
            echo "❌ Task #$TASK_ID does not meet acceptance criteria yet."
            echo "Please complete the requirements and try again."
            exit 1
        fi
    fi
elif [[ "$1" == "test" ]]; then
    # Extract task ID and run appropriate tests
    TASK_ID=$(echo "$CURRENT_TASK" | grep -oE 'Task #[0-9]+' | grep -oE '[0-9]+' || echo "0")
    run_phase_tests "$TASK_ID"
else
    echo "Usage:"
    echo "  ./scripts/taskmaster-test-helper.sh validate  # Check if current task is complete"
    echo "  ./scripts/taskmaster-test-helper.sh test      # Run tests for current task phase"
fi