# Logging Configuration Guide

## Overview

The WCI@NYP application implements a comprehensive, environment-aware logging system that adapts its behavior based on the deployment environment. The logging system provides structured logging, performance metrics, error reporting, and remote log aggregation capabilities.

## Architecture

### Components

1. **Enhanced Logger** (`/src/lib/logger-v2.ts`)
   - Core logging functionality
   - Context management
   - Performance tracking
   - Circular buffer for recent logs

2. **Logger Configuration** (`/src/config/logger.config.ts`)
   - Environment-specific presets
   - Performance thresholds
   - Formatting utilities

3. **Logger Factory** (`/src/lib/logger-factory.ts`)
   - Creates configured logger instances
   - Handles remote logging setup
   - Manages error reporting integration

4. **Server Logger** (`/netlify/functions/utils/logger.ts`)
   - Optimized for serverless environment
   - Request context tracking
   - Batch log transmission

## Configuration

### Environment Variables

```bash
# Core Logging Settings
LOG_LEVEL=info                           # Minimum log level (debug|info|warn|error)
ENABLE_STRUCTURED_LOGGING=true           # Use JSON format (true|false)
ENABLE_PERFORMANCE_METRICS=true          # Track performance metrics
LOG_BUFFER_SIZE=1000                     # In-memory buffer size
LOG_SAMPLING_RATE=1.0                    # Sampling rate (0.0-1.0)

# Remote Logging
ENABLE_REMOTE_LOGGING=false              # Send logs to external service
REMOTE_LOGGING_ENDPOINT=                 # External logging endpoint URL

# Error Reporting
ENABLE_ERROR_REPORTING=false             # Enable error reporting
NEXT_PUBLIC_SENTRY_DSN=                  # Sentry DSN for error tracking

# Client-side
NEXT_PUBLIC_ENABLE_LOGGING=true          # Enable client-side logging
```

### Environment Presets

#### Development
```javascript
{
  enabledLevels: ['debug', 'info', 'warn', 'error', 'metric'],
  maxBufferSize: 2000,
  enablePerformanceMetrics: true,
  enableStructuredLogging: false,  // Human-readable format
  enableDevTools: true,
}
```

#### Staging
```javascript
{
  enabledLevels: ['info', 'warn', 'error', 'metric'],
  maxBufferSize: 1000,
  enablePerformanceMetrics: true,
  enableStructuredLogging: true,   // JSON format
  enableDevTools: false,
}
```

#### Production
```javascript
{
  enabledLevels: ['warn', 'error'],
  maxBufferSize: 500,
  enablePerformanceMetrics: false,
  enableStructuredLogging: true,
  enableDevTools: false,
}
```

## Usage

### Basic Logging

```typescript
import { logger } from '@/lib/logger-v2'

// Simple logging
logger.debug('Debug message')
logger.info('User logged in', { userId: '123' })
logger.warn('API rate limit approaching', { remaining: 10 })
logger.error('Failed to process payment', { error, orderId })
```

### Context Management

```typescript
// Push context for nested operations
logger.pushContext('UserService')
logger.info('Processing user request')
// Logs: [UserService] Processing user request

// Automatic context management
logger.withContext('PaymentProcessor', () => {
  logger.info('Processing payment')
  // Logs: [UserService.PaymentProcessor] Processing payment
})

// Async context
await logger.withContextAsync('DatabaseOperation', async () => {
  await performDatabaseOperation()
})
```

### Performance Tracking

```typescript
// Manual timing
logger.time('apiCall')
const response = await fetch('/api/data')
const duration = logger.timeEnd('apiCall')
// Logs: [METRIC] apiCall completed { duration: 245.3 }

// Automatic measurement
const result = await logger.measure('databaseQuery', async () => {
  return await db.query('SELECT * FROM users')
})

// Get performance metrics
const metrics = logger.getMetrics('apiCall')
const avgDuration = logger.getAverageMetric('apiCall')
```

### Creating Custom Loggers

```typescript
import { createLogger } from '@/lib/logger-factory'

// Create a logger for a specific module
const authLogger = createLogger('Authentication')

// Create a performance-focused logger
const perfLogger = createLogger('Performance', 'performance')

// Create a server-side logger
const serverLogger = createLogger('API', 'server')
```

### Server-Side Logging (Netlify Functions)

```typescript
import { createLogger } from './utils/logger'

const logger = createLogger('my-function')

export const handler = async (event) => {
  const log = logger.withRequest(event)
  
  log.info('Processing request', { 
    path: event.path,
    method: event.httpMethod 
  })
  
  try {
    // Function logic
    log.info('Request processed successfully')
  } catch (error) {
    log.error('Request failed', { error })
  }
}
```

## Log Formats

### Development Format (Human-Readable)
```
2024-01-15T10:30:45.123Z [Auth.Login] INFO: User login attempt { email: 'user@example.com' }
```

### Production Format (Structured JSON)
```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "info",
  "context": "Auth.Login",
  "message": "User login attempt",
  "email": "user@example.com",
  "environment": "production",
  "correlationId": "req-123456"
}
```

## Performance Thresholds

The system automatically categorizes performance metrics:

### API Operations
- **Fast**: < 100ms
- **Normal**: < 500ms
- **Slow**: < 2000ms
- **Critical**: ≥ 2000ms

### Render Operations
- **Fast**: < 16ms (60fps)
- **Normal**: < 50ms (20fps)
- **Slow**: < 100ms (10fps)
- **Critical**: ≥ 100ms

### Database Operations
- **Fast**: < 50ms
- **Normal**: < 200ms
- **Slow**: < 1000ms
- **Critical**: ≥ 1000ms

## Remote Logging

When enabled, logs are batched and sent to a remote endpoint:

```typescript
// Logs are automatically batched (100 logs or 5 seconds)
// Format sent to remote endpoint:
{
  "logs": [...],
  "source": "wcinyp-client",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

## Error Reporting

Errors are automatically reported to Sentry when configured:

```typescript
// Automatic error capture
logger.error('Database connection failed', { 
  database: 'users',
  attempt: 3 
})
// Automatically sent to Sentry with context

// Manual error reporting
logger.securityWarn('Unauthorized access attempt', {
  ip: request.ip,
  path: request.path
})
```

## Debugging

### Browser DevTools

In development, access logger utilities via console:

```javascript
// Get recent logs
__WCINYP_LOGGER__.getBuffer()

// Get performance metrics
__WCINYP_LOGGER__.getMetrics()

// Clear logs
__WCINYP_LOGGER__.clearBuffer()

// Change log level
__WCINYP_LOGGER__.setLogLevel(['debug', 'info', 'warn', 'error'])
```

### Log Analysis

```typescript
// Get recent error logs
const errors = logger.getRecentLogs(50, 'error')

// Get all performance metrics
const allMetrics = logger.getMetrics()

// Clear all stored data
logger.clear()
```

## Best Practices

1. **Use Appropriate Log Levels**
   - `debug`: Detailed information for debugging
   - `info`: General information about application flow
   - `warn`: Warning conditions that might need attention
   - `error`: Error conditions that need immediate attention

2. **Add Meaningful Context**
   ```typescript
   // Good
   logger.info('Payment processed', { 
     orderId: order.id,
     amount: order.total,
     currency: order.currency 
   })
   
   // Bad
   logger.info('Payment done')
   ```

3. **Use Performance Tracking**
   ```typescript
   // Track critical operations
   await logger.measure('criticalOperation', async () => {
     await performOperation()
   }, { userId, operationType })
   ```

4. **Handle Sensitive Data**
   ```typescript
   // Don't log sensitive information
   logger.info('User authenticated', { 
     userId: user.id,
     // Don't log: password, creditCard, ssn, etc.
   })
   ```

5. **Use Context for Tracing**
   ```typescript
   logger.setCorrelationId(request.id)
   logger.withContext('RequestHandler', () => {
     // All logs will include correlationId and context
   })
   ```

## Performance Considerations

1. **Log Sampling**: In production, use sampling to reduce log volume
   ```bash
   LOG_SAMPLING_RATE=0.1  # Log only 10% of non-error logs
   ```

2. **Buffer Size**: Adjust based on memory constraints
   ```bash
   LOG_BUFFER_SIZE=500    # Reduce for memory-constrained environments
   ```

3. **Disable Metrics**: Turn off in production if not needed
   ```bash
   ENABLE_PERFORMANCE_METRICS=false
   ```

4. **Async Operations**: Logs are non-blocking and won't impact performance

## Troubleshooting

### Logs Not Appearing

1. Check log level configuration
2. Verify `NEXT_PUBLIC_ENABLE_LOGGING` is true
3. Check sampling rate isn't too low
4. Ensure logger is properly imported

### Performance Impact

1. Reduce buffer size
2. Lower sampling rate
3. Disable performance metrics
4. Use more selective log levels

### Remote Logging Issues

1. Verify endpoint URL is correct
2. Check network connectivity
3. Monitor batch size and frequency
4. Check for CORS issues

## Integration Examples

### With Error Boundaries

```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('React error boundary triggered', {
      error: error.message,
      componentStack: errorInfo.componentStack
    })
  }
}
```

### With API Middleware

```typescript
export async function apiMiddleware(req: Request) {
  const correlationId = crypto.randomUUID()
  logger.setCorrelationId(correlationId)
  
  logger.time('apiRequest')
  try {
    const response = await processRequest(req)
    logger.timeEnd('apiRequest', { 
      status: response.status,
      path: req.url 
    })
    return response
  } catch (error) {
    logger.error('API request failed', { error, path: req.url })
    throw error
  }
}
```

### With Database Operations

```typescript
async function queryDatabase(query: string) {
  return logger.measure('databaseQuery', async () => {
    const result = await db.execute(query)
    logger.info('Query executed', { 
      rowCount: result.rowCount,
      duration: result.duration 
    })
    return result
  }, { query: query.substring(0, 100) }) // Log truncated query
}
```