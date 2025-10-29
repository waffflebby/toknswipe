import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { folders } from '@/shared/schema'
import { eq, and } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'

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

    const folderId = params.id

    const [folder] = await db
      .select()
      .from(folders)
      .where(and(eq(folders.id, folderId), eq(folders.userId, user.id)))
      .limit(1)

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
    }

    if (folder.type === 'system') {
      return NextResponse.json({ error: 'Cannot delete system folders' }, { status: 403 })
    }

    await db.delete(folders).where(eq(folders.id, folderId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Folders API] Error deleting folder:', error)
    return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 })
  }
}
