import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { favorites, matches } from '@/shared/schema'
import { eq, and } from 'drizzle-orm'
import type { EnrichedCoin } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { favoritesData = [], matchesData = [] } = body

    let favoritesAdded = 0
    let matchesAdded = 0

    for (const coin of favoritesData as EnrichedCoin[]) {
      try {
        const existing = await db
          .select()
          .from(favorites)
          .where(and(eq(favorites.userId, user.id), eq(favorites.coinMint, coin.id)))
          .limit(1)

        if (existing.length === 0) {
          await db.insert(favorites).values({
            userId: user.id,
            coinMint: coin.id,
            coinData: coin,
          })
          favoritesAdded++
        }
      } catch (error) {
        console.error('Error migrating favorite:', coin.id, error)
      }
    }

    for (const coin of matchesData as EnrichedCoin[]) {
      try {
        const existing = await db
          .select()
          .from(matches)
          .where(and(eq(matches.userId, user.id), eq(matches.coinMint, coin.id)))
          .limit(1)

        if (existing.length === 0) {
          await db.insert(matches).values({
            userId: user.id,
            coinMint: coin.id,
            coinData: coin,
          })
          matchesAdded++
        }
      } catch (error) {
        console.error('Error migrating match:', coin.id, error)
      }
    }

    return NextResponse.json({
      success: true,
      favoritesAdded,
      matchesAdded,
      message: `Migrated ${favoritesAdded} favorites and ${matchesAdded} matches to database`
    })
  } catch (error) {
    console.error('Error during migration:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
