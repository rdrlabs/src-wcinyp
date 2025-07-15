#!/bin/bash

# Start Claude Code with CodeRabbit MCP integration

echo "🚀 Starting Claude Code with CodeRabbit integration..."

# Check if GITHUB_PAT is set
if [ -z "$GITHUB_PAT" ]; then
    echo "❌ GITHUB_PAT environment variable not set!"
    echo "Please set it in your ~/.zshrc or ~/.bashrc file:"
    echo "  export GITHUB_PAT='your-github-personal-access-token'"
    exit 1
fi

echo "✅ GitHub PAT is configured"
echo "🤖 CodeRabbit MCP server will be available"
echo ""
echo "You can now ask Claude Code to:"
echo "  - 'Show me CodeRabbit reviews for PR #X'"
echo "  - 'Implement CodeRabbit suggestions'"
echo "  - '/coderabbit-review owner:rdrlabs repo:src-wcinyp pullNumber:X'"
echo ""

# Start Claude Code
# Note: Replace 'claude' with the actual command you use to start Claude Code
claude