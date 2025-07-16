/**
 * Centralized error handling utilities
 */

import { toast } from 'sonner'
import { logger } from './logger'

/**
 * Error types for consistent handling
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Custom error class with additional context
 */
export class AppError extends Error {
  constructor(
    message: string,
    public type: ErrorType = ErrorType.UNKNOWN,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

/**
 * Error messages for user display
 */
const USER_FRIENDLY_MESSAGES: Record<ErrorType, string> = {
  [ErrorType.NETWORK]: 'Connection error. Please check your internet connection.',
  [ErrorType.VALIDATION]: 'Please check your input and try again.',
  [ErrorType.AUTHENTICATION]: 'Please log in to continue.',
  [ErrorType.AUTHORIZATION]: 'You do not have permission to perform this action.',
  [ErrorType.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorType.SERVER]: 'Something went wrong on our end. Please try again later.',
  [ErrorType.UNKNOWN]: 'An unexpected error occurred. Please try again.',
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof AppError) {
    return USER_FRIENDLY_MESSAGES[error.type] || error.message
  }
  
  if (error instanceof Error) {
    // Check for common error patterns
    if (error.message.includes('fetch')) {
      return USER_FRIENDLY_MESSAGES[ErrorType.NETWORK]
    }
    if (error.message.includes('401') || error.message.includes('unauthorized')) {
      return USER_FRIENDLY_MESSAGES[ErrorType.AUTHENTICATION]
    }
    if (error.message.includes('403') || error.message.includes('forbidden')) {
      return USER_FRIENDLY_MESSAGES[ErrorType.AUTHORIZATION]
    }
    if (error.message.includes('404')) {
      return USER_FRIENDLY_MESSAGES[ErrorType.NOT_FOUND]
    }
    if (error.message.includes('500') || error.message.includes('server')) {
      return USER_FRIENDLY_MESSAGES[ErrorType.SERVER]
    }
  }
  
  return USER_FRIENDLY_MESSAGES[ErrorType.UNKNOWN]
}

/**
 * Log error for debugging
 */
export function logError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString()
  const errorInfo = {
    timestamp,
    context,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error instanceof AppError && {
        type: error.type,
        code: error.code,
        details: error.details,
      }),
    } : error,
  }
  
  // In production, this would send to a logging service
  logger.error('Error logged', errorInfo, 'ErrorHandling')
}

/**
 * Handle error with toast notification
 */
export function handleError(error: unknown, context?: string, showToast = true): void {
  logError(error, context)
  
  if (showToast) {
    const message = getUserFriendlyMessage(error)
    toast.error(message)
  }
}

/**
 * Async error boundary wrapper
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context?: string,
  options?: {
    showToast?: boolean
    fallback?: T
  }
): Promise<T | undefined> {
  try {
    return await fn()
  } catch (error) {
    handleError(error, context, options?.showToast ?? true)
    return options?.fallback
  }
}

/**
 * Form validation error handler
 */
export function handleValidationError(
  errors: Record<string, string | string[]>,
  showToast = true
): void {
  const errorMessages = Object.entries(errors)
    .map(([field, messages]) => {
      const messageList = Array.isArray(messages) ? messages : [messages]
      return `${field}: ${messageList.join(', ')}`
    })
    .join('\n')
  
  const error = new AppError(
    'Validation failed',
    ErrorType.VALIDATION,
    'VALIDATION_ERROR',
    { errors }
  )
  
  logError(error, 'Form validation')
  
  if (showToast) {
    toast.error('Please fix the following errors:', {
      description: errorMessages,
    })
  }
}

/**
 * Network request error handler
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`
    let errorType = ErrorType.UNKNOWN
    let errorDetails: Record<string, unknown> = {}
    
    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorMessage
      errorDetails = errorData
    } catch {
      // Response wasn't JSON
    }
    
    // Map status codes to error types
    switch (response.status) {
      case 400:
        errorType = ErrorType.VALIDATION
        break
      case 401:
        errorType = ErrorType.AUTHENTICATION
        break
      case 403:
        errorType = ErrorType.AUTHORIZATION
        break
      case 404:
        errorType = ErrorType.NOT_FOUND
        break
      case 500:
      case 502:
      case 503:
        errorType = ErrorType.SERVER
        break
    }
    
    throw new AppError(errorMessage, errorType, `HTTP_${response.status}`, errorDetails)
  }
  
  return response.json()
}