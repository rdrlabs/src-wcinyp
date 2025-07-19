/**
 * Configuration options for retry behavior
 * @interface RetryOptions
 * 
 * @property {number} [maxRetries=3] - Maximum number of retry attempts
 * @property {number} [initialDelay=1000] - Initial delay in milliseconds before first retry
 * @property {number} [maxDelay=10000] - Maximum delay between retries in milliseconds
 * @property {number} [backoffFactor=2] - Multiplier for exponential backoff
 * @property {Function} [onRetry] - Callback function called on each retry attempt
 * 
 * @example
 * ```ts
 * const options: RetryOptions = {
 *   maxRetries: 5,
 *   initialDelay: 500,
 *   maxDelay: 30000,
 *   backoffFactor: 1.5,
 *   onRetry: (error, attempt) => {
 *     console.log(`Retry attempt ${attempt} after error:`, error.message);
 *   }
 * };
 * ```
 */
export interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffFactor?: number
  onRetry?: (error: any, attempt: number) => void
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    onRetry
  } = options

  let lastError: any
  let delay = initialDelay

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries) {
        throw error
      }

      if (onRetry) {
        onRetry(error, attempt)
      }

      await new Promise(resolve => setTimeout(resolve, delay))
      delay = Math.min(delay * backoffFactor, maxDelay)
    }
  }

  throw lastError
}

// Alias for backward compatibility
export const retryWithBackoff = retry