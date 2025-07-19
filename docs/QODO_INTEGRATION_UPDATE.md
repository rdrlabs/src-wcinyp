# Qodo Merge Pro - Post-Installation Configuration Guide

## 🎉 Installation Status: COMPLETE

**Congratulations!** Qodo Merge Pro was successfully installed on January 19, 2025.

### Current Setup
- **App**: Qodo Merge Pro
- **Status**: ✅ Active and ready to use
- **Repository Access**: All repositories
- **Permissions Granted**: 
  - ✅ Read: actions, checks, metadata
  - ✅ Read/Write: code, discussions, issues, pull requests

## What's Already Working

Since installation, Qodo Merge Pro is automatically:
- 🤖 Monitoring all pull requests in your repositories
- 📝 Ready to generate PR descriptions with `/describe`
- 🔍 Ready to perform code reviews with `/review`
- 💡 Ready to suggest improvements with `/improve`

## Immediate Next Steps

### 1. Test the Installation (5 minutes)

Create a test PR to verify everything is working:

```bash
# Create a test branch
git checkout -b test/qodo-integration

# Make a small change (e.g., update README)
echo "\n<!-- Testing Qodo Merge -->" >> README.md

# Commit and push
git add README.md
git commit -m "test: Verify Qodo Merge integration"
git push origin test/qodo-integration
```

Then open a PR and you should see Qodo automatically:
- Generate a PR description
- Perform an initial review

### 2. Install Chrome Extension (Optional but Recommended)

The Chrome extension enables AI chat directly in PRs:
1. Visit [Qodo Chrome Extension](https://chrome.google.com/webstore/detail/qodo)
2. Click "Add to Chrome"
3. Sign in with your GitHub account
4. Now you can chat with Qodo directly in PR comments!

### 3. Create Configuration File (Recommended)

Create `.pr_agent.toml` in your repository root:

```toml
[pr_description]
# Automatic PR descriptions
publish_description_as_comment = false
add_original_user_description = true
generate_ai_title = true
ai_title_prefix = ""  # Or use "feat:", "fix:", etc.
include_generated_by_header = true

[pr_reviewer] 
# Code review settings
ask_and_reflect = true
remove_previous_review_comment = true
persistent_comment = true
inline_code_comments = true
require_tests_review = true
require_security_review = true

# Project-specific instructions
extra_instructions = """
Focus on:
- React 18 and Next.js 15 best practices
- TypeScript type safety
- Supabase security patterns
- Accessibility (WCAG 2.1)
- Performance implications
- Healthcare data privacy considerations
"""

[pr_code_suggestions]
# Improvement suggestions
num_code_suggestions = 5
summarize_suggestions = true
focus_on_important_suggestions = true

[pr_custom_labels]
# Auto-labeling
enable_custom_labels = true
labels = ["bug", "feature", "docs", "test", "refactor", "security"]
```

### 4. Team Quick Reference Card

Share this with your team:

```markdown
## Qodo Merge Commands

### Basic Commands
- `/describe` - Generate/update PR description
- `/review` - Perform code review
- `/improve` - Get code improvement suggestions
- `/ask [question]` - Ask specific questions

### Examples
- `/ask Is this accessible?`
- `/improve src/components/Button.tsx`
- `/review --focus security`

### Pro Tips
- Qodo learns from accepted suggestions
- It fetches context from linked issues
- 75 free PRs/month for our org
```

## Configuration Options

### Option 1: Keep Both Tools (Recommended Initially)
- Run Qodo and CodeRabbit in parallel for 2 weeks
- Compare quality of reviews
- Gather team feedback
- Make informed decision

### Option 2: Qodo Only
- Disable CodeRabbit workflow
- Rely solely on Qodo Merge
- Save on CodeRabbit costs

### Option 3: Selective Usage
- Use Qodo for feature PRs
- Use CodeRabbit for dependency updates
- Optimize for 75 PR/month limit

## Usage Optimization (75 PRs/Month)

### Current Month Budget
- **Total**: 75 PRs
- **Used**: 0 (as of Jan 19)
- **Remaining**: 75

### Strategies
1. **Priority PRs** (use Qodo):
   - Feature branches
   - Bug fixes
   - Security updates
   - Complex refactors

2. **Skip Qodo** (save quota):
   - Documentation-only changes
   - Dependency bumps (unless security)
   - Style/formatting changes
   - Draft PRs

3. **Batch Changes**:
   - Group related fixes
   - Combine small improvements
   - Plan PR timing

## Features to Explore

### 1. The 14 Workflow Tools

| Command | Purpose | When to Use |
|---------|---------|------------|
| `/describe` | PR description | Every PR (automatic) |
| `/review` | Code review | Complex changes |
| `/improve` | Suggestions | Before finalizing |
| `/ask` | Q&A | Specific concerns |
| `/update_changelog` | Update CHANGELOG | Release PRs |
| `/add_docs` | Generate docs | New features |
| `/similar_issue` | Find related | Bug fixes |
| `/generate_labels` | Auto-label | All PRs |

### 2. Context-Aware Features
- Links to GitHub Issues automatically
- Learns from your coding patterns
- Adapts to team preferences
- Fetches ticket information

### 3. Security & Privacy
- Zero data retention
- No model training on your code
- SOC 2 compliant
- Encrypted transmission

## Monitoring & Metrics

### Week 1 Goals
- [ ] All team members use at least one command
- [ ] Test on 5 different PR types
- [ ] Document any issues or confusion
- [ ] Compare with CodeRabbit quality

### Success Metrics
- Response time < 2 minutes
- Useful suggestions > 80%
- False positive rate < 10%
- Team adoption > 90%

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Qodo not responding | Check PR is not draft |
| No automatic review | Check quota (75/month) |
| Commands not working | Ensure proper syntax |
| Want to disable | Settings > Integrations |

## FAQ

**Q: Do we need to remove CodeRabbit?**
A: No, they can run together. Evaluate both before deciding.

**Q: What counts against the 75 PR limit?**
A: Each PR that receives automated review/description.

**Q: Can we upgrade if needed?**
A: Yes, paid plans available for higher volume.

**Q: Is our code safe?**
A: Yes, zero retention policy and no training on your code.

## Next Actions Checklist

### Immediate (Today)
- [x] Qodo Merge Pro installed
- [ ] Create test PR to verify
- [ ] Install Chrome extension
- [ ] Share commands with team

### This Week
- [ ] Create `.pr_agent.toml` config
- [ ] Monitor first 10 PRs
- [ ] Gather team feedback
- [ ] Document learnings

### This Month
- [ ] Evaluate vs CodeRabbit
- [ ] Optimize PR workflow
- [ ] Decide on tool strategy
- [ ] Train team on advanced features

## Support Resources

- [Qodo Documentation](https://qodo-merge-docs.qodo.ai/)
- [Video Tutorials](https://www.youtube.com/@QodoAI)
- [Community Forum](https://github.com/qodo-ai/pr-agent/discussions)
- Internal Contact: [Your DevOps Team]

---

*Remember: Qodo Merge Pro is already active! Start using it on your next PR.*