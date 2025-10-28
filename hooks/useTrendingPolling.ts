import { useEffect, useRef } from "react"
import { fetchTrendingCoinsFromAPI } from "@/lib/api-client"
import { saveCoinCache, getCoinCache } from "@/lib/coin-cache"
import type { EnrichedCoin } from "@/lib/types"

const POLLING_INTERVAL = 2 * 60 * 60 * 1000 // 2 hours

export function useTrendingPolling(onCoinsUpdate?: (coins: EnrichedCoin[]) => void) {
  const pollingRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const pollTrending = async () => {
      try {
        console.log("[Polling] Fetching trending coins...")
        const coins = await fetchTrendingCoinsFromAPI()
        
        if (coins.length > 0) {
          // Save to local cache
          saveCoinCache(coins)
          console.log(`[Polling] Saved ${coins.length} coins to cache`)
          
          // Notify parent component
          onCoinsUpdate?.(coins)
        }
      } catch (error) {
        console.error("[Polling] Error fetching trending coins:", error)
      }
    }

    // Poll immediately on mount
    pollTrending()

    // Set up interval polling
    pollingRef.current = setInterval(pollTrending, POLLING_INTERVAL)

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [onCoinsUpdate])
}
