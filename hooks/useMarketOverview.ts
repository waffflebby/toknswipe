import { useQuery } from "@tanstack/react-query"

import { fetchMarketOverviewFromAPI, type MarketOverview } from "@/lib/api-client"

export function useMarketOverview() {
  return useQuery<MarketOverview | null>({
    queryKey: ["market-overview"],
    queryFn: fetchMarketOverviewFromAPI,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
