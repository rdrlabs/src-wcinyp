# GitHub Environments Configuration

## Overview
This document outlines the GitHub environments configuration for the WCINYP application.

## Environments

### Production
- **Branch**: `main`
- **Protection Rules**:
  - Requires pull request reviews
  - Requires status checks to pass
  - Restricts deployments to main branch only
- **Secrets Required**:
  - `NETLIFY_AUTH_TOKEN`
  - `NETLIFY_SITE_ID`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_KEY`
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`

### Staging
- **Branch**: `develop`, `staging/*`
- **Protection Rules**:
  - Requires status checks to pass
  - No deployment restrictions
- **Secrets Required**:
  - Same as production but with staging-specific values

## Deployment Workflow

1. **Feature Development**: Create feature branches from `main`
2. **Pull Request**: Open PR to `main` branch
3. **Automated Checks**: Tests, linting, and CodeRabbit review
4. **Review**: Manual code review required
5. **Merge**: Merge to main triggers production deployment
6. **Staging**: Push to `develop` or `staging/*` branches for staging deployments

## Manual Setup Instructions

Since GitHub environments require specific repository settings, they need to be configured manually:

1. Go to Settings → Environments in the GitHub repository
2. Create "production" environment:
   - Add deployment branch rule: `main`
   - Add required reviewers if needed
   - Add environment secrets listed above
3. Create "staging" environment:
   - Add deployment branch rules: `develop`, `staging/*`
   - Add environment secrets with staging values

## Environment Variables

### Required for all environments:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Redis Rate Limiting
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Netlify (for deployments)
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id
```

## Notes

- Environment protection rules are enforced at the workflow level
- Secrets are encrypted and only exposed to workflows when needed
- Production deployments require approval from designated reviewers
- All deployments must pass CI checks before proceeding