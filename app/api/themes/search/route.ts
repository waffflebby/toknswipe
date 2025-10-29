import { NextRequest, NextResponse } from 'next/server'
import { MEME_THEMES, type ThemeId, detectThemes } from '@/lib/theme-detector'
import { FAMOUS_COINS_BY_THEME } from '@/lib/famous-coins'
import { cache } from '@/lib/redis'

const THEME_SEARCH_CACHE_TTL = 10 * 60 // 10 minutes

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const theme = searchParams.get('theme') as ThemeId | null

    if (!theme || !MEME_THEMES[theme]) {
      return NextResponse.json(
        { error: 'Invalid or missing theme parameter' },
        { status: 400 }
      )
    }

    // Check cache first
    const cacheKey = `theme_search:${theme}`
    const cached = await cache.get<any>(cacheKey)
    if (cached) {
      console.log(`[Theme Search] Cache hit for ${theme}`)
      return NextResponse.json({
        success: true,
        theme,
        coins: cached,
        count: cached.length,
        source: 'cache',
      })
    }

    const apiKey = process.env.MORALIS_API_KEY
    if (!apiKey) {
      console.error('[Theme Search] MORALIS_API_KEY not configured')
      // Fallback to famous coins if API key missing
      const famousCoins = FAMOUS_COINS_BY_THEME[theme as keyof typeof FAMOUS_COINS_BY_THEME] || []
      return NextResponse.json({
        success: true,
        theme,
        coins: famousCoins,
        count: famousCoins.length,
        source: 'fallback',
      })
    }

    const response = await fetch(
      `https://solana-gateway.moralis.io/token/mainnet/trending`,
      {
        headers: {
          'Accept': 'application/json',
          'X-API-Key': apiKey,
        },
      }
    )

    if (!response.ok) {
      console.error('[Theme Search] Moralis API error:', response.status)
      // Fallback to famous coins on API error
      const famousCoins = FAMOUS_COINS_BY_THEME[theme as keyof typeof FAMOUS_COINS_BY_THEME] || []
      return NextResponse.json({
        success: true,
        theme,
        coins: famousCoins,
        count: famousCoins.length,
        source: 'fallback',
      })
    }

    const data = await response.json()
    const coins = data?.tokens || data || []

    // Filter trending coins by theme
    const filteredCoins = coins.filter((coin: any) => {
      const enrichedCoin = {
        name: coin.name || '',
        symbol: coin.symbol || '',
        description: coin.description || '',
      } as any
      const themes = detectThemes(enrichedCoin)
      return themes.includes(theme)
    })

    console.log(`[Theme Search] Found ${filteredCoins.length} coins for theme: ${theme}`)

    // If no trending coins found, use famous placeholder coins
    let finalCoins = filteredCoins
    if (filteredCoins.length === 0) {
      const famousCoins = FAMOUS_COINS_BY_THEME[theme as keyof typeof FAMOUS_COINS_BY_THEME] || []
      console.log(`[Theme Search] Using ${famousCoins.length} famous coins as fallback for theme: ${theme}`)
      finalCoins = famousCoins
    }

    // Cache the result
    await cache.set(cacheKey, finalCoins, THEME_SEARCH_CACHE_TTL)

    return NextResponse.json({
      success: true,
      theme,
      coins: finalCoins,
      count: finalCoins.length,
      source: filteredCoins.length > 0 ? 'moralis' : 'fallback',
    })
  } catch (error) {
    console.error('[Theme Search] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
