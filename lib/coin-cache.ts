import type { EnrichedCoin } from "./types"

const CACHE_KEY = "coinswipe_coin_cache"
const CACHE_TIMESTAMP_KEY = "coinswipe_cache_timestamp"

export interface CoinCacheData {
  coins: EnrichedCoin[]
  timestamp: number
}

// Save coins to localStorage cache
export function saveCoinCache(coins: EnrichedCoin[]): void {
  if (typeof window === "undefined") return

  try {
    const cacheData: CoinCacheData = {
      coins,
      timestamp: Date.now(),
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    console.log(`[CoinCache] Saved ${coins.length} coins`)
  } catch (error) {
    console.error("[CoinCache] Error saving cache:", error)
  }
}

// Get coins from localStorage cache
export function getCoinCache(): EnrichedCoin[] {
  if (typeof window === "undefined") return []

  try {
    const data = localStorage.getItem(CACHE_KEY)
    if (!data) return []

    const cacheData: CoinCacheData = JSON.parse(data)
    return cacheData.coins || []
  } catch (error) {
    console.error("[CoinCache] Error reading cache:", error)
    return []
  }
}

// Get cache timestamp
export function getCacheTimestamp(): number {
  if (typeof window === "undefined") return 0

  try {
    const data = localStorage.getItem(CACHE_KEY)
    if (!data) return 0

    const cacheData: CoinCacheData = JSON.parse(data)
    return cacheData.timestamp || 0
  } catch (error) {
    console.error("[CoinCache] Error reading timestamp:", error)
    return 0
  }
}

// Check if cache is fresh (within 2 hours)
export function isCacheFresh(): boolean {
  const timestamp = getCacheTimestamp()
  const now = Date.now()
  const twoHours = 2 * 60 * 60 * 1000

  return timestamp > 0 && now - timestamp < twoHours
}

// Clear cache
export function clearCoinCache(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(CACHE_KEY)
    console.log("[CoinCache] Cache cleared")
  } catch (error) {
    console.error("[CoinCache] Error clearing cache:", error)
  }
}
