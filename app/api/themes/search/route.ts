import { NextRequest, NextResponse } from 'next/server'
import { MEME_THEMES, type ThemeId, detectThemes } from '@/lib/theme-detector'

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

    const apiKey = process.env.MORALIS_API_KEY
    if (!apiKey) {
      console.error('[Theme Search] MORALIS_API_KEY not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
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
      return NextResponse.json(
        { error: 'Failed to fetch coins' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const coins = data?.tokens || data || []

    const filteredCoins = coins.filter((coin: any) => {
      const enrichedCoin = {
        name: coin.name || '',
        symbol: coin.symbol || '',
        description: coin.description || '',
      }
      const themes = detectThemes(enrichedCoin)
      return themes.includes(theme)
    })

    return NextResponse.json({
      success: true,
      theme,
      coins: filteredCoins,
      count: filteredCoins.length,
    })
  } catch (error) {
    console.error('[Theme Search] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
