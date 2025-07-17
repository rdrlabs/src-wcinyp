/**
 * Production-safe logging utility
 * Only logs in development mode unless explicitly enabled
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: Date;
  context?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isLoggingEnabled = process.env.NEXT_PUBLIC_ENABLE_LOGGING === 'true';

  private shouldLog(): boolean {
    return this.isDevelopment || this.isLoggingEnabled;
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const context = entry.context ? `[${entry.context}]` : '';
    return `${timestamp} ${context} ${entry.level.toUpperCase()}: ${entry.message}`;
  }

  private log(level: LogLevel, message: string, data?: unknown, context?: string): void {
    if (!this.shouldLog()) return;

    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date(),
      context,
    };

    const formattedMessage = this.formatMessage(entry);

    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.log(formattedMessage, data || '');
        }
        break;
      case 'info':
        console.log(formattedMessage, data || '');
        break;
      case 'warn':
        console.warn(formattedMessage, data || '');
        break;
      case 'error':
        console.error(formattedMessage, data || '');
        // In production, you might want to send errors to a service like Sentry
        // Only send errors from browser environment
        if (!this.isDevelopment && process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
          // TODO: Implement Sentry integration - see issue #TODO
        }
        break;
    }
  }

  debug(message: string, data?: unknown, context?: string): void {
    this.log('debug', message, data, context);
  }

  info(message: string, data?: unknown, context?: string): void {
    this.log('info', message, data, context);
  }

  warn(message: string, data?: unknown, context?: string): void {
    this.log('warn', message, data, context);
  }

  error(message: string, data?: unknown, context?: string): void {
    this.log('error', message, data, context);
  }

  // Special method for security-related warnings
  securityWarn(message: string, data?: unknown): void {
    // Always log security warnings, even in production
    console.warn(`[SECURITY] ${message}`, data || '');
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for testing purposes
export { Logger };