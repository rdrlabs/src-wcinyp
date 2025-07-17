# Technical Stack & Development Guide

## Core Technologies

- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript 5.x
- **React**: React 19.0.0
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Documentation**: Fumadocs v15 (native MDX support)
- **Theme**: Dark mode with next-themes
- **Authentication**: Supabase Auth
- **Rate Limiting**: Upstash Redis
- **Testing**: Vitest 2.0 + React Testing Library
- **Deployment**: Netlify static export

## Build System

The project uses npm as the package manager with the following key scripts:

```bash
# Development
npm run dev          # Start dev server with turbopack
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier

# Testing
npm test             # Run tests with Vitest
npm run test:ci      # Run tests once (for CI)
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Building
npm run build        # Build for production
npm start            # Run production build locally

# Validation
npm run validate:design # Validate design system compliance
```

## Important Development Notes

1. **Claude Task Master Integration** 🎯
   - All development work should be tracked in `.taskmaster/` directory
   - Task Master v0.19.0 is installed and configured for Claude Code
   - Use task templates in `tasks/templates/` for consistent development
   - Reference task IDs in commit messages
   - Tasks persist across Claude sessions for continuity

2. **Netlify Static Export**
   - The app uses `output: 'export'` in next.config.mjs
   - All components must be client components (`'use client'`)
   - No server components or API routes (use Netlify Functions)

3. **Testing Considerations**
   - Tests may timeout in Claude Code (use `npm run test:ci` instead)
   - All components should have tests (current coverage ~75-85%)
   - Use TDD approach for new features
   - 327 tests across 28 test files currently passing

4. **Strict Design System** 🎨
   - **CRITICAL**: Run `npm run validate:design` before commits
   - Use ONLY semantic color tokens (bg-primary, text-destructive)
   - **NEVER** use direct Tailwind colors (bg-blue-500, text-red-600)
   - Typography sizes: text-xs through text-5xl (avoid text-6xl+)
   - Font weights: font-normal, font-medium, font-semibold, font-bold
   - Use the `cn()` utility for conditional styling
   - Follow shadcn/ui component patterns exclusively

5. **Authentication**
   - Supabase Auth for user authentication
   - Protected routes with auth guards
   - JWT session management

6. **Data Fetching**
   - Client-side data fetching (no SSR)
   - Netlify Functions for backend operations
   - Static data in public JSON files

## Claude Code Specific Limitations & Workarounds

1. **Test Timeout Issues**
   - Watch mode tests (`npm test`) will ALWAYS timeout in Claude Code
   - Use `npm run test:ci` for one-time test runs
   - Maximum timeout is 10 minutes, but watch mode runs indefinitely

2. **Long-Running Processes**
   - Development server may timeout after 2 minutes
   - Use shorter development sessions
   - Restart processes as needed

3. **File System Operations**
   - Large file operations may timeout
   - Break down large changes into smaller chunks

## Design System Enforcement

The project has strict design system validation that will fail builds if violated:

```bash
# Always run before committing
npm run validate:design
```

**Common Violations to Avoid**:
- Using `bg-blue-500` instead of `bg-primary`
- Using `text-red-600` instead of `text-destructive`
- Using `text-6xl` or larger (too big for UI)
- Inconsistent spacing patterns

## Testing Strategy

**Philosophy**: Test-Driven Development (TDD) approach
- Write tests before implementing features
- Focus on user behavior, not implementation details
- Use React Testing Library principles

**Test Structure**:
- Component tests: `component-name.test.tsx`
- Page tests: `app/page-name/page.test.tsx`
- Hook tests: `hooks/use-hook-name.test.ts`
- Utility tests: `lib/util-name.test.ts`

**Mock Data**: Use factories in `src/test/mocks/factories.ts`

## Environment Variables

Key environment variables (defined in .env.local):

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
```

## Deployment Process

1. Ensure all tests pass: `npm run test:ci`
2. Validate design system: `npm run validate:design`
3. Type check: `npm run type-check`
4. Build locally: `npm run build`
5. Push to main branch for automatic Netlify deployment
6. Netlify will run the build command and deploy to CDN

## Performance Considerations

- **Bundle Size**: Keep components small and focused
- **Code Splitting**: Use dynamic imports for large components
- **Image Optimization**: Use Next.js Image component (with unoptimized: true)
- **Static Assets**: Store in public/ directory for CDN caching

## Security Best Practices

- **No PHI Storage**: Never store patient health information
- **Input Validation**: Validate all form inputs
- **Rate Limiting**: Use Upstash Redis for API rate limiting
- **Authentication**: Secure routes with Supabase Auth
- **HTTPS**: Enforced by Netlify for all traffic