#!/bin/bash

# Setup Taskmaster Aliases for Testing Workflow
# Run this script or add these to your ~/.zshrc

echo "Setting up Taskmaster aliases..."

# Basic Taskmaster aliases
echo "alias tm='task-master'" >> ~/.zshrc
echo "alias tmn='task-master next'" >> ~/.zshrc
echo "alias tml='task-master list'" >> ~/.zshrc
echo "alias tmc='task-master current'" >> ~/.zshrc
echo "alias tmd='task-master complete'" >> ~/.zshrc

# Testing integration aliases
echo "alias tmt='./scripts/taskmaster-test-helper.sh test'" >> ~/.zshrc
echo "alias tmv='./scripts/taskmaster-test-helper.sh validate'" >> ~/.zshrc
echo "alias tmr='./scripts/taskmaster-research.sh'" >> ~/.zshrc

# Quick workflow aliases
echo "alias tmwork='task-master next && task-master show \$(task-master next | grep -o "[0-9]\+" | head -1)'" >> ~/.zshrc
echo "alias tmcheck='./scripts/taskmaster-test-helper.sh validate && echo \"Ready to complete!\"'" >> ~/.zshrc
echo "alias tms='./scripts/taskmaster-show.sh'" >> ~/.zshrc

echo ""
echo "✅ Aliases added to ~/.zshrc"
echo ""
echo "📝 Quick Reference:"
echo "  tm      - Run any task-master command"
echo "  tmn     - Get next task"
echo "  tml     - List all tasks"
echo "  tmc     - Show current task"
echo "  tmd     - Mark task as done (add task ID)"
echo "  tmt     - Run tests for current task"
echo "  tmv     - Validate current task acceptance"
echo "  tmr     - Research helper (add query)"
echo "  tms     - Show task details (add task ID)"
echo "  tmwork  - Get next task and show details"
echo "  tmcheck - Validate task before completing"
echo ""
echo "Run: source ~/.zshrc to activate aliases"