import { getPersonalList, getWatchlist } from "./storage"

const MIGRATION_KEY = "coinswipe_migration_completed"

export function hasMigrated(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(MIGRATION_KEY) === "true"
}

export function markMigrated(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(MIGRATION_KEY, "true")
}

export async function migrateLocalStorageToDatabase(): Promise<{
  success: boolean
  favoritesAdded: number
  matchesAdded: number
  message?: string
}> {
  if (hasMigrated()) {
    return {
      success: true,
      favoritesAdded: 0,
      matchesAdded: 0,
      message: "Migration already completed"
    }
  }

  const favoritesData = getPersonalList()
  const matchesData = getWatchlist()

  if (favoritesData.length === 0 && matchesData.length === 0) {
    markMigrated()
    return {
      success: true,
      favoritesAdded: 0,
      matchesAdded: 0,
      message: "No data to migrate"
    }
  }

  try {
    const response = await fetch('/api/migrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        favoritesData,
        matchesData
      })
    })

    if (!response.ok) {
      throw new Error('Migration failed')
    }

    const result = await response.json()
    markMigrated()
    
    return result
  } catch (error) {
    console.error('Error migrating localStorage to database:', error)
    return {
      success: false,
      favoritesAdded: 0,
      matchesAdded: 0,
      message: 'Migration failed'
    }
  }
}
