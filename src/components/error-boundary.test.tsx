import React, { useState } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ErrorBoundary, withErrorBoundary } from './error-boundary'
import { vi } from 'vitest'

// Mock the logger
vi.mock('@/lib/logger-v2', () => ({
  logger: {
    error: vi.fn(),
  },
}))

// Component that throws an error
const ThrowError = ({ message = 'Test error' }: { message?: string }) => {
  throw new Error(message)
}

// Component that throws conditionally
const ConditionalError = ({ shouldError }: { shouldError: boolean }) => {
  if (shouldError) {
    throw new Error('Conditional error')
  }
  return <div>No error</div>
}

// Component with error trigger button
const ErrorTrigger = () => {
  const [hasError, setHasError] = useState(false)
  
  if (hasError) {
    throw new Error('Triggered error')
  }
  
  return (
    <button onClick={() => setHasError(true)}>
      Trigger Error
    </button>
  )
}

describe('ErrorBoundary', () => {
  // Suppress console errors in tests
  const originalError = console.error
  beforeAll(() => {
    console.error = vi.fn()
  })
  
  afterAll(() => {
    console.error = originalError
  })
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Functionality', () => {
    it('renders children when there is no error', () => {
      render(
        <ErrorBoundary>
          <div>Test content</div>
        </ErrorBoundary>
      )
      
      expect(screen.getByText('Test content')).toBeInTheDocument()
    })

    it('displays error UI when child throws', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      )
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('displays custom error message', () => {
      render(
        <ErrorBoundary>
          <ThrowError message="Custom error message" />
        </ErrorBoundary>
      )
      
      expect(screen.getByText('Custom error message')).toBeInTheDocument()
    })

    it('uses custom fallback when provided', () => {
      render(
        <ErrorBoundary
          fallback={(error, reset) => (
            <div>
              <p>Custom fallback: {error.message}</p>
              <button onClick={reset}>Reset</button>
            </div>
          )}
        >
          <ThrowError message="Fallback test" />
        </ErrorBoundary>
      )
      
      expect(screen.getByText('Custom fallback: Fallback test')).toBeInTheDocument()
      expect(screen.getByText('Reset')).toBeInTheDocument()
    })
  })

  describe('Error Levels', () => {
    it('renders page-level error UI', () => {
      render(
        <ErrorBoundary level="page">
          <ThrowError />
        </ErrorBoundary>
      )
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByText('Go Home')).toBeInTheDocument()
    })

    it('renders section-level error UI', () => {
      render(
        <ErrorBoundary level="section">
          <ThrowError />
        </ErrorBoundary>
      )
      
      expect(screen.getByText('Unable to load this section')).toBeInTheDocument()
    })

    it('renders component-level error UI', () => {
      render(
        <ErrorBoundary level="component">
          <ThrowError />
        </ErrorBoundary>
      )
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByText('Refresh Page')).toBeInTheDocument()
    })

    it('renders isolated component error UI', () => {
      render(
        <ErrorBoundary level="component" isolate>
          <ThrowError />
        </ErrorBoundary>
      )
      
      expect(screen.getByText('Failed to load component')).toBeInTheDocument()
      expect(screen.getByText('Retry')).toBeInTheDocument()
    })
  })

  describe('Reset Functionality', () => {
    it('resets error state when retry is clicked', async () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ConditionalError shouldError={true} />
        </ErrorBoundary>
      )
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      
      // Click retry
      fireEvent.click(screen.getByText('Try Again'))
      
      // Rerender with no error
      rerender(
        <ErrorBoundary>
          <ConditionalError shouldError={false} />
        </ErrorBoundary>
      )
      
      expect(screen.getByText('No error')).toBeInTheDocument()
    })

    it('resets on resetKeys change', () => {
      const { rerender } = render(
        <ErrorBoundary resetKeys={[1]}>
          <ThrowError />
        </ErrorBoundary>
      )
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      
      rerender(
        <ErrorBoundary resetKeys={[2]}>
          <div>Reset successful</div>
        </ErrorBoundary>
      )
      
      expect(screen.getByText('Reset successful')).toBeInTheDocument()
    })

    it('resets on prop change when enabled', () => {
      const { rerender } = render(
        <ErrorBoundary resetOnPropsChange>
          <ThrowError />
        </ErrorBoundary>
      )
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      
      rerender(
        <ErrorBoundary resetOnPropsChange>
          <div>New content</div>
        </ErrorBoundary>
      )
      
      expect(screen.getByText('New content')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('calls onError callback', () => {
      const onError = vi.fn()
      
      render(
        <ErrorBoundary onError={onError}>
          <ThrowError message="Callback test" />
        </ErrorBoundary>
      )
      
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Callback test' }),
        expect.any(Object)
      )
    })

    it('logs errors with context', () => {
      const { logger } = require('@/lib/logger-v2')
      
      render(
        <ErrorBoundary level="section">
          <ThrowError message="Log test" />
        </ErrorBoundary>
      )
      
      expect(logger.error).toHaveBeenCalledWith(
        'ErrorBoundary caught error at section level',
        expect.objectContaining({
          error: 'Log test',
          level: 'section',
        })
      )
    })

    it('tracks error count', async () => {
      render(
        <ErrorBoundary level="section">
          <ErrorTrigger />
        </ErrorBoundary>
      )
      
      // Trigger error
      fireEvent.click(screen.getByText('Trigger Error'))
      
      expect(screen.getByText('Unable to load this section')).toBeInTheDocument()
      expect(screen.queryByText('Failed 1 times')).not.toBeInTheDocument()
      
      // Reset and trigger again
      fireEvent.click(screen.getByText('Retry'))
      
      // Note: In real usage, the component would need to handle the error differently
      // This is just testing the error count display
    })
  })

  describe('Development Features', () => {
    it('shows error details when showDetails is true', () => {
      render(
        <ErrorBoundary level="page" showDetails>
          <ThrowError message="Details test" />
        </ErrorBoundary>
      )
      
      expect(screen.getByText('Error details (for developers)')).toBeInTheDocument()
      expect(screen.getByText(/Details test/)).toBeInTheDocument()
    })

    it('hides error details when showDetails is false', () => {
      render(
        <ErrorBoundary level="page" showDetails={false}>
          <ThrowError message="Hidden details" />
        </ErrorBoundary>
      )
      
      expect(screen.queryByText('Error details (for developers)')).not.toBeInTheDocument()
    })
  })

  describe('HOC Usage', () => {
    it('wraps component with error boundary', () => {
      const TestComponent = () => {
        throw new Error('HOC error')
      }
      
      const SafeComponent = withErrorBoundary(TestComponent, {
        level: 'component',
      })
      
      render(<SafeComponent />)
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('passes props through HOC', () => {
      const TestComponent = ({ message }: { message: string }) => {
        return <div>{message}</div>
      }
      
      const SafeComponent = withErrorBoundary(TestComponent)
      
      render(<SafeComponent message="Props work" />)
      
      expect(screen.getByText('Props work')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles errors during error handling gracefully', () => {
      // Create a fallback that also throws
      const BadFallback = () => {
        throw new Error('Fallback error')
      }
      
      render(
        <ErrorBoundary>
          <ErrorBoundary
            fallback={() => <BadFallback />}
          >
            <ThrowError />
          </ErrorBoundary>
        </ErrorBoundary>
      )
      
      // Should show the outer error boundary's UI
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('handles null error messages', () => {
      const NullError = () => {
        const error = new Error()
        error.message = ''
        throw error
      }
      
      render(
        <ErrorBoundary>
          <NullError />
        </ErrorBoundary>
      )
      
      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument()
    })
  })
})