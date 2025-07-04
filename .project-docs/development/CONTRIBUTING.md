# Contributing to WCINYP

## Development Setup

1. Ensure you have Node.js 20+ installed
2. Clone the repository
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`

## Code Standards

### Before Committing

Always run these commands before committing:

```bash
npm run lint
npm run type-check
npm test
npm run format
```

### Component Guidelines

- All components must use `'use client'` directive (Netlify limitation)
- Use TypeScript for all new code
- Follow existing patterns for consistency
- Import from `@/` paths, not relative paths

### File Organization

- Pages go in `src/app/`
- Reusable components in `src/components/`
- Type definitions in `src/types/`
- JSON data in `src/data/`
- Tests next to the files they test

### Git Workflow

1. Create feature branch from `main`
2. Make changes
3. Run all checks (lint, type-check, test)
4. Commit with descriptive message
5. Push and create pull request

### Testing

- Write tests for new features
- Maintain existing test coverage
- Use Vitest and React Testing Library
- Mock external dependencies

### Documentation

- Update CLAUDE.md for AI assistance context
- Update README.md for user-facing changes
- Comment complex logic
- Keep type definitions up to date