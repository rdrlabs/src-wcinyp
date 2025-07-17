import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Create rate limiter
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
  analytics: true,
})

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  reset: number
  retryAfter?: number
}

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  try {
    const { success, limit, reset, remaining } = await ratelimit.limit(identifier)
    
    return {
      allowed: success,
      remaining,
      reset,
      retryAfter: success ? undefined : Math.round((reset - Date.now()) / 1000),
    }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    // In case of Redis failure, allow the request but log the error
    return {
      allowed: true,
      remaining: 10,
      reset: Date.now() + 3600000,
    }
  }
}