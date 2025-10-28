import { useState, useEffect, useCallback } from "react"
import {
  getThemeStorage,
  addCoinToTheme,
  removeCoinFromTheme,
  getCoinsForTheme,
  autoTagCoins,
  clearThemeStorage,
  type ThemeStorage,
} from "@/lib/theme-service"
import type { EnrichedCoin } from "@/lib/types"

export function useThemeStorage() {
  const [themes, setThemes] = useState<ThemeStorage>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Load themes from storage on mount
  useEffect(() => {
    const stored = getThemeStorage()
    setThemes(stored)
    setIsLoaded(true)
  }, [])

  // Add coin to theme
  const addCoin = useCallback((themeId: string, coinId: string) => {
    addCoinToTheme(themeId, coinId)
    const updated = getThemeStorage()
    setThemes(updated)
  }, [])

  // Remove coin from theme
  const removeCoin = useCallback((themeId: string, coinId: string) => {
    removeCoinFromTheme(themeId, coinId)
    const updated = getThemeStorage()
    setThemes(updated)
  }, [])

  // Get coins for a theme
  const getThemeCoins = useCallback((themeId: string): string[] => {
    return getCoinsForTheme(themeId)
  }, [])

  // Auto-tag coins
  const autoTag = useCallback((coins: EnrichedCoin[]) => {
    autoTagCoins(coins)
    const updated = getThemeStorage()
    setThemes(updated)
  }, [])

  // Check if coin is in theme
  const isCoinInTheme = useCallback((themeId: string, coinId: string): boolean => {
    return getCoinsForTheme(themeId).includes(coinId)
  }, [])

  // Clear all themes
  const clear = useCallback(() => {
    clearThemeStorage()
    setThemes({})
  }, [])

  return {
    themes,
    isLoaded,
    addCoin,
    removeCoin,
    getThemeCoins,
    autoTag,
    isCoinInTheme,
    clear,
  }
}
