# Test Migration Guide for Design System

## Overview
This guide documents which tests will need updates as we roll out the design system changes. Tests are organized by the phase in which they'll need updates.

## Feature Flag Testing Strategy

### Default Behavior
- All feature flags are **disabled by default** in tests
- This ensures existing tests continue to pass without modification
- New tests should explicitly enable flags when testing new behavior

### Using Feature Flags in Tests

```typescript
import { withFeatureFlags } from '@/test/feature-flag-utils'

// Test with specific flags enabled
it('should use neutral badges when flag is enabled', withFeatureFlags(
  { NEUTRAL_BADGES: true },
  async () => {
    // Your test code here
  }
))
```

## Tests Requiring Updates by Phase

### Phase 2: UI Component Library Migration

#### Badge Component Tests (`src/components/ui/badge.test.tsx`)
- **Current**: Tests expect various color variants (blue, green, purple, etc.)
- **Update**: When `NEUTRAL_BADGES` flag is enabled, all badges should be neutral
- **Strategy**: Add conditional tests based on feature flag

#### Button Component Tests (`src/components/ui/button.test.tsx`)
- **Current**: Tests include `xs` size variant
- **Update**: When `ENFORCE_TYPOGRAPHY` is enabled, `xs` should map to `sm`
- **Strategy**: Test both old and new behavior with flags

#### Provider Table Tests (`src/components/ui/provider-table.test.tsx`)
- **Current**: May include colorful badges for affiliations
- **Update**: Should use neutral badges when flag is enabled

### Phase 3: Error Pages

#### Error Page Tests
- `src/app/not-found.test.tsx` (if exists)
- `src/app/error.test.tsx` (if exists)
- **Current**: May expect specific color classes like `bg-red-600`
- **Update**: Should expect semantic colors like `bg-destructive`

### Phase 4: Typography

#### Component Tests with Text Sizes
Files that may need updates:
- `src/app/documents/page.test.tsx`
- `src/app/directory/page.test.tsx`
- `src/app/updates/page.test.tsx`

**Current**: May render and test for specific text sizes
**Update**: Should expect mapped sizes when `ENFORCE_TYPOGRAPHY` is enabled

### Phase 5: Integration Tests

#### Full App Tests
- Any E2E or integration tests
- **Update**: Should pass with all flags enabled

## Test Update Patterns

### Pattern 1: Conditional Assertions
```typescript
it('renders badge with correct color', () => {
  render(<Badge variant="blue">Test</Badge>)
  const badge = screen.getByText('Test')
  
  if (FEATURE_FLAGS.NEUTRAL_BADGES_ONLY) {
    expect(badge).toHaveClass('bg-secondary')
  } else {
    expect(badge).toHaveClass('bg-blue-100')
  }
})
```

### Pattern 2: Separate Test Suites
```typescript
describe('Badge Component', () => {
  describe('with legacy colors', () => {
    // Tests with flags disabled
  })
  
  describe('with design system', () => {
    beforeEach(() => {
      setFeatureFlags({ NEUTRAL_BADGES: true })
    })
    
    // Tests with flags enabled
  })
})
```

### Pattern 3: Parameterized Tests
```typescript
testWithFeatureFlagCombinations(
  'renders correctly',
  async (flags) => {
    render(<Component />)
    // Assertions based on flags
  }
)
```

## Migration Checklist

### Before Starting
- [ ] Run all tests to ensure they pass with flags disabled
- [ ] Document current test count and coverage

### During Migration
- [ ] Update tests incrementally by component
- [ ] Keep both old and new assertions during transition
- [ ] Use feature flag utilities for conditional behavior
- [ ] Run tests with various flag combinations

### After Each Phase
- [ ] All tests pass with flags disabled (backward compatibility)
- [ ] All tests pass with relevant flags enabled
- [ ] No hardcoded assertions for old patterns when flags are enabled
- [ ] Coverage remains the same or improves

## Common Pitfalls

1. **Module Caching**: Always use `vi.resetModules()` when changing feature flags
2. **Snapshot Tests**: May need separate snapshots for different flag states
3. **Visual Regression Tests**: Should capture both old and new states
4. **Integration Tests**: May need longer timeout during transition

## Test Utilities Reference

```typescript
// Enable specific flags for a test
withFeatureFlags({ ENFORCE_TYPOGRAPHY: true }, async () => {
  // Test code
})

// Reset all flags to default
resetFeatureFlags()

// Test with multiple flag combinations
testWithFeatureFlagCombinations('component behavior', (flags) => {
  // Test code that adapts based on flags
})
```

## Future Considerations

Once all phases are complete and feature flags are removed:
1. Remove conditional test logic
2. Delete tests for old behavior
3. Simplify test suites
4. Update this guide to reflect permanent changes