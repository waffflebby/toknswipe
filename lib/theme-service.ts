import { getThemesForCoin } from "./coin-database"
import type { EnrichedCoin } from "./types"

const STORAGE_KEY = "coinswipe_themes"

export interface ThemeData {
  coins: string[] // coin IDs/mints
  metadata: {
    createdAt: number
    lastUpdated: number
    customName?: string
  }
}

export interface ThemeStorage {
  [themeId: string]: ThemeData
}

// Get all theme data from localStorage
export function getThemeStorage(): ThemeStorage {
  if (typeof window === "undefined") return {}

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error("[Theme] Error reading storage:", error)
    return {}
  }
}

// Save theme data to localStorage
export function saveThemeStorage(themes: ThemeStorage): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(themes))
  } catch (error) {
    console.error("[Theme] Error saving storage:", error)
  }
}

// Add coin to theme
export function addCoinToTheme(themeId: string, coinId: string): void {
  const themes = getThemeStorage()

  if (!themes[themeId]) {
    themes[themeId] = {
      coins: [],
      metadata: {
        createdAt: Date.now(),
        lastUpdated: Date.now(),
      },
    }
  }

  if (!themes[themeId].coins.includes(coinId)) {
    themes[themeId].coins.push(coinId)
    themes[themeId].metadata.lastUpdated = Date.now()
  }

  saveThemeStorage(themes)
}

// Remove coin from theme
export function removeCoinFromTheme(themeId: string, coinId: string): void {
  const themes = getThemeStorage()

  if (themes[themeId]) {
    themes[themeId].coins = themes[themeId].coins.filter((id) => id !== coinId)
    themes[themeId].metadata.lastUpdated = Date.now()
  }

  saveThemeStorage(themes)
}

// Get coins for a theme
export function getCoinsForTheme(themeId: string): string[] {
  const themes = getThemeStorage()
  return themes[themeId]?.coins || []
}

// Auto-tag coins from trending data
export function autoTagCoins(coins: EnrichedCoin[]): void {
  const themes = getThemeStorage()

  coins.forEach((coin) => {
    const detectedThemes = getThemesForCoin(coin.symbol)

    detectedThemes.forEach((themeId) => {
      addCoinToTheme(themeId, coin.mint)
    })
  })
}

// Get all coins tagged to a theme
export function getThemeCoins(
  themeId: string,
  allCoins: EnrichedCoin[]
): EnrichedCoin[] {
  const coinIds = getCoinsForTheme(themeId)
  return allCoins.filter((coin) => coinIds.includes(coin.mint))
}

// Clear all theme data
export function clearThemeStorage(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}
