# Comprehensive Testing Guide

## Overview

The WCI@NYP application uses a modern testing stack with Vitest, React Testing Library, and comprehensive mocking utilities. This guide covers all testing patterns, best practices, and examples.

## Testing Stack

- **Test Runner**: Vitest 2.0
- **Testing Library**: React Testing Library
- **Mocking**: Supabase mocks, MSW for API mocking
- **Coverage**: Vitest coverage with c8
- **Visual Testing**: Playwright for E2E and visual regression

## Test Structure

```
src/
├── components/
│   ├── navbar.tsx
│   ├── navbar.test.tsx          # Unit tests
│   └── navbar.supabase.test.tsx # Integration tests
├── test/
│   ├── setup.ts                 # Global test setup
│   ├── mocks/                   # Mock utilities
│   └── fixtures/                # Test data
tests/
├── e2e/                         # End-to-end tests
└── visual/                      # Visual regression tests
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests once (CI mode)
npm run test:ci

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test navbar.test.tsx

# Run tests matching pattern
npm test -- --grep "should render"
```

## Testing Patterns

### 1. Component Unit Tests

Basic component testing with theme support:

```tsx
import { render, screen } from '@testing-library/react'
import { TestProviders } from '@/test/test-providers'
import { Button } from './button'

describe('Button', () => {
  it('should render with correct text', () => {
    render(
      <TestProviders>
        <Button>Click me</Button>
      </TestProviders>
    )
    
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
  
  it('should handle click events', async () => {
    const handleClick = vi.fn()
    const { user } = render(
      <TestProviders>
        <Button onClick={handleClick}>Click me</Button>
      </TestProviders>
    )
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

### 2. Theme Testing

All UI components should test both light and dark modes:

```tsx
import { renderInTheme } from '@/test/theme-test-utils'

describe('Card - Theme Tests', () => {
  it('should render correctly in light mode', () => {
    const { container } = renderInTheme(
      <Card>Content</Card>,
      'light'
    )
    
    expect(container.firstChild).toHaveClass('bg-card')
    expect(container.firstChild).toMatchSnapshot()
  })
  
  it('should render correctly in dark mode', () => {
    const { container } = renderInTheme(
      <Card>Content</Card>,
      'dark'
    )
    
    expect(container.firstChild).toHaveClass('bg-card')
    expect(container.firstChild).toMatchSnapshot()
  })
})
```

### 3. Data-TestId Pattern

Use data-testid for reliable element selection:

```tsx
// Component
<div data-testid="user-profile">
  <h1 data-testid="user-name">{user.name}</h1>
  <p data-testid="user-email">{user.email}</p>
</div>

// Test
it('should display user information', () => {
  render(<UserProfile user={mockUser} />)
  
  expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe')
  expect(screen.getByTestId('user-email')).toHaveTextContent('john@example.com')
})
```

### 4. Async Component Testing

Testing components with async data fetching:

```tsx
import { waitFor } from '@testing-library/react'

it('should load and display data', async () => {
  // Mock the API call
  const mockData = [{ id: 1, name: 'Item 1' }]
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockData
  })
  
  render(<DataList />)
  
  // Wait for loading to complete
  await waitFor(() => {
    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })
})
```

### 5. Supabase Mocking

Using the Supabase mock factory:

```tsx
import { createAuthenticatedSupabaseMock } from '@/test/mocks/supabase-factory'
import { setSupabaseMock } from '@/test/setup'

describe('Admin Page', () => {
  it('should show admin content for admin users', async () => {
    const mock = createAdminSupabaseMock('admin@med.cornell.edu')
    setSupabaseMock(mock)
    
    render(<AdminPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
    })
  })
  
  it('should handle database errors gracefully', async () => {
    const mock = createErrorSupabaseMock()
    setSupabaseMock(mock)
    
    render(<DataComponent />)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load data')).toBeInTheDocument()
    })
  })
})
```

### 6. Form Testing

Testing form interactions and validation:

```tsx
it('should submit form with valid data', async () => {
  const handleSubmit = vi.fn()
  const { user } = render(
    <ContactForm onSubmit={handleSubmit} />
  )
  
  // Fill in form fields
  await user.type(screen.getByLabelText('Name'), 'John Doe')
  await user.type(screen.getByLabelText('Email'), 'john@med.cornell.edu')
  await user.type(screen.getByLabelText('Message'), 'Test message')
  
  // Submit form
  await user.click(screen.getByRole('button', { name: 'Submit' }))
  
  expect(handleSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@med.cornell.edu',
    message: 'Test message'
  })
})
```

### 7. Error Boundary Testing

Testing error boundaries and error states:

```tsx
it('should display error boundary on component error', () => {
  const ThrowError = () => {
    throw new Error('Test error')
  }
  
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  )
  
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  expect(screen.getByText('Test error')).toBeInTheDocument()
})
```

### 8. Loading State Testing

Testing loading boundaries and skeletons:

```tsx
it('should show loading skeleton while fetching data', async () => {
  let resolveData: (data: any) => void
  const dataPromise = new Promise(resolve => {
    resolveData = resolve
  })
  
  mockFetch.mockReturnValueOnce(dataPromise)
  
  render(
    <LoadingBoundary>
      <AsyncDataComponent />
    </LoadingBoundary>
  )
  
  // Should show skeleton initially
  expect(screen.getByTestId('table-skeleton')).toBeInTheDocument()
  
  // Resolve data
  resolveData!({ data: mockData })
  
  // Should show content
  await waitFor(() => {
    expect(screen.queryByTestId('table-skeleton')).not.toBeInTheDocument()
    expect(screen.getByText('Data loaded')).toBeInTheDocument()
  })
})
```

## Best Practices

### 1. Test Organization

```tsx
describe('ComponentName', () => {
  // Group related tests
  describe('rendering', () => {
    it('should render with default props', () => {})
    it('should render with custom className', () => {})
  })
  
  describe('interactions', () => {
    it('should handle click events', () => {})
    it('should handle keyboard navigation', () => {})
  })
  
  describe('accessibility', () => {
    it('should have proper ARIA labels', () => {})
    it('should be keyboard accessible', () => {})
  })
})
```

### 2. Mock Management

```tsx
// Always clean up mocks
beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
  resetSupabaseMock()
})
```

### 3. Avoid Implementation Details

```tsx
// ❌ Bad - Testing implementation details
expect(component.state.isOpen).toBe(true)
expect(wrapper.find('div.modal').hasClass('open')).toBe(true)

// ✅ Good - Testing user-facing behavior
expect(screen.getByRole('dialog')).toBeVisible()
expect(screen.getByText('Modal content')).toBeInTheDocument()
```

### 4. Use Testing Library Queries

```tsx
// Priority order for queries:
// 1. getByRole
expect(screen.getByRole('button', { name: 'Submit' }))

// 2. getByLabelText
expect(screen.getByLabelText('Email address'))

// 3. getByPlaceholderText
expect(screen.getByPlaceholderText('Enter your name'))

// 4. getByText
expect(screen.getByText('Welcome'))

// 5. getByTestId (last resort)
expect(screen.getByTestId('custom-element'))
```

### 5. Async Testing

```tsx
// ❌ Bad - Not waiting for async operations
fireEvent.click(submitButton)
expect(screen.getByText('Success')).toBeInTheDocument()

// ✅ Good - Properly waiting
await user.click(submitButton)
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})
```

## Test Utilities

### Custom Render

```tsx
import { render } from '@testing-library/react'
import { TestProviders } from '@/test/test-providers'

export function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions
) {
  return render(ui, {
    wrapper: TestProviders,
    ...options
  })
}
```

### Mock Factories

```tsx
// User factory
export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: 'user-123',
    email: 'test@med.cornell.edu',
    name: 'Test User',
    ...overrides
  }
}

// Document factory
export function createMockDocument(overrides?: Partial<Document>): Document {
  return {
    id: 'doc-123',
    name: 'Test Document',
    category: 'forms',
    url: '/documents/test.pdf',
    ...overrides
  }
}
```

### Accessibility Testing

```tsx
import { axe } from 'jest-axe'

it('should not have accessibility violations', async () => {
  const { container } = render(<MyComponent />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## Coverage Requirements

Aim for these coverage targets:

- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

Critical paths should have 100% coverage:
- Authentication flows
- Form submissions
- Error handling
- Data mutations

## Debugging Tests

### 1. Debug Output

```tsx
import { screen, debug } from '@testing-library/react'

// Debug entire document
debug()

// Debug specific element
debug(screen.getByRole('button'))

// Pretty print
screen.debug(undefined, Infinity)
```

### 2. VS Code Debugging

```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Current Test File",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["run", "${relativeFile}"],
  "console": "integratedTerminal"
}
```

### 3. Test Isolation

```bash
# Run single test
npm test -- navbar.test.tsx -t "should render logo"

# Run with reporter
npm test -- --reporter=verbose
```

## Common Issues and Solutions

### 1. Act Warnings

```tsx
// Problem: "Warning: An update to Component inside a test was not wrapped in act(...)"

// Solution: Use async utilities
await waitFor(() => {
  expect(screen.getByText('Updated')).toBeInTheDocument()
})
```

### 2. Timer Issues

```tsx
// Setup fake timers
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.runOnlyPendingTimers()
  vi.useRealTimers()
})

// Advance timers in test
await user.click(button)
act(() => {
  vi.advanceTimersByTime(1000)
})
```

### 3. Module Mocking

```tsx
// Mock entire module
vi.mock('@/lib/supabase-client', () => ({
  getSupabaseClient: vi.fn(() => mockSupabase)
}))

// Mock specific export
vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation')
  return {
    ...actual,
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn()
    })
  }
})
```

## E2E Testing with Playwright

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('user can log in', async ({ page }) => {
  await page.goto('/login')
  
  // Fill in email
  await page.fill('[data-testid="email-input"]', 'test@med.cornell.edu')
  
  // Submit form
  await page.click('[data-testid="submit-button"]')
  
  // Check for success message
  await expect(page.locator('text=Magic link sent')).toBeVisible()
})
```

## Continuous Integration

GitHub Actions configuration:

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test:ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)