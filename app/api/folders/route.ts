import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { folders } from '@/shared/schema'
import { eq, and, desc } from 'drizzle-orm'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const createFolderSchema = z.object({
  name: z.string().min(1).max(100),
  icon: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userFolders = await db
      .select()
      .from(folders)
      .where(eq(folders.userId, user.id))
      .orderBy(desc(folders.type), desc(folders.createdAt))

    return NextResponse.json({ folders: userFolders })
  } catch (error) {
    console.error('[Folders API] Error fetching folders:', error)
    return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 })
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
    const validation = createFolderSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { name, icon } = validation.data

    const existingFolder = await db
      .select()
      .from(folders)
      .where(and(eq(folders.userId, user.id), eq(folders.name, name)))
      .limit(1)

    if (existingFolder.length > 0) {
      return NextResponse.json({ error: 'Folder with this name already exists' }, { status: 409 })
    }

    const [newFolder] = await db
      .insert(folders)
      .values({
        userId: user.id,
        name,
        icon: icon || '📁',
        type: 'custom',
      })
      .returning()

    return NextResponse.json({ folder: newFolder }, { status: 201 })
  } catch (error) {
    console.error('[Folders API] Error creating folder:', error)
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 })
  }
}
