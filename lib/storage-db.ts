import type { EnrichedCoin } from "./types"
import { 
  getWatchlist as getWatchlistLocal, 
  addToWatchlist as addToWatchlistLocal,
  removeFromWatchlist as removeFromWatchlistLocal,
  getPersonalList as getPersonalListLocal,
  addToPersonalList as addToPersonalListLocal,
  removeFromPersonalList as removeFromPersonalListLocal
} from "./storage"

async function checkAuth(): Promise<boolean> {
  if (typeof window === "undefined") return false
  
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      credentials: 'include'
    })
    return response.ok
  } catch {
    return false
  }
}

export async function getFavorites(): Promise<EnrichedCoin[]> {
  const isAuthenticated = await checkAuth()
  
  if (!isAuthenticated) {
    return []
  }
  
  try {
    const response = await fetch('/api/favorites')
    if (response.ok) {
      const data = await response.json()
      return data.favorites.map((fav: any) => fav.coinData as EnrichedCoin)
    }
  } catch (error) {
    console.error('Error fetching favorites from DB:', error)
  }
  
  return []
}

export async function addToFavorites(coin: EnrichedCoin): Promise<boolean> {
  const isAuthenticated = await checkAuth()
  
  if (!isAuthenticated) {
    return false
  }
  
  try {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        coinMint: coin.id,
        coinData: coin
      })
    })
    
    if (response.ok || response.status === 409) {
      return true
    }
  } catch (error) {
    console.error('Error adding favorite to DB:', error)
  }
  
  return false
}

export async function removeFromFavorites(coinId: string): Promise<boolean> {
  const isAuthenticated = await checkAuth()
  
  if (!isAuthenticated) {
    return false
  }
  
  try {
    const response = await fetch(`/api/favorites?coinMint=${coinId}`, {
      method: 'DELETE'
    })
    
    if (response.ok || response.status === 404) {
      return true
    }
  } catch (error) {
    console.error('Error removing favorite from DB:', error)
  }
  
  return false
}

export async function isInFavorites(coinId: string): Promise<boolean> {
  const favorites = await getFavorites()
  return favorites.some((c) => c.id === coinId)
}

export async function getMatches(): Promise<EnrichedCoin[]> {
  const isAuthenticated = await checkAuth()
  
  if (!isAuthenticated) {
    return []
  }
  
  try {
    const response = await fetch('/api/matches')
    if (response.ok) {
      const data = await response.json()
      return data.matches.map((match: any) => match.coinData as EnrichedCoin)
    }
  } catch (error) {
    console.error('Error fetching matches from DB:', error)
  }
  
  return []
}

export async function addToMatches(coin: EnrichedCoin): Promise<boolean> {
  const isAuthenticated = await checkAuth()
  
  if (!isAuthenticated) {
    return false
  }
  
  try {
    const response = await fetch('/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        coinMint: coin.id,
        coinData: coin
      })
    })
    
    if (response.ok || response.status === 409) {
      return true
    }
  } catch (error) {
    console.error('Error adding match to DB:', error)
  }
  
  return false
}

export async function removeFromMatches(coinId: string): Promise<boolean> {
  const isAuthenticated = await checkAuth()
  
  if (!isAuthenticated) {
    return false
  }
  
  try {
    const response = await fetch(`/api/matches?coinMint=${coinId}`, {
      method: 'DELETE'
    })
    
    if (response.ok || response.status === 404) {
      return true
    }
  } catch (error) {
    console.error('Error removing match from DB:', error)
  }
  
  return false
}

export async function recordSwipe(coinMint: string, direction: 'left' | 'right'): Promise<boolean> {
  const isAuthenticated = await checkAuth()
  
  if (!isAuthenticated) {
    return false
  }
  
  try {
    const response = await fetch('/api/swipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        coinMint,
        direction
      })
    })
    
    if (response.ok) {
      return true
    }
  } catch (error) {
    console.error('Error recording swipe:', error)
  }
  
  return false
}
