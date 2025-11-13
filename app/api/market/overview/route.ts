import { NextResponse } from "next/server"

import { fetchTrendingCoins } from "@/lib/api-enhanced"

export async function GET() {
  try {
    const coins = await fetchTrendingCoins()
    const totalMarketCapUsd = coins.reduce((sum, coin) => sum + (coin.marketCapUsd || 0), 0)
    const averageChange24h = coins.length
      ? coins.reduce((sum, coin) => sum + (coin.change24hNum || 0), 0) / coins.length
      : 0

    const sortedByChange = [...coins].sort((a, b) => (b.change24hNum || 0) - (a.change24hNum || 0))
    const topGainers = sortedByChange.slice(0, 3)
    const topLosers = [...coins]
      .sort((a, b) => (a.change24hNum || 0) - (b.change24hNum || 0))
      .slice(0, 3)

    return NextResponse.json({
      data: {
        totalMarketCapUsd,
        averageChange24h,
        topGainers,
        topLosers,
        sampleSize: coins.length,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[API] Failed to build market overview", error)
    return NextResponse.json(
      { error: "Unable to build market overview" },
      { status: 500 }
    )
  }
}
