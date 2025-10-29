import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { swipes } from '@/shared/schema'
import { checkRateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

const addSwipeSchema = z.object({
  coinMint: z.string().min(1, 'coinMint is required'),
  direction: z.enum(['left', 'right'], {
    errorMap: () => ({ message: 'direction must be "left" or "right"' }),
  }),
})

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
    
    const validationResult = addSwipeSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { coinMint, direction } = validationResult.data

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
