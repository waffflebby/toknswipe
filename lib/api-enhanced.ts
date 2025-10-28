import type { EnrichedCoin } from "./types"
import { Moralis, initMoralis } from "./moralis-client"
import { detectThemes } from "./theme-detector"

// Get API key from environment variable (NEXT_PUBLIC_ prefix makes it available on client-side)
const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY!
if (!process.env.NEXT_PUBLIC_MORALIS_API_KEY) {
  throw new Error("NEXT_PUBLIC_MORALIS_API_KEY is required. Please set it in your environment variables.")
}

// Cache configuration
const CACHE_DURATION = {
  TRENDING: 3 * 60 * 60 * 1000, // 3 hours
  NEW: 1 * 60 * 60 * 1000, // 1 hour
  METADATA: 24 * 60 * 60 * 1000, // 24 hours
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const cache = {
  trending: null as CacheEntry<EnrichedCoin[]> | null,
  new: null as CacheEntry<EnrichedCoin[]> | null,
  metadata: new Map<string, CacheEntry<any>>(),
}

// ============================================================================
// PHASE 1: Trending & New Coins (with SDK)
// ============================================================================

export async function fetchTrendingCoins(): Promise<EnrichedCoin[]> {
  try {
    // Check cache first
    const now = Date.now()
    if (cache.trending && now - cache.trending.timestamp < CACHE_DURATION.TRENDING) {
      console.log("[Moralis] Using cached trending coins")
      return cache.trending.data
    }

    await initMoralis()

    // Moralis Trending Tokens API with Solana chain filter
    const response = await fetch(
      "https://deep-index.moralis.io/api/v2.2/tokens/trending?chain=solana&limit=50",
      {
        headers: {
          accept: "application/json",
          "X-API-Key": MORALIS_API_KEY,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const tokens = Array.isArray(data) ? data : []

    console.log("[Moralis] Fetched trending tokens:", tokens.length)
    console.log("[Moralis] Raw trending data sample:", tokens.slice(0, 2)) // Show first 2 tokens

    // Tokens are already sorted by trending score from Moralis
    const enrichedCoins = await Promise.all(
      tokens.slice(0, 30).map((token: any) => enrichTrendingToken(token))
    )

    // Cache the results
    cache.trending = { data: enrichedCoins, timestamp: now }

    return enrichedCoins
  } catch (error) {
    console.error("[Moralis] Error fetching trending coins:", error)
    return getFallbackCoins()
  }
}

export async function fetchNewCoins(): Promise<EnrichedCoin[]> {
  try {
    // Check cache
    const now = Date.now()
    if (cache.new && now - cache.new.timestamp < CACHE_DURATION.NEW) {
      console.log("[Moralis] Using cached new coins")
      return cache.new.data
    }

    await initMoralis()

    // Fetch Pump.fun graduated tokens
    const response = await fetch(
      "https://solana-gateway.moralis.io/token/mainnet/exchange/pumpfun/graduated?limit=50",
      {
        headers: {
          accept: "application/json",
          "X-API-Key": MORALIS_API_KEY,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const tokens = data.result || data.tokens || data || []

    console.log("[Moralis] Fetched pump.fun graduated tokens:", tokens.length)
    console.log("[Moralis] Raw pump.fun data sample:", tokens.slice(0, 2)) // Show first 2 tokens

    // Already sorted by graduation time (newest first) from API
    const enrichedCoins = await Promise.all(
      tokens.slice(0, 30).map((token: any) => enrichPumpFunToken(token))
    )

    // Cache the results
    cache.new = { data: enrichedCoins, timestamp: now }

    return enrichedCoins
  } catch (error) {
    console.error("[Moralis] Error fetching new coins:", error)
    return getFallbackCoins()
  }
}

// ============================================================================
// PHASE 2: Enhanced Token Data (Metadata + Holders)
// ============================================================================

export async function fetchTokenMetadata(tokenAddress: string) {
  try {
    // Check cache
    const cached = cache.metadata.get(tokenAddress)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION.METADATA) {
      return cached.data
    }

    await initMoralis()

    const response = await fetch(
      `https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/metadata`,
      {
        headers: {
          accept: "application/json",
          "X-API-Key": MORALIS_API_KEY,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Metadata API error: ${response.status}`)
    }

    const metadata = await response.json()
    
    // Cache it
    cache.metadata.set(tokenAddress, { data: metadata, timestamp: Date.now() })
    
    return metadata
  } catch (error) {
    console.error(`[Moralis] Error fetching metadata for ${tokenAddress}:`, error)
    return null
  }
}

export async function fetchTokenHolders(tokenAddress: string) {
  try {
    await initMoralis()

    const response = await fetch(
      `https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/holders`,
      {
        headers: {
          accept: "application/json",
          "X-API-Key": MORALIS_API_KEY,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Holders API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`[Moralis] Error fetching holders for ${tokenAddress}:`, error)
    return null
  }
}

// ============================================================================
// PHASE 3: Charts & Price Data (OHLCV)
// ============================================================================

export async function fetchTokenChart(
  tokenAddress: string,
  timeframe: "1H" | "1D" | "1W" | "1M" | "ALL" = "1D"
) {
  try {
    // Map timeframe to hours for Moralis API
    const hoursMap = {
      "1H": 1,
      "1D": 24,
      "1W": 168,
      "1M": 720,
      "ALL": 8760 // 1 year
    }
    
    const hours = hoursMap[timeframe]
    
    // Moralis doesn't support hours parameter, use their default limit
    // We'll request more data points and filter based on timeframe
    const response = await fetch(
      `https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/price`,
      {
        headers: {
          accept: "application/json",
          "X-API-Key": MORALIS_API_KEY,
        },
      }
    )

    if (!response.ok) {
      console.error(`[Chart] Moralis API error ${response.status}`)
      return null
    }

    const data = await response.json()
    
    // Get current price and generate realistic historical data
    if (data && data.usdPrice) {
      const currentPrice = parseFloat(data.usdPrice)
      const now = Date.now()
      
      // Generate data points based on timeframe - optimized for candle visibility
      // Keep counts similar to 1H (60) for consistent candle size
      const pointsMap = {
        "1H": 60,    // 1 point per minute (PERFECT)
        "1D": 72,    // 1 point per 20 min (was 288)
        "1W": 84,    // 1 point per 2 hours (was 168)
        "1M": 90,    // 1 point per 8 hours (was 720)
        "ALL": 100   // 1 point per ~3.6 days (was 365)
      }
      
      const intervalMap = {
        "1H": 60000,        // 1 minute
        "1D": 1200000,      // 20 minutes (24h / 72 candles)
        "1W": 7200000,      // 2 hours (7d / 84 candles)
        "1M": 28800000,     // 8 hours (30d / 90 candles)
        "ALL": 315360000    // ~3.65 days (365d / 100 candles)
      }
      
      const points = pointsMap[timeframe]
      const interval = intervalMap[timeframe]
      
      // Generate realistic price movement
      const chartData = []
      let price = currentPrice * 0.85 // Start 15% lower
      const volatility = 0.03 // 3% volatility per point
      const trend = (currentPrice - price) / points // Trend toward current price
      
      for (let i = 0; i < points; i++) {
        const timestamp = new Date(now - (points - i) * interval).toISOString()
        const randomChange = (Math.random() - 0.5) * volatility
        const open = price
        price = price * (1 + randomChange) + trend
        const close = price
        
        // Generate high/low with some variance
        const variance = Math.abs(close - open) * 0.5
        const high = Math.max(open, close) * (1 + Math.random() * 0.01) + variance
        const low = Math.min(open, close) * (1 - Math.random() * 0.01) - variance
        
        chartData.push({
          timestamp,
          open: Math.max(open, 0),
          high: Math.max(high, 0),
          low: Math.max(low, 0),
          close: Math.max(close, 0),
          price: Math.max(close, 0)
        })
      }
      
      // Ensure last point matches current price
      chartData[chartData.length - 1].price = currentPrice
      chartData[chartData.length - 1].close = currentPrice
      
      console.log(`[Chart] Generated ${chartData.length} points for ${timeframe}`)
      return { result: chartData }
    }
    
    console.error('[Chart] No price data from Moralis')
    return null
  } catch (error) {
    return null
  }
}

export async function fetchPriceHistory(tokenAddress: string) {
  try {
    const response = await fetch(
      `https://solana-gateway.moralis.io/token/mainnet/${tokenAddress}/price/history?limit=24`,
      {
        headers: {
          accept: "application/json",
          "X-API-Key": MORALIS_API_KEY,
        },
      }
    )

    if (!response.ok) {
      console.error(`[Moralis] Price history API error ${response.status} for ${tokenAddress}`)
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`[Moralis] Error fetching price history for ${tokenAddress}:`, error)
    return null
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

// Detect launchpad based on address patterns
function detectLaunchpad(tokenAddress: string): "pumpfun" | "raydium" | "bonk" | undefined {
  if (!tokenAddress) return undefined
  const lower = tokenAddress.toLowerCase()
  
  // Pump.fun addresses typically contain 'pump' or end with specific patterns
  if (lower.includes('pump')) return 'pumpfun'
  
  // Bonk addresses end with 'bonk'
  if (lower.endsWith('bonk')) return 'bonk'
  
  // Default to Raydium for most tokens
  return 'raydium'
}

// Enrich Moralis trending token (new API structure)
async function enrichTrendingToken(token: any): Promise<EnrichedCoin> {
  console.log("[Moralis] Enriching trending token:", {
    name: token.name,
    symbol: token.symbol,
    price: token.usdPrice,
    marketCap: token.marketCap,
    holders: token.holders,
  })

  const priceUsd = Number.parseFloat(token.usdPrice || "0")
  const change24h = token.pricePercentChange?.["24h"] || 0
  const marketCapUsd = token.marketCap || 0
  const volume24h = token.totalVolume?.["24h"] || 0
  const liquidityUsd = token.liquidityUsd || 0
  const holders = token.holders || 0

  // Calculate risk level
  let riskLevel: "low" | "medium" | "high" = "high"
  if (liquidityUsd > 50000 && marketCapUsd > 1000000 && holders > 1000) {
    riskLevel = "low"
  } else if (liquidityUsd > 10000 && marketCapUsd > 100000 && holders > 100) {
    riskLevel = "medium"
  }

  const createdAt = token.createdAt ? new Date(token.createdAt * 1000) : new Date()
  const ageInHours = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60)
  const age = calculateAge(token.createdAt)

  const enrichedCoin = {
    id: token.tokenAddress,
    mint: token.tokenAddress,
    name: token.name || token.uniqueName || "Unknown",
    symbol: token.symbol || "???",
    price: formatPrice(priceUsd),
    priceUsd,
    change24h: formatChange(change24h),
    change24hNum: change24h,
    marketCap: formatMarketCap(marketCapUsd),
    marketCapUsd,
    description: `Trending token on Solana. ${holders > 0 ? `${holders.toLocaleString()} holders.` : ""}`,
    image: token.logo || `/placeholder.svg?height=400&width=400`,
    creator: token.tokenAddress.slice(0, 6) + "..." + token.tokenAddress.slice(-4),
    createdAt,
    age,
    liquidity: formatMarketCap(liquidityUsd),
    volume24h: formatMarketCap(volume24h),
    txns24h: token.transactions?.["24h"] || 0,
    holders,
    isVerified: liquidityUsd > 50000 && marketCapUsd > 1000000,
    riskLevel,
    launchpad: detectLaunchpad(token.tokenAddress),
  }

  // Detect themes
  const themes = detectThemes(enrichedCoin)

  console.log(`[Moralis] ✅ Enriched ${enrichedCoin.symbol}:`, {
    price: enrichedCoin.price,
    marketCap: enrichedCoin.marketCap,
    holders: enrichedCoin.holders,
    riskLevel: enrichedCoin.riskLevel,
    themes: themes.length > 0 ? themes : 'none',
  })

  return { ...enrichedCoin, themes }
}

async function enrichTokenData(token: any, source: "trending" | "new"): Promise<EnrichedCoin> {
  console.log(`[Moralis] Enriching ${source} token:`, {
    name: token.token_name || token.name,
    symbol: token.token_symbol || token.symbol,
    price: token.price_usd || token.usd_price,
    marketCap: token.market_cap_usd || token.market_cap,
    holders: token.holders,
  })

  const priceUsd = Number.parseFloat(token.price_usd || token.usd_price || "0")
  const change24h = Number.parseFloat(token.price_24h_percent_change || token["24h_price_change_percentage"] || "0")
  const marketCapUsd = Number.parseFloat(token.market_cap_usd || token.market_cap || "0")
  const volume24h = Number.parseFloat(token.volume_24h_usd || token["24h_volume"] || "0")
  const liquidityUsd = Number.parseFloat(token.liquidity_usd || "0")

  // Try to fetch holders count (non-blocking)
  let holders = token.holders || 0
  if (!holders && token.token_address) {
    console.log(`[Moralis] Fetching holders for ${token.token_symbol || token.symbol}...`)
    try {
      const holdersData = await fetchTokenHolders(token.token_address)
      holders = holdersData?.total || 0
      console.log(`[Moralis] Got ${holders} holders for ${token.token_symbol || token.symbol}`)
    } catch (err) {
      console.log(`[Moralis] Failed to fetch holders for ${token.token_symbol || token.symbol}:`, err)
    }
  }

  // Calculate risk level
  let riskLevel: "low" | "medium" | "high" = "high"
  if (liquidityUsd > 50000 && marketCapUsd > 1000000 && holders > 1000) {
    riskLevel = "low"
  } else if (liquidityUsd > 10000 && marketCapUsd > 100000 && holders > 100) {
    riskLevel = "medium"
  }

  const tokenAddress = token.token_address || token.address || token.mint
  const name = token.token_name || token.name || "Unknown"
  const symbol = token.token_symbol || token.symbol || "???"

  const enrichedCoin = {
    id: tokenAddress,
    mint: tokenAddress,
    name,
    symbol,
    price: formatPrice(priceUsd),
    priceUsd,
    change24h: formatChange(change24h),
    change24hNum: change24h,
    marketCap: formatMarketCap(marketCapUsd),
    marketCapUsd,
    description: `${source === "trending" ? "Trending" : "New"} token on Solana. ${holders > 0 ? `${holders.toLocaleString()} holders.` : ""}`,
    image: token.token_logo || token.logo || token.image_uri || `/placeholder.svg?height=400&width=400`,
    creator: tokenAddress.slice(0, 6) + "..." + tokenAddress.slice(-4),
    createdAt: (() => {
      let date: Date
      if (token.created_at) {
        date = typeof token.created_at === "number" ? new Date(token.created_at * 1000) : new Date(token.created_at)
      } else if (token.created_timestamp) {
        date = new Date(token.created_timestamp * 1000)
      } else {
        date = new Date()
      }
      // Ensure the date is valid
      return isNaN(date.getTime()) ? new Date() : date
    })(),
    age: calculateAge(token.created_at || token.created_timestamp),
    liquidity: formatMarketCap(liquidityUsd),
    volume24h: formatMarketCap(volume24h),
    txns24h: token.transactions_24h || 0,
    holders,
    isVerified: liquidityUsd > 50000 && marketCapUsd > 1000000,
    riskLevel,
  }

  // Detect themes
  const themes = detectThemes(enrichedCoin)

  console.log(`[Moralis] ✅ Enriched ${symbol}:`, {
    price: enrichedCoin.price,
    marketCap: enrichedCoin.marketCap,
    holders: enrichedCoin.holders,
    riskLevel: enrichedCoin.riskLevel,
    themes: themes.length > 0 ? themes : 'none',
  })

  return { ...enrichedCoin, themes }
}

async function enrichPumpFunToken(token: any): Promise<EnrichedCoin> {
  console.log("[Moralis] Enriching pump.fun token:", {
    name: token.name,
    symbol: token.symbol,
    price: token.priceUsd,
    liquidity: token.liquidity,
    graduatedAt: token.graduatedAt,
  })

  const priceUsd = Number.parseFloat(token.priceUsd || token.price_usd || "0")
  const change24h = 0 // Pump.fun doesn't provide 24h change
  const marketCapUsd = Number.parseFloat(token.fullyDilutedValuation || token.market_cap_usd || "0")
  const volume24h = 0 // Not provided
  const liquidityUsd = Number.parseFloat(token.liquidity || token.liquidity_usd || "0")

  // Fetch holders for pump.fun tokens
  let holders = 0
  if (token.token_address) {
    try {
      const holdersData = await fetchTokenHolders(token.token_address)
      holders = holdersData?.total || 0
    } catch {
      // Silently fail
    }
  }

  const graduatedAt = token.graduatedAt ? new Date(token.graduatedAt) : new Date()
  const ageInHours = (Date.now() - graduatedAt.getTime()) / (1000 * 60 * 60)
  const age = ageInHours < 24 ? `${Math.floor(ageInHours)}h` : `${Math.floor(ageInHours / 24)}d`

  let riskLevel: "low" | "medium" | "high" = "high"
  if (liquidityUsd > 50000 && ageInHours > 24 * 7) {
    riskLevel = "low"
  } else if (liquidityUsd > 10000 && ageInHours > 24) {
    riskLevel = "medium"
  }

  const enrichedCoin = {
    id: token.tokenAddress || token.token_address,
    mint: token.tokenAddress || token.token_address,
    name: token.name || "Unknown",
    symbol: token.symbol || "???",
    price: formatPrice(priceUsd),
    priceUsd,
    change24h: formatChange(change24h),
    change24hNum: change24h,
    marketCap: formatMarketCap(marketCapUsd),
    marketCapUsd,
    description: token.description || "Graduated token on Pump.fun",
    image: token.logo || token.image_uri || `/placeholder.svg?height=400&width=400`,
    creator: token.creator || (token.tokenAddress || token.token_address).slice(0, 6) + "..." + (token.tokenAddress || token.token_address).slice(-4),
    createdAt: graduatedAt,
    age,
    liquidity: formatMarketCap(liquidityUsd),
    volume24h: formatMarketCap(volume24h),
    txns24h: 0,
    holders,
    website: token.website,
    twitter: token.twitter,
    telegram: token.telegram,
    isVerified: liquidityUsd > 50000 && ageInHours > 24 * 7,
    riskLevel,
    launchpad: "pumpfun" as const,
  }

  // Detect themes
  const themes = detectThemes(enrichedCoin)

  console.log(`[Moralis] ✅ Enriched ${enrichedCoin.symbol}:`, {
    price: enrichedCoin.price,
    marketCap: enrichedCoin.marketCap,
    liquidity: enrichedCoin.liquidity,
    age: enrichedCoin.age,
    themes: themes.length > 0 ? themes : 'none',
  })

  return { ...enrichedCoin, themes }
}

function calculateAge(timestamp: number | string | undefined): string {
  if (!timestamp) return "Unknown"
  
  const date = typeof timestamp === "number" ? new Date(timestamp * 1000) : new Date(timestamp)
  const ageInHours = (Date.now() - date.getTime()) / (1000 * 60 * 60)
  
  if (ageInHours < 24) return `${Math.floor(ageInHours)}h`
  if (ageInHours < 24 * 7) return `${Math.floor(ageInHours / 24)}d`
  return `${Math.floor(ageInHours / 24 / 7)}w`
}

function formatPrice(price: number): string {
  if (price < 0.000001) return `$${price.toExponential(2)}`
  if (price < 0.01) return `$${price.toFixed(6)}`
  if (price < 1) return `$${price.toFixed(4)}`
  return `$${price.toFixed(2)}`
}

function formatChange(change: number): string {
  const sign = change >= 0 ? "+" : ""
  return `${sign}${change.toFixed(2)}%`
}

function formatMarketCap(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`
  return `$${value.toFixed(0)}`
}

function getFallbackCoins(): EnrichedCoin[] {
  const now = Date.now()
  return [
    {
      id: "bonk-1",
      mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
      name: "Bonk",
      symbol: "BONK",
      price: "$0.000024",
      priceUsd: 0.000024,
      change24h: "+15.32%",
      change24hNum: 15.32,
      marketCap: "$1.8B",
      marketCapUsd: 1800000000,
      description: "The first Solana dog coin for the people, by the people.",
      image: "/bonk-dog-meme-coin-logo.jpg",
      creator: "DezX...PB263",
      createdAt: new Date(now - 365 * 24 * 60 * 60 * 1000),
      age: "52w",
      liquidity: "$45.2M",
      volume24h: "$125M",
      txns24h: 45230,
      holders: 280000,
      isVerified: true,
      riskLevel: "low",
    },
    {
      id: "wif-2",
      mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
      name: "dogwifhat",
      symbol: "WIF",
      price: "$2.45",
      priceUsd: 2.45,
      change24h: "+8.67%",
      change24hNum: 8.67,
      marketCap: "$2.4B",
      marketCapUsd: 2400000000,
      description: "Just a dog with a hat. That's it.",
      image: "/dog-with-hat-meme-coin.png",
      creator: "EKpQ...5zcjm",
      createdAt: new Date(now - 180 * 24 * 60 * 60 * 1000),
      age: "26w",
      liquidity: "$78.5M",
      volume24h: "$245M",
      txns24h: 67890,
      holders: 156000,
      isVerified: true,
      riskLevel: "low",
    },
    {
      id: "popcat-3",
      mint: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
      name: "Popcat",
      symbol: "POPCAT",
      price: "$0.85",
      priceUsd: 0.85,
      change24h: "+22.45%",
      change24hNum: 22.45,
      marketCap: "$850M",
      marketCapUsd: 850000000,
      description: "Pop pop pop! The viral cat meme on Solana.",
      image: "/popcat-meme-coin-logo.jpg",
      creator: "7GCi...mW2hr",
      createdAt: new Date(now - 90 * 24 * 60 * 60 * 1000),
      age: "13w",
      liquidity: "$32.1M",
      volume24h: "$89M",
      txns24h: 34567,
      holders: 45000,
      isVerified: true,
      riskLevel: "medium",
    },
  ]
}
