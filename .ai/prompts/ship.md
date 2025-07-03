# Ship Changes

All-in-one: sync, test, and commit workflow.

## What [ship] Does
1. Syncs with GitHub (pull latest)
2. Runs full test suite
3. Updates documentation to match code ([utd])
4. If all pass, commits and pushes
5. If anything fails, shows errors and stops

## Usage
- `[ship]` - Uses auto-generated commit message
- `[ship "your message"]` - Uses your commit message

## Workflow
```bash
# 1. Sync with remote
git fetch
git pull --ff-only

# 2. Run tests
npm test -- --coverage
npm run typecheck
npm run lint

# 3. Update docs to match reality
[utd]

# 4. If all pass, commit and push
git add -A  # Includes any doc updates from [utd]
git commit -m "$1" # or auto-generated
git push
```

## Output Example
```
🚀 Shipping changes...
✅ Synced with GitHub
✅ Tests passing (92% coverage)
✅ TypeScript clean
✅ Linting passed
✅ Docs updated (fixed 2 paths)
📝 Committing: "feat: add user authentication"
✅ Pushed to GitHub

Ship complete! 🎉
```

## Failure Handling
If any step fails, stops and shows:
- Which step failed
- Error details
- Suggested fixes

Perfect for quick iterations when you're confident in your changes.