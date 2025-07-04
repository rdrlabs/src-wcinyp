# WCINYP Next.js Migration

## Overview
This directory contains the migrated Next.js 14 version of WCINYP with:
- ✅ All pages converted to App Router
- ✅ Tables instead of cards (as requested)
- ✅ Fumadocs integration for knowledge base
- ✅ Dark mode support
- ✅ All static documents preserved

## Key Changes from React Router

1. **Routing**: React Router → Next.js App Router
2. **Documentation**: react-router-mdx → Fumadocs
3. **Build System**: Vite → Next.js/Webpack
4. **Deployment**: SPA mode → SSG/SSR hybrid

## Migration Steps

1. **Test locally**:
   ```bash
   npm run dev
   ```

2. **Build and verify**:
   ```bash
   npm run build
   npm run start
   ```

3. **Deploy** (when ready):
   ```bash
   ./deploy-migration.sh
   ```

## Important Notes

- The migration script will:
  - Backup current React Router build
  - Clear ALL caches (as requested)
  - Move Next.js files to main directory
  - Update Netlify configuration
  
- First deployment WILL clear cache to avoid conflicts
- All documents remain in `/public/documents/`
- Dark mode preference is preserved

## What's Different

- **Performance**: Better with Next.js SSG
- **SEO**: Improved with server-side rendering
- **Documentation**: Native Fumadocs integration
- **Build times**: Slightly longer but with better optimization