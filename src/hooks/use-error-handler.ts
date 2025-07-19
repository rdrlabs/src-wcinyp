import { useCallback } from 'react'
import { handleError, withErrorHandling } from '@/lib/error-handling'

/**
 * Hook for consistent error handling across the application.
 * Provides utilities to handle errors with proper logging and user feedback.
 * 
 * @returns Object with error handling utilities
 * @returns handleError - Function to handle errors with context and optional toast
 * @returns wrapAsync - Function to wrap async operations with error handling
 * 
 * @example
 * ```tsx
 * const { handleError, wrapAsync } = useErrorHandler();
 * 
 * // Direct error handling
 * try {
 *   await someOperation();
 * } catch (error) {
 *   handleError(error, 'Failed to perform operation');
 * }
 * 
 * // Wrapped async operation
 * const result = await wrapAsync(
 *   () => fetchUserData(userId),
 *   'Failed to fetch user data',
 *   { showToast: true, fallback: null }
 * );
 * ```
 */
export function useErrorHandler() {
  const handleErrorWithContext = useCallback(
    (error: unknown, context: string, showToast = true) => {
      handleError(error, context, showToast)
    },
    []
  )

  const wrapAsync = useCallback(
    <T,>(
      fn: () => Promise<T>,
      context: string,
      options?: {
        showToast?: boolean
        fallback?: T
      }
    ) => {
      return withErrorHandling(fn, context, options)
    },
    []
  )

  return {
    handleError: handleErrorWithContext,
    wrapAsync,
  }
}