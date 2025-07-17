import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  reset: number
  retryAfter?: number
}

// Initialize Redis client only if configured
let redis: Redis | null = null
let ratelimit: Ratelimit | null = null

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })

  // Create rate limiter instance - 5 attempts per hour per IP
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    analytics: true,
    prefix: 'auth_rate_limit',
  })
}

/**
 * Check rate limit for authentication attempts
 * @param identifier - IP address or user identifier
 * @returns Rate limit result with allowed status and metadata
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  try {
    // Skip rate limiting if not configured
    if (!redis || !ratelimit) {
      // Rate limiting not configured - allow the request
      return {
        allowed: true,
        remaining: 5,
        reset: Date.now() + 3600000, // 1 hour from now
      }
    }

    const result = await ratelimit.limit(identifier)
    
    return {
      allowed: result.success,
      remaining: result.remaining,
      reset: result.reset,
      retryAfter: result.success ? undefined : Math.round((result.reset - Date.now()) / 1000),
    }
  } catch (error) {
    // In case of Redis failure, allow the request
    // Error logging should be handled by the calling function
    return {
      allowed: true,
      remaining: 5,
      reset: Date.now() + 3600000,
    }
  }
}

/**
 * Get current rate limit status without consuming an attempt
 * @param identifier - IP address or user identifier
 * @returns Current rate limit status
 */
export async function getRateLimitStatus(identifier: string): Promise<{
  current: number
  limit: number
  reset: number
}> {
  try {
    if (!redis) {
      return {
        current: 0,
        limit: 5,
        reset: Date.now() + 3600000,
      }
    }

    const key = `auth_rate_limit:${identifier}`
    const current = await redis.get<number>(key) || 0
    const ttl = await redis.ttl(key)
    
    return {
      current,
      limit: 5,
      reset: ttl > 0 ? Date.now() + (ttl * 1000) : Date.now() + 3600000,
    }
  } catch (error) {
    // Return default status on error
    return {
      current: 0,
      limit: 5,
      reset: Date.now() + 3600000,
    }
  }
}