export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  data?: any
  timestamp: string
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isServer = typeof window === 'undefined'

  private log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString()
    }

    if (this.isDevelopment || level === 'error' || level === 'warn') {
      const method = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'
      console[method](`[${entry.level.toUpperCase()}] ${entry.message}`, data || '')
      
      // In production, send errors to tracking service (only in browser)
      if (!this.isDevelopment && level === 'error' && !this.isServer) {
        // TODO: Send to error tracking service like Sentry
      }
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data)
  }

  info(message: string, data?: any) {
    this.log('info', message, data)
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data)
  }

  error(message: string, data?: any) {
    this.log('error', message, data)
  }

  securityWarn(message: string, data?: any) {
    this.log('warn', `[SECURITY] ${message}`, data)
  }
}

export const logger = new Logger()