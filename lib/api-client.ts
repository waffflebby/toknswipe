// Client-side API wrapper - calls Next.js API routes
import type { EnrichedCoin } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

export async function fetchTrendingCoinsFromAPI(): Promise<EnrichedCoin[]> {
  try {
    const url = `${API_BASE_URL}/api/trending`
    console.log("[API Client] Fetching trending coins from:", url)
    const response = await fetch(url)
    
    console.log("[API Client] Response status:", response.status)
    
    if (!response.ok) {
      const text = await response.text()
      console.error("[API Client] Error response:", text)
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()
    console.log("[API Client] Got result:", result)
    console.log(`[API Client] Got ${result.data.length} coins from ${result.source}`)
    return result.data
  } catch (error) {
    console.error("[API Client] Error fetching trending:", error)
    return []
  }
}

export async function fetchNewCoinsFromAPI(): Promise<EnrichedCoin[]> {
  try {
    console.log("[API Client] Fetching new coins from Express server")
    const response = await fetch(`${API_BASE_URL}/api/new`)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()
    console.log(`[API Client] Got ${result.data.length} new coins from ${result.source}`)
    return result.data
  } catch (error) {
    console.error("[API Client] Error fetching new coins:", error)
    return []
  }
}

export async function searchCoinsFromAPI(query: string): Promise<{ tokens: any[]; themes: any[] }> {
  try {
    if (!query || query.length < 1) {
      return { tokens: [], themes: [] }
    }

    console.log("[API Client] Searching for:", query)
    const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`)
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const result = await response.json()
    console.log(`[API Client] Found ${result.data.tokens.length} tokens and ${result.data.themes.length} themes from ${result.source}`)
    return result.data
  } catch (error) {
    console.error("[API Client] Error searching:", error)
    return { tokens: [], themes: [] }
  }
}

export async function fetchTokenChartFromAPI(
  tokenAddress: string,
  timeframe: "1H" | "1D" | "1W" | "1M" | "ALL" | "1m" | "5m" | "15m" | "1h" | "4h" | "1d" = "1D"
) {
  try {
    const normalizedTimeframe = normalizeTimeframe(timeframe)
    const response = await fetch(
      `${API_BASE_URL}/api/chart?token=${encodeURIComponent(tokenAddress)}&timeframe=${normalizedTimeframe}`
    )
    
    if (!response.ok) {
      console.error(`[API Client] Chart API error: ${response.status}`)
      return null
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error("[API Client] Error fetching chart:", error)
    return null
  }
}

function normalizeTimeframe(timeframe: string): "1H" | "1D" | "1W" | "1M" | "ALL" {
  const map: Record<string, "1H" | "1D" | "1W" | "1M" | "ALL"> = {
    "1m": "1H",
    "5m": "1H",
    "15m": "1H",
    "1h": "1H",
    "4h": "1D",
    "1d": "1D",
    "1H": "1H",
    "1D": "1D",
    "1W": "1W",
    "1M": "1M",
    "ALL": "ALL",
  }
  return map[timeframe] || "1D"
}

export async function fetchTokenHoldersFromAPI(tokenAddress: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/holders?token=${encodeURIComponent(tokenAddress)}`
    )
    
    if (!response.ok) {
      console.error(`[API Client] Holders API error: ${response.status}`)
      return null
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error("[API Client] Error fetching holders:", error)
    return null
  }
}
