
import { useQuery } from '@tanstack/react-query'
import { searchCoinsFromAPI } from '@/lib/api-client'
import type { EnrichedCoin } from '@/lib/types'

export function useSearch(query: string) {
  const trimmedQuery = query.trim()
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['search', trimmedQuery],
    queryFn: async () => {
      if (!trimmedQuery) {
        return { tokens: [], themes: [] }
      }
      return await searchCoinsFromAPI(trimmedQuery)
    },
    enabled: trimmedQuery.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes - search results stay fresh
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 1000,
  })

  return {
    tokens: (data?.tokens || []) as EnrichedCoin[],
    themes: data?.themes || [],
    isSearching: isLoading,
    error,
  }
}
