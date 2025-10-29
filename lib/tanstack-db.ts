import { createCollection } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { QueryClient } from '@tanstack/query-core'
import { z } from 'zod'

// Create a shared query client for collections
export const dbQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
})

// Schema definitions
const coinDataSchema = z.object({
  name: z.string(),
  symbol: z.string(),
  mint: z.string(),
  price: z.number().optional(),
  priceUsd: z.number().optional(),
  fdv: z.number().optional(),
  liquidity: z.number().optional(),
  volume24h: z.number().optional(),
  priceChange24h: z.number().optional(),
}).passthrough()

const favoriteSchema = z.object({
  id: z.string(),
  userId: z.string(),
  coinMint: z.string(),
  coinData: coinDataSchema,
  createdAt: z.string().or(z.date()),
})

const matchSchema = z.object({
  id: z.string(),
  userId: z.string(),
  coinMint: z.string(),
  coinData: coinDataSchema,
  createdAt: z.string().or(z.date()),
})

export type FavoriteItem = z.infer<typeof favoriteSchema>
export type MatchItem = z.infer<typeof matchSchema>

// Favorites Collection
export const favoritesCollection = createCollection(
  queryCollectionOptions({
    id: 'favorites',
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await fetch('/api/favorites')
      if (!res.ok) {
        // If unauthorized, return empty array
        if (res.status === 401) return []
        throw new Error('Failed to fetch favorites')
      }
      const data = await res.json()
      return data.favorites || []
    },
    queryClient: dbQueryClient,
    getKey: (item: FavoriteItem) => item.id,
    startSync: true,
  })
)

// Matches Collection
export const matchesCollection = createCollection(
  queryCollectionOptions({
    id: 'matches',
    queryKey: ['matches'],
    queryFn: async () => {
      const res = await fetch('/api/matches')
      if (!res.ok) {
        // If unauthorized, return empty array
        if (res.status === 401) return []
        throw new Error('Failed to fetch matches')
      }
      const data = await res.json()
      return data.matches || []
    },
    queryClient: dbQueryClient,
    getKey: (item: MatchItem) => item.id,
    startSync: true,
  })
)
