import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { matches } from '@/shared/schema'
import { eq, and } from 'drizzle-orm'
import { checkRateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

const addMatchSchema = z.object({
  coinMint: z.string().min(1, 'coinMint is required'),
  coinData: z.object({
    name: z.string(),
    symbol: z.string(),
    mint: z.string(),
  }).passthrough(),
})

export async function GET(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResult = await checkRateLimit(request, 'reads')
    if ('status' in rateLimitResult) {
      return rateLimitResult
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userMatches = await db
      .select()
      .from(matches)
      .where(eq(matches.userId, user.id))
      .orderBy(matches.createdAt)

    return NextResponse.json({ matches: userMatches })
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await checkRateLimit(request, 'mutations')
    if ('status' in rateLimitResult) {
      return rateLimitResult
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const validationResult = addMatchSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { coinMint, coinData } = validationResult.data

    const existingMatches = await db
      .select()
      .from(matches)
      .where(and(eq(matches.userId, user.id), eq(matches.coinMint, coinMint)))
      .limit(1)

    if (existingMatches.length > 0) {
      return NextResponse.json(
        { error: 'Coin already in matches' },
        { status: 409 }
      )
    }

    const [newMatch] = await db
      .insert(matches)
      .values({
        userId: user.id,
        coinMint,
        coinData,
      })
      .returning()

    return NextResponse.json({ match: newMatch }, { status: 201 })
  } catch (error) {
    console.error('Error adding match:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const rateLimitResult = await checkRateLimit(request, 'mutations')
    if ('status' in rateLimitResult) {
      return rateLimitResult
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const coinMint = searchParams.get('coinMint')

    if (!coinMint) {
      return NextResponse.json(
        { error: 'Missing coinMint parameter' },
        { status: 400 }
      )
    }

    const deleted = await db
      .delete(matches)
      .where(and(eq(matches.userId, user.id), eq(matches.coinMint, coinMint)))
      .returning()

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting match:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
