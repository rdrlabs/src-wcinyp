#!/bin/bash

# Claude Code Shortcuts Helper
# This script provides directory shortcuts for Claude Code

# Get the shortcut command
SHORTCUT="$1"

case "$SHORTCUT" in
    "wcinyp")
        echo "$HOME/Documents/src-wcinyp"
        ;;
    *)
        echo "Unknown shortcut: $SHORTCUT"
        echo "Available shortcuts:"
        echo "  wcinyp - ~/Documents/src-wcinyp"
        exit 1
        ;;
esac