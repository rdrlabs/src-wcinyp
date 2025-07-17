# CodeRabbit Local Development Guide (No PR Required!)

This guide shows how to use CodeRabbit for local code reviews without creating pull requests.

## 🆓 VSCode Extension (Free, No PR Needed!)

The CodeRabbit VSCode extension provides instant code reviews locally:

### Installation

1. **Open VSCode**
2. **Go to Extensions** (⌘⇧X on Mac)
3. **Search** "CodeRabbit"
4. **Install** the official CodeRabbit extension
5. **Reload** VSCode

### Setup

1. **Open your project** in VSCode
2. **Click CodeRabbit icon** in the activity bar (left sidebar)
3. **Sign in** with your GitHub account
4. **That's it!** No additional configuration needed

### How to Use

#### Option 1: Automatic Review on Commit
```bash
# Make changes in Claude Code CLI
git add .
git commit -m "feat: new feature"
# CodeRabbit automatically reviews!
```

#### Option 2: Manual Review Anytime
1. Click CodeRabbit icon in VSCode
2. Choose review type:
   - **All Changes**: Review everything vs base branch
   - **Committed Only**: Review just commits
   - **Uncommitted Only**: Review working changes

#### Option 3: Review Specific Files
1. Right-click any file in VSCode
2. Select "CodeRabbit: Review File"

## 🚀 Hybrid Workflow: VSCode + Claude Code CLI

Best of both worlds - Claude Code writes, CodeRabbit reviews locally!

### Setup Hybrid Workflow

1. **Open Terminal in VSCode** (⌃\` on Mac)
2. **Start Claude Code** in the terminal:
   ```bash
   claude
   ```
3. **Work normally** - I write code in the CLI
4. **VSCode auto-updates** - You see changes live
5. **CodeRabbit reviews** - Get instant feedback

### Workflow Example

```bash
# In VSCode terminal with Claude Code running:
You: "Add error handling to the Footer component"
Me: [writes code]

# In VSCode UI:
- See changes appear live
- CodeRabbit icon shows review available
- Click to see suggestions
- Tell me what to fix

You: "CodeRabbit says to add try-catch"
Me: [implements the suggestion]
```

## ⚡ Quick Review Commands

### In VSCode Terminal (while using Claude Code):

```bash
# Stage and review changes
git add . && git commit -m "WIP: reviewing locally"

# Review without committing (using VSCode)
# Just click CodeRabbit icon → "Review Uncommitted"

# Undo the WIP commit after review
git reset --soft HEAD~1
```

## 🎯 Best Practices for Local Development

### 1. **Continuous Review Cycle**
- Write feature with Claude Code
- Review locally with CodeRabbit
- Fix issues immediately
- Only push when perfect

### 2. **Pre-Push Checklist**
```bash
# Before pushing to GitHub:
1. Run CodeRabbit review on all changes
2. Fix all high-priority issues
3. Run tests: npm test
4. Then push confidently
```

### 3. **Quick Feedback Loop**
- Make small commits frequently
- Review each commit immediately
- Never accumulate tech debt

## 🔄 Alternative: Rapid Draft PR Workflow

If you prefer the full CodeRabbit experience with all features:

### Create Instant Draft PR
```bash
# Super fast PR creation for review
git checkout -b quick-review/feature-name
git add . && git commit -m "Quick review: feature name"
git push -u origin HEAD
gh pr create --draft --title "REVIEW ONLY: Feature" --body "Just for CodeRabbit review"

# After review and fixes:
gh pr close  # Close without merging
git checkout main
git branch -D quick-review/feature-name
```

### Benefits:
- Full CodeRabbit features (not just VSCode subset)
- MCP integration works (I can read reviews)
- Can delete PR after review

## 📊 Comparison: Local vs PR-Based

| Feature | VSCode Extension | PR-Based |
|---------|-----------------|----------|
| No PR needed | ✅ | ❌ |
| Instant feedback | ✅ | ✅ (30 seconds) |
| Full features | ❌ (subset) | ✅ |
| Claude reads reviews | ❌ | ✅ (via MCP) |
| Free | ✅ | ✅ (public repos) |

## 🎨 VSCode Settings for Best Experience

Add to VSCode settings.json:
```json
{
  "coderabbit.autoReviewOnCommit": true,
  "coderabbit.showInlinesuggestions": true,
  "coderabbit.reviewUncommittedChanges": true
}
```

## 🤝 Recommended Workflow

1. **Use VSCode + Claude Code terminal** for active development
2. **Get instant local reviews** without PRs
3. **Create PR only when ready** to merge
4. **Full PR review** catches anything missed locally

## 💡 Pro Tips

1. **Review Often**: Don't wait - review after each logical change
2. **Use Both Tools**: Local for speed, PR for thoroughness  
3. **Learn Patterns**: CodeRabbit teaches best practices
4. **Iterate Fast**: Fix issues immediately while context is fresh

---

## Quick Start Checklist

- [ ] Install CodeRabbit VSCode extension
- [ ] Open project in VSCode
- [ ] Start Claude Code in VSCode terminal
- [ ] Make changes and review locally
- [ ] No PR needed until ready to merge!

This gives you the best of both worlds: Claude Code's intelligence + CodeRabbit's instant local feedback! 🚀