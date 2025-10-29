import { NextResponse } from "next/server"
import { fetchTrendingCoins } from "@/lib/api-enhanced"
import { getCached, setCached } from "../cache"
import { autoTagFamousCoins } from "@/lib/theme-coins"
import { cache } from "@/lib/redis"

const TRENDING_CACHE_TTL = 30 * 60 * 1000 // 30 minutes
const TRENDING_CACHE_TTL_SECONDS = 30 * 60 // 30 minutes

export async function GET() {
  try {
    // Check Redis cache first (production)
    const redisKey = "trending_coins:v1"
    const redisCached = await cache.get(redisKey)
    if (redisCached) {
      console.log("[API] Returning Redis cached trending coins")
      return NextResponse.json({
        data: redisCached,
        source: "redis-cache",
        timestamp: Date.now(),
      })
    }

    // Check in-memory cache (fallback)
    const cached = getCached("trending_coins")
    if (cached) {
      console.log("[API] Returning in-memory cached trending coins")
      return NextResponse.json({
        data: cached,
        source: "memory-cache",
        timestamp: Date.now(),
      })
    }

    console.log("[API] Cache miss, fetching from Moralis...")
    const coins = await fetchTrendingCoins()

    // Auto-tag famous coins to themes
    autoTagFamousCoins(coins)

    // Cache in Redis (production)
    await cache.set(redisKey, coins, TRENDING_CACHE_TTL_SECONDS)
    
    // Cache in memory (fallback)
    setCached("trending_coins", coins, TRENDING_CACHE_TTL)

    // Serialize coins - convert Date objects to ISO strings
    const serializedCoins = coins.map(coin => ({
      ...coin,
      createdAt: coin.createdAt instanceof Date ? coin.createdAt.toISOString() : coin.createdAt,
    }))

    return NextResponse.json({
      data: serializedCoins,
      source: "moralis",
      timestamp: Date.now(),
      cacheExpires: Date.now() + TRENDING_CACHE_TTL,
    })
  } catch (error) {
    console.error("[API] Error fetching trending:", error)
    return NextResponse.json(
      { error: "Failed to fetch trending coins" },
      { status: 500 }
    )
  }
}
