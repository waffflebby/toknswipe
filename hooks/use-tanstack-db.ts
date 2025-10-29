'use client'

import { useLiveQuery } from '@tanstack/react-db'
import { eq } from '@tanstack/db'
import { favoritesCollection, matchesCollection, FavoriteItem, MatchItem } from '@/lib/tanstack-db'
import { useQueryClient } from '@tanstack/react-query'

// Hook for favorites with live reactivity
export function useFavorites() {
  const { data: favorites } = useLiveQuery((q) =>
    q.from({ favorites: favoritesCollection })
  )
  
  return favorites || []
}

// Hook for matches with live reactivity
export function useMatches() {
  const { data: matches } = useLiveQuery((q) =>
    q.from({ matches: matchesCollection })
  )
  
  return matches || []
}

// Mutation helpers for optimistic updates
export function useAddFavorite() {
  const queryClient = useQueryClient()
  
  return async (coinMint: string, coinData: any) => {
    // Optimistic update to the collection
    const tempId = `temp-${Date.now()}`
    const newFavorite: FavoriteItem = {
      id: tempId,
      userId: 'temp',
      coinMint,
      coinData,
      createdAt: new Date().toISOString(),
    }
    
    // Update the collection optimistically
    queryClient.setQueryData(['favorites'], (old: any) => {
      return [...(old || []), newFavorite]
    })
    
    try {
      // Make the actual API call
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coinMint, coinData }),
      })
      
      if (!res.ok) throw new Error('Failed to add favorite')
      
      const data = await res.json()
      
      // Invalidate to fetch the real data from server
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      
      return data.favorite
    } catch (error) {
      // Rollback on error
      queryClient.setQueryData(['favorites'], (old: any) => {
        return (old || []).filter((item: FavoriteItem) => item.id !== tempId)
      })
      throw error
    }
  }
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient()
  
  return async (coinMint: string) => {
    // Optimistic remove
    let removedItem: FavoriteItem | undefined
    queryClient.setQueryData(['favorites'], (old: any) => {
      const filtered = (old || []).filter((item: FavoriteItem) => {
        if (item.coinMint === coinMint) {
          removedItem = item
          return false
        }
        return true
      })
      return filtered
    })
    
    try {
      const res = await fetch(`/api/favorites?coinMint=${coinMint}`, {
        method: 'DELETE',
      })
      
      if (!res.ok) throw new Error('Failed to remove favorite')
      
      // Invalidate to sync with server
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    } catch (error) {
      // Rollback on error
      if (removedItem) {
        queryClient.setQueryData(['favorites'], (old: any) => {
          return [...(old || []), removedItem]
        })
      }
      throw error
    }
  }
}

export function useAddMatch() {
  const queryClient = useQueryClient()
  
  return async (coinMint: string, coinData: any) => {
    // Optimistic update
    const tempId = `temp-${Date.now()}`
    const newMatch: MatchItem = {
      id: tempId,
      userId: 'temp',
      coinMint,
      coinData,
      createdAt: new Date().toISOString(),
    }
    
    queryClient.setQueryData(['matches'], (old: any) => {
      return [...(old || []), newMatch]
    })
    
    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coinMint, coinData }),
      })
      
      if (!res.ok) throw new Error('Failed to add match')
      
      const data = await res.json()
      queryClient.invalidateQueries({ queryKey: ['matches'] })
      
      return data.match
    } catch (error) {
      queryClient.setQueryData(['matches'], (old: any) => {
        return (old || []).filter((item: MatchItem) => item.id !== tempId)
      })
      throw error
    }
  }
}

export function useRemoveMatch() {
  const queryClient = useQueryClient()
  
  return async (coinMint: string) => {
    let removedItem: MatchItem | undefined
    queryClient.setQueryData(['matches'], (old: any) => {
      const filtered = (old || []).filter((item: MatchItem) => {
        if (item.coinMint === coinMint) {
          removedItem = item
          return false
        }
        return true
      })
      return filtered
    })
    
    try {
      const res = await fetch(`/api/matches?coinMint=${coinMint}`, {
        method: 'DELETE',
      })
      
      if (!res.ok) throw new Error('Failed to remove match')
      
      queryClient.invalidateQueries({ queryKey: ['matches'] })
    } catch (error) {
      if (removedItem) {
        queryClient.setQueryData(['matches'], (old: any) => {
          return [...(old || []), removedItem]
        })
      }
      throw error
    }
  }
}
