'use client';

import React, { Component, ReactNode, ErrorInfo } from 'react';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { logger } from '@/lib/logger-v2';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link'

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
  isolate?: boolean;
  level?: 'page' | 'section' | 'component';
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private resetTimeoutId: NodeJS.Timeout | null = null;
  private previousResetKeys: Array<string | number> = [];

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      errorCount: 0
    };
    
    if (props.resetKeys) {
      this.previousResetKeys = props.resetKeys;
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      errorInfo: null,
      errorCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, level = 'component' } = this.props;
    
    // Log the error with context
    logger.error(`ErrorBoundary caught error at ${level} level`, {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      level,
      errorCount: this.state.errorCount + 1,
    });

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }

    // Update state with error info
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Auto-reset after 3 errors to prevent infinite loops
    if (this.state.errorCount >= 2) {
      this.scheduleReset(5000);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;
    
    // Reset on prop changes if enabled
    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetError();
    }
    
    // Reset if resetKeys changed
    if (hasError && resetKeys && this.previousResetKeys) {
      const hasResetKeyChanged = resetKeys.some((key, index) => key !== this.previousResetKeys[index]);
      if (hasResetKeyChanged) {
        this.resetError();
        this.previousResetKeys = resetKeys;
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  scheduleReset = (delay: number) => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
    
    this.resetTimeoutId = setTimeout(() => {
      this.resetError();
    }, delay);
  }

  resetError = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    });
  };

  render() {
    const { hasError, error, errorInfo, errorCount } = this.state;
    const { children, fallback, isolate, level = 'component', showDetails } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided (maintaining backward compatibility)
      if (fallback) {
        return <>{fallback(error, this.resetError)}</>;
      }

      // Default error UI based on level
      switch (level) {
        case 'page':
          return <PageErrorFallback error={error} errorInfo={errorInfo} onReset={this.resetError} showDetails={showDetails} />;
        
        case 'section':
          return <SectionErrorFallback error={error} onReset={this.resetError} errorCount={errorCount} />;
        
        case 'component':
        default:
          return <ComponentErrorFallback error={error} onReset={this.resetError} isolate={isolate} />;
      }
    }

    return children;
  }
}

// Page-level error fallback
function PageErrorFallback({ 
  error, 
  errorInfo, 
  onReset, 
  showDetails 
}: { 
  error: Error
  errorInfo: ErrorInfo | null
  onReset: () => void
  showDetails?: boolean 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
          <CardDescription>
            We encountered an unexpected error. The error has been logged and we'll look into it.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              {error.message || 'An unexpected error occurred'}
            </AlertDescription>
          </Alert>
          
          {showDetails && errorInfo && (
            <details className="space-y-2">
              <summary className="cursor-pointer text-sm font-medium">
                Error details (for developers)
              </summary>
              <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-48">
                {error.stack}
                {'\n\nComponent Stack:'}
                {errorInfo.componentStack}
              </pre>
            </details>
          )}
        </CardContent>
        
        <CardFooter className="flex gap-2">
          <Button onClick={onReset} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Section-level error fallback
function SectionErrorFallback({ 
  error, 
  onReset, 
  errorCount 
}: { 
  error: Error
  onReset: () => void
  errorCount: number 
}) {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <div className="text-center space-y-2">
            <h3 className="font-semibold">Unable to load this section</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {error.message || 'Something went wrong while loading this content'}
            </p>
          </div>
          <Button onClick={onReset} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-3 w-3" />
            Retry
          </Button>
          {errorCount > 1 && (
            <p className="text-xs text-muted-foreground">
              Failed {errorCount} times
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Component-level error fallback (default)
function ComponentErrorFallback({ 
  error, 
  onReset, 
  isolate 
}: { 
  error: Error
  onReset: () => void
  isolate?: boolean 
}) {
  // This maintains backward compatibility with the original UI
  if (!isolate) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
        <div className="mx-auto max-w-md text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">
            An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => window.location.reload()}
              variant="default"
            >
              Refresh Page
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-8 text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground">
                Error details (development only)
              </summary>
              <pre className="mt-2 overflow-auto rounded bg-muted p-4 text-xs">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  // Minimal UI for isolated components
  return (
    <div className="p-4 border border-destructive/20 rounded-md bg-destructive/5">
      <p className="text-sm text-destructive">
        Failed to load component
      </p>
      <button 
        onClick={onReset}
        className="text-xs underline mt-1 hover:no-underline"
      >
        Retry
      </button>
    </div>
  )
}

// Hook to use with error boundaries
export function useErrorHandler() {
  return (error: Error) => {
    throw error;
  };
}

// Higher-order component for easy wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}