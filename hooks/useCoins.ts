import { useQuery } from '@tanstack/react-query'
import type { EnrichedCoin } from '@/lib/types'
import {
  fetchTrendingCoinsFromAPI,
  fetchNewCoinsFromAPI,
  fetchMostSwipedCoinsFromAPI,
  fetchThemeCoinsFromAPI
} from '@/lib/api-client'

type FeedType = 'trending' | 'new' | 'themed' | 'most-swiped'

export function useCoins(feedType: FeedType, theme?: string | null) {
  const queryKey = theme 
    ? ['coins', feedType, theme] 
    : ['coins', feedType]

  const { data: coins = [], isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      let fetchedCoins: EnrichedCoin[] = []

      if (feedType === 'trending') {
        fetchedCoins = await fetchTrendingCoinsFromAPI()
      } else if (feedType === 'new') {
        fetchedCoins = await fetchNewCoinsFromAPI()
      } else if (feedType === 'most-swiped') {
        fetchedCoins = await fetchMostSwipedCoinsFromAPI()
      } else if (feedType === 'themed' && theme) {
        fetchedCoins = await fetchThemeCoinsFromAPI(theme)
      } else if (feedType === 'themed' && !theme) {
        console.warn('[useCoins] Themed feed without theme, falling back to trending')
        fetchedCoins = await fetchTrendingCoinsFromAPI()
      } else {
        console.warn('[useCoins] Unknown feed type, falling back to trending')
        fetchedCoins = await fetchTrendingCoinsFromAPI()
      }

      return fetchedCoins
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })

  return {
    coins,
    isLoading,
    error,
    refetch,
  }
}
