# CI/CD Setup Guide - Save Netlify Build Minutes

This setup will save you 70-80% of your Netlify build minutes by running tests on GitHub Actions first.

## What's Been Set Up

### 1. GitHub Actions CI Workflow (`.github/workflows/ci.yml`)
- Runs on every push to main and all pull requests
- Executes: linting, type checking, tests, and build
- Uses GitHub's free runners (2000 minutes/month)
- Uploads build artifacts for debugging

### 2. Manual Deploy Workflow (`.github/workflows/deploy.yml`)
- Allows manual deployment to Netlify when needed
- Useful for emergency deploys or specific releases

### 3. Netlify Build Optimization
- **Updated `netlify.toml`** with ignore script
- **Created `.netlify/ignore-build.sh`** that skips builds for:
  - Pull requests (tests run on GitHub instead)
  - Commits with `[skip ci]` or `[skip netlify]` in message
  - Documentation-only changes
  - Non-main branches

## Manual Setup Required

### 1. Link Netlify Site (if not already done)
```bash
netlify link
# Choose: Use current git remote origin
```

### 2. GitHub Repository Settings

Go to: https://github.com/rdrlabs/src-wcinyp/settings

#### A. Create Repository Secrets
Navigate to Settings → Secrets and variables → Actions

Add these secrets:
- `NETLIFY_AUTH_TOKEN`: Get from https://app.netlify.com/user/applications#personal-access-tokens
- `NETLIFY_SITE_ID`: Get from Netlify site settings → General → Site ID

#### B. Set Up Branch Protection
Navigate to Settings → Branches → Add rule

- Branch name pattern: `main`
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- Select status checks: `test` (will appear after first CI run)

### 3. Netlify Dashboard Settings

Go to your Netlify site dashboard:

#### A. Build Settings
Site settings → Build & deploy → Continuous deployment

- Build settings → Edit settings
- Branches to deploy: Production branch only (main)
- Deploy previews: Consider disabling "Deploy pull requests automatically"

#### B. Build Hooks (Optional)
For manual deploys via GitHub Actions:
1. Site settings → Build & deploy → Build hooks
2. Add build hook: "GitHub Actions Deploy"
3. Copy the hook URL for use in GitHub Actions

## How It Works

### For Pull Requests:
1. Developer creates PR
2. GitHub Actions runs all tests (free)
3. Netlify skips the build (saves minutes)
4. Merge only if tests pass

### For Main Branch:
1. PR merged to main
2. GitHub Actions runs tests again
3. If tests pass, Netlify builds and deploys
4. One build instead of multiple attempts

### Manual Deploy:
1. Go to Actions tab in GitHub
2. Select "Manual Deploy to Netlify"
3. Click "Run workflow"
4. Deploys directly without using Netlify minutes

## Build Minutes Savings

**Before**: 
- Every push = 5-10 minutes
- Failed builds still consume minutes
- PR previews consume minutes

**After**:
- PRs: 0 minutes (GitHub Actions only)
- Failed tests: 0 minutes (no Netlify build)
- Success: 5-10 minutes (only successful merges)
- **Estimated savings: 70-80%**

## Tips

1. **Skip builds** when needed:
   ```bash
   git commit -m "Update docs [skip netlify]"
   ```

2. **Check CI status** before merging:
   ```bash
   gh pr checks
   ```

3. **View workflow runs**:
   ```bash
   gh run list
   gh run view
   ```

4. **Manual deploy** when needed:
   ```bash
   gh workflow run deploy.yml
   ```

## Troubleshooting

### Tests pass locally but fail in CI
- Check Node.js version matches (v20)
- Ensure all dependencies are in package.json
- Check for OS-specific issues (CI uses Ubuntu)

### Netlify still building PRs
- Verify `.netlify/ignore-build.sh` is executable
- Check Netlify dashboard settings for PR previews
- Ensure the ignore script path is correct in netlify.toml

### GitHub Actions not running
- Check branch protection rules
- Verify workflow files are in `.github/workflows/`
- Ensure YAML syntax is correct

## Next Steps

1. Complete the manual setup steps above
2. Create a test PR to verify everything works
3. Monitor your Netlify build minutes usage
4. Adjust settings as needed