import type { EnrichedCoin } from "./types"

// Meme coin theme definitions
export const MEME_THEMES = {
  cat: {
    id: "cat",
    name: "Cat",
    emoji: "🐱",
    keywords: ["cat", "kitty", "meow", "feline", "neko", "kitten", "pussy"],
  },
  dog: {
    id: "dog",
    name: "Dog",
    emoji: "🐶",
    keywords: ["dog", "doge", "shib", "puppy", "woof", "inu", "hound", "pup"],
  },
  frog: {
    id: "frog",
    name: "Frog",
    emoji: "🐸",
    keywords: ["frog", "pepe", "kek", "ribbit", "toad", "amphibian"],
  },
  ai: {
    id: "ai",
    name: "AI",
    emoji: "🤖",
    keywords: ["ai", "gpt", "bot", "neural", "machine", "artificial", "intelligence", "robot"],
  },
  moon: {
    id: "moon",
    name: "Moon",
    emoji: "🚀",
    keywords: ["moon", "mars", "rocket", "space", "astronaut", "galaxy", "stellar", "launch"],
  },
  diamond: {
    id: "diamond",
    name: "Diamond",
    emoji: "💎",
    keywords: ["diamond", "hodl", "gem", "jewel", "crystal", "treasure"],
  },
  fire: {
    id: "fire",
    name: "Fire",
    emoji: "🔥",
    keywords: ["fire", "hot", "burn", "flame", "blaze", "inferno"],
  },
  king: {
    id: "king",
    name: "King",
    emoji: "👑",
    keywords: ["king", "queen", "royal", "emperor", "crown", "throne", "monarch"],
  },
  gaming: {
    id: "gaming",
    name: "Gaming",
    emoji: "🎮",
    keywords: ["game", "play", "quest", "pixel", "arcade", "gamer", "esport"],
  },
  food: {
    id: "food",
    name: "Food",
    emoji: "🍕",
    keywords: ["pizza", "burger", "taco", "sushi", "food", "eat", "snack", "meal"],
  },
  meme: {
    id: "meme",
    name: "Meme",
    emoji: "😂",
    keywords: ["meme", "lol", "kek", "wojak", "chad", "based", "dank"],
  },
  elon: {
    id: "elon",
    name: "Elon",
    emoji: "🚗",
    keywords: ["elon", "musk", "tesla", "spacex", "mars"],
  },
  trump: {
    id: "trump",
    name: "Trump",
    emoji: "🇺🇸",
    keywords: ["trump", "donald", "maga", "president"],
  },
  anime: {
    id: "anime",
    name: "Anime",
    emoji: "🎌",
    keywords: ["anime", "manga", "waifu", "otaku", "chan", "kun", "senpai"],
  },
  wojak: {
    id: "wojak",
    name: "Wojak",
    emoji: "😐",
    keywords: ["wojak", "feels", "doomer", "boomer", "zoomer"],
  },
} as const

export type ThemeId = keyof typeof MEME_THEMES

// Detect themes from coin data
export function detectThemes(coin: EnrichedCoin): ThemeId[] {
  const searchText = `${coin.name} ${coin.symbol} ${coin.description || ""}`.toLowerCase()
  const detectedThemes: ThemeId[] = []

  for (const [themeId, theme] of Object.entries(MEME_THEMES)) {
    const hasKeyword = theme.keywords.some((keyword) => searchText.includes(keyword.toLowerCase()))
    if (hasKeyword) {
      detectedThemes.push(themeId as ThemeId)
    }
  }

  return detectedThemes
}

// Get theme by ID
export function getTheme(themeId: ThemeId) {
  return MEME_THEMES[themeId]
}

// Get all themes as array
export function getAllThemes() {
  return Object.values(MEME_THEMES)
}

// Search coins by theme
export function filterCoinsByTheme(coins: EnrichedCoin[], themeId: ThemeId): EnrichedCoin[] {
  return coins.filter((coin) => coin.themes?.includes(themeId))
}

// Search coins by text (name, symbol, or theme)
export function searchCoins(coins: EnrichedCoin[], query: string): EnrichedCoin[] {
  if (!query || query.trim().length === 0) return coins

  const searchQuery = query.toLowerCase().trim()

  return coins.filter((coin) => {
    // Search in name
    if (coin.name.toLowerCase().includes(searchQuery)) return true

    // Search in symbol
    if (coin.symbol.toLowerCase().includes(searchQuery)) return true

    // Search in themes
    if (coin.themes?.some((themeId) => {
      const theme = MEME_THEMES[themeId as ThemeId]
      return theme?.name.toLowerCase().includes(searchQuery)
    })) return true

    return false
  })
}
