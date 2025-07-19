# Qodo Free Tier Setup Guide

## 🎯 Goal: Maximize 75 Free PRs/Month

This guide helps you extract maximum value from Qodo's free tier by optimizing configuration, workflows, and integrations.

## 📋 Quick Setup Checklist

- [x] Qodo Merge Pro installed on GitHub
- [x] `.pr_agent.toml` configuration created
- [ ] Chrome extension installed
- [ ] MCP tools configured (optional)
- [ ] Test PR created
- [ ] Team commands documented

## 1. GitHub Integration (Already Complete ✅)

Your Qodo Merge Pro is already active. No additional setup needed!

## 2. Configuration File (Already Complete ✅)

The `.pr_agent.toml` file has been created with learning-optimized settings.

## 3. Chrome Extension Setup (Recommended)

The Chrome extension enables AI chat directly in PRs:

1. **Install Extension**
   - Visit: https://chromewebstore.google.com/detail/pr-agent-chrome-extension/ephlnjeghhogofkifjloamocljapahnl
   - Click "Add to Chrome"
   - Sign in with GitHub when prompted

2. **Features Unlocked**
   - Chat with AI about specific code lines
   - Ask questions directly in PR comments
   - Get instant explanations
   - No PR quota usage for chat!

## 4. Essential PR Commands

### 🎯 Core Commands (Use These Most)

```bash
/describe              # Auto-generate PR description
/review               # Full code review
/improve              # Get improvement suggestions
/ask [question]       # Ask specific questions
```

### 💡 Smart Usage Examples

```bash
# Security-focused review
/ask Are there any security vulnerabilities in this code?

# Performance check
/ask What are the performance implications of this change?

# Learning opportunity
/ask Can you explain why this pattern is better than my approach?

# Accessibility audit
/review focus on accessibility concerns

# Test suggestions
/ask What tests should I add for this feature?
```

### 🔧 Utility Commands

```bash
/update_changelog     # Update CHANGELOG.md
/generate_labels      # Auto-label PR
/similar_issue        # Find related issues
/help                 # Show all commands
```

## 5. Free Tier Optimization Strategy

### 📊 Monthly Budget: 75 PRs

**Recommended Distribution:**
- Week 1-2: 40 PRs (heavy development)
- Week 3: 20 PRs (refinements)
- Week 4: 15 PRs (buffer + fixes)

### 🎯 Prioritization Rules

**Always Use Qodo For:**
- ✅ Feature branches
- ✅ Bug fixes
- ✅ Security updates
- ✅ Complex refactors
- ✅ New components
- ✅ API changes

**Skip Qodo For:**
- ❌ Draft PRs (auto-skipped)
- ❌ Pure documentation
- ❌ Dependency bumps (unless security)
- ❌ Style-only changes
- ❌ GitHub Actions tweaks
- ❌ Config file updates

### 💡 Pro Tips

1. **Batch Small Changes**
   ```bash
   # Instead of 3 PRs:
   - Fix typo in Button
   - Fix typo in Card  
   - Fix typo in Modal
   
   # Create 1 PR:
   - Fix typos in UI components
   ```

2. **Use Interactive Mode**
   ```bash
   # Don't create multiple PRs to explore
   # Use /ask to iterate in one PR:
   /ask How can I improve this component's performance?
   /ask What about accessibility?
   /ask Show me a better pattern
   ```

3. **Learning-Focused Questions**
   ```bash
   /ask Why is this approach better than [alternative]?
   /ask What are the trade-offs of this pattern?
   /ask How would a senior dev refactor this?
   ```

## 6. MCP Integration (Optional Advanced)

Model Context Protocol tools extend Qodo's capabilities:

### GitHub MCP Setup

1. **Install Node.js** (if not already installed)
   ```bash
   brew install node  # macOS
   ```

2. **Configure GitHub MCP**
   - Create GitHub Personal Access Token:
     - Go to GitHub Settings → Developer settings → Personal access tokens
     - Generate new token with `repo` scope
   
3. **Add to Qodo Gen** (VS Code)
   ```json
   {
     "mcpServers": {
       "github": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-github"],
         "env": {
           "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_TOKEN_HERE"
         }
       }
     }
   }
   ```

### Benefits
- Search issues/PRs from within Qodo
- Access repository data
- Create automated workflows

## 7. Workflow Integration

### For Every PR

1. **Create PR** → Qodo auto-generates description
2. **Review Comments** → Address Qodo's feedback
3. **Ask Questions** → Use `/ask` for clarification
4. **Apply Suggestions** → Learn from improvements
5. **Document Learning** → Note patterns for reuse

### Daily Workflow

```bash
# Morning: Plan with AI
/ask What's the best approach for [feature]?

# Coding: Get instant feedback
# Push PR → Review suggestions

# Learning: Understand why
/ask Why did you suggest this pattern?

# Evening: Apply learning
# Implement suggestions across codebase
```

## 8. Cost-Benefit Analysis

### What You Get Free
- 75 PR reviews/month
- Unlimited `/ask` commands per PR
- All 14 workflow tools
- GPT-4 and Claude 3.5 Sonnet
- Zero data retention
- Chrome extension chat

### ROI Calculation
- Time saved: ~2 hours/PR = 150 hours/month
- Bugs prevented: ~3-5 per feature
- Learning value: Priceless
- **Effective value: ~$500-1000/month**

## 9. Tracking Usage

### Monitor Your Quota
1. Check Qodo dashboard (when available)
2. Track in spreadsheet:
   ```
   | Week | PRs Used | Remaining | Notes |
   |------|----------|-----------|-------|
   | 1    | 18       | 57        |       |
   | 2    | 22       | 35        |       |
   ```

### End-of-Month Strategy
- Days 25-31: Conservative usage
- Save 5-10 PRs for emergencies
- Batch non-critical changes

## 10. Common Patterns

### Security Review
```bash
/review focus on security vulnerabilities
/ask Are there any OWASP concerns?
/ask Check for exposed secrets or keys
```

### Performance Audit
```bash
/review focus on performance
/ask Will this scale to 1000 users?
/ask Any N+1 query issues?
```

### Accessibility Check
```bash
/review check WCAG 2.1 compliance
/ask Is this keyboard navigable?
/ask Any screen reader issues?
```

### Learning Mode
```bash
/ask Explain this like I'm a junior dev
/ask What's the modern way to do this?
/ask Show me enterprise patterns
```

## 11. Team Collaboration

### Share These Templates

**Bug Fix PR**
```
/describe
/review focus on regression risks
/ask Does this need tests?
/update_changelog
```

**Feature PR**
```
/describe
/review
/improve
/ask Any breaking changes?
/generate_labels
```

**Refactor PR**
```
/describe explain the why
/review focus on maintaining behavior
/ask Performance impact?
/similar_issue
```

## 12. Next Steps

1. **Today**
   - [ ] Install Chrome extension
   - [ ] Create test PR
   - [ ] Try all basic commands

2. **This Week**
   - [ ] Track PR usage
   - [ ] Document useful patterns
   - [ ] Share learnings with team

3. **This Month**
   - [ ] Optimize batching strategy
   - [ ] Consider paid tier if hitting limits
   - [ ] Build command shortcuts

## 13. Advanced Tips

### Custom Shortcuts (Shell Aliases)
```bash
# Add to ~/.zshrc or ~/.bashrc
alias qodo-security="/ask Check for security vulnerabilities"
alias qodo-perf="/ask What are the performance implications?"
alias qodo-a11y="/ask Any accessibility concerns?"
```

### PR Templates
Update `.github/pull_request_template.md`:
```markdown
## Commands to Run
- [ ] /describe
- [ ] /review
- [ ] /improve (if complex)
- [ ] /generate_labels
```

### Learning Journal
Keep a `QODO_LEARNINGS.md`:
```markdown
## Patterns Learned

### 2024-01-19: React Performance
Qodo suggested using `useMemo` for expensive calculations...
[Link to PR]

### 2024-01-20: TypeScript Generics
Learned about conditional types when Qodo reviewed...
[Link to PR]
```

## 14. Upgrade Triggers

Consider paid tier when:
- Consistently using 70+ PRs/month
- Need priority support
- Want advanced features
- Team is growing
- ROI justifies cost

## Remember

The free tier is incredibly generous. With smart usage:
- You get enterprise-grade code review
- You learn from AI mentors 24/7
- You ship better code faster
- You build expertise rapidly

**Your 75 free PRs = ~$500-1000 of value monthly**

Make every PR count! 🚀