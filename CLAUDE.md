# WCINYP Next.js Application

## Overview
This is a medical imaging center application built with Next.js 14, TypeScript, and Tailwind CSS. It provides document management, provider directory, form generation, and contact management features.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (migrated from v3)
- **UI Components**: shadcn/ui
- **Theme System**: Dual-theme approach (next-themes for dark/light, custom for color themes)
- **Documentation**: Fumadocs (MDX) - Properly isolated with its own styling context
- **Testing**: Vitest, React Testing Library (387 tests, TDD approach)
- **Deployment**: Netlify (static hosting)

## Project Structure
```
src/
├── app/                  # Next.js app router pages
│   ├── documents/       # Documents & Forms (combined)
│   ├── providers/       # Enhanced provider directory
│   ├── directory/       # Contact directory
│   ├── knowledge/       # Fumadocs-powered knowledge base
│   └── wiki/           # Staff wiki
├── components/          # Reusable React components
│   ├── ui/             # shadcn/ui components
│   ├── navbar.tsx      # Global navigation
│   └── footer.tsx      # Rich footer
├── data/               # JSON data files
├── types/              # TypeScript type definitions
└── test/               # Test setup and utilities

netlify/
└── functions/          # Serverless functions
```

## Key Features
1. **Documents & Forms**: Unified interface with toggle view for document browsing and form generation
2. **Provider Directory**: Enhanced profiles with NPI, affiliations, flags, and expandable notes
3. **Contact Directory**: Comprehensive database of all stakeholders
4. **Knowledge Base**: Fumadocs-powered documentation with full sidebar navigation and isolated styling
5. **Global Search**: Command+K shortcut for quick navigation
6. **Modern UI**: WCI@NYP branding, rich footer, and shadcn/ui components throughout

## Development Commands
```bash
# Development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with UI
npm run test:watch

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

## Important Notes
- All components use `'use client'` directive due to Netlify static hosting limitations
- No server components are used - everything runs client-side
- Netlify Functions provide serverless backend capabilities
- Data is stored in JSON files under `src/data/`
- Fumadocs uses its own styling system and is isolated from main app styles
- RootProvider is only used in the knowledge layout, not globally

## Testing
Run the following commands before committing:
```bash
npm run lint
npm run type-check
npm test -- --run  # Run tests once (avoid watch mode timeout in Claude Code)
```

**Test Suite Status**: 387 tests, all passing ✅

## Deployment
The application automatically deploys to Netlify on push to main branch. The `netlify.toml` configuration handles:
- Node.js version (v20)
- Build command
- Publish directory
- Function directory

## Architecture Decisions
1. **Client-side rendering**: Due to Netlify static hosting, all components are client-side
2. **JSON data storage**: Simple data persistence without a database
3. **Netlify Functions**: For form submissions and future API needs
4. **shadcn/ui**: For consistent, accessible UI components
5. **Fumadocs**: For native MDX documentation support with isolated styling
   - RootProvider only in knowledge layout, not global
   - Uses Fumadocs' default styling system
   - Prevents style conflicts with main app
   - TDD approach for ensuring isolation
6. **Theme System**: Dual-theme approach to avoid conflicts
   - next-themes manages light/dark mode on `<html>` element
   - Custom color themes (blue, red, orange, green, yellow, neutral) on `<body>` element
   - Uses OKLCH color space for perceptually uniform colors
   - ThemeBody component handles client-side theme application