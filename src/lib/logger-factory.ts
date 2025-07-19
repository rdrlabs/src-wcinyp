/**
 * Logger Factory
 * Creates loggers with environment-specific configuration
 */

import { EnhancedLogger, type LoggerConfig } from './logger-v2'
import { getLoggerConfig, shouldSampleLog, formatLogOutput, getRemoteLoggingConfig, getErrorReportingConfig } from '@/config/logger.config'
import { config } from '@/config/app.config'

/**
 * Logger types for different contexts
 */
export type LoggerType = 'client' | 'server' | 'test' | 'performance'

/**
 * Create a logger instance with environment-specific configuration
 */
export function createLogger(context: string, type: LoggerType = 'client'): EnhancedLogger {
  const baseConfig = getLoggerConfig()
  
  // Type-specific overrides
  const typeOverrides = getTypeOverrides(type)
  
  const loggerConfig: LoggerConfig = {
    ...baseConfig,
    ...typeOverrides,
  }
  
  const logger = new EnhancedLogger(loggerConfig)
  
  // Set up remote logging if enabled
  if (config.logging.enableRemoteLogging) {
    setupRemoteLogging(logger)
  }
  
  // Set up error reporting if enabled
  if (config.logging.enableErrorReporting) {
    setupErrorReporting(logger)
  }
  
  // Set up sampling if in production
  if (config.app.environment === 'production') {
    setupSampling(logger)
  }
  
  // Push initial context
  logger.pushContext(context)
  
  return logger
}

/**
 * Get type-specific configuration overrides
 */
function getTypeOverrides(type: LoggerType): Partial<LoggerConfig> {
  switch (type) {
    case 'server':
      return {
        enableStructuredLogging: true,
        enableDevTools: false,
      }
      
    case 'test':
      return {
        enabledLevels: ['error'],
        maxBufferSize: 100,
        enablePerformanceMetrics: false,
        enableDevTools: false,
      }
      
    case 'performance':
      return {
        enabledLevels: ['metric', 'error'],
        enablePerformanceMetrics: true,
      }
      
    default:
      return {}
  }
}

/**
 * Set up remote logging batching and transmission
 */
function setupRemoteLogging(logger: EnhancedLogger): void {
  const remoteConfig = getRemoteLoggingConfig()
  let logBatch: any[] = []
  
  // Override the log method to batch logs
  const originalLog = (logger as any).log.bind(logger)
  ;(logger as any).log = function(level: string, message: string, metadata?: any) {
    // Call original log method
    originalLog(level, message, metadata)
    
    // Add to batch if sampling passes
    if (shouldSampleLog()) {
      logBatch.push({
        level,
        message,
        metadata,
        timestamp: new Date().toISOString(),
        environment: config.app.environment,
      })
      
      // Flush if batch is full
      if (logBatch.length >= remoteConfig.batchSize) {
        flushLogs(logBatch, remoteConfig.endpoint!)
        logBatch = []
      }
    }
  }
  
  // Set up periodic flush
  if (typeof window !== 'undefined') {
    setInterval(() => {
      if (logBatch.length > 0) {
        flushLogs(logBatch, remoteConfig.endpoint!)
        logBatch = []
      }
    }, remoteConfig.flushInterval)
  }
}

/**
 * Set up error reporting integration
 */
function setupErrorReporting(logger: EnhancedLogger): void {
  const errorConfig = getErrorReportingConfig()
  
  // Override error method to report to Sentry
  const originalError = logger.error.bind(logger)
  logger.error = function(message: string, metadata?: any) {
    originalError(message, metadata)
    
    // Report to Sentry if available
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(new Error(message), {
        level: 'error',
        extra: metadata,
        tags: {
          environment: config.app.environment,
        },
      })
    }
  }
}

/**
 * Set up log sampling for production
 */
function setupSampling(logger: EnhancedLogger): void {
  const originalLog = (logger as any).log.bind(logger)
  
  ;(logger as any).log = function(level: string, message: string, metadata?: any) {
    // Always log errors and warnings
    if (level === 'error' || level === 'warn') {
      originalLog(level, message, metadata)
      return
    }
    
    // Sample other logs based on rate
    if (shouldSampleLog()) {
      originalLog(level, message, metadata)
    }
  }
}

/**
 * Flush logs to remote endpoint
 */
async function flushLogs(logs: any[], endpoint: string): Promise<void> {
  if (!endpoint) return
  
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        logs,
        source: 'wcinyp-client',
        timestamp: new Date().toISOString(),
      }),
    })
  } catch (error) {
    // Silently fail - don't log errors about logging
    console.error('Failed to flush logs:', error)
  }
}

/**
 * Create a child logger with additional context
 */
export function createChildLogger(
  parentLogger: EnhancedLogger,
  childContext: string
): EnhancedLogger {
  const childLogger = Object.create(parentLogger)
  childLogger.pushContext(childContext)
  return childLogger
}

/**
 * Default logger instances
 */
export const defaultLogger = createLogger('App')
export const performanceLogger = createLogger('Performance', 'performance')
export const testLogger = createLogger('Test', 'test')