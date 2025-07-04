# Testing Strategy for AI-Assisted Development

## Why Testing Matters for AI Development

As an AI assistant, I need tests because:
1. **No runtime access** - I can't manually verify changes work
2. **Confidence in refactoring** - Tests tell me if I break something
3. **Understanding behavior** - Tests document expected functionality
4. **Rapid iteration** - Can make changes without fear

## Proposed Testing Stack

### 1. Unit/Component Testing: Vitest + React Testing Library
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
```

**vitest.config.ts**:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 2. E2E Testing: Playwright
```bash
npm install -D @playwright/test
```

More reliable than Cypress for headless testing (better for AI).

### 3. Type Testing: tsc + expect-type
```bash
npm install -D expect-type
```

Ensures type safety without runtime.

## Critical Test Coverage Areas

### 1. Page Components
```typescript
// src/app/documents/page.test.tsx
import { render, screen } from '@testing-library/react'
import DocumentsPage from './page'

describe('DocumentsPage', () => {
  it('renders all document categories', () => {
    render(<DocumentsPage />)
    expect(screen.getByText('ABN Forms')).toBeInTheDocument()
    expect(screen.getByText('156 documents available')).toBeInTheDocument()
  })

  it('filters documents by search term', async () => {
    const { user } = render(<DocumentsPage />)
    await user.type(screen.getByPlaceholderText(/search/i), 'ABN')
    expect(screen.getAllByText(/ABN/)).toHaveLength(10)
  })
})
```

### 2. Data Fetching (Future)
```typescript
// src/lib/data/documents.test.ts
describe('getDocuments', () => {
  it('returns documents from API', async () => {
    const docs = await getDocuments()
    expect(docs).toHaveLength(156)
    expect(docs[0]).toHaveProperty('name')
    expect(docs[0]).toHaveProperty('category')
  })
})
```

### 3. UI Components
```typescript
// src/components/ui/table.test.tsx
describe('Table', () => {
  it('renders data rows', () => {
    const data = [{ id: 1, name: 'Test' }]
    render(<Table data={data} />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

## Development Workflow Enhancement

### 1. Test-Driven Refactoring
```bash
# Before making changes
npm test -- --related src/app/documents/page.tsx

# Make changes

# Verify nothing broke
npm test -- --related src/app/documents/page.tsx
```

### 2. Snapshot Testing for UI
```typescript
it('matches snapshot', () => {
  const { container } = render(<DocumentsPage />)
  expect(container).toMatchSnapshot()
})
```

### 3. Coverage Requirements
```json
// package.json
"scripts": {
  "test": "vitest",
  "test:coverage": "vitest --coverage",
  "test:ui": "vitest --ui"
}
```

## What This Enables

### For AI Development:
1. **Safe refactoring** - Run tests after each change
2. **Behavior verification** - Understand what should happen
3. **Regression prevention** - Know immediately if something breaks
4. **Documentation** - Tests show how components should work
5. **Confidence** - Make bold changes with safety net

### Immediate Benefits:
1. Can safely remove client-side rendering where not needed
2. Can refactor hardcoded data without breaking functionality  
3. Can add error boundaries with confidence
4. Can optimize performance without fear

## Implementation Priority

1. **Week 1**: Basic Vitest setup + page component tests
2. **Week 2**: UI component tests + snapshots
3. **Week 3**: E2E tests for critical paths
4. **Week 4**: API/data layer tests (when implemented)

## AI-Specific Testing Patterns

### 1. Descriptive Test Names
```typescript
// Good for AI understanding
it('displays error message when document download fails due to network error', () => {})

// Bad
it('handles errors', () => {})
```

### 2. Test Data Fixtures
```typescript
// src/test/fixtures/documents.ts
export const mockDocuments = {
  valid: [/* ... */],
  empty: [],
  malformed: null,
}
```

### 3. Custom Matchers
```typescript
// src/test/matchers.ts
expect.extend({
  toBeValidDocument(received) {
    const pass = received.name && received.category && received.path
    return { pass, message: () => 'Document missing required fields' }
  }
})
```

Without this testing infrastructure, I'm essentially flying blind when making changes. Every modification is a risk, and I can't confidently refactor or optimize the codebase.