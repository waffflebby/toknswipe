import type { EnrichedCoin, Badge } from "./types"

const WATCHLIST_KEY = "coinswipe_watchlist"
const PERSONAL_KEY = "coinswipe_personal"
const BADGES_KEY = "coinswipe_badges"
const SWIPE_PROGRESS_KEY = "coinswipe_swipe_progress"
const TOTAL_SWIPES_KEY = "coinswipe_total_swipes"
const USER_JOIN_DATE_KEY = "coinswipe_join_date"
const PRO_STATUS_KEY = "coinswipe_pro_status"
const PRO_SINCE_KEY = "coinswipe_pro_since"

export function getWatchlist(): EnrichedCoin[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(WATCHLIST_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading watchlist:", error)
    return []
  }
}

export function addToWatchlist(coin: EnrichedCoin): void {
  if (typeof window === "undefined") return

  try {
    const watchlist = getWatchlist()

    // Check if coin already exists
    const exists = watchlist.some((c) => c.id === coin.id)
    if (exists) return

    // Add coin to beginning of array
    const updated = [coin, ...watchlist]
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error("Error adding to watchlist:", error)
  }
}

export function removeFromWatchlist(coinId: string): void {
  if (typeof window === "undefined") return

  try {
    const watchlist = getWatchlist()
    const updated = watchlist.filter((c) => c.id !== coinId)
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error("Error removing from watchlist:", error)
  }
}

export function isInWatchlist(coinId: string): boolean {
  const watchlist = getWatchlist()
  return watchlist.some((c) => c.id === coinId)
}

export function getPersonalList(): EnrichedCoin[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(PERSONAL_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading personal list:", error)
    return []
  }
}

export function addToPersonalList(coin: EnrichedCoin): void {
  if (typeof window === "undefined") return

  try {
    const personalList = getPersonalList()

    // Check if coin already exists
    const exists = personalList.some((c) => c.id === coin.id)
    if (exists) return

    // Add coin to beginning of array
    const updated = [coin, ...personalList]
    localStorage.setItem(PERSONAL_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error("Error adding to personal list:", error)
  }
}

export function removeFromPersonalList(coinId: string): void {
  if (typeof window === "undefined") return

  try {
    const personalList = getPersonalList()
    const updated = personalList.filter((c) => c.id !== coinId)
    localStorage.setItem(PERSONAL_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error("Error removing from personal list:", error)
  }
}

export function isInPersonalList(coinId: string): boolean {
  const personalList = getPersonalList()
  return personalList.some((c) => c.id === coinId)
}

export function getBadges(): Badge[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(BADGES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading badges:", error)
    return []
  }
}

export function unlockBadge(badge: Badge): void {
  if (typeof window === "undefined") return

  try {
    const badges = getBadges()
    const exists = badges.some((b) => b.id === badge.id)
    if (exists) return

    const badgeWithDate = { ...badge, unlockedAt: new Date() }
    const updated = [...badges, badgeWithDate]
    localStorage.setItem(BADGES_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error("Error unlocking badge:", error)
  }
}

export function hasBadge(badgeId: string): boolean {
  const badges = getBadges()
  return badges.some((b) => b.id === badgeId)
}

export function getTotalSwipes(): number {
  if (typeof window === "undefined") return 0

  try {
    const stored = localStorage.getItem(TOTAL_SWIPES_KEY)
    return stored ? Number.parseInt(stored, 10) : 0
  } catch (error) {
    console.error("Error loading total swipes:", error)
    return 0
  }
}

export function incrementTotalSwipes(): number {
  if (typeof window === "undefined") return 0

  try {
    const current = getTotalSwipes()
    const updated = current + 1
    localStorage.setItem(TOTAL_SWIPES_KEY, updated.toString())
    return updated
  } catch (error) {
    console.error("Error incrementing swipes:", error)
    return 0
  }
}

export function getSwipeProgress(): number {
  if (typeof window === "undefined") return 0

  try {
    const stored = localStorage.getItem(SWIPE_PROGRESS_KEY)
    return stored ? Number.parseInt(stored, 10) : 0
  } catch (error) {
    console.error("Error loading swipe progress:", error)
    return 0
  }
}

export function incrementSwipeProgress(): number {
  if (typeof window === "undefined") return 0

  try {
    const current = getSwipeProgress()
    const updated = current + 1
    localStorage.setItem(SWIPE_PROGRESS_KEY, updated.toString())
    return updated
  } catch (error) {
    console.error("Error incrementing swipe progress:", error)
    return 0
  }
}

export function resetSwipeProgress(): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(SWIPE_PROGRESS_KEY, "0")
  } catch (error) {
    console.error("Error resetting swipe progress:", error)
  }
}

export function getUserJoinDate(): Date | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(USER_JOIN_DATE_KEY)
    if (!stored) {
      // First time user - set join date
      const now = new Date()
      localStorage.setItem(USER_JOIN_DATE_KEY, now.toISOString())
      return now
    }
    return new Date(stored)
  } catch (error) {
    console.error("Error loading join date:", error)
    return null
  }
}

export function checkAndUnlockBadges(): void {
  const totalSwipes = getTotalSwipes()

  // Check for Degen Badge (10,000+ swipes)
  if (totalSwipes >= 10000 && !hasBadge("degen")) {
    unlockBadge({
      id: "degen",
      name: "Degen Badge",
      description: "10,000+ swipes completed",
      icon: "🔥",
    })
  }

  // Check for Early Bird Badge (first 10,000 users - simplified check)
  const joinDate = getUserJoinDate()
  if (joinDate && !hasBadge("early-bird")) {
    unlockBadge({
      id: "early-bird",
      name: "Early Bird Badge",
      description: "First 10,000 users",
      icon: "🌟",
    })
  }

  // Check for OG Swiper Badge (downloaded in first month - simplified check)
  if (joinDate && !hasBadge("og-swiper")) {
    const monthsSinceJoin = (Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    if (monthsSinceJoin <= 1) {
      unlockBadge({
        id: "og-swiper",
        name: "OG Swiper Badge",
        description: "Downloaded in first month",
        icon: "💎",
      })
    }
  }

  if (getProStatus() && !hasBadge("pro")) {
    unlockBadge({
      id: "pro",
      name: "PRO Member",
      description: "Premium subscriber",
      icon: "👑",
    })
  }
}

export function getProStatus(): boolean {
  if (typeof window === "undefined") return false

  try {
    const stored = localStorage.getItem(PRO_STATUS_KEY)
    return stored === "true"
  } catch (error) {
    console.error("Error loading PRO status:", error)
    return false
  }
}

export function setProStatus(isPro: boolean): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(PRO_STATUS_KEY, isPro.toString())
    if (isPro && !localStorage.getItem(PRO_SINCE_KEY)) {
      localStorage.setItem(PRO_SINCE_KEY, new Date().toISOString())
    }
    checkAndUnlockBadges()
  } catch (error) {
    console.error("Error setting PRO status:", error)
  }
}

export function getProSinceDate(): Date | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(PRO_SINCE_KEY)
    return stored ? new Date(stored) : null
  } catch (error) {
    console.error("Error loading PRO since date:", error)
    return null
  }
}
