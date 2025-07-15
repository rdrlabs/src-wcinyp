#!/bin/bash

# Taskmaster Show Helper - Provides the missing 'tms' command
# Usage: tms <task-id>

if [ -z "$1" ]; then
    echo "Usage: tms <task-id>"
    echo "Shows detailed information about a specific task"
    exit 1
fi

# Run task-master show command
task-master show "$1"