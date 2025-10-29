import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { EnrichedCoin } from '@/lib/types'
import { getFavorites as getFavoritesAPI, addToFavorites as addToFavoritesAPI, removeFromFavorites as removeFromFavoritesAPI } from '@/lib/storage-db'

export function useFavorites() {
  const queryClient = useQueryClient()
  
  const { data: favorites = [], isLoading, refetch } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavoritesAPI,
    staleTime: 60 * 1000, // Increased from 30s to 1min
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  })

  const addMutation = useMutation({
    mutationFn: (coin: EnrichedCoin) => addToFavoritesAPI(coin),
    onMutate: async (newCoin) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['favorites'] })
      
      // Snapshot previous value
      const previous = queryClient.getQueryData<EnrichedCoin[]>(['favorites'])
      
      // Optimistically update
      queryClient.setQueryData<EnrichedCoin[]>(['favorites'], (old = []) => {
        if (old.some(c => c.id === newCoin.id)) {
          return old
        }
        return [...old, newCoin]
      })
      
      return { previous }
    },
    onError: (_err, _newCoin, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(['favorites'], context.previous)
      }
    },
    onSuccess: () => {
      // Only invalidate on success, not on settled
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  const removeMutation = useMutation({
    mutationFn: (coinId: string) => removeFromFavoritesAPI(coinId),
    onMutate: async (coinId) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] })
      const previous = queryClient.getQueryData<EnrichedCoin[]>(['favorites'])
      
      queryClient.setQueryData<EnrichedCoin[]>(['favorites'], (old = []) => 
        old.filter(c => c.id !== coinId)
      )
      
      return { previous }
    },
    onError: (_err, _coinId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['favorites'], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })

  return {
    favorites,
    isLoading,
    refetch,
    addFavorite: addMutation.mutate,
    removeFavorite: removeMutation.mutate,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  }
}
