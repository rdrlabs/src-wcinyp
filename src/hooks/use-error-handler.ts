/**
 * React hook for consistent error handling
 */

import { useCallback } from 'react'
import { handleError, withErrorHandling } from '@/lib/error-handling'

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