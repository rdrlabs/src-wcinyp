#!/bin/bash
# Wrapper script for claude CLI to ensure it works with Taskmaster

# Get the directory of this script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Execute the claude CLI from node_modules
exec "$DIR/node_modules/.bin/claude" "$@"