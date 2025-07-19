# Error Boundaries Documentation

## Overview

The WCI@NYP application implements a comprehensive error boundary system to gracefully handle runtime errors and prevent application crashes. Error boundaries catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI.

## Architecture

### Core Components

1. **ErrorBoundary** (`/src/components/error-boundary.tsx`)
   - Main error boundary component with flexible configuration
   - Supports different error levels (page, section, component)
   - Auto-recovery mechanisms
   - Integration with logging system

2. **ApiErrorBoundary** (`/src/components/api-error-boundary.tsx`)
   - Specialized for API and network errors
   - Handles specific HTTP status codes
   - Offline detection
   - Retry mechanisms

## Usage

### Basic Error Boundary

```tsx
import { ErrorBoundary } from '@/components/error-boundary'

function MyComponent() {
  return (
    <ErrorBoundary>
      <ComponentThatMightThrow />
    </ErrorBoundary>
  )
}
```

### Page-Level Error Boundary

```tsx
<ErrorBoundary level="page" showDetails={process.env.NODE_ENV === 'development'}>
  <PageContent />
</ErrorBoundary>
```

### Section-Level Error Boundary

```tsx
<ErrorBoundary level="section">
  <DataTable data={data} />
</ErrorBoundary>
```

### Component-Level Error Boundary

```tsx
<ErrorBoundary level="component" isolate>
  <RiskyComponent />
</ErrorBoundary>
```

### Custom Fallback UI

```tsx
<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <p>Something went wrong: {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )}
>
  <MyComponent />
</ErrorBoundary>
```

### API Error Boundary

```tsx
import { ApiErrorBoundary } from '@/components/api-error-boundary'

<ApiErrorBoundary onRetry={refetchData}>
  <DataFetchingComponent />
</ApiErrorBoundary>
```

## Configuration Options

### ErrorBoundary Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `level` | `'page' \| 'section' \| 'component'` | `'component'` | Error boundary level affects UI presentation |
| `fallback` | `(error: Error, reset: () => void) => ReactNode` | Built-in UI | Custom error UI |
| `onError` | `(error: Error, errorInfo: ErrorInfo) => void` | - | Called when error is caught |
| `resetKeys` | `Array<string \| number>` | - | Dependency array to trigger reset |
| `resetOnPropsChange` | `boolean` | `false` | Reset on prop changes |
| `isolate` | `boolean` | `false` | Show minimal UI |
| `showDetails` | `boolean` | `false` | Show error stack trace |

### Error Levels

#### Page Level
- Full-screen error display
- "Go Home" navigation option
- Detailed error information in development
- Suitable for route-level errors

#### Section Level
- Card-based error display
- Retry functionality
- Error count tracking
- Suitable for major features

#### Component Level
- Inline error display
- Minimal visual disruption
- Quick retry option
- Suitable for isolated components

## Features

### Auto-Recovery
Error boundaries automatically reset after 3 consecutive errors to prevent infinite error loops:

```tsx
// Auto-reset after 3 errors
if (this.state.errorCount >= 2) {
  this.scheduleReset(5000) // Reset after 5 seconds
}
```

### Reset Triggers
Multiple ways to reset error state:

1. **Manual Reset**: Click retry button
2. **Prop Changes**: Set `resetOnPropsChange={true}`
3. **Reset Keys**: Dependencies that trigger reset
4. **Auto Reset**: After multiple errors

### Error Logging
All errors are automatically logged with context:

```tsx
logger.error(`ErrorBoundary caught error at ${level} level`, {
  error: error.message,
  stack: error.stack,
  componentStack: errorInfo.componentStack,
  level,
  errorCount: this.state.errorCount + 1,
})
```

### Higher-Order Component
Wrap components easily with error boundaries:

```tsx
import { withErrorBoundary } from '@/components/error-boundary'

const SafeComponent = withErrorBoundary(UnsafeComponent, {
  level: 'component',
  onError: (error) => console.error('Component failed:', error)
})
```

## Implementation Guide

### 1. App-Level Protection

In your root layout:

```tsx
// app/layout.tsx
<ErrorBoundary level="page" showDetails={isDevelopment}>
  <Providers>
    <App />
  </Providers>
</ErrorBoundary>
```

### 2. Route Protection

For each route:

```tsx
// app/dashboard/layout.tsx
<ErrorBoundary level="section">
  {children}
</ErrorBoundary>
```

### 3. Feature Protection

For complex features:

```tsx
// Complex data visualization
<ErrorBoundary 
  level="section"
  onError={(error) => trackError('DataViz', error)}
>
  <DataVisualization />
</ErrorBoundary>
```

### 4. Component Protection

For risky components:

```tsx
// Third-party integrations
<ErrorBoundary level="component" isolate>
  <ThirdPartyWidget />
</ErrorBoundary>
```

### 5. API Protection

For data fetching:

```tsx
<ApiErrorBoundary onRetry={refetch}>
  <UserProfile userId={userId} />
</ApiErrorBoundary>
```

## Best Practices

### 1. Strategic Placement
- Don't wrap every component
- Focus on boundaries between features
- Protect third-party integrations
- Guard async operations

### 2. Error Recovery
```tsx
// Good: Provide meaningful recovery
<ErrorBoundary
  fallback={(error, reset) => (
    <Alert>
      <p>Failed to load user data</p>
      <Button onClick={() => {
        clearCache()
        reset()
      }}>
        Clear cache and retry
      </Button>
    </Alert>
  )}
>
```

### 3. Error Context
```tsx
// Good: Add context to errors
<ErrorBoundary
  onError={(error, errorInfo) => {
    logger.error('Dashboard widget failed', {
      widgetId,
      userId,
      error,
      errorInfo
    })
  }}
>
```

### 4. User-Friendly Messages
```tsx
// Good: Clear user messaging
const errorMessages = {
  NetworkError: 'Please check your internet connection',
  ValidationError: 'Please check your input and try again',
  PermissionError: 'You don\'t have access to this feature'
}
```

### 5. Progressive Degradation
```tsx
// Good: Fallback to simpler version
<ErrorBoundary
  fallback={() => <SimpleTable data={data} />}
>
  <AdvancedDataGrid data={data} />
</ErrorBoundary>
```

## Testing Error Boundaries

### 1. Component Testing

```tsx
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '@/components/error-boundary'

const ThrowError = () => {
  throw new Error('Test error')
}

test('displays error message', () => {
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  )
  
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
})
```

### 2. Error Simulation

```tsx
// Development component for testing
function ErrorSimulator() {
  const [shouldError, setShouldError] = useState(false)
  
  if (shouldError) {
    throw new Error('Simulated error')
  }
  
  return (
    <Button onClick={() => setShouldError(true)}>
      Trigger Error
    </Button>
  )
}
```

### 3. Reset Testing

```tsx
test('resets on prop change', () => {
  const { rerender } = render(
    <ErrorBoundary resetKeys={[1]} resetOnPropsChange>
      <ThrowError />
    </ErrorBoundary>
  )
  
  expect(screen.getByText(/error/i)).toBeInTheDocument()
  
  rerender(
    <ErrorBoundary resetKeys={[2]} resetOnPropsChange>
      <SafeComponent />
    </ErrorBoundary>
  )
  
  expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
})
```

## Common Patterns

### Async Component Protection

```tsx
const AsyncBoundary = ({ children, fallback }) => (
  <ErrorBoundary level="component">
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  </ErrorBoundary>
)
```

### Form Error Handling

```tsx
<ErrorBoundary
  level="section"
  resetKeys={[formData]}
  fallback={(error, reset) => (
    <Alert>
      <p>Form submission failed</p>
      <Button onClick={reset}>Try again</Button>
    </Alert>
  )}
>
  <Form onSubmit={handleSubmit} />
</ErrorBoundary>
```

### List Item Protection

```tsx
{items.map(item => (
  <ErrorBoundary key={item.id} level="component" isolate>
    <ListItem item={item} />
  </ErrorBoundary>
))}
```

## Monitoring and Analytics

### Error Tracking

```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Send to analytics
    analytics.track('Error Boundary Triggered', {
      error: error.message,
      stack: error.stack,
      component: errorInfo.componentStack,
      level,
      page: window.location.pathname
    })
    
    // Send to error reporting
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        }
      })
    }
  }}
>
```

### Performance Impact

Error boundaries have minimal performance impact:
- No overhead during normal operation
- Error catching is synchronous
- Logging is asynchronous
- Recovery mechanisms are throttled

## Troubleshooting

### Error Boundary Not Catching Errors

Error boundaries do NOT catch:
- Event handler errors (use try/catch)
- Async errors (use try/catch or .catch())
- Errors during SSR
- Errors in the error boundary itself

### Infinite Error Loops

Prevented by:
- Auto-reset after 3 errors
- Isolation mode for components
- Prop change detection

### Development vs Production

```tsx
// Show details only in development
<ErrorBoundary
  showDetails={process.env.NODE_ENV === 'development'}
  fallback={
    process.env.NODE_ENV === 'production'
      ? ProductionErrorUI
      : DevelopmentErrorUI
  }
>
```

## Migration Guide

### From Try/Catch

Before:
```tsx
try {
  return <RiskyComponent />
} catch (error) {
  return <div>Error: {error.message}</div>
}
```

After:
```tsx
<ErrorBoundary>
  <RiskyComponent />
</ErrorBoundary>
```

### From Error State

Before:
```tsx
const [error, setError] = useState(null)

if (error) return <ErrorDisplay error={error} />
return <Component onError={setError} />
```

After:
```tsx
<ErrorBoundary>
  <Component />
</ErrorBoundary>
```

## Future Enhancements

1. **Error Recovery Strategies**
   - Exponential backoff for retries
   - Circuit breaker pattern
   - Fallback data sources

2. **Error Reporting**
   - Detailed error analytics
   - User feedback collection
   - Error trend analysis

3. **Smart Recovery**
   - Automatic error resolution
   - Predictive error prevention
   - Self-healing components