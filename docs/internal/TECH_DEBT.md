# Technical Debt & Improvement Plan

## Critical Issues (Fix Immediately)

### 1. Testing Infrastructure Missing
**Problem**: Zero tests, no test runner, no test scripts
**Impact**: Can't verify changes, high regression risk
**Solution**:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
```

### 2. React Router Contamination
**Problem**: Old `/app` directory with React Router code still exists
**Impact**: Confusion, build errors, wasted space
**Solution**: Delete `/app`, keep only `/src/app`

### 3. Everything is Client-Side
**Problem**: All components use `'use client'` unnecessarily
**Impact**: Poor SEO, slow initial load, defeats Next.js purpose
**Solution**: Convert to server components where possible

## Major Issues (Fix Soon)

### 4. No Data Layer
**Problem**: Hardcoded arrays in every component
**Impact**: Can't update data, no persistence
**Solution**: 
- Add API routes in `/app/api`
- Or integrate with external API/database
- Use server components for data fetching

### 5. No Error Handling
**Problem**: No error.tsx, no try-catch, no error boundaries
**Impact**: White screen of death on errors
**Solution**:
- Add `error.tsx` to each route
- Implement proper error boundaries
- Add error logging

### 6. No Loading States
**Problem**: No loading.tsx, no suspense boundaries
**Impact**: Poor UX during data fetching
**Solution**:
- Add `loading.tsx` files
- Implement React Suspense
- Add skeleton screens

## Code Quality Issues

### 7. Type Safety
```typescript
// Bad (current)
// @ts-ignore
const MDX = page.data.default || page.data.body;

// Good
interface PageData {
  default: React.ComponentType;
  toc: TableOfContents;
  title: string;
  description: string;
}
```

### 8. Component Organization
```
// Current (mixed concerns)
src/
├── app/          # Pages with inline data
├── components/   # Mix of UI and business logic

// Better
src/
├── app/          # Pages only
├── components/   
│   ├── ui/       # Pure UI components
│   └── features/ # Feature-specific components
├── lib/
│   ├── data/     # Data fetching
│   └── types/    # Shared types
```

## Missing Features

### 9. Search Functionality
- Current: Client-side filter only
- Need: Proper search with API/database

### 10. Authentication
- Current: None
- Need: At least basic auth for admin features

### 11. Form Generator
- Current: Just a list
- Need: Actual form building functionality

## Development Efficiency

### 12. No Development Tools
Missing:
- ESLint configuration
- Prettier setup
- Husky pre-commit hooks
- VS Code settings
- Environment variables

### 13. No CI/CD Pipeline
Missing:
- GitHub Actions for tests
- Build verification
- Automated deployment checks

## Immediate Action Items

1. **Clean up React Router remnants**:
```bash
rm -rf app/
rm -rf modules/
rm -rf e2e/
```

2. **Set up basic testing**:
```json
// package.json
"scripts": {
  "test": "vitest",
  "test:coverage": "vitest --coverage"
}
```

3. **Convert to server components** where possible
4. **Add error and loading states**
5. **Extract hardcoded data** to separate files

## For AI Development Efficiency

Most critical for AI-assisted development:
1. **Tests** - Can't refactor safely without them
2. **Type definitions** - Need to understand data shapes
3. **Clear separation** - Business logic vs UI
4. **Error boundaries** - Need to see what breaks
5. **Development scripts** - Automate common tasks

Without tests, every change is risky. This should be priority #1.