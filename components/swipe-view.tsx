"use client"

import { useState, useEffect } from "react"
import { SwipeCard } from "@/components/swipe-card"
import { CoinDetailModal } from "@/components/coin-detail-modal"
import { CoinInsightsSheet } from "@/components/coin-insights-sheet"
import { AdvancedFilterModal } from "@/components/advanced-filter-modal"
import { JackpotModal } from "@/components/jackpot-modal"
import { Button } from "@/components/ui/button"
import { X, Heart, RefreshCw, SlidersHorizontal, Bookmark, Zap, Dog, Cat, Bug, Bot, Vote } from "lucide-react"
import { cn } from "@/lib/utils"
import { PaywallModal } from "@/components/paywall-modal"
import { fetchTrendingCoinsFromAPI, fetchNewCoinsFromAPI } from "@/lib/api-client"
import { getThemeFeed } from "@/lib/theme-feed"
import { getCoinCache } from "@/lib/coin-cache"
import type { EnrichedCoin, JackpotReward } from "@/lib/types"
import { BuyButton } from "@/components/buy-button" // Import BuyButton component
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { COIN_THEMES } from "@/lib/types"
import { ActivityBanner } from "@/components/activity-banner"
import { WatchlistSheet } from "@/components/watchlist-sheet"
import { ProfileSheet } from "@/components/profile-sheet"
import { RewardModal } from "@/components/reward-modal"
import { SearchBar } from "@/components/search-bar"
import { LoginButton } from "@/components/login-button"
import {
  addToWatchlist,
  incrementTotalSwipes,
  incrementSwipeProgress,
  resetSwipeProgress,
  checkAndUnlockBadges,
} from "@/lib/storage"

const JACKPOT_REWARDS: JackpotReward[] = [
  {
    type: "airdrop",
    title: "Token Airdrop",
    description: "Exclusive early access airdrop",
    value: "500 USDC",
    rarity: "legendary",
  },
  {
    type: "nft",
    title: "Rare NFT Drop",
    description: "Limited edition meme coin NFT",
    value: "1 NFT",
    rarity: "rare",
  },
  {
    type: "bonus_tokens",
    title: "Bonus Tokens",
    description: "Extra tokens for your next match",
    value: "100 Tokens",
    rarity: "common",
  },
  {
    type: "premium_trial",
    title: "Premium Trial",
    description: "7 days of premium features",
    value: "7 Days Free",
    rarity: "rare",
  },
  {
    type: "super_swipe",
    title: "Super Swipes",
    description: "Priority swipes on hot coins",
    value: "10 Super Swipes",
    rarity: "common",
  },
]

export function SwipeView() {
  const [coins, setCoins] = useState<EnrichedCoin[]>([])
  const [allCoins, setAllCoins] = useState<EnrichedCoin[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [swipeHistory, setSwipeHistory] = useState<Array<{ coinId: string; direction: "left" | "right" }>>([])
  const [isSwipeAnimating, setIsSwipeAnimating] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [swipeCount, setSwipeCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCoin, setSelectedCoin] = useState<EnrichedCoin | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showInsightsSheet, setShowInsightsSheet] = useState(false)
  const [insightsViewMode, setInsightsViewMode] = useState<"full" | "devMetrics">("full")
  const [feedType, setFeedType] = useState<"trending" | "new" | "themed" | "most-swiped">("trending") // Updated feed type to support the four main types: trending, new, themed, and most-swiped
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)

  const [streak, setStreak] = useState(5)
  const [showJackpot, setShowJackpot] = useState(false)
  const [currentReward, setCurrentReward] = useState<JackpotReward | null>(null)
  const [dailySwipes, setDailySwipes] = useState(0)
  const [showRewardModal, setShowRewardModal] = useState(false)

  const maxFreeSwipes = 25
  const [theme, setTheme] = useState<"light" | "dark" | "neon">("light")

  const [swipeEffect, setSwipeEffect] = useState<"like" | "dislike" | null>(null)
  const [isScrolling, setIsScrolling] = useState(false) // Added state to track scrolling
  const [showWatchlist, setShowWatchlist] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  // Filter and sorting
  const [sortBy, setSortBy] = useState<"mcap" | "volume" | "holders" | "age">("mcap")
  const [showSortMenu, setShowSortMenu] = useState(false)

  // Sort coins by selected filter
  const sortCoins = (coinsToSort: EnrichedCoin[]) => {
    const sorted = [...coinsToSort]
    switch (sortBy) {
      case "mcap":
        return sorted.sort((a, b) => b.marketCapUsd - a.marketCapUsd)
      case "volume":
        return sorted.sort((a, b) => {
          const volA = parseFloat(a.volume24h.replace(/[$,]/g, "")) || 0
          const volB = parseFloat(b.volume24h.replace(/[$,]/g, "")) || 0
          return volB - volA
        })
      case "holders":
        return sorted.sort((a, b) => b.holders - a.holders)
      case "age":
        return sorted.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt as any).getTime()
          const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt as any).getTime()
          return dateA - dateB
        })
      default:
        return sorted
    }
  }

  // Poll for trending coins every 2 hours
  useEffect(() => {
    loadCoins()
  }, [feedType, selectedTheme])

  const loadCoins = async () => {
    setIsLoading(true)
    let fetchedCoins: EnrichedCoin[] = []

    // Fetch from API routes (server-side cached)
    if (feedType === "trending") {
      fetchedCoins = await fetchTrendingCoinsFromAPI()
    } else if (feedType === "new") {
      fetchedCoins = await fetchNewCoinsFromAPI()
    } else if (feedType === "themed" && selectedTheme) {
      const allCoins = await fetchTrendingCoinsFromAPI()
      fetchedCoins = getThemeFeed(selectedTheme, allCoins, "all")
    }

    // Apply sorting
    const sortedCoins = sortCoins(fetchedCoins)

    console.log("[SwipeView] Loaded coins:", sortedCoins.length, "for feed:", feedType, "theme:", selectedTheme, "sort:", sortBy)
    setCoins(sortedCoins)
    setAllCoins(sortedCoins)
    setCurrentIndex(0)
    setIsLoading(false)
  }

  const checkForJackpot = () => {
    const jackpotChance = 0.05
    if (Math.random() < jackpotChance) {
      const reward = JACKPOT_REWARDS[Math.floor(Math.random() * JACKPOT_REWARDS.length)]
      setCurrentReward(reward)
      setShowJackpot(true)
    }
  }

  const handleSwipe = (direction: "left" | "right") => {
    if (isSwipeAnimating || coins.length === 0) return

    if (swipeCount >= maxFreeSwipes) {
      setShowPaywall(true)
      return
    }

    setIsSwipeAnimating(true)
    const currentCoin = coins[currentIndex]

    setSwipeHistory((prev) => [...prev, { coinId: currentCoin.id, direction }])
    setSwipeCount((prev) => prev + 1)
    setDailySwipes((prev) => prev + 1)

    const newTotalSwipes = incrementTotalSwipes()
    const newProgress = incrementSwipeProgress()

    if (newProgress >= 100) {
      resetSwipeProgress()
      setShowRewardModal(true)
    }

    checkAndUnlockBadges()

    if (direction === "right") {
      setSwipeEffect("like")
      addToWatchlist(currentCoin)
      checkForJackpot()
    } else {
      setSwipeEffect("dislike")
    }

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % coins.length)
      setIsSwipeAnimating(false)
      setSwipeEffect(null)
    }, 600)
  }

  const handleUndo = () => {
    if (swipeHistory.length === 0 || isSwipeAnimating) return

    setSwipeHistory((prev) => prev.slice(0, -1))
    setSwipeCount((prev) => Math.max(0, prev - 1))
    setDailySwipes((prev) => Math.max(0, prev - 1))
    setCurrentIndex((prev) => (prev - 1 + coins.length) % coins.length)
  }

  const handleCardTap = () => {
    if (coins.length > 0) {
      setSelectedCoin(coins[currentIndex])
      setShowDetailModal(true)
    }
  }

  const handleQuickBuy = () => {
    if (coins.length > 0) {
      const currentCoin = coins[currentIndex]
      window.open(`https://jup.ag/swap/SOL-${currentCoin.mint}`, "_blank")
    }
  }

  const handleImageTap = () => {
    if (coins.length > 0) {
      setSelectedCoin(coins[currentIndex])
      setInsightsViewMode("full")
      setShowInsightsSheet(true)
    }
  }

  const handleDevMetricsTap = () => {
    if (coins.length > 0) {
      setSelectedCoin(coins[currentIndex])
      setInsightsViewMode("devMetrics")
      setShowInsightsSheet(true)
    }
  }

  const handleDoubleTap = () => {
    handleSwipe("right")
  }

  const handleScrollChange = (scrolling: boolean) => {
    setIsScrolling(scrolling)
  }

  const handleClaimReward = () => {
    console.log("[v0] Claiming reward - integrate with wallet here")
    // TODO: Integrate with wallet to send tokens
  }

  const currentCoin = coins[currentIndex]
  const canUndo = swipeHistory.length > 0
  const remainingSwipes = maxFreeSwipes - swipeCount


  if (coins.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold">No coins available</p>
          <p className="text-xs text-muted-foreground">Check your internet connection</p>
          <Button onClick={loadCoins} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-50/50 dark:bg-black">
      <header className="bg-white/80 dark:bg-black backdrop-blur-sm border-b border-gray-200/50 dark:border-neutral-800 px-4 py-2 shrink-0 space-y-2 shadow-sm relative z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold tracking-tighter">CoinSwipe</h1>
            <p className="text-[9px] text-muted-foreground font-medium">
              {remainingSwipes}/{maxFreeSwipes}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(true)}
              className="gap-1.5 border-neutral-200/50 hover:bg-gray-100 hover:shadow-md hover:border-neutral-300 font-medium px-2.5 h-7 text-[10px] shadow-sm rounded-full bg-white/90 transition-all"
            >
              <SlidersHorizontal className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowWatchlist(true)}
              className="gap-1.5 border-neutral-200/50 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-900 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-600 font-medium px-2.5 h-7 text-[10px] shadow-sm rounded-full bg-white/90 dark:bg-black border transition-all"
            >
              <Bookmark className="h-3 w-3" />
            </Button>
            <LoginButton />
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-1">
          <ActivityBanner />
        </div>

        <div className="border-t border-b border-gray-200/50 dark:border-neutral-800 py-2 px-4">
          <SearchBar
            coins={allCoins}
            onSelectCoin={(coin) => {
              setSelectedCoin(coin)
              setShowInsightsSheet(true)
            }}
            onSelectTheme={(themeId) => {
              setSelectedTheme(themeId)
            }}
          />
        </div>

        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 pb-1 px-4 pl-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedTheme(null)
                setFeedType("most-swiped")
              }}
              className={cn(
                "h-7 px-3 text-[10px] font-semibold rounded-full border transition-all shrink-0 shadow-sm flex items-center gap-1.5",
                !selectedTheme && feedType === "most-swiped"
                  ? "bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-500/20 dark:hover:bg-purple-500/30 hover:shadow-md"
                  : "bg-white/90 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-gray-900 dark:hover:text-white text-gray-700 dark:text-neutral-400 border-neutral-200/50 dark:border-neutral-800",
              )}
            >
              <Zap className="h-3.5 w-3.5" />
              Most Swiped
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedTheme(null)
                setFeedType("trending")
              }}
              className={cn(
                "h-7 px-3 text-[10px] font-semibold rounded-full border transition-all shrink-0 shadow-sm",
                !selectedTheme && feedType === "trending"
                  ? "bg-orange-500/10 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800 hover:bg-orange-500/20 dark:hover:bg-orange-500/30 hover:shadow-md"
                  : "bg-white/90 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-gray-900 dark:hover:text-white text-gray-700 dark:text-neutral-400 border-neutral-200/50 dark:border-neutral-800",
              )}
            >
              Trending
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedTheme(null)
                setFeedType("new")
              }}
              className={cn(
                "h-7 px-3 text-[10px] font-semibold rounded-full border transition-all shrink-0 shadow-sm",
                !selectedTheme && feedType === "new"
                  ? "bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-500/20 dark:hover:bg-green-500/30 hover:shadow-md"
                  : "bg-white/90 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-gray-900 dark:hover:text-white text-gray-700 dark:text-neutral-400 border-neutral-200/50 dark:border-neutral-800",
              )}
            >
              New Launches
            </Button>
            {COIN_THEMES.map((theme) => (
              <Button
                key={theme.id}
                variant="outline"
                size="sm"
                onClick={() => {
                  if (theme.id === selectedTheme) {
                    setSelectedTheme(null)
                    setFeedType("trending")
                  } else {
                    setSelectedTheme(theme.id)
                    setFeedType("themed")
                  }
                }}
                className={cn(
                  "h-7 px-3 text-[10px] font-semibold rounded-full border transition-all shrink-0 shadow-sm",
                  selectedTheme === theme.id
                    ? "bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-500/20 dark:hover:bg-purple-500/30 hover:shadow-md"
                    : "bg-white/90 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-gray-900 dark:hover:text-white text-gray-700 dark:text-neutral-400 border-neutral-200/50 dark:border-neutral-800",
                )}
              >
                {theme.id === "dogs" && <Dog className="h-4 w-4" />}
                {theme.id === "cats" && <Cat className="h-4 w-4" />}
                {theme.id === "frogs" && <Bug className="h-4 w-4" />}
                {theme.id === "ai" && <Bot className="h-4 w-4" />}
                {theme.id === "political" && <Vote className="h-4 w-4" />}
                {theme.id === "celebrity" && <span className="text-base">⭐</span>}
                {theme.id !== "dogs" && theme.id !== "cats" && theme.id !== "frogs" && theme.id !== "ai" && theme.id !== "political" && theme.id !== "celebrity" && <span>{theme.emoji}</span>}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </header>

      <div className="relative flex flex-1 items-center justify-center px-4 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/30 dark:bg-black/30 backdrop-blur-sm z-40 rounded-3xl">
            <div className="text-center space-y-3">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
              <p className="text-xs text-muted-foreground font-medium">Loading coins...</p>
            </div>
          </div>
        )}
        {swipeEffect === "like" && (
          <div className="absolute inset-0 pointer-events-none z-[60] flex items-center justify-center">
            <div className="absolute inset-0 animate-confetti">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full animate-particle"
                  style={{
                    left: `${50 + (Math.random() - 0.5) * 20}%`,
                    top: `${50 + (Math.random() - 0.5) * 20}%`,
                    backgroundColor: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"][
                      Math.floor(Math.random() * 5)
                    ],
                    animationDelay: `${Math.random() * 0.2}s`,
                    animationDuration: `${0.6 + Math.random() * 0.4}s`,
                  }}
                />
              ))}
            </div>
            <div className="relative z-10 animate-match-text">
              <div className="text-6xl font-black text-green-500 drop-shadow-[0_0_20px_rgba(34,197,94,0.8)] animate-pulse-scale">
                <Heart className="h-24 w-24 fill-green-500 text-green-500 drop-shadow-2xl" />
              </div>
            </div>
            <div className="absolute inset-0 bg-green-500/20 animate-glow-pulse rounded-3xl" />
          </div>
        )}

        {swipeEffect === "dislike" && (
          <div className="absolute inset-0 pointer-events-none z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-red-500/10 animate-flash-fade" />
            <div className="relative z-10 animate-shake">
              <X className="h-24 w-24 text-red-500 stroke-[3] drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
            </div>
          </div>
        )}

        {currentIndex + 1 < coins.length && (
          <div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none">
            <div className="h-[calc(100%-20px)] w-full scale-[0.96] opacity-10">
              <div className="h-full w-full rounded-3xl glass-dark shadow-xl" />
            </div>
          </div>
        )}

        <SwipeCard
          coin={currentCoin}
          onSwipe={handleSwipe}
          onTap={handleCardTap}
          onImageTap={handleImageTap}
          onDoubleTap={handleDoubleTap}
          onDevMetricsTap={handleDevMetricsTap}
          onScrollChange={handleScrollChange} // Pass scroll handler to card
        />
      </div>

      <div
        className={cn(
          "absolute bottom-4 left-0 right-0 flex items-center justify-center gap-5 px-6 pb-2 pointer-events-none transition-all duration-300 ease-out",
          isScrolling ? "scale-[0.65] opacity-20" : "scale-100 opacity-100",
        )}
      >
        <div className="flex items-center justify-center gap-5 pointer-events-auto">
          <Button
            size="lg"
            variant="ghost"
            className={cn(
              "h-14 w-14 rounded-full bg-white/95 dark:bg-neutral-900 backdrop-blur-sm border-2 border-red-200 dark:border-red-900 text-red-500 transition-all hover:scale-110 hover:bg-red-50 dark:hover:bg-red-950 hover:border-red-300 active:scale-95 shadow-md hover:shadow-lg",
              isSwipeAnimating && "pointer-events-none opacity-40",
            )}
            onClick={() => handleSwipe("left")}
            disabled={isSwipeAnimating}
          >
            <X className="h-8 w-8" strokeWidth={2.5} />
          </Button>

          <div className="relative">
            <BuyButton coin={currentCoin} />
          </div>

          <Button
            size="lg"
            variant="ghost"
            className={cn(
              "h-14 w-14 rounded-full bg-white/95 dark:bg-neutral-900 backdrop-blur-sm border-2 border-green-200 dark:border-green-900 text-green-500 transition-all hover:scale-110 hover:bg-green-50 dark:hover:bg-green-950 hover:border-green-300 active:scale-95 shadow-md hover:shadow-lg",
              isSwipeAnimating && "pointer-events-none opacity-40",
            )}
            onClick={() => handleSwipe("right")}
            disabled={isSwipeAnimating}
          >
            <Heart className="h-8 w-8 fill-current" strokeWidth={0} />
          </Button>
        </div>
      </div>

      <PaywallModal open={showPaywall} onOpenChange={setShowPaywall} />
      <CoinDetailModal coin={selectedCoin} open={showDetailModal} onOpenChange={setShowDetailModal} />
      <CoinInsightsSheet
        coin={selectedCoin}
        open={showInsightsSheet}
        onOpenChange={setShowInsightsSheet}
        viewMode={insightsViewMode}
      />
      <JackpotModal open={showJackpot} onOpenChange={setShowJackpot} reward={currentReward} />
      <AdvancedFilterModal open={showFilters} onOpenChange={setShowFilters} />
      <WatchlistSheet open={showWatchlist} onOpenChange={setShowWatchlist} />
      <ProfileSheet open={showProfile} onOpenChange={setShowProfile} />
      <RewardModal open={showRewardModal} onOpenChange={setShowRewardModal} onClaim={handleClaimReward} />
    </div>
  )
}
