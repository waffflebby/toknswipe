import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { folders, folderCoins } from '@/shared/schema'
import { eq, and } from 'drizzle-orm'
import { checkRateLimit } from '@/lib/rate-limit'
import { z } from 'zod'
import { getPersonalFolder } from '@/lib/folder-helpers'

const addFavoriteSchema = z.object({
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

    const personalFolder = await getPersonalFolder(user.id)
    
    if (!personalFolder) {
      return NextResponse.json({ favorites: [] })
    }

    const coins = await db
      .select()
      .from(folderCoins)
      .where(eq(folderCoins.folderId, personalFolder.id))
      .orderBy(folderCoins.addedAt)

    return NextResponse.json({ favorites: coins })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
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
    
    // Validate request body
    const validationResult = addFavoriteSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { coinMint, coinData } = validationResult.data

    const personalFolder = await getPersonalFolder(user.id)
    
    if (!personalFolder) {
      return NextResponse.json({ error: 'Personal folder not found' }, { status: 500 })
    }

    const existing = await db
      .select()
      .from(folderCoins)
      .where(and(eq(folderCoins.folderId, personalFolder.id), eq(folderCoins.coinMint, coinMint)))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Coin already in favorites' },
        { status: 409 }
      )
    }

    const [newFavorite] = await db
      .insert(folderCoins)
      .values({
        folderId: personalFolder.id,
        coinMint,
        coinData,
      })
      .returning()

    return NextResponse.json({ favorite: newFavorite }, { status: 201 })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check rate limit
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

    const personalFolder = await getPersonalFolder(user.id)
    
    if (!personalFolder) {
      return NextResponse.json({ error: 'Personal folder not found' }, { status: 500 })
    }

    const deleted = await db
      .delete(folderCoins)
      .where(and(eq(folderCoins.folderId, personalFolder.id), eq(folderCoins.coinMint, coinMint)))
      .returning()

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting favorite:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
