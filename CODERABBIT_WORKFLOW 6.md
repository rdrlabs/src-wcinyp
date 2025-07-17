# CodeRabbit Integration Workflow

This document explains how CodeRabbit is integrated into your development workflow to provide AI-powered code reviews that help Claude Code (and you) get quick feedback on code quality.

> **New!** Want to use CodeRabbit without creating PRs? See [CODERABBIT_LOCAL_GUIDE.md](./CODERABBIT_LOCAL_GUIDE.md) for the VSCode extension workflow!

## Overview

CodeRabbit is an AI code reviewer that:
- Reviews PRs automatically within seconds
- Provides Claude-like insights on code quality, security, and best practices
- Learns from your team's preferences over time
- Integrates seamlessly with GitHub

## Setup Complete ✅

### 1. CodeRabbit Configuration (`.coderabbit.yaml`)
- Custom review instructions for healthcare compliance
- Path-specific rules for different file types
- Security and accessibility checks enabled
- TypeScript strict mode enforcement

### 2. GitHub Actions Workflow (`.github/workflows/coderabbit.yml`)
- Automatic PR reviews on open/update
- Support for draft PRs (early feedback)
- Interactive reviews via comments

### 3. Claude Code Hooks (`.claude/hooks.json`)
- **Pre-commit**: Runs lint, type-check, and tests
- **Post-commit**: Auto-creates draft PR for CodeRabbit review
- **Pre-push**: Ensures tests pass before pushing

### 4. MCP Integration (`.claude/settings.local.json`) 🆕
- **Direct API Access**: Claude Code can read CodeRabbit reviews
- **Auto-implementation**: Implement suggested fixes automatically
- **Comment Resolution**: Mark comments as resolved
- **Enhanced Workflow**: AI-to-AI code improvement cycle

## How It Works

### When Coding with Claude Code:

1. **Make Changes**: I write code based on your requirements
2. **Commit**: When committing, tests run automatically
3. **Auto PR**: A draft PR is created automatically (if on feature branch)
4. **Instant Review**: CodeRabbit reviews within seconds
5. **Iterate**: I can see CodeRabbit's feedback and improve the code
6. **Quality Code**: You get thoroughly reviewed, high-quality code

### With MCP Integration (Enhanced Workflow):

1. **Make Changes**: Claude Code writes code
2. **Auto PR**: Created via hooks
3. **Instant Review**: CodeRabbit analyzes
4. **Fetch Reviews**: `"Get CodeRabbit reviews for PR #X"`
5. **Auto-Implement**: `"Implement all CodeRabbit suggestions"`
6. **Mark Resolved**: Comments marked as addressed
7. **Perfect Code**: Fully reviewed and improved automatically!

### Example Workflow:

```bash
# Claude Code makes changes
git add .
git commit -m "feat: add user authentication"
# Hooks run tests automatically
# Draft PR created automatically
# CodeRabbit reviews in ~30 seconds
# Claude Code can read feedback and improve
```

## Interacting with CodeRabbit

### In Pull Requests:
- **@coderabbitai review** - Request a fresh review
- **@coderabbitai resolve** - Mark comments as resolved
- **@coderabbitai configuration** - Show current config
- **@coderabbitai help** - Get help with commands

### Review Features:
- 🔍 Security vulnerability detection
- ♿ Accessibility compliance checks
- 🚀 Performance optimization suggestions
- 📚 Best practices enforcement
- 🧪 Test coverage analysis

## Benefits for Your Workflow

1. **Double AI Review**: Both Claude Code and CodeRabbit review the code
2. **Instant Feedback**: No waiting for human reviewers
3. **Educational**: Learn from AI suggestions
4. **Consistent Quality**: Automated enforcement of standards
5. **Healthcare Compliance**: Custom rules for your medical platform

## Configuration Customization

### To adjust review strictness:
Edit `.coderabbit.yaml`:
```yaml
reviews:
  request_changes_workflow: true  # Make reviews stricter
```

### To add custom checks:
```yaml
custom_checks:
  - name: "PHI Protection"
    pattern: "**/*.tsx"
    check: "Ensure no patient data in logs"
```

## Next Steps

1. **Install CodeRabbit**: Visit https://github.com/marketplace/coderabbitai
2. **Grant Permissions**: Allow access to your repository
3. **Set GitHub PAT**: `export GITHUB_PAT=ghp_your_token` (for MCP)
4. **Start Coding**: The integration is ready to use!

## MCP Integration 🆕

The CodeRabbit MCP (Model Context Protocol) server is now configured, enabling Claude Code to:
- Directly access CodeRabbit reviews via API
- Implement suggestions automatically
- Create a seamless AI-to-AI workflow

For detailed MCP usage, see: [CODERABBIT_MCP_GUIDE.md](./CODERABBIT_MCP_GUIDE.md)

## Local Development Options 🆕

CodeRabbit isn't limited to PRs! You have two options for local development:

1. **VSCode Extension** (Free) - Review code locally without PRs
   - Install from VSCode marketplace
   - Reviews on commit or manually
   - Perfect for iterative development
   - See [CODERABBIT_LOCAL_GUIDE.md](./CODERABBIT_LOCAL_GUIDE.md)

2. **Rapid Draft PRs** - Full features with quick turnaround
   - Create temporary PRs for review
   - Get full CodeRabbit analysis
   - MCP integration works
   - Delete PR when done

## Tips for Best Results

1. **Write Clear PR Titles**: Help CodeRabbit understand context
2. **Include PR Descriptions**: Explain the "why" behind changes
3. **Respond to Comments**: CodeRabbit learns from interactions
4. **Use Draft PRs**: Get early feedback while developing

## Troubleshooting

### PR Not Created Automatically?
- Ensure you're on a feature branch (not main/master)
- Check if GitHub CLI (`gh`) is installed and configured
- Run `gh auth login` if needed

### CodeRabbit Not Reviewing?
- Check if CodeRabbit app is installed on GitHub
- Ensure repository permissions are granted
- Check workflow runs in Actions tab

### Tests Failing on Commit?
- Run `npm test -- --run` manually
- Fix any failing tests before committing
- Use `--no-verify` to skip hooks temporarily (not recommended)

## Support

- CodeRabbit Docs: https://docs.coderabbit.ai/
- GitHub Actions: Check `.github/workflows/coderabbit.yml`
- Claude Code Hooks: See `.claude/hooks.json`