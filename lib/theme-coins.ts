// Pre-populate themes with famous high-MCap coins
import { addCoinToTheme } from "./theme-service"
import type { EnrichedCoin } from "./types"

export const FAMOUS_COINS_BY_THEME: Record<string, string[]> = {
  dog: ["DogwifHat", "Shiba Inu", "Doge", "Floki", "Samo"],
  cat: ["Popcat", "Mew", "Kitty", "Nyan"],
  frog: ["Pepe", "Kek"],
  ai: ["Grok", "Render", "Fetch"],
  moon: ["Rocket", "Luna"],
  fire: ["Burn", "Flame"],
  meme: ["Wojak", "Chad"],
}

// Auto-tag coins to themes based on famous names
export function autoTagFamousCoins(coins: EnrichedCoin[]): void {
  coins.forEach((coin) => {
    const symbol = coin.symbol.toLowerCase()
    const name = coin.name.toLowerCase()

    // Check each theme's keywords
    for (const [themeId, keywords] of Object.entries(FAMOUS_COINS_BY_THEME)) {
      const matches = keywords.some(
        (keyword) =>
          symbol.includes(keyword.toLowerCase()) ||
          name.includes(keyword.toLowerCase())
      )

      if (matches) {
        console.log(`[ThemeCoins] Tagged ${coin.symbol} to theme: ${themeId}`)
        addCoinToTheme(themeId, coin.mint)
      }
    }
  })
}

// Get top coins for a theme (sorted by MCap)
export function getTopCoinsForTheme(
  coins: EnrichedCoin[],
  themeId: string
): EnrichedCoin[] {
  const keywords = FAMOUS_COINS_BY_THEME[themeId] || []

  return coins
    .filter((coin) => {
      const symbol = coin.symbol.toLowerCase()
      const name = coin.name.toLowerCase()
      return keywords.some(
        (keyword) =>
          symbol.includes(keyword.toLowerCase()) ||
          name.includes(keyword.toLowerCase())
      )
    })
    .sort((a, b) => b.marketCapUsd - a.marketCapUsd)
    .slice(0, 5) // Top 5 per theme
}
