# Sync with GitHub

Pull latest changes from GitHub to local.

```bash
# Fetch and show status
git fetch
git status

# Pull if clean
git pull --ff-only
```

If conflicts exist:
```bash
git stash
git pull
git stash pop
```