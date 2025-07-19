/**
 * Logger Configuration
 * Environment-specific logging presets and utilities
 */

import { config } from './app.config'
import type { LogLevel, LoggerConfig } from '@/lib/logger-v2'

export type Environment = 'development' | 'staging' | 'production' | 'test'

/**
 * Environment-specific logger presets
 */
export const loggerPresets: Record<Environment, Partial<LoggerConfig>> = {
  development: {
    enabledLevels: ['debug', 'info', 'warn', 'error', 'metric'],
    maxBufferSize: 2000,
    enablePerformanceMetrics: true,
    enableStructuredLogging: false,
    enableDevTools: true,
  },
  
  staging: {
    enabledLevels: ['info', 'warn', 'error', 'metric'],
    maxBufferSize: 1000,
    enablePerformanceMetrics: true,
    enableStructuredLogging: true,
    enableDevTools: false,
  },
  
  production: {
    enabledLevels: ['warn', 'error'],
    maxBufferSize: 500,
    enablePerformanceMetrics: false,
    enableStructuredLogging: true,
    enableDevTools: false,
  },
  
  test: {
    enabledLevels: ['error'],
    maxBufferSize: 100,
    enablePerformanceMetrics: false,
    enableStructuredLogging: false,
    enableDevTools: false,
  },
}

/**
 * Get logger configuration based on current environment
 */
export function getLoggerConfig(): LoggerConfig {
  const environment = config.app.environment
  const preset = loggerPresets[environment]
  
  // Override preset with explicit configuration
  const logLevel = config.logging.level
  const enabledLevels = getEnabledLevels(logLevel)
  
  return {
    enabledLevels,
    maxBufferSize: config.logging.bufferSize,
    enablePerformanceMetrics: config.logging.enablePerformanceMetrics,
    enableStructuredLogging: config.logging.enableStructuredLogging,
    enableDevTools: config.logging.enableDevTools,
    ...preset, // Environment preset as base
  }
}

/**
 * Get enabled log levels based on minimum level
 */
function getEnabledLevels(minLevel: LogLevel): LogLevel[] {
  const levels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'metric']
  const levelIndex = levels.indexOf(minLevel)
  
  if (levelIndex === -1) {
    return ['error'] // Default to error only if invalid level
  }
  
  // Return all levels from minLevel and above (excluding metric)
  const enabledLevels = levels.slice(levelIndex).filter(l => l !== 'metric')
  
  // Always include metric if performance metrics are enabled
  if (config.logging.enablePerformanceMetrics) {
    enabledLevels.push('metric')
  }
  
  return enabledLevels
}

/**
 * Check if we should sample this log based on sampling rate
 */
export function shouldSampleLog(): boolean {
  if (config.app.environment === 'development') {
    return true // Always log in development
  }
  
  return Math.random() < config.logging.samplingRate
}

/**
 * Get remote logging configuration
 */
export function getRemoteLoggingConfig() {
  return {
    enabled: config.logging.enableRemoteLogging,
    endpoint: config.logging.remoteLoggingEndpoint,
    batchSize: 100,
    flushInterval: 5000, // 5 seconds
  }
}

/**
 * Get error reporting configuration
 */
export function getErrorReportingConfig() {
  return {
    enabled: config.logging.enableErrorReporting,
    dsn: config.logging.sentryDsn,
    environment: config.app.environment,
    sampleRate: config.logging.samplingRate,
  }
}

/**
 * Format log output based on environment
 */
export function formatLogOutput(
  level: LogLevel,
  message: string,
  context: string[],
  metadata?: Record<string, unknown>
): string {
  if (!config.logging.enableStructuredLogging) {
    // Human-readable format for development
    const timestamp = new Date().toLocaleTimeString()
    const contextStr = context.length > 0 ? `[${context.join('.')}]` : ''
    const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : ''
    return `${timestamp} ${contextStr} ${level.toUpperCase()}: ${message}${metaStr}`
  }
  
  // Structured JSON format for production
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    context: context.join('.'),
    environment: config.app.environment,
    ...metadata,
  })
}

/**
 * Performance thresholds for different operations
 */
export const performanceThresholds = {
  api: {
    fast: 100,    // < 100ms is fast
    normal: 500,  // < 500ms is normal
    slow: 2000,   // < 2s is slow, > 2s is critical
  },
  render: {
    fast: 16,     // 60fps
    normal: 50,   // 20fps
    slow: 100,    // 10fps
  },
  database: {
    fast: 50,
    normal: 200,
    slow: 1000,
  },
}

/**
 * Get performance level based on duration and operation type
 */
export function getPerformanceLevel(
  duration: number,
  operationType: keyof typeof performanceThresholds = 'api'
): 'fast' | 'normal' | 'slow' | 'critical' {
  const thresholds = performanceThresholds[operationType]
  
  if (duration < thresholds.fast) return 'fast'
  if (duration < thresholds.normal) return 'normal'
  if (duration < thresholds.slow) return 'slow'
  return 'critical'
}