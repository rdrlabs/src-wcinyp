# WCINYP Next.js Application

## Overview
This is a medical imaging center application built with Next.js 14, TypeScript, and Tailwind CSS. It provides document management, provider directory, form generation, and contact management features.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui
- **Documentation**: Fumadocs (MDX) - Properly isolated with its own styling context
- **Testing**: Vitest, React Testing Library (287 tests, TDD approach)
- **Deployment**: Netlify (static hosting)

## Project Structure
```
src/
├── app/                  # Next.js app router pages
│   ├── documents/       # Document management
│   ├── providers/       # Provider directory
│   ├── forms/           # Form generator
│   ├── directory/       # Contact directory
│   └── knowledge/       # Knowledge hub (documentation)
├── components/          # Reusable React components
├── data/               # JSON data files
├── types/              # TypeScript type definitions
└── test/               # Test setup and utilities

netlify/
└── functions/          # Serverless functions
```

## Key Features
1. **Document Hub**: Browse and download medical forms organized by category
2. **Provider Directory**: Search and view medical staff information
3. **Form Generator**: Create and submit dynamic forms
4. **Contact Directory**: Comprehensive database of all contacts
5. **Knowledge Hub**: Fumadocs-powered documentation with full sidebar navigation and isolated styling

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

**Test Suite Status**: 287 tests across 23 test files, 100% passing

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