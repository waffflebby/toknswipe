// Combine famous coins + trending coins for theme swiping
import type { EnrichedCoin } from "./types"
import { FAMOUS_COINS_BY_THEME } from "./theme-coins"

export type ThemeFeedType = "famous" | "trending" | "all"

export function getThemeFeed(
  themeId: string,
  trendingCoins: EnrichedCoin[],
  feedType: ThemeFeedType = "all"
): EnrichedCoin[] {
  const keywords = FAMOUS_COINS_BY_THEME[themeId] || []

  // Famous coins - filter by keywords
  const famousCoins = trendingCoins.filter((coin) => {
    const symbol = coin.symbol.toLowerCase()
    const name = coin.name.toLowerCase()
    return keywords.some(
      (keyword) =>
        symbol.includes(keyword.toLowerCase()) ||
        name.includes(keyword.toLowerCase())
    )
  })

  // Trending coins - filter by theme keywords from coin.themes
  const trendingForTheme = trendingCoins.filter((coin) =>
    coin.themes?.includes(themeId as any)
  )

  // Combine based on feed type
  let result: EnrichedCoin[] = []

  if (feedType === "famous") {
    result = famousCoins
  } else if (feedType === "trending") {
    result = trendingForTheme
  } else {
    // "all" - combine and deduplicate
    const combined = [...famousCoins, ...trendingForTheme]
    const seen = new Set<string>()
    result = combined.filter((coin) => {
      if (seen.has(coin.mint)) return false
      seen.add(coin.mint)
      return true
    })
  }

  // Sort by MCap descending
  return result.sort((a, b) => b.marketCapUsd - a.marketCapUsd)
}

// Get user's preferred feed type from localStorage
export function getThemeFeedPreference(): ThemeFeedType {
  if (typeof window === "undefined") return "all"
  const pref = localStorage.getItem("theme_feed_preference")
  return (pref as ThemeFeedType) || "all"
}

// Save user's feed type preference
export function setThemeFeedPreference(feedType: ThemeFeedType): void {
  if (typeof window === "undefined") return
  localStorage.setItem("theme_feed_preference", feedType)
}
