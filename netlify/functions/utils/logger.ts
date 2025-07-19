/**
 * Server-side logger configuration for Netlify Functions
 * Provides structured logging for serverless environment
 * with environment-specific configuration
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMetadata {
  [key: string]: unknown;
}

// Get log configuration from environment
const LOG_CONFIG = {
  level: process.env.LOG_LEVEL || 'info',
  structuredLogging: process.env.ENABLE_STRUCTURED_LOGGING !== 'false',
  samplingRate: parseFloat(process.env.LOG_SAMPLING_RATE || '1.0'),
  enableRemoteLogging: process.env.ENABLE_REMOTE_LOGGING === 'true',
  remoteEndpoint: process.env.REMOTE_LOGGING_ENDPOINT,
};

class ServerLogger {
  private context: string;
  private logBuffer: any[] = [];

  constructor(context: string) {
    this.context = context;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const configuredLevel = LOG_CONFIG.level as LogLevel;
    const levelIndex = levels.indexOf(configuredLevel);
    const currentLevelIndex = levels.indexOf(level);
    
    if (levelIndex === -1 || currentLevelIndex === -1) {
      return level === 'error'; // Default to error only
    }
    
    // Log if current level is >= configured level
    return currentLevelIndex >= levelIndex;
  }
  
  private shouldSample(): boolean {
    // Always log errors and warnings
    return Math.random() < LOG_CONFIG.samplingRate;
  }

  private formatLog(level: LogLevel, message: string, metadata?: LogMetadata): string {
    const timestamp = new Date().toISOString();
    
    if (!LOG_CONFIG.structuredLogging) {
      // Human-readable format for development
      const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : '';
      return `${timestamp} [${this.context}] ${level.toUpperCase()}: ${message}${metaStr}`;
    }
    
    // Structured JSON format for production
    const logEntry = {
      timestamp,
      level,
      context: this.context,
      message,
      environment: process.env.NODE_ENV || 'production',
      ...metadata
    };
    return JSON.stringify(logEntry);
  }
  
  private async sendToRemote(logEntry: any): Promise<void> {
    if (!LOG_CONFIG.enableRemoteLogging || !LOG_CONFIG.remoteEndpoint) return;
    
    this.logBuffer.push(logEntry);
    
    // Batch logs - send when buffer reaches 10 items
    if (this.logBuffer.length >= 10) {
      const logs = [...this.logBuffer];
      this.logBuffer = [];
      
      try {
        await fetch(LOG_CONFIG.remoteEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            logs,
            source: 'netlify-function',
            context: this.context,
          }),
        });
      } catch (error) {
        // Silently fail - don't create log loops
      }
    }
  }

  debug(message: string, metadata?: LogMetadata): void {
    if (this.shouldLog('debug') && this.shouldSample()) {
      const formatted = this.formatLog('debug', message, metadata);
      console.log(formatted);
      void this.sendToRemote({ level: 'debug', message, metadata, timestamp: new Date().toISOString() });
    }
  }

  info(message: string, metadata?: LogMetadata): void {
    if (this.shouldLog('info') && this.shouldSample()) {
      const formatted = this.formatLog('info', message, metadata);
      console.info(formatted);
      void this.sendToRemote({ level: 'info', message, metadata, timestamp: new Date().toISOString() });
    }
  }

  warn(message: string, metadata?: LogMetadata): void {
    if (this.shouldLog('warn')) {
      const formatted = this.formatLog('warn', message, metadata);
      console.warn(formatted);
      void this.sendToRemote({ level: 'warn', message, metadata, timestamp: new Date().toISOString() });
    }
  }

  error(message: string, metadata?: LogMetadata): void {
    // Always log errors
    const formatted = this.formatLog('error', message, metadata);
    console.error(formatted);
    void this.sendToRemote({ level: 'error', message, metadata, timestamp: new Date().toISOString() });
  }

  withRequest(event: any) {
    const requestMetadata = {
      method: event.httpMethod,
      path: event.path,
      ip: event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown',
      userAgent: event.headers['user-agent'],
      correlationId: event.headers['x-correlation-id'] || event.headers['x-request-id'],
    };
    
    return {
      debug: (message: string, metadata?: LogMetadata) => 
        this.debug(message, { ...requestMetadata, ...metadata }),
      info: (message: string, metadata?: LogMetadata) => 
        this.info(message, { ...requestMetadata, ...metadata }),
      warn: (message: string, metadata?: LogMetadata) => 
        this.warn(message, { ...requestMetadata, ...metadata }),
      error: (message: string, metadata?: LogMetadata) => 
        this.error(message, { ...requestMetadata, ...metadata }),
    };
  }
}

export function createLogger(context: string): ServerLogger {
  return new ServerLogger(context);
}