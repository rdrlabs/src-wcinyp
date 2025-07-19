import React, { Suspense } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  LoadingBoundary,
  DataLoadingBoundary,
  CardLoadingBoundary,
  ListLoadingBoundary,
  FormLoadingBoundary,
  ChartLoadingBoundary,
  withLoadingBoundary,
  createAsyncComponent
} from './loading-boundary'

// Mock component that simulates async loading
const AsyncComponent = ({ delay = 100 }: { delay?: number }) => {
  const [loaded, setLoaded] = React.useState(false)
  
  React.useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), delay)
    return () => clearTimeout(timer)
  }, [delay])
  
  if (!loaded) {
    throw new Promise((resolve) => setTimeout(resolve, delay))
  }
  
  return <div>Content loaded</div>
}

// Mock error component
const ErrorComponent = () => {
  throw new Error('Test error')
}

describe('LoadingBoundary', () => {
  it('renders loading state initially', () => {
    render(
      <LoadingBoundary>
        <AsyncComponent />
      </LoadingBoundary>
    )
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
  
  it('renders content after loading', async () => {
    render(
      <LoadingBoundary>
        <AsyncComponent delay={50} />
      </LoadingBoundary>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Content loaded')).toBeInTheDocument()
    })
  })
  
  it('renders custom fallback', () => {
    render(
      <LoadingBoundary fallback={<div>Custom loading</div>}>
        <AsyncComponent />
      </LoadingBoundary>
    )
    
    expect(screen.getByText('Custom loading')).toBeInTheDocument()
  })
  
  it('handles errors with error boundary', () => {
    const errorFallback = (error: Error) => <div>Error: {error.message}</div>
    
    render(
      <LoadingBoundary errorFallback={errorFallback}>
        <ErrorComponent />
      </LoadingBoundary>
    )
    
    expect(screen.getByText('Error: Test error')).toBeInTheDocument()
  })
  
  it('renders skeleton loading type', () => {
    render(
      <LoadingBoundary loadingType="skeleton">
        <AsyncComponent />
      </LoadingBoundary>
    )
    
    expect(screen.getByRole('status')).toHaveClass('animate-pulse')
  })
})

describe('DataLoadingBoundary', () => {
  it('renders table skeleton', () => {
    render(
      <DataLoadingBoundary>
        <AsyncComponent />
      </DataLoadingBoundary>
    )
    
    expect(screen.getByTestId('table-skeleton')).toBeInTheDocument()
  })
})

describe('CardLoadingBoundary', () => {
  it('renders multiple card skeletons', () => {
    render(
      <CardLoadingBoundary count={3}>
        <AsyncComponent />
      </CardLoadingBoundary>
    )
    
    const cards = screen.getAllByTestId('card-skeleton')
    expect(cards).toHaveLength(3)
  })
  
  it('renders default count of card skeletons', () => {
    render(
      <CardLoadingBoundary>
        <AsyncComponent />
      </CardLoadingBoundary>
    )
    
    const cards = screen.getAllByTestId('card-skeleton')
    expect(cards).toHaveLength(3) // default count
  })
})

describe('ListLoadingBoundary', () => {
  it('renders list items skeleton', () => {
    render(
      <ListLoadingBoundary items={5}>
        <AsyncComponent />
      </ListLoadingBoundary>
    )
    
    const items = screen.getAllByTestId('list-item-skeleton')
    expect(items).toHaveLength(5)
  })
})

describe('FormLoadingBoundary', () => {
  it('renders form fields skeleton', () => {
    render(
      <FormLoadingBoundary fields={4}>
        <AsyncComponent />
      </FormLoadingBoundary>
    )
    
    const fields = screen.getAllByTestId('form-field-skeleton')
    expect(fields).toHaveLength(4)
  })
})

describe('ChartLoadingBoundary', () => {
  it('renders chart skeleton with custom height', () => {
    render(
      <ChartLoadingBoundary height={400}>
        <AsyncComponent />
      </ChartLoadingBoundary>
    )
    
    const chart = screen.getByTestId('chart-skeleton')
    expect(chart).toHaveStyle({ height: '400px' })
  })
})

describe('withLoadingBoundary HOC', () => {
  it('wraps component with loading boundary', async () => {
    const TestComponent = () => <div>Test component</div>
    const WrappedComponent = withLoadingBoundary(TestComponent, {
      loadingType: 'card'
    })
    
    render(<WrappedComponent />)
    
    await waitFor(() => {
      expect(screen.getByText('Test component')).toBeInTheDocument()
    })
  })
  
  it('preserves component display name', () => {
    const TestComponent = () => <div>Test</div>
    TestComponent.displayName = 'TestComponent'
    
    const WrappedComponent = withLoadingBoundary(TestComponent)
    expect(WrappedComponent.displayName).toBe('withLoadingBoundary(TestComponent)')
  })
})

describe('createAsyncComponent', () => {
  it('creates async component with loading boundary', async () => {
    const loader = async () => ({
      default: () => <div>Async loaded component</div>
    })
    
    const AsyncComponent = createAsyncComponent(loader, {
      loadingType: 'skeleton'
    })
    
    render(<AsyncComponent />)
    
    // Initially shows loading
    expect(screen.getByRole('status')).toBeInTheDocument()
    
    // Eventually shows content
    await waitFor(() => {
      expect(screen.getByText('Async loaded component')).toBeInTheDocument()
    })
  })
})