/**
 * User-friendly error messages for authentication
 */

// Map of error codes to user-friendly messages
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // Email validation errors
  'invalid_email': 'Please use your @med.cornell.edu email address',
  'invalid_cwid': 'Invalid CWID format. Please use 3 letters followed by 4 numbers (e.g., abc1234)',
  
  // Rate limiting
  'rate_limit': 'Too many login attempts. Please try again in 5 minutes.',
  'rate_limit_exceeded': 'You have exceeded the maximum number of login attempts. Please try again later.',
  
  // Email delivery
  'email_not_sent': 'Unable to send login email. Please try again.',
  'email_not_confirmed': 'Please check your email and click the confirmation link',
  'email_already_registered': 'This email is already registered',
  
  // Network errors
  'network_error': 'Connection problem. Please check your internet and try again.',
  'offline': 'You appear to be offline. Please check your connection.',
  'timeout': 'Request timed out. Please try again.',
  
  // Session errors
  'session_expired': 'Your session has expired. Please sign in again.',
  'invalid_session': 'Invalid session. Please sign in again.',
  'session_not_found': 'Session not found. Please sign in again.',
  
  // Magic link errors
  'expired_link': 'This login link has expired. Please request a new one.',
  'invalid_token': 'This login link is invalid. Please request a new one.',
  'link_already_used': 'This login link has already been used. Please request a new one.',
  
  // Account status
  'account_locked': 'Your account has been locked. Please contact IT support.',
  'account_suspended': 'Your account has been suspended. Please contact IT support.',
  'unauthorized_domain': 'Access restricted to @med.cornell.edu emails only',
  
  // Server errors
  'server_error': 'Something went wrong on our end. Please try again later.',
  'maintenance': 'System is under maintenance. Please try again later.',
  
  // Supabase specific errors
  'User already registered': 'This email is already registered',
  'Invalid login credentials': 'Invalid email or password',
  'Email not confirmed': 'Please confirm your email before signing in',
  'Token has expired or is invalid': 'This login link has expired or is invalid',
  'Auth session missing!': 'Authentication session not found. Please sign in again.',
  
  // Generic fallback
  'unknown_error': 'Something went wrong. Please try again.',
}

/**
 * Get a user-friendly error message based on the error
 * @param error - The error object or string
 * @returns User-friendly error message
 */
export function getAuthErrorMessage(error: unknown): string {
  if (!error) {
    return AUTH_ERROR_MESSAGES.unknown_error
  }

  // If error is a string, check if it's a known error key
  if (typeof error === 'string') {
    return AUTH_ERROR_MESSAGES[error] || error
  }

  // Type guard for error object
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>
    
    // Check for specific error properties
    if ('code' in errorObj && typeof errorObj.code === 'string') {
      const message = AUTH_ERROR_MESSAGES[errorObj.code]
      if (message) return message
    }

    if ('error_code' in errorObj && typeof errorObj.error_code === 'string') {
      const message = AUTH_ERROR_MESSAGES[errorObj.error_code]
      if (message) return message
    }

    if ('message' in errorObj && typeof errorObj.message === 'string') {
      // Check if the error message matches any known patterns
      for (const [key, value] of Object.entries(AUTH_ERROR_MESSAGES)) {
        if (errorObj.message.toLowerCase().includes(key.toLowerCase())) {
          return value
        }
      }
      
      // Return the original message if no match found
      return errorObj.message
    }

    if ('error' in errorObj) {
      return getAuthErrorMessage(errorObj.error)
    }
  }

  // Default fallback
  return AUTH_ERROR_MESSAGES.unknown_error
}

/**
 * Check if an error is due to rate limiting
 * @param error - The error object
 * @returns Whether the error is a rate limit error
 */
export function isRateLimitError(error: unknown): boolean {
  if (!error) return false
  
  const rateLimitCodes = ['rate_limit', 'rate_limit_exceeded', 'too_many_requests', '429']
  
  if (typeof error === 'string') {
    return rateLimitCodes.some(code => error.toLowerCase().includes(code))
  }
  
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>
    
    if ('code' in errorObj && typeof errorObj.code === 'string') {
      return rateLimitCodes.includes(errorObj.code.toLowerCase())
    }
    
    if ('status' in errorObj && errorObj.status === 429) {
      return true
    }
    
    if ('message' in errorObj && typeof errorObj.message === 'string') {
      return errorObj.message.toLowerCase().includes('rate limit') || 
             errorObj.message.toLowerCase().includes('too many')
    }
  }
  
  return false
}

/**
 * Check if an error is a network error
 * @param error - The error object
 * @returns Whether the error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (!error) return false
  
  const networkErrorPatterns = [
    'network', 'fetch', 'connection', 'timeout', 
    'ECONNREFUSED', 'ETIMEDOUT', 'ECONNRESET'
  ]
  
  if (typeof error === 'string') {
    return networkErrorPatterns.some(pattern => 
      error.toLowerCase().includes(pattern.toLowerCase())
    )
  }
  
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>
    
    if ('code' in errorObj && typeof errorObj.code === 'string') {
      return networkErrorPatterns.includes(errorObj.code)
    }
    
    if ('message' in errorObj && typeof errorObj.message === 'string') {
      const message = errorObj.message
      return networkErrorPatterns.some(pattern => 
        message.toLowerCase().includes(pattern.toLowerCase())
      )
    }
  }
  
  return false
}