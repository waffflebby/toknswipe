import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Initialize Redis client
// Note: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN need to be set as secrets
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

// Rate limiters
export const ratelimit = redis ? {
  // For mutations (favorites, matches, swipes, themes)
  mutations: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
    analytics: true,
  }),
  
  // For reads (less strict)
  reads: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '10 s'), // 30 requests per 10 seconds
    analytics: true,
  }),
} : null

// Cache utilities
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    if (!redis) return null
    
    try {
      const data = await redis.get<T>(key)
      return data
    } catch (error) {
      console.error('[Redis] Get error:', error)
      return null
    }
  },

  async set(key: string, value: any, ttlSeconds: number = 60): Promise<boolean> {
    if (!redis) return false
    
    try {
      await redis.setex(key, ttlSeconds, value)
      return true
    } catch (error) {
      console.error('[Redis] Set error:', error)
      return false
    }
  },

  async del(key: string): Promise<boolean> {
    if (!redis) return false
    
    try {
      await redis.del(key)
      return true
    } catch (error) {
      console.error('[Redis] Delete error:', error)
      return false
    }
  },

  async invalidate(pattern: string): Promise<number> {
    if (!redis) return 0
    
    try {
      const keys = await redis.keys(pattern)
      if (keys.length === 0) return 0
      
      const deleted = await redis.del(...keys)
      return deleted
    } catch (error) {
      console.error('[Redis] Invalidate error:', error)
      return 0
    }
  },
}

export { redis }
