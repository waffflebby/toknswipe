import { NextRequest, NextResponse } from 'next/server'
import { detectThemes, type ThemeId } from '@/lib/theme-detector'
import { db } from '@/lib/db'
import { coinThemes } from '@/shared/schema'
import { eq, and } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

const tagThemeSchema = z.object({
  coinMint: z.string().min(1, 'coinMint is required'),
  coinData: z.object({
    name: z.string(),
    symbol: z.string(),
  }).passthrough(),
})

export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await checkRateLimit(request, 'mutations')
    if ('status' in rateLimitResult) {
      return rateLimitResult
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    
    const validationResult = tagThemeSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { coinMint, coinData } = validationResult.data

    const detectedThemes = detectThemes(coinData)

    if (user && detectedThemes.length > 0) {
      for (const theme of detectedThemes) {
        const existing = await db
          .select()
          .from(coinThemes)
          .where(
            and(
              eq(coinThemes.coinMint, coinMint),
              eq(coinThemes.theme, theme)
            )
          )
          .limit(1)

        if (existing.length === 0) {
          await db.insert(coinThemes).values({
            coinMint,
            theme,
            matchedKeywords: [],
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      themes: detectedThemes,
    })
  } catch (error) {
    console.error('Error tagging themes:', error)
    return NextResponse.json(
      { error: 'Failed to tag themes' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const coinMint = searchParams.get('coinMint')

    if (!coinMint) {
      return NextResponse.json(
        { error: 'Missing coinMint parameter' },
        { status: 400 }
      )
    }

    const themes = await db
      .select()
      .from(coinThemes)
      .where(eq(coinThemes.coinMint, coinMint))

    return NextResponse.json({
      success: true,
      themes: themes.map((t) => t.theme as ThemeId),
    })
  } catch (error) {
    console.error('Error fetching themes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch themes' },
      { status: 500 }
    )
  }
}
