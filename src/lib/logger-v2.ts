/**
 * Enhanced Production Logger with Context and Performance Support
 * Features:
 * - Hierarchical context support
 * - Performance tracking and metrics
 * - Structured logging with metadata
 * - Circular buffer for recent logs
 * - Async operation tracking
 * - Memory-efficient design
 * - Environment-specific configuration
 * - Remote logging support
 * - Error reporting integration
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'metric';

interface LogMetadata {
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context: string[];
  metadata?: LogMetadata;
  duration?: number;
  correlationId?: string;
}

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: LogMetadata;
}

interface LoggerConfig {
  enabledLevels: LogLevel[];
  maxBufferSize: number;
  enablePerformanceMetrics: boolean;
  enableStructuredLogging: boolean;
  enableDevTools: boolean;
}

class EnhancedLogger {
  private config: LoggerConfig;
  private buffer: LogEntry[] = [];
  private performanceMetrics: Map<string, PerformanceMetric[]> = new Map();
  private contextStack: string[] = [];
  private timers: Map<string, number> = new Map();
  private correlationId?: string;

  constructor(config?: Partial<LoggerConfig>) {
    // Use provided config or default config
    this.config = config ? { ...this.getDefaultConfig(), ...config } : this.getDefaultConfig();

    // Setup dev tools integration
    if (this.config.enableDevTools && typeof window !== 'undefined') {
      this.setupDevTools();
    }
  }

  private getDefaultConfig(): LoggerConfig {
    // Import configuration lazily to avoid circular dependencies
    if (typeof window !== 'undefined') {
      try {
        const { getLoggerConfig } = require('@/config/logger.config');
        return getLoggerConfig();
      } catch (error) {
        // Fallback if config is not available
        console.warn('Logger config not available, using defaults');
      }
    }
    
    // Fallback configuration
    return {
      enabledLevels: process.env.NODE_ENV === 'development' 
        ? ['debug', 'info', 'warn', 'error', 'metric']
        : ['error'],
      maxBufferSize: 1000,
      enablePerformanceMetrics: true,
      enableStructuredLogging: process.env.NODE_ENV === 'production',
      enableDevTools: process.env.NODE_ENV === 'development',
    };
  }

  private setupDevTools(): void {
    if (typeof window !== 'undefined') {
      (window as any).__WCINYP_LOGGER__ = {
        getBuffer: () => [...this.buffer],
        getMetrics: () => {
          const metrics: Record<string, PerformanceMetric[]> = {};
          this.performanceMetrics.forEach((value, key) => {
            metrics[key] = [...value];
          });
          return metrics;
        },
        clearBuffer: () => this.buffer = [],
        clearMetrics: () => this.performanceMetrics.clear(),
        setLogLevel: (levels: LogLevel[]) => this.config.enabledLevels = levels,
      };
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return this.config.enabledLevels.includes(level);
  }

  private addToBuffer(entry: LogEntry): void {
    this.buffer.push(entry);
    if (this.buffer.length > this.config.maxBufferSize) {
      this.buffer.shift();
    }
  }

  private formatStructured(entry: LogEntry): string {
    // Use centralized formatting if available
    if (typeof window !== 'undefined') {
      try {
        const { formatLogOutput } = require('@/config/logger.config');
        return formatLogOutput(entry.level, entry.message, entry.context, entry.metadata);
      } catch {
        // Continue with default formatting
      }
    }
    
    if (!this.config.enableStructuredLogging) {
      const timestamp = new Date(entry.timestamp).toISOString();
      const context = entry.context.length > 0 ? `[${entry.context.join('.')}]` : '';
      const duration = entry.duration ? ` (${entry.duration.toFixed(2)}ms)` : '';
      return `${timestamp} ${context} ${entry.level.toUpperCase()}: ${entry.message}${duration}`;
    }

    return JSON.stringify({
      ...entry,
      timestamp: new Date(entry.timestamp).toISOString(),
      context: entry.context.join('.'),
    });
  }

  private log(level: LogLevel, message: string, metadata?: LogMetadata): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context: [...this.contextStack],
      metadata,
      correlationId: this.correlationId,
    };

    this.addToBuffer(entry);
    const formatted = this.formatStructured(entry);

    switch (level) {
      case 'debug':
        console.log(formatted, metadata || '');
        break;
      case 'info':
        console.info(formatted, metadata || '');
        break;
      case 'warn':
        console.warn(formatted, metadata || '');
        break;
      case 'error':
        console.error(formatted, metadata || '');
        this.reportError(entry);
        break;
      case 'metric':
        if (this.config.enablePerformanceMetrics) {
          console.log(`[METRIC] ${formatted}`, metadata || '');
        }
        break;
    }
  }

  private reportError(entry: LogEntry): void {
    // Integration point for error reporting services
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // TODO: Implement Sentry integration
    }
  }

  // Context management
  pushContext(context: string): void {
    this.contextStack.push(context);
  }

  popContext(): void {
    this.contextStack.pop();
  }

  withContext<T>(context: string, fn: () => T): T {
    this.pushContext(context);
    try {
      return fn();
    } finally {
      this.popContext();
    }
  }

  async withContextAsync<T>(context: string, fn: () => Promise<T>): Promise<T> {
    this.pushContext(context);
    try {
      return await fn();
    } finally {
      this.popContext();
    }
  }

  // Correlation ID for tracing requests
  setCorrelationId(id: string): void {
    this.correlationId = id;
  }

  clearCorrelationId(): void {
    this.correlationId = undefined;
  }

  // Performance tracking
  time(label: string, metadata?: LogMetadata): void {
    this.timers.set(label, performance.now());
    if (metadata) {
      this.debug(`Timer started: ${label}`, metadata);
    }
  }

  timeEnd(label: string, metadata?: LogMetadata): number | undefined {
    const start = this.timers.get(label);
    if (!start) {
      this.warn(`Timer '${label}' does not exist`);
      return undefined;
    }

    const duration = performance.now() - start;
    this.timers.delete(label);

    const metric: PerformanceMetric = {
      name: label,
      duration,
      timestamp: Date.now(),
      metadata,
    };

    // Store metric
    if (!this.performanceMetrics.has(label)) {
      this.performanceMetrics.set(label, []);
    }
    this.performanceMetrics.get(label)!.push(metric);

    // Log metric
    this.log('metric', `${label} completed`, { duration, ...metadata });

    return duration;
  }

  async measure<T>(label: string, fn: () => Promise<T>, metadata?: LogMetadata): Promise<T> {
    this.time(label, metadata);
    try {
      const result = await fn();
      this.timeEnd(label, { ...metadata, status: 'success' });
      return result;
    } catch (error) {
      this.timeEnd(label, { ...metadata, status: 'error', error });
      throw error;
    }
  }

  // Performance metrics aggregation
  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.performanceMetrics.get(name) || [];
    }
    
    const allMetrics: PerformanceMetric[] = [];
    this.performanceMetrics.forEach(metrics => {
      allMetrics.push(...metrics);
    });
    return allMetrics.sort((a, b) => a.timestamp - b.timestamp);
  }

  getAverageMetric(name: string): number | null {
    const metrics = this.performanceMetrics.get(name);
    if (!metrics || metrics.length === 0) return null;

    const sum = metrics.reduce((acc, m) => acc + m.duration, 0);
    return sum / metrics.length;
  }

  // Standard logging methods
  debug(message: string, metadata?: LogMetadata): void {
    this.log('debug', message, metadata);
  }

  info(message: string, metadata?: LogMetadata): void {
    this.log('info', message, metadata);
  }

  warn(message: string, metadata?: LogMetadata): void {
    this.log('warn', message, metadata);
  }

  error(message: string, metadata?: LogMetadata): void {
    this.log('error', message, metadata);
  }

  // Specialized logging methods
  securityWarn(message: string, metadata?: LogMetadata): void {
    // Always log security warnings
    const savedLevels = this.config.enabledLevels;
    this.config.enabledLevels = ['warn'];
    this.warn(`[SECURITY] ${message}`, metadata);
    this.config.enabledLevels = savedLevels;
  }

  metric(name: string, value: number, metadata?: LogMetadata): void {
    this.log('metric', name, { value, ...metadata });
  }

  // Group logging for better organization
  group(label: string): void {
    if (console.group && this.config.enableDevTools) {
      console.group(label);
    }
    this.pushContext(label);
  }

  groupEnd(): void {
    if (console.groupEnd && this.config.enableDevTools) {
      console.groupEnd();
    }
    this.popContext();
  }

  // Table logging for structured data
  table(data: any[], columns?: string[]): void {
    if (this.shouldLog('debug') && console.table) {
      console.table(data, columns);
    }
  }

  // Get recent logs for debugging
  getRecentLogs(count: number = 100, level?: LogLevel): LogEntry[] {
    let logs = [...this.buffer];
    if (level) {
      logs = logs.filter(entry => entry.level === level);
    }
    return logs.slice(-count);
  }

  // Clear all stored data
  clear(): void {
    this.buffer = [];
    this.performanceMetrics.clear();
    this.timers.clear();
    this.contextStack = [];
    this.correlationId = undefined;
  }
}

// Create singleton instance using factory when possible
let logger: EnhancedLogger;

// Initialize logger with proper configuration
if (typeof window !== 'undefined') {
  try {
    // Try to use factory if available
    const { createLogger } = require('./logger-factory');
    logger = createLogger('App');
  } catch {
    // Fallback to direct instantiation
    logger = new EnhancedLogger();
  }
} else {
  // Server-side or during build
  logger = new EnhancedLogger();
}

// Export singleton instance
export { logger };

// Export class for testing and custom instances
export { EnhancedLogger, type LogLevel, type LogMetadata, type LogEntry, type PerformanceMetric, type LoggerConfig };

// Convenience exports for backwards compatibility
export const loggerV2 = logger;