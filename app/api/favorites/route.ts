import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { favorites } from '@/shared/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userFavorites = await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, user.id))
      .orderBy(favorites.createdAt)

    return NextResponse.json({ favorites: userFavorites })
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
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { coinMint, coinData } = body

    if (!coinMint || !coinData) {
      return NextResponse.json(
        { error: 'Missing required fields: coinMint, coinData' },
        { status: 400 }
      )
    }

    const existingFavorites = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, user.id), eq(favorites.coinMint, coinMint)))
      .limit(1)

    if (existingFavorites.length > 0) {
      return NextResponse.json(
        { error: 'Coin already in favorites' },
        { status: 409 }
      )
    }

    const [newFavorite] = await db
      .insert(favorites)
      .values({
        userId: user.id,
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
      .delete(favorites)
      .where(and(eq(favorites.userId, user.id), eq(favorites.coinMint, coinMint)))
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
