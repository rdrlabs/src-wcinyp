# CodeRabbit MCP Integration Guide

This guide explains how to use the CodeRabbit Model Context Protocol (MCP) integration with Claude Code for enhanced code review workflows.

## Overview

The CodeRabbit MCP server enables Claude Code to:
- 🔍 Directly access CodeRabbit reviews on pull requests
- 🛠️ Implement suggested fixes automatically
- ✅ Mark comments as resolved
- 🤖 Create a seamless AI-to-AI code review workflow

## Prerequisites

1. **GitHub Personal Access Token (PAT)**
   - Create at: https://github.com/settings/tokens
   - Required scopes: `repo`, `read:org`
   - Set as environment variable: `export GITHUB_PAT=ghp_your_token_here`

2. **CodeRabbit installed on your repository**
   - Install from: https://github.com/marketplace/coderabbitai

## Setup Complete ✅

The MCP server is already configured in `.claude/settings.local.json`:

```json
{
  "mcpServers": {
    "coderabbitai": {
      "command": "npx",
      "args": ["coderabbitai-mcp@latest"],
      "env": {
        "GITHUB_PAT": "${GITHUB_PAT}"
      }
    }
  }
}
```

## How to Use

### 1. Set GitHub PAT Environment Variable

Before starting Claude Code:
```bash
export GITHUB_PAT=ghp_your_personal_access_token
claude-code  # or however you start Claude Code
```

### 2. Available Commands

Once connected, you can ask Claude Code to:

#### Get All Reviews for a PR
```
"Show me all CodeRabbit reviews for PR #7 in rdrlabs/src-wcinyp"
```

#### Get Specific Review Details
```
"Get the details of CodeRabbit comments that have AI prompts I can implement"
```

#### Implement Suggestions
```
"Implement the CodeRabbit suggestions for improving the Footer component"
```

#### Use the Slash Command
```
/coderabbit-review owner:rdrlabs repo:src-wcinyp pullNumber:7
```

### 3. Workflow Example

1. **Create a PR**: Claude Code commits and creates a draft PR
2. **CodeRabbit Reviews**: Automatic review within seconds
3. **Fetch Reviews**: "Get CodeRabbit reviews for the latest PR"
4. **Implement Fixes**: "Implement all CodeRabbit suggestions"
5. **Mark Resolved**: Comments are automatically marked as resolved

## MCP Server Capabilities

### Available Tools

1. **`getReviews`** - Get all CodeRabbit reviews for a PR
   - Returns review IDs and summaries

2. **`getReviewDetails`** - Get detailed review information
   - Configuration used
   - Files reviewed
   - Overall assessment

3. **`getComments`** - Extract line-specific comments
   - File path and line numbers
   - AI prompts for fixes
   - Severity levels

4. **`getCommentDetails`** - Deep dive into specific comments
   - Full context
   - Example fixes
   - Related code snippets

5. **`resolveComment`** - Mark comments as addressed
   - Options: "addressed", "wont_fix", "not_applicable"

## Troubleshooting

### MCP Server Not Connecting?

1. **Check GitHub PAT**:
   ```bash
   echo $GITHUB_PAT  # Should show your token
   ```

2. **Restart Claude Code** after setting the environment variable

3. **Verify MCP is enabled** in Claude Code settings

### CodeRabbit Not Reviewing?

1. Ensure CodeRabbit is installed on the repository
2. Check if the PR exists and has been reviewed
3. Verify GitHub PAT has correct permissions

### Error Messages

- `"GitHub PAT not configured"` - Set the GITHUB_PAT environment variable
- `"PR not found"` - Check PR number and repository
- `"No reviews found"` - CodeRabbit may not have reviewed yet

## Advanced Usage

### Batch Processing Reviews
```
"Get all CodeRabbit reviews for PR #7, implement all high-priority suggestions, and mark them as resolved"
```

### Filter by File Type
```
"Show me CodeRabbit comments only for TypeScript files in PR #7"
```

### Integration with Existing Workflow

The MCP server complements the existing workflow:
1. **Hooks** create PRs automatically
2. **GitHub Actions** trigger CodeRabbit
3. **MCP** enables Claude Code to read and implement reviews
4. **Result**: Fully automated code improvement cycle

## Benefits

1. **Speed**: Implement reviews in seconds, not minutes
2. **Accuracy**: AI understands AI suggestions perfectly
3. **Completeness**: Never miss a review comment
4. **Learning**: Claude Code learns from CodeRabbit's patterns

## Security Notes

- GitHub PAT is only accessible to the MCP server
- No credentials are stored in files
- All communication is over secure channels
- PAT should have minimal required permissions

## Next Steps

1. Set your `GITHUB_PAT` environment variable
2. Create a test PR to see the integration in action
3. Ask Claude Code to fetch and implement CodeRabbit reviews
4. Enjoy automated code quality improvements! 🚀

---

For more information:
- CodeRabbit MCP Server: https://github.com/bradthebeeble/coderabbitai-mcp
- Model Context Protocol: https://modelcontextprotocol.io/
- CodeRabbit Docs: https://docs.coderabbit.ai/