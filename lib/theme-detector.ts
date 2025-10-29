import type { EnrichedCoin } from "./types"

// Meme coin theme definitions
export const MEME_THEMES = {
  ai: {
    id: "ai",
    name: "AI & Tech",
    emoji: "🤖",
    keywords: ["ai", "artificial", "intelligence", "robot", "bot", "neural", "machine", "gpt", "chatgpt", "openai", "tech", "cyber", "digital", "meta", "quantum"],
    color: "bg-blue-100 text-blue-700 border-blue-300"
  },
  gaming: {
    id: "gaming",
    name: "Gaming",
    emoji: "🎮",
    keywords: ["game", "gaming", "play", "gamer", "esport", "arcade", "console", "xbox", "playstation", "nintendo", "steam", "fps", "rpg", "mmo", "pixel", "quest"],
    color: "bg-purple-100 text-purple-700 border-purple-300"
  },
  dog: {
    id: "dog",
    name: "Dog Coins",
    emoji: "🐕",
    keywords: ["dog", "doge", "shib", "inu", "puppy", "pup", "corgi", "husky", "retriever", "hound", "woof", "bark", "floki", "doggo", "bonk", "wif", "howl", "fetch", "shiba", "army"],
    color: "bg-yellow-100 text-yellow-700 border-yellow-300"
  },
  cat: {
    id: "cat",
    name: "Cat Coins",
    emoji: "🐱",
    keywords: ["cat", "kitten", "kitty", "meow", "feline", "neko", "tabby", "persian", "siamese", "grumpy", "garfield", "popcat", "mog", "mew", "toshi", "pop", "simon", "base", "nub", "michi", "mini", "bongo", "nyan", "happy", "giko", "hehe", "wyac", "oiiaoiia", "glorp", "bingus", "gary", "long", "gak", "elgato", "catwifhat", "catdog", "catmew"],
    color: "bg-pink-100 text-pink-700 border-pink-300"
  },
  pepe: {
    id: "pepe",
    name: "Pepe & Frogs",
    emoji: "🐸",
    keywords: ["pepe", "frog", "kek", "apu", "feels", "ribbit", "toad", "amphibian", "lilpepe", "pepenode", "unchained", "node", "deflation"],
    color: "bg-green-100 text-green-700 border-green-300"
  },
  elon: {
    id: "elon",
    name: "Elon & Space",
    emoji: "🚀",
    keywords: ["elon", "musk", "tesla", "spacex", "mars", "rocket", "moon", "x"],
    color: "bg-gray-100 text-gray-700 border-gray-300"
  },
  trump: {
    id: "trump",
    name: "Trump",
    emoji: "🇺🇸",
    keywords: ["trump", "donald", "maga", "president", "wlfi", "melania", "election", "liberty", "policy"],
    color: "bg-red-100 text-red-700 border-red-300"
  },
  defi: {
    id: "defi",
    name: "DeFi",
    emoji: "💰",
    keywords: ["defi", "finance", "swap", "stake", "yield", "farm", "liquidity", "dex", "protocol", "lending", "vault"],
    color: "bg-emerald-100 text-emerald-700 border-emerald-300"
  },
  nft: {
    id: "nft",
    name: "NFT & Art",
    emoji: "🖼️",
    keywords: ["nft", "art", "collectible", "rare", "unique", "mint", "gallery", "drop", "metaverse", "ape", "flow", "blur", "pengu", "collect", "bayc", "pudgy", "azuki"],
    color: "bg-indigo-100 text-indigo-700 border-indigo-300"
  },
  sport: {
    id: "sport",
    name: "Sports",
    emoji: "⚽",
    keywords: ["sport", "football", "soccer", "basketball", "baseball", "tennis", "racing", "athlete", "team", "champion", "chiliz", "sore", "sweat", "fan", "token", "fitness", "icon"],
    color: "bg-orange-100 text-orange-700 border-orange-300"
  },
  food: {
    id: "food",
    name: "Food & Drink",
    emoji: "🍕",
    keywords: ["food", "pizza", "burger", "sushi", "taco", "beer", "wine", "coffee", "tea", "cake", "cookie", "banana", "apple", "eat", "snack", "meal"],
    color: "bg-red-100 text-red-700 border-red-300"
  },
  anime: {
    id: "anime",
    name: "Anime",
    emoji: "🎌",
    keywords: ["anime", "manga", "otaku", "waifu", "kawaii", "naruto", "pokemon", "goku", "japan", "ninja", "samurai", "chan", "kun", "senpai", "wen", "ghibli", "web3"],
    color: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300"
  },
  meme: {
    id: "meme",
    name: "Meme Coins",
    emoji: "😂",
    keywords: ["meme", "based", "chad", "sigma", "gigachad", "dank", "lol", "lmao", "kek", "rekt", "lambo", "wen", "spx", "bome", "brett", "turbo", "fart", "fartcoin", "viral", "hype", "rug", "maxi"],
    color: "bg-cyan-100 text-cyan-700 border-cyan-300"
  },
  wojak: {
    id: "wojak",
    name: "Wojak",
    emoji: "😐",
    keywords: ["wojak", "feels", "doomer", "boomer", "zoomer", "npc", "rfc", "guy", "retard", "finder"],
    color: "bg-slate-100 text-slate-700 border-slate-300"
  },
  diamond: {
    id: "diamond",
    name: "Diamond Hands",
    emoji: "💎",
    keywords: ["diamond", "hodl", "gem", "jewel", "crystal", "treasure"],
    color: "bg-teal-100 text-teal-700 border-teal-300"
  },
  fire: {
    id: "fire",
    name: "Fire",
    emoji: "🔥",
    keywords: ["fire", "hot", "burn", "flame", "blaze", "inferno", "matr1x"],
    color: "bg-rose-100 text-rose-700 border-rose-300"
  },
  king: {
    id: "king",
    name: "Royalty",
    emoji: "👑",
    keywords: ["king", "queen", "royal", "emperor", "crown", "throne", "monarch"],
    color: "bg-amber-100 text-amber-700 border-amber-300"
  },
} as const

export type ThemeId = keyof typeof MEME_THEMES

// Detect themes from coin data
export function detectThemes(coin: EnrichedCoin): ThemeId[] {
  const name = coin.name || ""
  const symbol = coin.symbol || ""
  const description = coin.description || ""
  const searchText = `${name} ${symbol} ${description}`.toLowerCase()
  
  if (!searchText.trim()) {
    return []
  }

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
