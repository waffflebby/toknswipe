import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { swipes } from '@/shared/schema'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { coinMint, direction } = body

    if (!coinMint || !direction) {
      return NextResponse.json(
        { error: 'Missing required fields: coinMint, direction' },
        { status: 400 }
      )
    }

    if (direction !== 'left' && direction !== 'right') {
      return NextResponse.json(
        { error: 'Invalid direction. Must be "left" or "right"' },
        { status: 400 }
      )
    }

    const [newSwipe] = await db
      .insert(swipes)
      .values({
        userId: user.id,
        coinMint,
        direction,
      })
      .returning()

    return NextResponse.json({ swipe: newSwipe }, { status: 201 })
  } catch (error) {
    console.error('Error recording swipe:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
