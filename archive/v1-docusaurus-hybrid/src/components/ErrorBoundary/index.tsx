import React from 'react';
import { ErrorBoundary as ReactErrorBoundary, ErrorBoundaryPropsWithFallback } from 'react-error-boundary';
import type { ErrorInfo } from 'react';
import { ErrorFallback, MinimalErrorFallback } from './ErrorFallback';

/**
 * Error logging service for production monitoring
 * In a real application, this would send to Sentry, LogRocket, etc.
 */
function logErrorToService(error: Error, errorInfo: ErrorInfo) {
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with monitoring service (Sentry, LogRocket, etc.)
    console.error('Error logged to monitoring service:', { error, errorInfo });
  } else {
    console.error('Error boundary caught:', error, errorInfo);
  }
}

/**
 * Enhanced Error Boundary with logging and recovery
 * Use this for most UI sections that can gracefully degrade
 */
interface AppErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<any>;
  onReset?: () => void;
  resetKeys?: Array<string | number | boolean | null | undefined>;
}

export function AppErrorBoundary({ 
  children, 
  fallback = ErrorFallback,
  onReset,
  resetKeys 
}: AppErrorBoundaryProps): React.ReactElement {
  return (
    <ReactErrorBoundary
      FallbackComponent={fallback}
      onError={logErrorToService}
      onReset={onReset}
      resetKeys={resetKeys}
    >
      {children}
    </ReactErrorBoundary>
  );
}

/**
 * Critical Error Boundary for essential UI sections
 * Uses minimal fallback to reduce risk of further errors
 */
export function CriticalErrorBoundary({ 
  children, 
  onReset,
  resetKeys 
}: Omit<AppErrorBoundaryProps, 'fallback'>): React.ReactElement {
  return (
    <ReactErrorBoundary
      FallbackComponent={MinimalErrorFallback}
      onError={logErrorToService}
      onReset={onReset}
      resetKeys={resetKeys}
    >
      {children}
    </ReactErrorBoundary>
  );
}

/**
 * Page-level Error Boundary
 * Wraps entire page content with comprehensive error handling
 */
export function PageErrorBoundary({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <AppErrorBoundary
      onReset={() => {
        // Clear any cached data that might be causing issues
        // This could include clearing React Query cache, localStorage, etc.
        window.location.reload();
      }}
    >
      {children}
    </AppErrorBoundary>
  );
}

// Re-export for convenience
export { ErrorFallback, MinimalErrorFallback };
export { ErrorBoundary } from 'react-error-boundary';