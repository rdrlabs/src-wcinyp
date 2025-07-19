# Loading Patterns Documentation

This document describes the loading patterns and boundaries implemented in the WCI@NYP application for handling asynchronous operations and providing optimal user experience.

## Overview

Loading boundaries provide consistent loading states across the application, eliminating layout shifts and providing immediate visual feedback during data fetching operations. They integrate seamlessly with our error boundaries to handle both loading and error states.

## Components

### LoadingBoundary

The base loading boundary component that combines React Suspense with error boundaries.

```tsx
import { LoadingBoundary } from '@/components/loading-boundary'

// Basic usage
<LoadingBoundary>
  <AsyncComponent />
</LoadingBoundary>

// With custom loading type
<LoadingBoundary loadingType="card">
  <AsyncComponent />
</LoadingBoundary>

// With custom fallback
<LoadingBoundary fallback={<CustomLoader />}>
  <AsyncComponent />
</LoadingBoundary>
```

### Specialized Loading Boundaries

Pre-configured loading boundaries for common UI patterns:

#### DataLoadingBoundary
For data tables and grids:
```tsx
<DataLoadingBoundary>
  <DataTable data={data} columns={columns} />
</DataLoadingBoundary>
```

#### CardLoadingBoundary
For card-based layouts:
```tsx
<CardLoadingBoundary count={6}>
  {stats && <StatsCards data={stats} />}
</CardLoadingBoundary>
```

#### ListLoadingBoundary
For list views:
```tsx
<ListLoadingBoundary items={10}>
  <ItemList items={items} />
</ListLoadingBoundary>
```

#### FormLoadingBoundary
For forms with multiple fields:
```tsx
<FormLoadingBoundary fields={5}>
  <UserForm onSubmit={handleSubmit} />
</FormLoadingBoundary>
```

#### ChartLoadingBoundary
For charts and visualizations:
```tsx
<ChartLoadingBoundary height={400}>
  <AnalyticsChart data={chartData} />
</ChartLoadingBoundary>
```

## Loading Skeletons

Custom skeleton components that match the application's UI patterns:

### Available Skeletons

- `Skeleton` - Base skeleton component
- `CardSkeleton` - Card layout skeleton
- `TableSkeleton` - Table with headers and rows
- `ListSkeleton` - List items skeleton
- `FormSkeleton` - Form fields skeleton
- `ChartSkeleton` - Chart placeholder
- `ProfileSkeleton` - User profile skeleton
- `NavigationSkeleton` - Navigation menu skeleton
- `StatsSkeleton` - Statistics cards skeleton
- `GallerySkeleton` - Image gallery skeleton
- `CommentSkeleton` - Comments/feedback skeleton
- `PageSkeleton` - Full page skeleton

## Implementation Patterns

### Client-Side Data Fetching

For components using useEffect or similar hooks:

```tsx
function MyComponent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData().then(setData).finally(() => setLoading(false))
  }, [])

  return loading ? (
    <ListLoadingBoundary>
      <div />
    </ListLoadingBoundary>
  ) : (
    <div>{/* Render data */}</div>
  )
}
```

### Server Components (Next.js App Router)

Server components with async/await don't need loading boundaries as Next.js handles the loading state:

```tsx
// This already has loading state handled by Next.js
export default async function Page() {
  const data = await fetchData()
  return <DataTable data={data} />
}
```

### Higher-Order Component Pattern

Wrap components that need loading boundaries:

```tsx
import { withLoadingBoundary } from '@/components/loading-boundary'

const MyComponent = () => <div>Content</div>

export default withLoadingBoundary(MyComponent, {
  loadingType: 'card',
  loadingProps: { count: 3 }
})
```

### Dynamic Imports

For code splitting with loading states:

```tsx
import { createAsyncComponent } from '@/components/loading-boundary'

const AsyncDashboard = createAsyncComponent(
  () => import('./Dashboard'),
  { loadingType: 'page' }
)
```

## Best Practices

1. **Choose the Right Loading Type**: Match the skeleton to your content type for seamless transitions
2. **Avoid Layout Shift**: Ensure loading skeletons have similar dimensions to loaded content
3. **Set Appropriate Counts**: For collection skeletons (cards, lists), match expected item counts
4. **Handle Empty States**: Differentiate between loading and empty data states
5. **Combine with Error Boundaries**: Loading boundaries include error handling by default
6. **Performance**: Use loading boundaries for operations that might take >100ms

## Examples in the Codebase

### Admin Access Requests Page
```tsx
// Stats cards with loading state
{stats ? (
  <StatsGrid stats={stats} />
) : (
  <CardLoadingBoundary count={6}>
    <div />
  </CardLoadingBoundary>
)}

// Request list with loading state
{loading ? (
  <ListLoadingBoundary>
    <div />
  </ListLoadingBoundary>
) : (
  <RequestsList requests={requests} />
)}
```

### Documents Page
```tsx
<DataLoadingBoundary>
  <DataTable
    columns={columns}
    data={documents}
    onRowClick={handleRowClick}
  />
</DataLoadingBoundary>
```

### Sessions Page
```tsx
const sessionsContent = loading ? (
  <ListLoadingBoundary>
    <div />
  </ListLoadingBoundary>
) : (
  <SessionsList sessions={sessions} />
)
```

## Testing

Loading boundaries and skeletons include comprehensive tests:

```tsx
// Test loading state
it('renders loading skeleton initially', () => {
  render(
    <LoadingBoundary>
      <AsyncComponent />
    </LoadingBoundary>
  )
  expect(screen.getByRole('status')).toBeInTheDocument()
})

// Test content rendering
it('renders content after loading', async () => {
  render(
    <LoadingBoundary>
      <AsyncComponent />
    </LoadingBoundary>
  )
  await waitFor(() => {
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})
```

## Accessibility

All loading skeletons include:
- `role="status"` for screen readers
- `aria-label="Loading"` where appropriate
- Proper semantic HTML structure
- Animation that respects `prefers-reduced-motion`

## Future Enhancements

1. **Progressive Loading**: Show partial content as it becomes available
2. **Optimistic Updates**: Update UI before server confirmation
3. **Loading Progress**: For long-running operations
4. **Stale-While-Revalidate**: Show cached content during refresh
5. **Network-Aware Loading**: Adjust timeouts based on connection speed