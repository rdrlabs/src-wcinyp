# Commit and Push to GitHub

Save changes and push to GitHub. Auto-generates message if not provided.

```bash
# Check what changed
git status --short
git diff --staged --stat

# If no message provided, Claude will analyze and suggest one
# Format: type(scope): description
# - feat: new feature
# - fix: bug fix
# - docs: documentation
# - style: formatting
# - refactor: code restructuring
# - test: adding tests
# - chore: maintenance

# Add all changes
git add -A

# Commit with message
git commit -m "$1"

# Push to GitHub
git push

# If new branch: git push -u origin $(git branch --show-current)
```