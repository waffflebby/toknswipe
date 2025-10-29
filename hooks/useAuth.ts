"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { migrateLocalStorageToDatabase } from "@/lib/migrate-storage"

export function useAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = createClient()
  const hasSynced = useRef(false)

  // Sync user profile to database
  const syncProfile = async () => {
    try {
      const response = await fetch('/api/profile/sync', {
        method: 'POST',
      })
      
      if (!response.ok) {
        console.error('Profile sync failed:', await response.text())
      }
    } catch (error) {
      console.error('Profile sync error:', error)
    }
  }

  // Migrate localStorage data to database
  const migrateData = async () => {
    try {
      const result = await migrateLocalStorageToDatabase()
      if (result.success && (result.favoritesAdded > 0 || result.matchesAdded > 0)) {
        console.log(`✅ Migration complete: ${result.favoritesAdded} favorites, ${result.matchesAdded} matches`)
      }
    } catch (error) {
      console.error('Migration error:', error)
    }
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsAuthenticated(!!session?.user)
      setIsLoading(false)
      
      // Sync profile on initial load if authenticated
      if (session?.user && !hasSynced.current) {
        syncProfile().then(() => migrateData())
        hasSynced.current = true
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsAuthenticated(!!session?.user)
      setIsLoading(false)
      
      // Sync profile when user signs in
      if (session?.user && !hasSynced.current) {
        syncProfile().then(() => migrateData())
        hasSynced.current = true
      } else if (!session?.user) {
        // Reset sync flag on logout
        hasSynced.current = false
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, isLoading, isAuthenticated }
}
