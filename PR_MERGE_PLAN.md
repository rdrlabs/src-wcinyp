# PR Merge Plan - WCI@NYP Project

## Overview
This document outlines the comprehensive plan for merging all open PRs from the mega PR split, addressing all CodeRabbit reviews, and ensuring a smooth integration.

**Generated**: 2025-07-16  
**Total PRs**: 10 (1 mega PR to close, 9 to merge)  
**Ready to Merge**: 2 PRs (#9, #18)  
**Blocked by Issues**: 7 PRs

## Current PR Status

| PR # | Title | Status | CI | CodeRabbit | Blockers |
|------|-------|--------|----|-----------:|----------|
| #7 | Mega PR (to close) | ❌ Conflicts | ❌ | - | Too large |
| #8 | Docstrings | ⚠️ Obsolete | ❌ | - | Superseded |
| #9 | Core Infrastructure | ✅ Ready | ✅ | 📝 Nitpicks | Needs approval |
| #10 | Testing Infrastructure | 🔧 Fix needed | ❌ | - | ESLint, dependencies |
| #13 | CI/CD & GitHub Actions | 🔧 Fix needed | ❌ | - | Workflow errors |
| #14 | Auth & Access Control | 🔧 Fix needed | ❌ | 🔒 Security | ESLint, security |
| #15 | UI Components | 🔧 Fix needed | ❌ | ♿ A11y | ESLint, accessibility |
| #16 | Admin Dashboard | 🔧 Fix needed | ❌ | - | Dependencies |
| #17 | Knowledge Base | 🔧 Fix needed | ❌ | - | ESLint, imports |
| #18 | Documentation | ✅ Ready | ✅ | ✅ | None |

## Phase 1: Immediate Actions (Day 1)

### 1.1 Fix ESLint Configuration
**Issue**: "npm error Exit handler never called!" affecting PRs #10, #13, #14, #15, #17

**Solution**:
```bash
# Fix ESLint dependencies
npm install --save-dev eslint@^8.57.0 @typescript-eslint/parser@^7.0.0 @typescript-eslint/eslint-plugin@^7.0.0

# Update ESLint config to handle async operations
# Add to .eslintrc.js:
parserOptions: {
  ecmaVersion: 2022,
  sourceType: 'module',
  project: './tsconfig.json'
}
```

### 1.2 Merge Documentation PR #18
```bash
gh pr merge 18 --squash --subject "feat: Project Documentation Suite"
```

### 1.3 Get PR #9 Approved and Merged
- Request review from project maintainer
- Address CodeRabbit nitpicks:
  - Add newline to .github/dependabot.yml
  - Fix browser detection in logger.ts
  - Convert netlify/functions/utils.ts to ES modules

## Phase 2: Testing & Security Fixes (Days 2-3)

### 2.1 Fix PR #10 (Testing Infrastructure)
**Issues**: Playwright dependencies, vitest configuration

**Actions**:
```bash
# Checkout PR #10
gh pr checkout 10

# Fix dependencies
npm install --save-dev @playwright/test@^1.50.1 @types/pixelmatch@^5.2.6 @types/pngjs@^6.0.5

# Update vitest.config.mjs to exclude e2e tests
# Already fixed in previous commit

# Fix visual validator diffColorAlt
# Already fixed in previous commit
```

### 2.2 Fix PR #14 (Auth & Access Control)
**Critical Security Issues from CodeRabbit**:

1. **Rate Limiting**:
```typescript
// Already implemented with Upstash Redis
// Verify configuration in netlify/functions/rate-limiter.ts
```

2. **CSRF Protection**:
```typescript
// Add to auth endpoints
import { validateCSRFToken } from '@/lib/security'

export async function handler(event: HandlerEvent) {
  if (!validateCSRFToken(event.headers['x-csrf-token'])) {
    return { statusCode: 403, body: 'Invalid CSRF token' }
  }
  // ... rest of handler
}
```

3. **Session Security**:
```typescript
// Update session configuration
const sessionConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 3600000 // 1 hour
}
```

### 2.3 Fix PR #13 (CI/CD)
**Issues**: Workflow syntax errors, missing secrets

**Actions**:
1. Fix YAML syntax in workflows
2. Update action versions to latest
3. Configure repository secrets in GitHub

## Phase 3: UI & Accessibility (Days 4-5)

### 3.1 Fix PR #15 (UI Components)
**CodeRabbit Accessibility Issues**:

1. **ARIA Labels**:
```tsx
// Add to all interactive components
<Button aria-label="Close dialog" onClick={onClose}>
  <X className="h-4 w-4" />
</Button>
```

2. **Keyboard Navigation**:
```tsx
// Add to custom components
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') onClose()
  if (e.key === 'Tab') handleTabNavigation(e)
}
```

3. **Replace console.error**:
```typescript
// Throughout codebase
- console.error('Error:', error)
+ logger.error('Error occurred', error)
```

### 3.2 Fix PR #16 (Admin Dashboard)
- Add role-based access control
- Implement activity logging
- Add comprehensive tests

### 3.3 Fix PR #17 (Knowledge Base)
- Fix Fumadocs component imports
- Restore MDX components
- Ensure KaTeX math rendering

## Phase 4: Final Integration (Day 6)

### 4.1 Merge Order
```bash
# 1. Documentation (already merged)
gh pr merge 18 --squash

# 2. Core Infrastructure
gh pr merge 9 --squash

# 3. Testing Infrastructure
gh pr merge 10 --squash

# 4. Auth & Access Control
gh pr merge 14 --squash

# 5. CI/CD
gh pr merge 13 --squash

# 6. UI Components
gh pr merge 15 --squash

# 7. Admin Dashboard
gh pr merge 16 --squash

# 8. Knowledge Base
gh pr merge 17 --squash

# 9. Close obsolete PRs
gh pr close 7 --comment "Superseded by PRs #9-18"
gh pr close 8 --comment "No longer needed"
```

## CodeRabbit Nitpicks Summary

### High Priority (Security)
- [ ] Rate limiting implementation (PR #14)
- [ ] CSRF protection (PR #14)
- [ ] Input validation on forms (PR #14, #15)
- [ ] Session security hardening (PR #14)

### Medium Priority (Code Quality)
- [ ] Replace console.error with logger (All PRs)
- [ ] Fix TypeScript 'any' types (PR #15, #17)
- [ ] Consistent import paths (All PRs)
- [ ] Add error boundaries (PR #15)

### Low Priority (Enhancement)
- [ ] Add pagination to lists (PR #15)
- [ ] Implement React.memo (PR #15)
- [ ] Lazy load components (PR #16, #17)
- [ ] Optimize bundle size (PR #15)

## Success Metrics
- [ ] All PRs passing CI checks
- [ ] No critical CodeRabbit issues
- [ ] Security vulnerabilities addressed
- [ ] Test coverage > 80%
- [ ] Zero merge conflicts
- [ ] Documentation complete

## Risk Mitigation
1. **Test Failures**: Fix ESLint first, then dependencies
2. **Merge Conflicts**: Rebase PRs after each merge
3. **Security Issues**: Prioritize auth fixes before merging
4. **Breaking Changes**: Test each PR locally before merge

## Commands Reference
```bash
# Check PR status
gh pr list --state open

# View CodeRabbit review
gh pr view [PR_NUMBER] --json reviews

# Test locally
gh pr checkout [PR_NUMBER]
npm install
npm test
npm run build

# Merge with squash
gh pr merge [PR_NUMBER] --squash

# Close PR
gh pr close [PR_NUMBER] --comment "Reason"
```

## Notes
- Always run tests locally before merging
- Address all CodeRabbit security concerns
- Update CLAUDE.md after all merges
- Create release notes summarizing all changes