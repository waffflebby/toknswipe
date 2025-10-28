import type { EnrichedCoin } from "./types"
import { detectThemes } from "./theme-detector"
import { addCoinToTheme } from "./theme-service"

const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjkwOWI1ZTU2LTg5ZTEtNGFkMy1iNzY3LWVkMTc2ZDg2OTg4MiIsIm9yZ0lkIjoiNDc2Mjg4IiwidXNlcklkIjoiNDkwMDA4IiwidHlwZSI6IlBST0pFQ1QiLCJ0eXBlSWQiOiI3YjFlZGNjOS05NjJlLTQ1MmUtYWFhMy0yM2VjNjVmYjU2ZjEiLCJpYXQiOjE3NjA5ODc2MjMsImV4cCI6NDkxNjc0NzYyM30.G5FMQktvACjnPVGyv_Mo9rACvSXcMO3rBtajsu9kEXE"

interface SearchResult {
  tokenAddress: string
  name: string
  symbol: string
  decimals: number
  logo?: string
}

// Search coins by symbol, name, or address
export async function searchCoins(query: string): Promise<EnrichedCoin[]> {
  if (!query || query.length < 1) return []

  try {
    // Search by token address or symbol
    const response = await fetch(
      `https://deep-index.moralis.io/api/v2.2/tokens/search?chain=solana&query=${encodeURIComponent(query)}`,
      {
        headers: {
          accept: "application/json",
          "X-API-Key": MORALIS_API_KEY,
        },
      }
    )

    if (!response.ok) {
      console.error("[Search] API error:", response.status)
      return []
    }

    const data = await response.json()
    const results = (data.result || []) as SearchResult[]

    // Transform to EnrichedCoin format
    const enrichedResults = results.slice(0, 10).map((coin) => {
      const enrichedCoin: EnrichedCoin = {
        id: coin.tokenAddress,
        mint: coin.tokenAddress,
        name: coin.name,
        symbol: coin.symbol,
        price: "$0.00",
        priceUsd: 0,
        change24h: "+0.00%",
        change24hNum: 0,
        marketCap: "$0",
        marketCapUsd: 0,
        description: "",
        image: coin.logo || "/placeholder.svg",
        creator: "",
        createdAt: new Date(),
        age: "N/A",
        liquidity: "$0",
        volume24h: "$0",
        txns24h: 0,
        holders: 0,
        website: "",
        twitter: "",
        telegram: "",
        isVerified: false,
        riskLevel: "high" as const,
        themes: [],
      }

      // Auto-detect themes for this coin
      const detectedThemes = detectThemes(enrichedCoin)
      enrichedCoin.themes = detectedThemes

      // Auto-tag coin to detected themes
      detectedThemes.forEach((themeId) => {
        addCoinToTheme(themeId, coin.tokenAddress)
      })

      return enrichedCoin
    })

    return enrichedResults
  } catch (error) {
    console.error("[Search] Error:", error)
    return []
  }
}

// Debounced search
let searchTimeout: NodeJS.Timeout
export function debouncedSearch(
  query: string,
  callback: (results: EnrichedCoin[]) => void,
  delay: number = 300
) {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    const results = await searchCoins(query)
    callback(results)
  }, delay)
}
