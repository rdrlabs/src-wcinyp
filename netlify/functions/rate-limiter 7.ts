import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  reset: number
  retryAfter?: number
}

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

// Create rate limiter instance - 5 attempts per hour per IP
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: true,
  prefix: 'auth_rate_limit',
})

/**
 * Check rate limit for authentication attempts
 * @param identifier - IP address or user identifier
 * @returns Rate limit result with allowed status and metadata
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  try {
    // Skip rate limiting if not configured
    if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
      console.warn('Rate limiting is not configured. Skipping rate limit check.')
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
    console.error('Rate limit check failed:', error)
    // In case of Redis failure, allow the request but log the error
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
    const key = `auth_rate_limit:${identifier}`
    const current = await redis.get<number>(key) || 0
    const ttl = await redis.ttl(key)
    
    return {
      current,
      limit: 5,
      reset: ttl > 0 ? Date.now() + (ttl * 1000) : Date.now() + 3600000,
    }
  } catch (error) {
    console.error('Failed to get rate limit status:', error)
    return {
      current: 0,
      limit: 5,
      reset: Date.now() + 3600000,
    }
  }
}