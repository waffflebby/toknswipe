import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { folders, folderCoins } from '@/shared/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const addCoinSchema = z.object({
  coinMint: z.string().min(1),
  coinData: z.any(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const folderId = params.id

    const [folder] = await db
      .select()
      .from(folders)
      .where(and(eq(folders.id, folderId), eq(folders.userId, user.id)))
      .limit(1)

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    }

    const coins = await db
      .select()
      .from(folderCoins)
      .where(eq(folderCoins.folderId, folderId))
      .orderBy(folderCoins.addedAt)

    return NextResponse.json({ coins: coins.map(c => c.coinData) })
  } catch (error) {
    console.error('[Folder Coins API] Error fetching coins:', error)
    return NextResponse.json({ error: 'Failed to fetch coins' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validation = addCoinSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { coinMint, coinData } = validation.data
    const folderId = params.id

    const [folder] = await db
      .select()
      .from(folders)
      .where(and(eq(folders.id, folderId), eq(folders.userId, user.id)))
      .limit(1)

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    }

    const existing = await db
      .select()
      .from(folderCoins)
      .where(and(eq(folderCoins.folderId, folderId), eq(folderCoins.coinMint, coinMint)))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Coin already in folder' }, { status: 409 })
    }

    const [newCoin] = await db
      .insert(folderCoins)
      .values({
        folderId,
        coinMint,
        coinData,
      })
      .returning()

    return NextResponse.json({ coin: newCoin }, { status: 201 })
  } catch (error) {
    console.error('[Folder Coins API] Error adding coin:', error)
    return NextResponse.json({ error: 'Failed to add coin' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const coinMint = searchParams.get('coinMint')

    if (!coinMint) {
      return NextResponse.json({ error: 'coinMint query parameter required' }, { status: 400 })
    }

    const folderId = params.id

    const [folder] = await db
      .select()
      .from(folders)
      .where(and(eq(folders.id, folderId), eq(folders.userId, user.id)))
      .limit(1)

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    }

    await db
      .delete(folderCoins)
      .where(and(eq(folderCoins.folderId, folderId), eq(folderCoins.coinMint, coinMint)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Folder Coins API] Error removing coin:', error)
    return NextResponse.json({ error: 'Failed to remove coin' }, { status: 500 })
  }
}
