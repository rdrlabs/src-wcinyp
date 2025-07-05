# WCINYP Next.js Application

## Overview
This is a medical imaging center application built with Next.js 14, TypeScript, and Tailwind CSS. It provides document management, provider directory, form generation, and contact management features.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui
- **Documentation**: Fumadocs (MDX) - Fully integrated with isolated styling
- **Testing**: Vitest, React Testing Library (327 tests)
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
4. **Knowledge Base**: Full Fumadocs implementation with sidebar navigation
5. **Global Search**: Command+K shortcut for quick navigation
6. **Modern UI**: shadcn/ui components throughout with dark mode support

## Phase 1 UI/UX Enhancements (Completed)

### Navigation
- Reordered navbar: Knowledge Base → Directory → Documents → Providers
- WCI@NYP branding
- Global search with Command+K
- Quick links dropdown (Teams, Outlook, MyApps)
- Feedback button and login icon in navbar

### Enhanced Features
- **Documents & Forms Integration**: Single page with toggle view
- **Provider Cards**: Epic EMR-style expandable cards with:
  - NPI numbers
  - Affiliation badges (WCM, NYP, etc.)
  - Provider flags (VIP, urgent, teaching, etc.)
  - Languages spoken
  - Expandable notes section

### Theme & Styling
- Active page highlighting with primary color
- White glow hover effect on inactive nav items
- Rich footer with contact info and resources
- Full dark mode support

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

## Testing
Run the following commands before committing:
```bash
npm run lint
npm run type-check
npm test -- --run  # Run tests once (use --run flag to avoid Claude Code timeout)
```

**Test Suite Status**: 327 tests, all passing ✅

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
5. **Fumadocs**: For native MDX documentation support