#!/bin/bash

# Custom research functionality for Taskmaster
# Since the built-in research command doesn't work with Claude Code,
# this script provides a workaround using available tools

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# usage displays usage instructions, available options, and example commands for the Taskmaster Research Tool script.
usage() {
    echo "Usage: $0 \"research query\" [options]"
    echo ""
    echo "Options:"
    echo "  -f, --files FILE1,FILE2   Comma-separated list of files to include in context"
    echo "  -t, --tasks TASK1,TASK2   Comma-separated list of task IDs to include"
    echo "  -h, --help                Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 \"Best practices for Playwright visual testing\""
    echo "  $0 \"Fumadocs MDX configuration\" -f \"mdx-components.ts,source.config.ts\""
    echo "  $0 \"Testing strategy\" -t \"7,8,9\""
}

# Parse arguments
QUERY=""
FILES=""
TASKS=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -f|--files)
            FILES="$2"
            shift 2
            ;;
        -t|--tasks)
            TASKS="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            if [ -z "$QUERY" ]; then
                QUERY="$1"
            fi
            shift
            ;;
    esac
done

# Check if query is provided
if [ -z "$QUERY" ]; then
    echo -e "${YELLOW}Error: No research query provided${NC}"
    usage
    exit 1
fi

# Display research header
echo -e "${BLUE}╭──────────────────────────────────────────╮${NC}"
echo -e "${BLUE}│       🔍 Taskmaster Research Tool        │${NC}"
echo -e "${BLUE}╰──────────────────────────────────────────╯${NC}"
echo ""
echo -e "${GREEN}Query:${NC} $QUERY"

# Build context information
CONTEXT=""

# Add file context if specified
if [ -n "$FILES" ]; then
    echo -e "${GREEN}Files:${NC} $FILES"
    CONTEXT="$CONTEXT\n\nFile Context:"
    IFS=',' read -ra FILE_ARRAY <<< "$FILES"
    for file in "${FILE_ARRAY[@]}"; do
        if [ -f "$file" ]; then
            CONTEXT="$CONTEXT\n\n--- $file ---"
            # Get first 50 lines of the file
            CONTEXT="$CONTEXT\n$(head -50 "$file" 2>/dev/null || echo "File not found")"
        fi
    done
fi

# Add task context if specified
if [ -n "$TASKS" ]; then
    echo -e "${GREEN}Tasks:${NC} $TASKS"
    CONTEXT="$CONTEXT\n\nTask Context:"
    IFS=',' read -ra TASK_ARRAY <<< "$TASKS"
    for task_id in "${TASK_ARRAY[@]}"; do
        # Extract task info from tasks.json
        TASK_INFO=$(jq -r ".master.tasks[] | select(.id == $task_id) | \"Task #\(.id): \(.title)\\nDescription: \(.description)\\nStatus: \(.status)\\nPhase: \(.phase)\"" .taskmaster/tasks/tasks.json 2>/dev/null)
        if [ -n "$TASK_INFO" ]; then
            CONTEXT="$CONTEXT\n\n$TASK_INFO"
        fi
    done
fi

echo ""
echo -e "${BLUE}Researching...${NC}"
echo ""

# Create a research prompt
RESEARCH_PROMPT="Research Query: $QUERY

Please provide comprehensive information about this topic, focusing on:
1. Current best practices (2024-2025)
2. Implementation examples
3. Common pitfalls and solutions
4. Relevant tools and libraries
5. Performance considerations$CONTEXT"

# Save the research prompt to a file
TEMP_FILE="/tmp/taskmaster-research-$$.md"
echo "$RESEARCH_PROMPT" > "$TEMP_FILE"

# Display research results header
echo -e "${BLUE}╭──────────────────────────────────────────╮${NC}"
echo -e "${BLUE}│          📊 Research Results             │${NC}"
echo -e "${BLUE}╰──────────────────────────────────────────╯${NC}"
echo ""

# Output the research prompt for manual research
echo "Since the automated research isn't working with Claude Code, you can:"
echo ""
echo "1. Use WebSearch in Claude Code with this query:"
echo -e "   ${GREEN}$QUERY${NC}"
echo ""
echo "2. Copy the full research prompt from:"
echo -e "   ${GREEN}$TEMP_FILE${NC}"
echo ""
echo "3. Key topics to research:"
echo "   - Current best practices and patterns"
echo "   - Tool-specific documentation"
echo "   - Common implementation examples"
echo "   - Performance optimization techniques"
echo ""

# If this is about visual testing, provide some quick tips
if [[ "$QUERY" == *"visual"* ]] || [[ "$QUERY" == *"pixelmatch"* ]] || [[ "$QUERY" == *"screenshot"* ]]; then
    echo -e "${YELLOW}Quick Visual Testing Tips:${NC}"
    echo "• Use consistent viewport sizes (1280x720 recommended)"
    echo "• Disable animations for stable screenshots"
    echo "• Set threshold to 0.1 (10%) for initial tests"
    echo "• Create baseline images on first run"
    echo "• Use element-specific captures for components"
    echo "• Store images in tests/visual/{baseline,current,diff}"
    echo ""
fi

# If this is about Playwright, provide some quick tips
if [[ "$QUERY" == *"playwright"* ]] || [[ "$QUERY" == *"e2e"* ]] || [[ "$QUERY" == *"test"* ]]; then
    echo -e "${YELLOW}Quick Playwright Tips:${NC}"
    echo "• Use page.waitForLoadState('networkidle') for SPAs"
    echo "• Implement retry logic for flaky tests"
    echo "• Use data-testid attributes for stable selectors"
    echo "• Run tests in parallel for faster execution"
    echo "• Configure proper timeouts (30s default)"
    echo "• Use fixtures for common setup/teardown"
    echo ""
fi

# Clean up after a delay (so user can see the file path)
(sleep 300 && rm -f "$TEMP_FILE" 2>/dev/null) &

echo -e "${GREEN}✓ Research prompt generated successfully${NC}"