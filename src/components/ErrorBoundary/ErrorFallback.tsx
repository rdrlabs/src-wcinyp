import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Generic error fallback component for Error Boundaries
 * Provides user-friendly error display with recovery options
 */
export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps): React.ReactElement {
  return (
    <Card className="border-destructive bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <span>⚠️</span>
          Something went wrong
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          There was an error loading this section. This error has been reported.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium">
              Error details (development only)
            </summary>
            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
              {error.message}
            </pre>
          </details>
        )}
        
        <div className="flex gap-2">
          <Button 
            onClick={resetErrorBoundary} 
            variant="outline"
            size="sm"
          >
            Try again
          </Button>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            size="sm"
          >
            Reload page
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Minimal error fallback for critical sections
 * Used when even basic UI components might be compromised
 */
export function MinimalErrorFallback({ error, resetErrorBoundary }: FallbackProps): React.ReactElement {
  return (
    <div 
      role="alert" 
      className="p-4 border border-red-300 bg-red-50 text-red-800 rounded-md"
    >
      <h3 className="font-semibold mb-2">⚠️ Error</h3>
      <p className="text-sm mb-3">
        This section failed to load. Please try again.
      </p>
      <button 
        onClick={resetErrorBoundary}
        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
      >
        Retry
      </button>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-3">
          <summary className="text-xs cursor-pointer">Details</summary>
          <pre className="text-xs mt-1 bg-red-100 p-2 rounded overflow-auto">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  );
}