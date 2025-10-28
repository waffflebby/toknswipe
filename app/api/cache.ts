// Simple in-memory cache for MVP (upgrade to Redis later)
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // in milliseconds
}

const cache = new Map<string, CacheEntry<any>>()

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null

  const now = Date.now()
  const age = now - entry.timestamp

  // Check if expired
  if (age > entry.ttl) {
    cache.delete(key)
    return null
  }

  return entry.data as T
}

export function setCached<T>(key: string, data: T, ttlMs: number): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMs,
  })
  console.log(`[Cache] Set ${key} with TTL ${ttlMs}ms`)
}

export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key)
    console.log(`[Cache] Cleared ${key}`)
  } else {
    cache.clear()
    console.log(`[Cache] Cleared all`)
  }
}

export function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys()),
  }
}
