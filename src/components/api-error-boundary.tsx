'use client'

import React from 'react'
import { ErrorBoundary } from './error-boundary'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, WifiOff, ServerCrash, Clock } from 'lucide-react'

interface ApiError extends Error {
  status?: number
  code?: string
  retry?: () => Promise<void>
}

interface Props {
  children: React.ReactNode
  onRetry?: () => Promise<void>
  showOfflineAlert?: boolean
}

export function ApiErrorBoundary({ children, onRetry, showOfflineAlert = true }: Props) {
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine)
  const [isRetrying, setIsRetrying] = React.useState(false)

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      if (onRetry) {
        await onRetry()
      }
      window.location.reload()
    } catch (error) {
      console.error('Retry failed:', error)
    } finally {
      setIsRetrying(false)
    }
  }

  const renderError = (error: ApiError, reset: () => void) => {
    // Network offline
    if (isOffline && showOfflineAlert) {
      return (
        <Alert className="m-4">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>You're offline</AlertTitle>
          <AlertDescription>
            Please check your internet connection and try again.
          </AlertDescription>
        </Alert>
      )
    }

    // API errors by status code
    if (error.status) {
      switch (error.status) {
        case 401:
          return (
            <Alert className="m-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>
                Please log in to access this content.
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => window.location.href = '/login'}
                >
                  Go to Login
                </Button>
              </AlertDescription>
            </Alert>
          )

        case 403:
          return (
            <Alert className="m-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                You don't have permission to access this resource.
              </AlertDescription>
            </Alert>
          )

        case 404:
          return (
            <Alert className="m-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Not Found</AlertTitle>
              <AlertDescription>
                The requested resource could not be found.
              </AlertDescription>
            </Alert>
          )

        case 429:
          return (
            <Alert className="m-4" variant="destructive">
              <Clock className="h-4 w-4" />
              <AlertTitle>Too Many Requests</AlertTitle>
              <AlertDescription>
                Please wait a moment before trying again.
              </AlertDescription>
            </Alert>
          )

        case 500:
        case 502:
        case 503:
        case 504:
          return (
            <Alert className="m-4" variant="destructive">
              <ServerCrash className="h-4 w-4" />
              <AlertTitle>Server Error</AlertTitle>
              <AlertDescription>
                Something went wrong on our end. Please try again later.
                {(error.retry || onRetry) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={error.retry || handleRetry}
                    disabled={isRetrying}
                  >
                    {isRetrying ? 'Retrying...' : 'Try Again'}
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )

        default:
          return (
            <Alert className="m-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error {error.status}</AlertTitle>
              <AlertDescription>
                {error.message || 'An unexpected error occurred'}
                {(error.retry || onRetry) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 block"
                    onClick={error.retry || handleRetry}
                    disabled={isRetrying}
                  >
                    {isRetrying ? 'Retrying...' : 'Try Again'}
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )
      }
    }

    // Generic API error
    return (
      <Alert className="m-4" variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Connection Error</AlertTitle>
        <AlertDescription>
          {error.message || 'Failed to connect to the server'}
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2 block"
              onClick={handleRetry}
              disabled={isRetrying}
            >
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </Button>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <ErrorBoundary
      fallback={renderError}
      level="section"
      onError={(error) => {
        // Check if it's an API error
        if (error.message?.includes('fetch') || error.name === 'NetworkError') {
          console.error('API Error:', error)
        }
      }}
    >
      {children}
    </ErrorBoundary>
  )
}