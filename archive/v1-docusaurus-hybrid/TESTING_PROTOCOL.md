# Testing Protocol & Standards

## Overview
This document establishes comprehensive testing standards for senior-level development using React Testing Library and Jest. All components must pass these standards before deployment.

## Testing Philosophy

### Test-First Approach
- Write tests BEFORE implementing features
- Tests define the expected behavior
- Implementation fulfills the test requirements
- Red → Green → Refactor cycle

### Testing Pyramid
```
                /\
               /  \
              /    \
             /  E2E  \    (Few, High-level, Slow)
            /________\
           /          \
          /Integration \   (Some, Medium-level, Medium)
         /______________\
        /                \
       /      Unit         \  (Many, Low-level, Fast)
      /____________________\
```

## Required Test Categories

### 1. **Unit Tests** (Primary Focus)
- **Component Rendering**: Verify basic rendering with default props
- **User Interactions**: Click, keyboard, form input handling  
- **State Management**: Props changes, internal state updates
- **Edge Cases**: Empty states, error conditions, boundary values
- **Accessibility**: ARIA attributes, keyboard navigation, screen readers

### 2. **Integration Tests**
- **Component Communication**: Parent-child interactions
- **Data Flow**: Props passing, event bubbling
- **Context Integration**: Theme, state management integration

### 3. **Accessibility Tests**
- **ARIA Compliance**: Proper labels, roles, states
- **Keyboard Navigation**: Tab order, Enter/Space activation
- **Screen Reader**: Meaningful content announcements
- **Color Contrast**: Not tested in code but documented requirements

## Test Structure Standards

### File Organization
```
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   └── __tests__/
│   │       └── button.test.tsx
│   ├── ModernDocumentSelector.tsx
│   └── __tests__/
│       └── ModernDocumentSelector.test.tsx
├── test-utils/
│   └── index.tsx
└── setupTests.ts
```

### Test File Naming
- Component tests: `[ComponentName].test.tsx`
- Utility tests: `[utilityName].test.ts`
- Hook tests: `[hookName].test.ts`

### Test Structure Template
```typescript
import { render, screen } from '../../test-utils';
import userEvent from '@testing-library/user-event';
import ComponentName from '../ComponentName';

describe('ComponentName', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      // Test basic rendering
    });
    
    it('renders with custom props', () => {
      // Test prop variations
    });
  });

  describe('Interactions', () => {
    it('handles user events', async () => {
      // Test user interactions
    });
  });

  describe('Accessibility', () => {
    it('supports keyboard navigation', () => {
      // Test accessibility features
    });
  });

  describe('Edge Cases', () => {
    it('handles error states', () => {
      // Test error conditions
    });
  });
});
```

## Testing Standards & Requirements

### 1. **Coverage Requirements**
- **Minimum**: 80% line coverage
- **Target**: 90%+ line coverage
- **Branches**: 85%+ branch coverage
- **Functions**: 95%+ function coverage

### 2. **Test Quality Standards**
- **Descriptive Names**: Tests explain WHAT and WHY
- **Single Responsibility**: One behavior per test
- **Deterministic**: Tests produce consistent results
- **Fast Execution**: Unit tests complete in <100ms
- **Independent**: Tests don't depend on each other

### 3. **Required Test Categories per Component**

#### **Basic Rendering Tests**
```typescript
it('renders with default props', () => {
  render(<Component />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});

it('applies custom className', () => {
  render(<Component className="custom" />);
  expect(screen.getByRole('button')).toHaveClass('custom');
});
```

#### **User Interaction Tests**
```typescript
it('handles click events', async () => {
  const handleClick = jest.fn();
  const user = userEvent.setup();
  
  render(<Component onClick={handleClick} />);
  await user.click(screen.getByRole('button'));
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

#### **Accessibility Tests**
```typescript
it('supports keyboard navigation', async () => {
  const user = userEvent.setup();
  render(<Component />);
  
  const button = screen.getByRole('button');
  await user.tab();
  
  expect(button).toHaveFocus();
});

it('has proper ARIA attributes', () => {
  render(<Component aria-label="Test button" />);
  expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Test button');
});
```

#### **Edge Case Tests**
```typescript
it('handles empty state', () => {
  render(<Component items={[]} />);
  expect(screen.getByText('No items')).toBeInTheDocument();
});

it('handles loading state', () => {
  render(<Component loading />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

it('handles error state', () => {
  render(<Component error="Failed to load" />);
  expect(screen.getByText('Failed to load')).toBeInTheDocument();
});
```

## Test Utilities & Helpers

### Custom Render Function
```typescript
// src/test-utils/index.tsx
import { render, RenderOptions } from '@testing-library/react';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (ui: ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Common Test Data
```typescript
export const testFormData = [
  { label: 'Name', value: 'John Doe', type: 'text' },
  { label: 'Email', value: 'john@example.com', type: 'email' }
];

export const mockDocument = {
  name: 'Test Document',
  path: '/test.pdf',
  category: 'test'
};
```

## Mocking Standards

### Window APIs
```typescript
// setupTests.ts
Object.defineProperty(window, 'print', {
  value: jest.fn(),
  writable: true,
});
```

### External Libraries
```typescript
jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon" />,
  Print: () => <div data-testid="print-icon" />
}));
```

### Async Operations
```typescript
jest.mock('./api', () => ({
  fetchData: jest.fn().mockResolvedValue({ data: 'test' })
}));
```

## CI/CD Integration

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:ci && npm run typecheck"
    }
  }
}
```

### Test Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

## Performance Testing

### Component Performance
```typescript
it('renders large lists efficiently', () => {
  const largeList = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: \`Item \${i}\` }));
  
  const start = performance.now();
  render(<Component items={largeList} />);
  const end = performance.now();
  
  expect(end - start).toBeLessThan(100); // 100ms threshold
});
```

## Error Boundary Testing

### Error Handling
```typescript
it('handles component errors gracefully', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };
  
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );
  
  expect(screen.getByText('Something went wrong')).toBeInTheDocument();
});
```

## Visual Regression Testing

### Snapshot Testing (Limited Use)
```typescript
it('matches snapshot for complex layouts', () => {
  const { container } = render(<ComplexComponent />);
  expect(container.firstChild).toMatchSnapshot();
});
```

## UI Layout Testing

### Layout Consistency Validation
```typescript
describe('Layout Consistency', () => {
  it('follows Provider layout pattern', () => {
    render(<NewComponent />);
    
    // Verify header structure
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    
    // Verify filter section
    const filterButtons = screen.getAllByRole('button');
    expect(filterButtons.length).toBeGreaterThan(0);
    
    // Verify content area
    expect(screen.getByTestId('content-area')).toHaveStyle({
      maxWidth: '1200px',
      margin: '0 auto'
    });
  });

  it('maintains responsive design breakpoints', () => {
    // Test mobile viewport
    global.innerWidth = 768;
    global.dispatchEvent(new Event('resize'));
    
    render(<Component />);
    expect(screen.getByTestId('mobile-layout')).toBeInTheDocument();
  });
});
```

### Provider Pattern Validation
```typescript
describe('Provider Pattern Compliance', () => {
  it('matches Provider component structure', () => {
    const { container: newComponent } = render(<NewComponent />);
    const { container: provider } = render(<ProviderComponent />);
    
    // Compare DOM structure patterns
    const newHeader = newComponent.querySelector('[style*="backgroundColor: white"]');
    const providerHeader = provider.querySelector('[style*="backgroundColor: white"]');
    
    expect(newHeader).toBeTruthy();
    expect(providerHeader).toBeTruthy();
    
    // Verify similar styling patterns
    expect(newHeader).toHaveStyle('padding: 24px 32px');
    expect(newHeader).toHaveStyle('borderBottom: 1px solid #e2e8f0');
  });

  it('uses consistent spacing and typography', () => {
    render(<NewComponent />);
    
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveStyle({
      fontSize: '24px',
      fontWeight: '600',
      color: '#1e293b'
    });
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toHaveStyle({
      padding: '12px 16px 12px 40px',
      fontSize: '14px',
      borderRadius: '8px'
    });
  });

  it('maintains color consistency', () => {
    render(<NewComponent />);
    
    // Check filter buttons use standard colors
    const filterButton = screen.getByRole('button', { name: /general/i });
    expect(filterButton).toHaveStyle('backgroundColor: #64748b'); // MODALITY_COLORS.General
  });
});
```

## Performance Testing

### Component Render Time Benchmarks
```typescript
describe('Performance Benchmarks', () => {
  it('renders within acceptable time limits', () => {
    const startTime = performance.now();
    render(<Component />);
    const endTime = performance.now();
    
    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThan(100); // 100ms threshold
  });

  it('handles large datasets efficiently', () => {
    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      category: 'test'
    }));
    
    const startTime = performance.now();
    render(<Component data={largeDataset} />);
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(200); // 200ms for large datasets
  });

  it('optimizes re-renders with React.memo', () => {
    const renderSpy = jest.fn();
    const TestComponent = React.memo(() => {
      renderSpy();
      return <Component />;
    });
    
    const { rerender } = render(<TestComponent prop="value" />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    
    // Re-render with same props - should not trigger re-render
    rerender(<TestComponent prop="value" />);
    expect(renderSpy).toHaveBeenCalledTimes(1);
    
    // Re-render with different props - should trigger re-render
    rerender(<TestComponent prop="newValue" />);
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  it('measures search filter performance', async () => {
    const user = userEvent.setup();
    render(<Component />);
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    
    const startTime = performance.now();
    await user.type(searchInput, 'test query');
    const endTime = performance.now();
    
    // Search should be responsive
    expect(endTime - startTime).toBeLessThan(50);
  });
});
```

### Memory Usage Testing
```typescript
describe('Memory Performance', () => {
  it('cleans up event listeners on unmount', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    
    const { unmount } = render(<Component />);
    const addCalls = addEventListenerSpy.mock.calls.length;
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledTimes(addCalls);
  });

  it('prevents memory leaks with proper cleanup', () => {
    const cleanup = jest.fn();
    
    const ComponentWithCleanup = () => {
      useEffect(() => {
        return cleanup;
      }, []);
      return <Component />;
    };
    
    const { unmount } = render(<ComponentWithCleanup />);
    unmount();
    
    expect(cleanup).toHaveBeenCalled();
  });
});
```

## Deployment Checklist

### Pre-Deployment Requirements
- [ ] All tests pass (`npm run test:ci`)
- [ ] Type checking passes (`npm run typecheck`)
- [ ] Coverage meets requirements (>80%)
- [ ] No console errors in tests
- [ ] Accessibility tests pass
- [ ] Edge cases covered
- [ ] Performance tests pass

### Test Quality Gates
1. **Unit Tests**: >90% pass rate
2. **Integration Tests**: >95% pass rate  
3. **Coverage**: >80% overall
4. **Performance**: <100ms render time
5. **Accessibility**: WCAG 2.1 AA compliance

## Documentation Requirements

### Test Documentation
- Document complex test setups
- Explain unusual mocking decisions
- Provide examples for team members
- Keep README updated with testing info

### Component Testing Docs
```typescript
/**
 * @test-requirements
 * - Must test all interactive elements
 * - Must verify accessibility compliance
 * - Must handle error states
 * - Must test edge cases with empty/invalid data
 */
```

This protocol ensures consistent, high-quality testing across the entire codebase while maintaining senior engineering standards.