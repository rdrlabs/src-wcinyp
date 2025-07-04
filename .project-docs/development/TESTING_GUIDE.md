# Testing Guide for Rapid UI Evolution

## Overview

This guide documents our testing strategy designed to support rapid UI/UX changes while maintaining test confidence.

## Core Principles

1. **Test Behavior, Not Implementation**
   - Focus on what users can do, not how it's coded
   - Use semantic queries (roles, labels) over structure

2. **Abstraction Layers**
   - Page Objects isolate UI changes
   - Test data factories for consistent test data
   - Stable selectors via data-testid

3. **Progressive Enhancement**
   - Start with critical path tests
   - Add edge cases as features stabilize
   - Visual tests for UI consistency

## Test Structure

### 1. Page Objects Pattern

```typescript
// ❌ Bad: Direct UI coupling
const searchInput = screen.getByPlaceholderText('Search documents...')
await user.type(searchInput, 'ABN')

// ✅ Good: Page object abstraction
const page = new DocumentsPage()
await page.searchDocuments('ABN')
```

### 2. Data-TestId Strategy

```typescript
// Add stable test IDs to components
<Button data-testid="submit-form-button">Submit</Button>

// Query by test ID in page objects
get submitButton() {
  return screen.getByTestId('submit-form-button')
}
```

### 3. Test Data Factories

```typescript
// Generate consistent test data
const provider = createMockProvider({
  specialty: 'Radiology',
  location: '61st Street'
})

const formData = createMockUserData()
```

## File Organization

```
src/test/
├── page-objects/       # Page object models
│   ├── DocumentsPage.ts
│   ├── FormBuilderPage.ts
│   └── index.ts
├── mocks/             # Test data factories
│   └── factories.ts
├── patterns/          # Reusable test patterns
│   └── patterns.tsx
├── examples/          # Example refactorings
└── index.ts          # Central exports
```

## Writing Resilient Tests

### 1. Use Page Objects

```typescript
import { DocumentsPage } from '@/test'

describe('Document Search', () => {
  let page: DocumentsPage

  beforeEach(() => {
    render(<DocumentsComponent />)
    page = new DocumentsPage()
  })

  it('filters documents by category', async () => {
    await page.selectCategory('ABN Forms')
    page.expectCategorySelected('ABN Forms')
    page.expectDocumentCount(5)
  })
})
```

### 2. Abstract Assertions

```typescript
// ❌ Bad: Specific text assertions
expect(screen.getByText('8 providers in directory')).toBeInTheDocument()

// ✅ Good: Behavioral assertions
providersPage.expectProviderCount(8)
```

### 3. Handle Dynamic Content

```typescript
// Use factories for dynamic data
const providers = createProviderDirectory(10)

// Test behavior, not specific content
providersPage.expectProviderCount(providers.length)
```

## Maintenance Strategy

### When UI Changes

1. **Update Page Objects** - Single location for selector changes
2. **Update Test IDs** - If element structure changes
3. **Keep Tests Green** - Tests should pass with UI updates

### When Adding Features

1. **Create Page Object** - Before writing tests
2. **Add Test IDs** - To new interactive elements
3. **Use Factories** - For new data types

### When Refactoring

1. **Keep Behavior Same** - Tests shouldn't change
2. **Update Implementation** - In page objects only
3. **Verify Coverage** - Ensure nothing is missed

## Test Categories

### 1. Critical Path Tests (Required)
- User can search and download documents
- User can fill and submit forms
- Provider directory is searchable
- Navigation between pages works

### 2. Feature Tests (Important)
- Form validation works correctly
- Search filters apply properly
- Data displays accurately
- Error states handle gracefully

### 3. Edge Case Tests (Nice to Have)
- Empty states display correctly
- Loading states show appropriately
- Keyboard navigation works
- Accessibility compliance

## Visual Testing Strategy

For rapid UI changes, consider:

1. **Snapshot Tests** - For stable components
2. **Visual Regression** - Using Chromatic/Percy
3. **Component Screenshots** - For documentation

## Performance Considerations

1. **Batch Renders** - Render once per test suite
2. **Reuse Factories** - Don't recreate identical data
3. **Parallel Tests** - Use Vitest's parallel mode
4. **Mock Heavy Operations** - File uploads, API calls

## Common Patterns

### Testing Forms

```typescript
const formPage = new FormBuilderPage()

// Fill form using page object
await formPage.fillFormData({
  field_1: 'John Doe',
  field_2: 'john@example.com',
  field_3: true
})

// Submit and verify
await formPage.submitForm()
expect(mockSubmit).toHaveBeenCalled()
```

### Testing Search

```typescript
const page = new ProvidersPage()

// Search and verify results
await page.searchProviders('radiology')
page.expectProviderVisible('Dr. Sarah Johnson')
page.expectProviderSpecialty('Dr. Sarah Johnson', 'Radiology')
```

### Testing Navigation

```typescript
const documentsPage = new DocumentsPage()

// Switch tabs
await documentsPage.switchToTab('forms')

// Verify content changed
const formsPage = new FormsListPage()
formsPage.expectFormTemplateVisible('Self Pay Waiver Form')
```

## Debugging Tips

1. **Use debug()** - `screen.debug()` to see current DOM
2. **Check Queries** - `screen.logTestingPlaygroundURL()`
3. **Verbose Errors** - Set `DEBUG_PRINT_LIMIT=0` for full output
4. **Step Through** - Use debugger in tests

## Future Enhancements

1. **Contract Testing** - Validate API responses
2. **E2E Tests** - Critical user journeys
3. **Load Testing** - Performance benchmarks
4. **A/B Testing** - Feature flag support

## Resources

- [Testing Library Docs](https://testing-library.com/docs/)
- [Vitest Documentation](https://vitest.dev/)
- [Page Object Pattern](https://martinfowler.com/bliki/PageObject.html)
- [Test Data Builders](https://wiki.c2.com/?TestDataBuilder)