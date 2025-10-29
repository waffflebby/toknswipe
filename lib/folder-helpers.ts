import { db } from '@/lib/db'
import { folders } from '@/shared/schema'
import { eq, and } from 'drizzle-orm'

export async function ensureSystemFolders(userId: string) {
  try {
    const existingFolders = await db
      .select()
      .from(folders)
      .where(and(eq(folders.userId, userId), eq(folders.type, 'system')))

    const hasPersonal = existingFolders.some(f => f.name === 'Personal')
    const hasMatched = existingFolders.some(f => f.name === 'Matched')

    const foldersToCreate = []

    if (!hasPersonal) {
      foldersToCreate.push({
        userId,
        name: 'Personal',
        type: 'system' as const,
        icon: '⭐',
      })
    }

    if (!hasMatched) {
      foldersToCreate.push({
        userId,
        name: 'Matched',
        type: 'system' as const,
        icon: '💚',
      })
    }

    if (foldersToCreate.length > 0) {
      await db.insert(folders).values(foldersToCreate)
    }

    const allSystemFolders = await db
      .select()
      .from(folders)
      .where(and(eq(folders.userId, userId), eq(folders.type, 'system')))

    return {
      personal: allSystemFolders.find(f => f.name === 'Personal'),
      matched: allSystemFolders.find(f => f.name === 'Matched'),
    }
  } catch (error) {
    console.error('[Folder Helpers] Error ensuring system folders:', error)
    throw error
  }
}

export async function getPersonalFolder(userId: string) {
  const [folder] = await db
    .select()
    .from(folders)
    .where(and(eq(folders.userId, userId), eq(folders.name, 'Personal')))
    .limit(1)

  if (!folder) {
    const systemFolders = await ensureSystemFolders(userId)
    return systemFolders.personal
  }

  return folder
}

export async function getMatchedFolder(userId: string) {
  const [folder] = await db
    .select()
    .from(folders)
    .where(and(eq(folders.userId, userId), eq(folders.name, 'Matched')))
    .limit(1)

  if (!folder) {
    const systemFolders = await ensureSystemFolders(userId)
    return systemFolders.matched
  }

  return folder
}
