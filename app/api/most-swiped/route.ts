import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { swipes } from '@/shared/schema'
import { sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const days = parseInt(searchParams.get('days') || '7')

    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - days)

    const mostSwipedCoins = await db
      .select({
        coinMint: swipes.coinMint,
        swipeCount: sql<number>`count(*)`.as('swipe_count'),
        rightSwipes: sql<number>`sum(case when ${swipes.direction} = 'right' then 1 else 0 end)`.as('right_swipes'),
        leftSwipes: sql<number>`sum(case when ${swipes.direction} = 'left' then 1 else 0 end)`.as('left_swipes'),
      })
      .from(swipes)
      .where(sql`${swipes.createdAt} >= ${daysAgo}`)
      .groupBy(swipes.coinMint)
      .orderBy(sql`count(*) desc`)
      .limit(limit)

    return NextResponse.json({ 
      coins: mostSwipedCoins,
      period: `${days} days`,
      total: mostSwipedCoins.length
    })
  } catch (error) {
    console.error('Error fetching most swiped coins:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
