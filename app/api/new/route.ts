import { NextResponse } from "next/server"
import { fetchNewCoins } from "@/lib/api-enhanced"
import { getCached, setCached } from "../cache"

const NEW_COINS_CACHE_TTL = 3 * 60 * 1000 // 3 minutes (moves fast)

export async function GET() {
  try {
    // Check cache first
    const cached = getCached("new_coins")
    if (cached) {
      console.log("[API] Returning cached new coins")
      return NextResponse.json({
        data: cached,
        source: "cache",
        timestamp: Date.now(),
      })
    }

    console.log("[API] Cache miss, fetching new coins from Moralis...")
    const coins = await fetchNewCoins()

    // Cache the result
    setCached("new_coins", coins, NEW_COINS_CACHE_TTL)

    // Serialize coins - convert Date objects to ISO strings
    const serializedCoins = coins.map(coin => ({
      ...coin,
      createdAt: coin.createdAt instanceof Date ? coin.createdAt.toISOString() : coin.createdAt,
    }))

    return NextResponse.json({
      data: serializedCoins,
      source: "moralis",
      timestamp: Date.now(),
      cacheExpires: Date.now() + NEW_COINS_CACHE_TTL,
    })
  } catch (error) {
    console.error("[API] Error fetching new coins:", error)
    return NextResponse.json(
      { error: "Failed to fetch new coins" },
      { status: 500 }
    )
  }
}
