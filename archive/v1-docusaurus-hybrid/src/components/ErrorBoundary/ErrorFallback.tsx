import React from 'react';
import { FallbackProps } from 'react-error-boundary';

/**
 * Generic error fallback component for Error Boundaries
 * Provides user-friendly error display with recovery options
 */
export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps): React.ReactElement {
  return (
    <div 
      role="alert" 
      style={{
        padding: '1.5rem',
        border: '1px solid #f87171',
        backgroundColor: '#fef2f2',
        borderRadius: '0.5rem',
        margin: '1rem 0'
      }}
    >
      <h3 style={{
        color: '#dc2626',
        fontSize: '1.125rem',
        fontWeight: '600',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <span>⚠️</span>
        Something went wrong
      </h3>
      <p style={{
        fontSize: '0.875rem',
        color: '#6b7280',
        marginBottom: '1rem'
      }}>
        There was an error loading this section. This error has been reported.
      </p>
      
      {process.env.NODE_ENV === 'development' && (
        <details style={{ marginTop: '1rem' }}>
          <summary style={{
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            Error details (development only)
          </summary>
          <pre style={{
            marginTop: '0.5rem',
            fontSize: '0.75rem',
            backgroundColor: '#f3f4f6',
            padding: '0.5rem',
            borderRadius: '0.25rem',
            overflow: 'auto',
            maxHeight: '8rem'
          }}>
            {error.message}
          </pre>
        </details>
      )}
      
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button 
          onClick={resetErrorBoundary}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            backgroundColor: '#ffffff',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Try again
        </button>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            backgroundColor: '#ffffff',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Reload page
        </button>
      </div>
    </div>
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
      style={{
        padding: '1rem',
        border: '1px solid #fca5a5',
        backgroundColor: '#fef2f2',
        color: '#991b1b',
        borderRadius: '0.375rem'
      }}
    >
      <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>⚠️ Error</h3>
      <p style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>
        This section failed to load. Please try again.
      </p>
      <button 
        onClick={resetErrorBoundary}
        style={{
          padding: '0.25rem 0.75rem',
          backgroundColor: '#dc2626',
          color: '#ffffff',
          fontSize: '0.875rem',
          borderRadius: '0.25rem',
          border: 'none',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
      >
        Retry
      </button>
      
      {process.env.NODE_ENV === 'development' && (
        <details style={{ marginTop: '0.75rem' }}>
          <summary style={{ fontSize: '0.75rem', cursor: 'pointer' }}>Details</summary>
          <pre style={{
            fontSize: '0.75rem',
            marginTop: '0.25rem',
            backgroundColor: '#fee2e2',
            padding: '0.5rem',
            borderRadius: '0.25rem',
            overflow: 'auto'
          }}>
            {error.message}
          </pre>
        </details>
      )}
    </div>
  );
}