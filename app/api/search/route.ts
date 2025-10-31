import { NextResponse } from "next/server"
import { getCached, setCached } from "../cache"
import { MEME_THEMES } from "@/lib/theme-detector"

const SEARCH_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

const MORALIS_API_KEY = process.env.MORALIS_API_KEY!
if (!process.env.MORALIS_API_KEY) {
  throw new Error("MORALIS_API_KEY is required. Please set it in your environment variables.")
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const type = searchParams.get("type") || "all" // "all", "tokens", "themes"

    if (!query || query.length < 1) {
      return NextResponse.json(
        { error: "Query must be at least 1 character" },
        { status: 400 }
      )
    }

    const queryLower = query.toLowerCase()
    const results: any = { tokens: [], themes: [] }

    // Search themes
    if (type === "all" || type === "themes") {
      const matchedThemes = Object.entries(MEME_THEMES).filter(([id, theme]) =>
        id.includes(queryLower) || theme.name.toLowerCase().includes(queryLower)
      )
      results.themes = matchedThemes.map(([id, theme]) => ({
        id,
        name: theme.name,
        emoji: theme.emoji,
        keywords: theme.keywords,
      }))
    }

    // Search tokens (only if type is "all" or "tokens")
    if (type === "all" || type === "tokens") {

      // Check cache first
      const cacheKey = `search_tokens_${query.toLowerCase()}`
      const cached = getCached(cacheKey)
      if (cached) {
        console.log(`[API] Returning cached token search for: ${query}`)
        results.tokens = cached
      } else {
        console.log(`[API] Searching Moralis for tokens: ${query}`)

        // Search Moralis for tokens by symbol or name
        const response = await fetch(
          `https://deep-index.moralis.io/api/v2.2/tokens/search?chain=solana&query=${encodeURIComponent(query)}&limit=20`,
          {
            headers: {
              accept: "application/json",
              "X-API-Key": MORALIS_API_KEY,
            },
          }
        )

        if (!response.ok) {
          console.error(`[API] Moralis search error: ${response.status}`)
        } else {
          const data = await response.json()
          const tokens = Array.isArray(data) ? data : data.result || []

          console.log(`[API] Found ${tokens.length} tokens for: ${query}`)

          // Enrich tokens with complete metadata
          const enrichedTokens = tokens.map((token: any) => {
            const priceUsd = parseFloat(token.usdPrice || token.price_usd || "0")
            const marketCapUsd = parseFloat(token.marketCap || token.market_cap_usd || "0")
            const liquidityUsd = parseFloat(token.liquidityUsd || token.liquidity_usd || "0")
            const volume24hNum = parseFloat(token.totalVolume?.["24h"] || token["24h_volume"] || "0")
            const change24hNum = parseFloat(token.pricePercentChange?.["24h"] || "0")
            const holders = token.holders || 0
            
            // Format helpers
            const formatPrice = (price: number) => {
              if (price === 0) return "$0.00"
              if (price < 0.000001) return `$${price.toExponential(2)}`
              if (price < 0.01) return `$${price.toFixed(6)}`
              if (price < 1) return `$${price.toFixed(4)}`
              return `$${price.toFixed(2)}`
            }
            
            const formatValue = (value: number) => {
              if (value === 0) return "N/A"
              if (value >= 1000000000) return `$${(value / 1000000000).toFixed(2)}B`
              if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`
              if (value >= 1000) return `$${(value / 1000).toFixed(2)}K`
              return `$${value.toFixed(0)}`
            }
            
            return {
              id: token.address || token.tokenAddress,
              mint: token.address || token.tokenAddress,
              name: token.name || "Unknown",
              symbol: token.symbol || "???",
              image: token.logo || token.image || "/placeholder.svg",
              priceUsd,
              marketCapUsd,
              liquidityUsd,
              volume24hNum,
              change24hNum,
              holders,
              // Formatted display fields
              price: formatPrice(priceUsd),
              marketCap: formatValue(marketCapUsd),
              liquidity: formatValue(liquidityUsd),
              volume24h: formatValue(volume24hNum),
              change24h: `${change24hNum >= 0 ? '+' : ''}${change24hNum.toFixed(2)}%`,
              age: "N/A",
              description: `${token.name || "Unknown token"} on Solana${holders > 0 ? `. ${holders.toLocaleString()} holders` : ""}`,
              creator: (token.address || token.tokenAddress || "").slice(0, 6) + "..." + (token.address || token.tokenAddress || "").slice(-4),
              createdAt: new Date(),
              isVerified: liquidityUsd > 50000 && marketCapUsd > 1000000,
              riskLevel: liquidityUsd < 10000 ? "high" : liquidityUsd < 100000 ? "medium" : "low",
              launchpad: "unknown",
              theme: [],
              themes: [],
            }
          })

          // Cache results
          setCached(`search_tokens_${query.toLowerCase()}`, enrichedTokens, SEARCH_CACHE_TTL)
          results.tokens = enrichedTokens
        }
      }
    }

    return NextResponse.json({
      data: results,
      source: results.tokens.length > 0 ? "moralis" : "cache",
      timestamp: Date.now(),
      query,
    })
  } catch (error) {
    console.error("[API] Search error:", error)
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    )
  }
}
