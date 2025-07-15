/**
 * Retry utility with exponential backoff
 */

export interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  factor?: number
  onRetry?: (error: Error, attempt: number) => void
}

/**
 * Execute a function with exponential backoff retry logic
 * @param fn - The async function to execute
 * @param options - Retry configuration options
 * @returns The result of the function
 * @throws The last error if all retries fail
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    factor = 2,
    onRetry,
  } = options

  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        throw lastError
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        baseDelay * Math.pow(factor, attempt),
        maxDelay
      )

      // Add jitter to prevent thundering herd
      const jitteredDelay = delay + Math.random() * 1000

      // Call onRetry callback if provided
      if (onRetry) {
        onRetry(lastError, attempt + 1)
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, jitteredDelay))
    }
  }

  throw lastError!
}

/**
 * Check if an error is retryable
 * @param error - The error to check
 * @returns Whether the error should trigger a retry
 */
export function isRetryableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false
  }
  
  const errorObj = error as Record<string, unknown>
  
  // Network errors
  if ('code' in errorObj && typeof errorObj.code === 'string') {
    if (errorObj.code === 'ECONNRESET' || 
        errorObj.code === 'ETIMEDOUT' ||
        errorObj.code === 'ECONNREFUSED') {
      return true
    }
  }

  // HTTP status codes that are retryable
  if ('status' in errorObj && typeof errorObj.status === 'number') {
    if (errorObj.status === 429 || // Too Many Requests
        errorObj.status === 502 || // Bad Gateway
        errorObj.status === 503 || // Service Unavailable
        errorObj.status === 504) { // Gateway Timeout
      return true
    }
  }

  // Supabase specific errors
  if ('message' in errorObj && typeof errorObj.message === 'string') {
    if (errorObj.message.includes('Failed to fetch') ||
        errorObj.message.includes('Network request failed')) {
      return true
    }
  }

  return false
}

/**
 * Wrapper for retrying only on retryable errors
 * @param fn - The async function to execute
 * @param options - Retry configuration options
 * @returns The result of the function
 */
export async function retryOnError<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  return retryWithBackoff(async () => {
    try {
      return await fn()
    } catch (error) {
      if (isRetryableError(error)) {
        throw error // Will be retried
      }
      // Non-retryable error, throw immediately
      throw error
    }
  }, options)
}