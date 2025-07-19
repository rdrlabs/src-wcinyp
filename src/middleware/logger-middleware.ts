/**
 * Logger Middleware for Next.js API Routes and Netlify Functions
 * Provides automatic request/response logging with performance tracking
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger-v2';
import { v4 as uuidv4 } from 'uuid';

interface MiddlewareConfig {
  excludePaths?: string[];
  includeBody?: boolean;
  includeHeaders?: boolean;
  sensitiveHeaders?: string[];
  maxBodyLength?: number;
}

const DEFAULT_CONFIG: MiddlewareConfig = {
  excludePaths: ['/api/health', '/_next', '/static'],
  includeBody: true,
  includeHeaders: false,
  sensitiveHeaders: ['authorization', 'cookie', 'x-api-key'],
  maxBodyLength: 1000,
};

/**
 * Sanitize sensitive data from headers
 */
function sanitizeHeaders(headers: Headers, sensitiveHeaders: string[]): Record<string, string> {
  const sanitized: Record<string, string> = {};
  
  headers.forEach((value, key) => {
    if (sensitiveHeaders.includes(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = value;
    }
  });
  
  return sanitized;
}

/**
 * Truncate body if it exceeds max length
 */
function truncateBody(body: any, maxLength: number): any {
  if (typeof body === 'string' && body.length > maxLength) {
    return body.substring(0, maxLength) + '... [TRUNCATED]';
  }
  
  if (typeof body === 'object') {
    const stringified = JSON.stringify(body);
    if (stringified.length > maxLength) {
      return stringified.substring(0, maxLength) + '... [TRUNCATED]';
    }
  }
  
  return body;
}

/**
 * Extract request metadata
 */
async function extractRequestMetadata(
  request: NextRequest,
  config: MiddlewareConfig
): Promise<Record<string, any>> {
  const metadata: Record<string, any> = {
    method: request.method,
    url: request.url,
    pathname: new URL(request.url).pathname,
    userAgent: request.headers.get('user-agent'),
    ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
  };

  if (config.includeHeaders) {
    metadata.headers = sanitizeHeaders(request.headers, config.sensitiveHeaders || []);
  }

  if (config.includeBody && request.body) {
    try {
      const body = await request.text();
      metadata.body = truncateBody(body, config.maxBodyLength || 1000);
    } catch (error) {
      metadata.body = '[BODY_PARSE_ERROR]';
    }
  }

  return metadata;
}

/**
 * Main logger middleware for Next.js
 */
export function createLoggerMiddleware(customConfig?: Partial<MiddlewareConfig>) {
  const config = { ...DEFAULT_CONFIG, ...customConfig };

  return async function loggerMiddleware(
    request: NextRequest
  ): Promise<NextResponse> {
    // Check if path should be excluded
    const pathname = new URL(request.url).pathname;
    if (config.excludePaths?.some(path => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    // Generate correlation ID for request tracing
    const correlationId = request.headers.get('x-correlation-id') || uuidv4();
    logger.setCorrelationId(correlationId);

    // Start timing
    const timerLabel = `API.${request.method}.${pathname}`;
    logger.time(timerLabel);

    // Log request
    logger.pushContext('API');
    const requestMetadata = await extractRequestMetadata(request, config);
    logger.info('Incoming request', { ...requestMetadata, correlationId });

    try {
      // Continue with the request
      const response = NextResponse.next();
      
      // Add correlation ID to response
      response.headers.set('x-correlation-id', correlationId);

      // Log response
      const duration = logger.timeEnd(timerLabel);
      logger.info('Request completed', {
        status: response.status,
        duration,
        correlationId,
      });

      return response;
    } catch (error) {
      // Log error
      const duration = logger.timeEnd(timerLabel);
      logger.error('Request failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        duration,
        correlationId,
      });

      throw error;
    } finally {
      logger.popContext();
      logger.clearCorrelationId();
    }
  };
}

/**
 * Middleware for Netlify Functions
 */
export function createNetlifyLoggerMiddleware(customConfig?: Partial<MiddlewareConfig>) {
  const config = { ...DEFAULT_CONFIG, ...customConfig };

  return function netlifyLoggerMiddleware(
    handler: (event: any, context: any) => Promise<any>
  ) {
    return async (event: any, context: any) => {
      // Generate correlation ID
      const correlationId = event.headers?.['x-correlation-id'] || uuidv4();
      logger.setCorrelationId(correlationId);

      // Start timing
      const pathname = event.path || event.rawUrl || 'unknown';
      const timerLabel = `Function.${event.httpMethod}.${pathname}`;
      logger.time(timerLabel);

      // Log request
      logger.pushContext('NetlifyFunction');
      const metadata: Record<string, any> = {
        method: event.httpMethod,
        path: pathname,
        headers: config.includeHeaders 
          ? sanitizeHeaders(new Headers(event.headers), config.sensitiveHeaders || [])
          : undefined,
        body: config.includeBody && event.body
          ? truncateBody(event.body, config.maxBodyLength || 1000)
          : undefined,
        queryStringParameters: event.queryStringParameters,
        correlationId,
      };

      logger.info('Function invoked', metadata, 'logger-middleware');

      try {
        // Execute the handler
        const response = await handler(event, context);

        // Log response
        const duration = logger.timeEnd(timerLabel);
        logger.info('Function completed', {
          statusCode: response.statusCode,
          duration,
          correlationId,
        });

        // Add correlation ID to response headers
        if (!response.headers) {
          response.headers = {};
        }
        response.headers['x-correlation-id'] = correlationId;

        return response;
      } catch (error) {
        // Log error
        const duration = logger.timeEnd(timerLabel);
        logger.error('Function failed', {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          duration,
          correlationId,
        });

        // Return error response
        return {
          statusCode: 500,
          headers: {
            'Content-Type': 'application/json',
            'x-correlation-id': correlationId,
          },
          body: JSON.stringify({
            error: 'Internal Server Error',
            correlationId,
          }),
        };
      } finally {
        logger.popContext();
        logger.clearCorrelationId();
      }
    };
  };
}

/**
 * Express-style middleware for API routes
 */
export function createExpressLoggerMiddleware(customConfig?: Partial<MiddlewareConfig>) {
  const config = { ...DEFAULT_CONFIG, ...customConfig };

  return function expressLoggerMiddleware(
    req: any,
    res: any,
    next: () => void
  ) {
    // Generate correlation ID
    const correlationId = req.headers['x-correlation-id'] || uuidv4();
    logger.setCorrelationId(correlationId);

    // Start timing
    const timerLabel = `Express.${req.method}.${req.path}`;
    logger.time(timerLabel);

    // Log request
    logger.pushContext('Express');
    const metadata: Record<string, any> = {
      method: req.method,
      path: req.path,
      url: req.url,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'],
      correlationId,
    };

    if (config.includeHeaders) {
      metadata.headers = sanitizeHeaders(
        new Headers(req.headers),
        config.sensitiveHeaders || []
      );
    }

    if (config.includeBody && req.body) {
      metadata.body = truncateBody(req.body, config.maxBodyLength || 1000);
    }

    logger.info('Request received', metadata, 'logger-middleware');

    // Store original end method
    const originalEnd = res.end;

    // Override end method to log response
    res.end = function(...args: any[]) {
      // Log response
      const duration = logger.timeEnd(timerLabel);
      logger.info('Request completed', {
        statusCode: res.statusCode,
        duration,
        correlationId,
      });

      logger.popContext();
      logger.clearCorrelationId();

      // Call original end method
      originalEnd.apply(res, args);
    };

    // Add correlation ID to response
    res.setHeader('x-correlation-id', correlationId);

    // Continue with request
    next();
  };
}

// Export default middleware
export const loggerMiddleware = createLoggerMiddleware();