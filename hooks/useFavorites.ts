import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { EnrichedCoin } from '@/lib/types'
import { getFavorites as getFavoritesAPI, addToFavorites as addToFavoritesAPI, removeFromFavorites as removeFromFavoritesAPI } from '@/lib/storage-db'

export function useFavorites() {
  const queryClient = useQueryClient()
  
  const { data: favorites = [], isLoading, refetch } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavoritesAPI,
    staleTime: 30 * 1000,
  })

  const addMutation = useMutation({
    mutationFn: (coin: EnrichedCoin) => addToFavoritesAPI(coin),
    onMutate: async (newCoin) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] })
      const previous = queryClient.getQueryData<EnrichedCoin[]>(['favorites'])
      
      queryClient.setQueryData<EnrichedCoin[]>(['favorites'], (old = []) => {
        if (old.some(c => c.id === newCoin.id)) {
          return old
        }
        return [...old, newCoin]
      })
      
      return { previous }
    },
    onError: (_err, _newCoin, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['favorites'], context.previous)
      }
    },
    onSettled: () => {
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
