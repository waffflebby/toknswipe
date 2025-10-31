export interface PumpFunCoin {
  mint: string
  name: string
  symbol: string
  description: string
  image_uri: string
  metadata_uri: string
  twitter?: string
  telegram?: string
  bonding_curve: string
  associated_bonding_curve: string
  creator: string
  created_timestamp: number
  raydium_pool?: string
  complete: boolean
  virtual_sol_reserves: number
  virtual_token_reserves: number
  total_supply: number
  website?: string
  show_name: boolean
  king_of_the_hill_timestamp?: number
  market_cap: number
  reply_count: number
  last_reply: number
  nsfw: boolean
  market_id?: string
  inverted?: boolean
  usd_market_cap: number
}

export interface DexScreenerPair {
  chainId: string
  dexId: string
  url: string
  pairAddress: string
  baseToken: {
    address: string
    name: string
    symbol: string
  }
  quoteToken: {
    address: string
    name: string
    symbol: string
  }
  priceNative: string
  priceUsd: string
  txns: {
    m5: { buys: number; sells: number }
    h1: { buys: number; sells: number }
    h6: { buys: number; sells: number }
    h24: { buys: number; sells: number }
  }
  volume: {
    h24: number
    h6: number
    h1: number
    m5: number
  }
  priceChange: {
    m5: number
    h1: number
    h6: number
    h24: number
  }
  liquidity: {
    usd: number
    base: number
    quote: number
  }
  fdv: number
  marketCap: number
  pairCreatedAt: number
}

export interface EnrichedCoin {
  id: string
  mint: string
  name: string
  symbol: string
  price: string
  priceUsd: number
  change24h: string
  change24hNum?: number
  marketCap: string
  marketCapUsd: number
  description: string
  image: string
  creator: string
  createdAt: Date
  age: string
  liquidity: string
  volume24h: string
  topHolderWeight?: number
  holders?: number
  website?: string
  twitter?: string
  telegram?: string
  isVerified: boolean
  riskLevel: "low" | "medium" | "high"
  theme?: CoinTheme
  themes?: string[] // Auto-detected theme IDs (e.g., ["cat", "meme", "ai"])
  launchpad?: "pumpfun" | "meteora" | "raydium" | "jupiter" | "bonk"
}

export interface JackpotReward {
  type: "airdrop" | "nft" | "bonus_tokens" | "premium_trial" | "super_swipe"
  title: string
  description: string
  value: string
  rarity: "common" | "rare" | "legendary"
}

export interface UserStats {
  totalSwipes: number
  streak: number
  longestStreak: number
  matchRate: number
  badges: Badge[]
  level: number
  xp: number
  reputation: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: Date
}

export interface LeaderboardEntry {
  userId: string
  username: string
  avatar: string
  swipes: number
  matches: number
  winRate: number
  reputation: number
  rank: number
}

export interface CoinTheme {
  id: string
  name: string
  emoji: string
  description: string
  keywords: string[]
  trendingCoin?: EnrichedCoin
}

export const COIN_THEMES: CoinTheme[] = [
  {
    id: "dogs",
    name: "Dogs",
    emoji: "🐕",
    description: "Dog-themed meme coins",
    keywords: ["dog", "doge", "shib", "inu", "floki", "bonk", "samo", "puppy", "woof"],
  },
  {
    id: "cats",
    name: "Cats",
    emoji: "🐱",
    description: "Cat-themed meme coins",
    keywords: ["cat", "kitty", "meow", "popcat", "mew", "neko"],
  },
  {
    id: "frogs",
    name: "Frogs",
    emoji: "🐸",
    description: "Frog-themed meme coins",
    keywords: ["pepe", "frog", "ribbit", "kermit"],
  },
  {
    id: "political",
    name: "Political",
    emoji: "🗳️",
    description: "Political and election-themed tokens",
    keywords: ["trump", "maga", "biden", "election", "vote"],
  },
  {
    id: "ai",
    name: "AI",
    emoji: "🤖",
    description: "AI and machine learning tokens",
    keywords: ["ai", "grok", "neural", "bot", "llm", "artificial", "intelligence"],
  },
  {
    id: "celebrity",
    name: "Celebrity",
    emoji: "⭐",
    description: "Celebrity and influencer tokens",
    keywords: ["elon", "musk", "celeb", "star", "vip"],
  },
]
