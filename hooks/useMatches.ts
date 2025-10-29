import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { EnrichedCoin } from '@/lib/types'
import { getMatches as getMatchesAPI, addToMatches as addToMatchesAPI, removeFromMatches as removeFromMatchesAPI } from '@/lib/storage-db'

export function useMatches() {
  const queryClient = useQueryClient()
  
  const { data: matches = [], isLoading, refetch } = useQuery({
    queryKey: ['matches'],
    queryFn: getMatchesAPI,
    staleTime: 30 * 1000,
  })

  const addMutation = useMutation({
    mutationFn: (coin: EnrichedCoin) => addToMatchesAPI(coin),
    onMutate: async (newCoin) => {
      await queryClient.cancelQueries({ queryKey: ['matches'] })
      const previous = queryClient.getQueryData<EnrichedCoin[]>(['matches'])
      
      queryClient.setQueryData<EnrichedCoin[]>(['matches'], (old = []) => {
        if (old.some(c => c.id === newCoin.id)) {
          return old
        }
        return [...old, newCoin]
      })
      
      return { previous }
    },
    onError: (_err, _newCoin, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['matches'], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] })
    },
  })

  const removeMutation = useMutation({
    mutationFn: (coinId: string) => removeFromMatchesAPI(coinId),
    onMutate: async (coinId) => {
      await queryClient.cancelQueries({ queryKey: ['matches'] })
      const previous = queryClient.getQueryData<EnrichedCoin[]>(['matches'])
      
      queryClient.setQueryData<EnrichedCoin[]>(['matches'], (old = []) => 
        old.filter(c => c.id !== coinId)
      )
      
      return { previous }
    },
    onError: (_err, _coinId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['matches'], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] })
    },
  })

  return {
    matches,
    isLoading,
    refetch,
    addMatch: addMutation.mutate,
    removeMatch: removeMutation.mutate,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  }
}
