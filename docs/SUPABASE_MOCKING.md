# Supabase Mocking Documentation

## Overview

This document describes the comprehensive Supabase mocking system implemented for testing database operations without real connections.

## Files Created

### 1. Mock Utilities (`src/test/mocks/supabase.ts`)
Core mock builder that mimics Supabase's chainable API:
- Type-safe query builder pattern
- Support for all CRUD operations (select, insert, update, delete)
- Filter methods (eq, neq, gt, lt, like, etc.)
- RPC function mocking
- Real-time subscription mocking
- Auth state mocking

### 2. Mock Factory (`src/test/mocks/supabase-factory.ts`)
Pre-configured mock builders for common scenarios:
- `createAuthenticatedSupabaseMock()` - Mock with authenticated user
- `createAdminSupabaseMock()` - Mock with admin user
- `createUnauthenticatedSupabaseMock()` - Mock with no user
- `createErrorSupabaseMock()` - Mock that simulates errors
- `createAccessRequestSupabaseMock()` - Mock with access request data
- `createRealtimeSupabaseMock()` - Mock with real-time events
- `SupabaseMockBuilder` - Fluent builder for custom configurations

### 3. Test Fixtures
Reusable test data:
- `src/test/fixtures/access-requests.fixtures.ts` - Access request test data
- `src/test/fixtures/profiles.fixtures.ts` - User profile test data
- `src/test/fixtures/auth-sessions.fixtures.ts` - Auth session test data
- `src/test/fixtures/admin-config.fixtures.ts` - Admin configuration test data

### 4. Integration Tests
- `src/app/admin/access-requests/page.integration.test.tsx` - Access requests page tests
- `src/contexts/auth-context.integration.test.tsx` - Auth context tests
- `src/lib/auth-validation.integration.test.ts` - Auth validation tests

### 5. Updated Setup (`src/test/setup.ts`)
- Import Supabase mocks
- Mock @supabase/ssr module
- Mock @/lib/supabase-client module
- Mock global fetch for Netlify Functions
- Helper functions: `setSupabaseMock()`, `resetSupabaseMock()`

## Usage Examples

### Basic Mock Setup
```typescript
import { createAuthenticatedSupabaseMock } from '@/test/mocks/supabase-factory'
import { setSupabaseMock, resetSupabaseMock } from '@/test/setup'

describe('My Component', () => {
  afterEach(() => {
    resetSupabaseMock()
  })

  it('should work with authenticated user', () => {
    const mock = createAuthenticatedSupabaseMock('user@med.cornell.edu')
    setSupabaseMock(mock)
    
    // Your test code
  })
})
```

### Custom Mock Configuration
```typescript
const mock = new SupabaseMockBuilder()
  .withUser('test@med.cornell.edu')
  .withAccessRequests([
    { id: '1', email: 'user1@med.cornell.edu', status: 'pending' },
    { id: '2', email: 'user2@med.cornell.edu', status: 'approved' }
  ])
  .withError('profiles', 'select', new Error('Network error'))
  .build()
```

### Testing Database Queries
```typescript
it('should fetch access requests', async () => {
  const mock = createAccessRequestSupabaseMock()
  setSupabaseMock(mock)
  
  // Component will use the mock when calling:
  // supabase.from('access_requests').select('*').order('requested_at')
  
  render(<AccessRequestsPage />)
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})
```

### Testing Error Scenarios
```typescript
it('should handle database errors', async () => {
  const mock = createErrorSupabaseMock()
  setSupabaseMock(mock)
  
  render(<MyComponent />)
  
  await waitFor(() => {
    expect(screen.getByText('Failed to load data')).toBeInTheDocument()
  })
})
```

## Key Features

### 1. Chainable Query Builder
The mock supports Supabase's chainable syntax:
```typescript
supabase
  .from('profiles')
  .select('*')
  .eq('email', 'test@example.com')
  .single()
```

### 2. Type Safety
Full TypeScript support with proper typing for tables and operations.

### 3. Stateful Mocks
Mocks maintain state - inserts add to data, updates modify existing records, deletes remove records.

### 4. Error Simulation
Easy to simulate various error conditions for robust error handling tests.

### 5. Real-time Support
Can simulate real-time events for testing subscription-based features.

## Testing Strategy

1. **Unit Tests**: Mock all Supabase interactions at the component level
2. **Integration Tests**: Test full user flows with mocked database responses
3. **Error Testing**: Verify error handling with simulated failures
4. **Performance**: No network calls means fast, reliable tests

## Current Status

✅ Completed:
- Core mock utilities and factory
- Comprehensive test fixtures
- Setup file integration
- Mock for Netlify Functions (fetch)
- Example integration tests

⚠️ Known Issues:
- Tests need proper auth context mocking
- Some components expect immediate auth state
- Act warnings need to be addressed

## Future Improvements

1. Add more fixture data for edge cases
2. Create mock helpers for complex queries
3. Add performance benchmarks
4. Create visual testing utilities
5. Add mock state persistence between tests