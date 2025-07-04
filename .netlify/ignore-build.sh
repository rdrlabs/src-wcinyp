#!/bin/bash

# This script helps Netlify decide whether to build or not
# Exit 0 = Skip build
# Exit 1 = Proceed with build

echo "🔍 Checking if build should proceed..."

# Get the current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: $BRANCH"

# Get the commit message
COMMIT_MSG=$(git log -1 --pretty=%B)
echo "Commit message: $COMMIT_MSG"

# Skip if commit message contains [skip ci] or [skip netlify]
if echo "$COMMIT_MSG" | grep -E "\[(skip ci|skip netlify)\]"; then
  echo "⏭️  Skipping build due to skip marker in commit message"
  exit 0
fi

# Skip if this is a pull request (Netlify sets these variables)
if [ "$PULL_REQUEST" == "true" ]; then
  echo "⏭️  Skipping build for pull request #$REVIEW_ID"
  echo "💡 Tests are running on GitHub Actions instead"
  exit 0
fi

# Skip if not on main branch (unless it's a production deploy)
if [ "$BRANCH" != "main" ] && [ "$CONTEXT" != "production" ]; then
  echo "⏭️  Skipping build for non-main branch: $BRANCH"
  exit 0
fi

# Check if only documentation files changed
CHANGED_FILES=$(git diff --name-only HEAD^ HEAD 2>/dev/null || git diff --name-only HEAD~1 HEAD)
NON_DOC_CHANGES=$(echo "$CHANGED_FILES" | grep -v -E "^(.*\.md|\.project-docs/|docs/|README|CONTRIBUTING|LICENSE)" | wc -l)

if [ "$NON_DOC_CHANGES" -eq 0 ] && [ -n "$CHANGED_FILES" ]; then
  echo "⏭️  Skipping build - only documentation files changed"
  exit 0
fi

# Check if this is a GitHub Actions triggered deploy
if echo "$COMMIT_MSG" | grep -E "(Manual deployment from GitHub Actions|Deploy from GitHub Actions)"; then
  echo "✅ Proceeding with GitHub Actions triggered deployment"
  exit 1
fi

# Default: proceed with build
echo "✅ Proceeding with build"
exit 1