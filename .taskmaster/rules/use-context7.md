# Context7 Usage Rules for WCINYP Project

## MANDATORY: Always Use Context7

When working on ANY task for the WCINYP project, you MUST prefix relevant prompts with "use context7" to get current documentation for:

### Core Technologies (UPDATED VERSIONS)
- **Next.js 15.3.5** (NOT Next.js 14!)
- **React 19.0.0** 
- **Tailwind CSS 4.0.0**
- **TypeScript 5.x**
- **Vitest 2.0**
- **Fumadocs 15.6.1**

### Key Areas Requiring Context7
1. **App Router Patterns** - Next.js 15 specific features
2. **React 19 Features** - New hooks, patterns, and APIs
3. **Tailwind v4 Syntax** - New utilities and configuration
4. **shadcn/ui Components** - Latest component patterns
5. **Testing Patterns** - Vitest 2.0 and React Testing Library
6. **Supabase Auth** - Current authentication patterns
7. **Netlify Functions** - Serverless deployment

### Example Usage
```
use context7 - how do I implement server components in Next.js 15?
use context7 - show me React 19 use() hook examples
use context7 - what's the Tailwind v4 syntax for container queries?
```

## Why This Matters
- The project uses LATEST versions of all dependencies
- Outdated documentation will cause errors
- Context7 provides real-time, accurate documentation
- Prevents hallucinated or deprecated APIs

## Implementation Checklist
- [ ] Add "use context7" when implementing new features
- [ ] Verify version-specific syntax with Context7
- [ ] Double-check deprecated patterns before using
- [ ] Test with actual project versions (see package.json)

Remember: When in doubt, use Context7!