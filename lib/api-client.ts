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
