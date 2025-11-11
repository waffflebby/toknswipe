"use client"

import { useEffect, useMemo, useState } from "react"
import { X, Heart, RotateCcw, RefreshCw } from "lucide-react"

import { SwipeCard } from "@/components/swipe-card"
import { CoinDetailModal } from "@/components/coin-detail-modal"
import { CoinInsightsSheet } from "@/components/coin-insights-sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useCoins } from "@/hooks/useCoins"
import { useMatches } from "@/hooks/useMatches"
import type { EnrichedCoin } from "@/lib/types"
import { COIN_THEMES } from "@/lib/types"

const FEED_OPTIONS = [
  { id: "trending" as const, label: "Trending" },
  { id: "new" as const, label: "New" },
  { id: "most-swiped" as const, label: "Most Swiped" },
]

type FeedType = (typeof FEED_OPTIONS)[number]["id"] | "themed"

export function SwipeView() {
  const [feedType, setFeedType] = useState<FeedType>("trending")
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [history, setHistory] = useState<EnrichedCoin[]>([])
  const [detailCoin, setDetailCoin] = useState<EnrichedCoin | null>(null)
  const [showInsights, setShowInsights] = useState(false)

  const { coins: fetchedCoins, isLoading, error, refetch } = useCoins(feedType, selectedTheme)
  const { addMatch } = useMatches()

  const coins = useMemo(() => fetchedCoins ?? [], [fetchedCoins])
  const currentCoin = coins[currentIndex]
  const canSwipe = !isLoading && coins.length > 0

  useEffect(() => {
    if (coins.length === 0) {
      if (currentIndex !== 0) {
        setCurrentIndex(0)
      }
      return
    }

    if (currentIndex >= coins.length) {
      setCurrentIndex(0)
    }
  }, [coins.length, currentIndex])

  const handleSwipe = (direction: "left" | "right") => {
    if (!canSwipe || !currentCoin) {
      return
    }

    setHistory((prev) => [...prev, currentCoin])
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1
      return nextIndex >= coins.length ? 0 : nextIndex
    })

    if (direction === "right") {
      addMatch(currentCoin)
    }
  }

  const handleUndo = () => {
    if (history.length === 0) return

    const previous = history[history.length - 1]
    setHistory((prev) => prev.slice(0, -1))

    const previousIndex = coins.findIndex((coin) => coin.id === previous.id)
    if (previousIndex >= 0) {
      setCurrentIndex(previousIndex)
    }
  }

  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId)
    setFeedType("themed")
    setCurrentIndex(0)
    setHistory([])
  }

  const handleSelectFeed = (nextFeed: FeedType) => {
    setFeedType(nextFeed)
    setSelectedTheme(null)
    setCurrentIndex(0)
    setHistory([])
  }

  const handleOpenDetails = (coin: EnrichedCoin) => {
    setDetailCoin(coin)
  }

  const handleOpenInsights = (coin: EnrichedCoin) => {
    setDetailCoin(coin)
    setShowInsights(true)
  }

  const handleDoubleTap = () => {
    handleSwipe("right")
  }

  const renderEmptyState = () => (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="space-y-2">
        <p className="text-base font-semibold text-foreground">No tokens found</p>
        <p className="text-sm text-muted-foreground">
          Try a different feed or refresh the data.
        </p>
      </div>
      <Button onClick={() => refetch()} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
    </div>
  )

  return (
    <div className="flex h-full flex-col gap-4">
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {FEED_OPTIONS.map((option) => (
              <Button
                key={option.id}
                variant={feedType === option.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleSelectFeed(option.id)}
                className="rounded-full"
              >
                {option.label}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="rounded-full"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={history.length === 0}
              className="rounded-full"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="whitespace-nowrap">
          <div className="flex gap-2 pb-2">
            {COIN_THEMES.map((theme) => (
              <Button
                key={theme.id}
                variant={selectedTheme === theme.id ? "default" : "outline"}
                size="sm"
                onClick={() => handleSelectTheme(theme.id)}
                className="rounded-full"
              >
                <span className="mr-1" role="img" aria-hidden>
                  {theme.emoji}
                </span>
                {theme.name}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      <section className="relative flex-1">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p className="text-base font-semibold text-destructive">Unable to load tokens</p>
            <p className="text-sm text-muted-foreground">{(error as Error).message ?? "Please try again later."}</p>
            <Button onClick={() => refetch()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        ) : !canSwipe ? (
          isLoading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">Loading tokens…</p>
            </div>
          ) : (
            renderEmptyState()
          )
        ) : (
          <div className="flex h-full flex-col gap-4">
            <div className="flex-1">
              <SwipeCard
                coin={currentCoin}
                onSwipe={handleSwipe}
                onTap={() => handleOpenDetails(currentCoin)}
                onImageTap={() => handleOpenInsights(currentCoin)}
                onDoubleTap={handleDoubleTap}
                onDevMetricsTap={() => handleOpenInsights(currentCoin)}
              />
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="destructive"
                size="lg"
                className="h-12 w-12 rounded-full"
                onClick={() => handleSwipe("left")}
              >
                <X className="h-5 w-5" />
              </Button>
              <Button
                variant="default"
                size="lg"
                className="h-14 w-14 rounded-full"
                onClick={() => handleSwipe("right")}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </section>

      <CoinDetailModal coin={detailCoin} open={!!detailCoin} onOpenChange={(open) => !open && setDetailCoin(null)} />
      <CoinInsightsSheet
        coin={detailCoin}
        open={showInsights}
        onOpenChange={(open) => {
          setShowInsights(open)
          if (!open) {
            setDetailCoin(null)
          }
        }}
        viewMode="full"
      />
    </div>
  )
}
