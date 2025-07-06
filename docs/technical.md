# WCINYP Technical Documentation

## Architecture Overview

The WCINYP application is built with modern web technologies optimized for static hosting on Netlify.

### Core Technologies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v3 + shadcn/ui
- **Documentation**: Fumadocs (MDX)
- **Testing**: Vitest + React Testing Library
- **Task Management**: Claude Task Master
- **Deployment**: Netlify (static export)

### Key Architectural Decisions

1. **Client-Side Rendering Only**
   - All components use `'use client'` directive
   - No server components due to Netlify static hosting
   - Data fetched from local JSON files

2. **Fumadocs Isolation**
   - RootProvider only in `/knowledge` layout
   - Prevents style conflicts with main app
   - Uses Fumadocs' default styling system

3. **Testing Strategy**
   - Test-Driven Development (TDD)
   - 327+ tests with full coverage of critical paths
   - Mocked Fumadocs components for isolation

4. **Data Management**
   - JSON files in `src/data/` directory
   - No database (planned for Phase 2)
   - Form submissions via Netlify Functions

### Component Patterns

```typescript
// Standard component pattern
'use client'

import { ComponentProps } from '@/types'

export function Component({ prop }: ComponentProps) {
  // Implementation
}
```

### Testing Patterns

```typescript
// Standard test pattern
import { render, screen } from '@/test/utils'
import { Component } from './component'

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />)
    expect(screen.getByRole('...')).toBeInTheDocument()
  })
})
```

### File Structure Conventions

- Components: `src/components/[feature]/[component].tsx`
- Pages: `src/app/[route]/page.tsx`
- Tests: Colocated with components (`[component].test.tsx`)
- Types: `src/types/[domain].ts`
- Data: `src/data/[resource].json`

### Performance Considerations

1. **Bundle Size**
   - Code splitting by route
   - Dynamic imports for heavy components
   - Tree shaking enabled

2. **Loading States**
   - Skeleton components for better UX
   - Suspense boundaries where applicable

3. **Caching**
   - Static assets cached by Netlify CDN
   - JSON data loaded once per session

### Security Considerations

1. **Input Validation**
   - All form inputs sanitized
   - Type checking with TypeScript

2. **Data Protection**
   - No sensitive data in JSON files
   - PHI handling planned for Phase 4

3. **CORS & Headers**
   - Security headers in `netlify.toml`
   - CORS configured for API endpoints

### Development Workflow

1. **Feature Development**
   ```bash
   # Create feature branch
   git checkout -b feat/feature-name
   
   # Switch Task Master context
   task-master tags switch feat/feature-name
   
   # Develop with TDD
   npm test -- --watch
   
   # Validate before commit
   npm run lint && npm run type-check && npm test -- --run
   ```

2. **Task Management**
   ```bash
   # View current tasks
   task-master list
   
   # Start a task
   task-master start [task-id]
   
   # Complete a task
   task-master complete [task-id]
   ```

3. **Documentation Updates**
   - Update `CLAUDE.md` for AI instructions
   - Update technical docs for architecture changes
   - Update README for user-facing changes

### API Integration (Future)

Planned Netlify Functions structure:
```
netlify/
└── functions/
    ├── submit-form.ts
    ├── track-download.ts
    ├── check-availability.ts
    └── send-feedback.ts
```

### Monitoring & Analytics (Future)

- Error tracking with Sentry
- Analytics with Google Analytics 4
- Performance monitoring with Web Vitals
- User session recording with Hotjar

### Deployment Pipeline

1. Push to GitHub
2. Netlify auto-builds
3. Tests run in CI
4. Static site deployed to CDN
5. Instant global availability

### Environment Variables

Required for production:
- `ANTHROPIC_API_KEY` - For Claude Task Master
- `NEXT_PUBLIC_GA_ID` - Google Analytics (future)
- `SENTRY_DSN` - Error tracking (future)
- `PERPLEXITY_API_KEY` - Research features (optional)