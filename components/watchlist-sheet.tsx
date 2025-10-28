"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
  Heart,
  Trash2,
  FolderPlus,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Users,
  Clock,
  BarChart3,
  Maximize2,
  X,
  Globe,
  Twitter,
  ChevronDown,
  Copy,
} from "lucide-react"
import type { EnrichedCoin } from "@/lib/types"
import { getWatchlist, removeFromWatchlist } from "@/lib/storage"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { CleanChart } from "@/components/clean-chart"

interface WatchlistSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Generate mock chart data based on 24h change
function generateMockChartData(change24h: number): number[] {
  try {
    const points = 24
    const data: number[] = []
    const baseValue = 100
    const safeChange = Number.isFinite(change24h) ? change24h : 0
    
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1)
      const trend = baseValue * (1 + (safeChange / 100) * progress)
      const noise = (Math.random() - 0.5) * (Math.abs(safeChange) * 0.3)
      data.push(Math.max(0, trend + noise))
    }
    
    return data
  } catch (error) {
    console.error("Error generating chart data:", error)
    return Array(24).fill(100)
  }
}

export function WatchlistSheet({ open, onOpenChange }: WatchlistSheetProps) {
  const [watchlistCoins, setWatchlistCoins] = useState<EnrichedCoin[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [customLists, setCustomLists] = useState<string[]>([])
  const [fullscreenChart, setFullscreenChart] = useState<EnrichedCoin | null>(null)
  const [showNewListDialog, setShowNewListDialog] = useState(false)
  const [newListName, setNewListName] = useState("")
  const [coinLists, setCoinLists] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (open) {
      setWatchlistCoins(getWatchlist())
      const savedLists = localStorage.getItem("customWatchlists")
      if (savedLists) {
        setCustomLists(JSON.parse(savedLists))
      }
      const savedCoinLists = localStorage.getItem("coinWatchlistAssignments")
      if (savedCoinLists) {
        setCoinLists(JSON.parse(savedCoinLists))
      }
    }
  }, [open])

  const handleRemove = (coinId: string) => {
    removeFromWatchlist(coinId)
    setWatchlistCoins(getWatchlist())
  }

  const handleCreateList = () => {
    if (newListName.trim()) {
      const updatedLists = [...customLists, newListName.trim()]
      setCustomLists(updatedLists)
      localStorage.setItem("customWatchlists", JSON.stringify(updatedLists))
      setNewListName("")
      setShowNewListDialog(false)
    }
  }

  const handleMoveToList = (coinId: string, listName: string) => {
    const updatedCoinLists = { ...coinLists }
    if (!updatedCoinLists[listName]) {
      updatedCoinLists[listName] = []
    }
    if (!updatedCoinLists[listName].includes(coinId)) {
      updatedCoinLists[listName].push(coinId)
      setCoinLists(updatedCoinLists)
      localStorage.setItem("coinWatchlistAssignments", JSON.stringify(updatedCoinLists))
    }
  }

  const getCoinsForTab = (tab: string) => {
    if (tab === "all") return watchlistCoins
    if (tab === "matched") return watchlistCoins
    if (customLists.includes(tab)) {
      const coinIds = coinLists[tab] || []
      return watchlistCoins.filter((coin) => coinIds.includes(coin.id))
    }
    return watchlistCoins
  }

  const themes = Array.from(new Set(watchlistCoins.map((coin) => coin.theme).filter(Boolean)))
  const displayedCoins = getCoinsForTab(activeTab)

  return (
    <>
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] p-0 bg-white dark:bg-black rounded-t-2xl">
        <SheetHeader className="border-b border-gray-100 dark:border-neutral-800 px-5 pt-5 pb-4 relative bg-white dark:bg-black">
          <div className="pr-20">
            <SheetTitle className="text-xl font-bold mb-0.5">Matches</SheetTitle>
            <p className="text-xs text-gray-500">
              {watchlistCoins.length} coin{watchlistCoins.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-12 right-5 h-6 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            onClick={() => setShowNewListDialog(true)}
          >
            <FolderPlus className="h-3 w-3 mr-1" />
            New
          </Button>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[calc(85vh-100px)]">
          <div className="border-b border-gray-100 px-5 py-2">
            <ScrollArea className="w-full">
              <TabsList className="bg-transparent gap-2 h-auto p-0">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 text-xs px-3 py-1 rounded-full"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="matched"
                  className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 text-xs px-3 py-1 rounded-full"
                >
                  Matched
                </TabsTrigger>
                {customLists.map((listName) => (
                  <TabsTrigger
                    key={listName}
                    value={listName}
                    className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-600 text-xs px-3 py-1 rounded-full"
                  >
                    {listName}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
          </div>

          <TabsContent value={activeTab} className="mt-0 h-[calc(100%-48px)]">
            <ScrollArea className="h-full">
              <div className="bg-white dark:bg-black min-h-[600px]">
                {displayedCoins.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                    <Heart className="h-10 w-10 text-gray-300 mb-2" />
                    <h3 className="text-sm font-semibold mb-1">No coins yet</h3>
                    <p className="text-xs text-gray-500">Swipe right on coins to add them here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-neutral-800">
                    {displayedCoins.map((coin) => (
                      <CoinCard
                        key={coin.id}
                        coin={coin}
                        onRemove={handleRemove}
                        customLists={customLists}
                        onMoveToList={handleMoveToList}
                        onViewChart={setFullscreenChart}
                      />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <Dialog open={showNewListDialog} onOpenChange={setShowNewListDialog}>
          <DialogContent className="sm:max-w-md">
            <VisuallyHidden>
              <DialogTitle>Create New Watchlist</DialogTitle>
            </VisuallyHidden>
            <DialogHeader>
              <h2 className="text-lg font-semibold">Create New Watchlist</h2>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Enter list name..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewListDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateList}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SheetContent>
    </Sheet>
    {/* Fullscreen Chart Dialog */}
    <Dialog open={!!fullscreenChart} onOpenChange={() => setFullscreenChart(null)}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[85vh] p-0 gap-0" showCloseButton={false}>
        <VisuallyHidden>
          <DialogTitle>
            {fullscreenChart ? `${fullscreenChart.name} Chart` : "Token Chart"}
          </DialogTitle>
        </VisuallyHidden>
        <div className="h-full w-full flex flex-col bg-background rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur shrink-0">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {fullscreenChart && (
                <>
                  <Image
                    src={fullscreenChart.image || "/placeholder.svg"}
                    alt={fullscreenChart.name}
                    width={32}
                    height={32}
                    className="object-contain rounded shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold truncate">{fullscreenChart.name}</h3>
                    <p className="text-xs text-muted-foreground">${fullscreenChart.symbol}</p>
                  </div>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFullscreenChart(null)}
              className="h-8 w-8 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            {fullscreenChart && (
              <CleanChart 
                tokenAddress={fullscreenChart.mint} 
                tokenSymbol={fullscreenChart.symbol}
                showStats={false}
                height={360}
                className="h-full"
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}

function CoinCard({
  coin,
  onRemove,
  customLists,
  onMoveToList,
  onViewChart,
}: {
  coin: EnrichedCoin
  onRemove: (id: string) => void
  customLists: string[]
  onMoveToList: (coinId: string, listName: string) => void
  onViewChart: (coin: EnrichedCoin) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const truncateAddress = (address: string | undefined) => {
    if (!address) return "N/A"
    if (address.length <= 12) return address
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div
      className="px-5 py-3 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer group"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start w-full">
        {/* Coin image */}
        <Image
          src={coin.image || "/placeholder.svg"}
          alt={coin.name}
          width={40}
          height={40}
          className="rounded-full shrink-0 mt-0.5 mr-3"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg"
          }}
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm mb-1">${coin.symbol}</h3>
          <div className="flex items-center gap-2">
            <p className="text-[11px] text-gray-500 truncate">{coin.name}</p>
            <span className="text-[10px] text-gray-600 dark:text-neutral-300 px-1.5 py-0.5 rounded-md border border-gray-200 dark:border-neutral-700 shrink-0 whitespace-nowrap">MCap {coin.marketCap}</span>
          </div>
        </div>

        <div className="flex flex-col items-end justify-center gap-2 shrink-0 -mr-2">
          <p className="text-sm font-semibold text-black dark:text-white leading-none">{coin.price}</p>
          <div
            className={cn(
              "text-xs font-semibold px-0 py-0 inline-flex items-center gap-1 leading-none",
              (coin.change24hNum ?? 0) >= 0 ? "text-green-600" : "text-red-600",
            )}
          >
            {(coin.change24hNum ?? 0) >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {coin.change24h}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-0"
            >
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {customLists.map((listName) => (
              <DropdownMenuItem key={listName} onClick={() => onMoveToList(coin.id, listName)}>
                Move to {listName}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem className="text-red-600" onClick={() => onRemove(coin.id)}>
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isExpanded && (
        <div className="mt-2 space-y-2 max-h-[500px] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          {/* Website, Twitter on Left | Chart, Copy on Right */}
          <div className="px-1 flex gap-2 justify-between">
            <div className="flex gap-2">
              <a
                href={coin.website || "#"}
                target={coin.website ? "_blank" : undefined}
                rel={coin.website ? "noopener noreferrer" : undefined}
                onClick={(e) => !coin.website && e.preventDefault()}
                className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-medium rounded-md bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors text-black dark:text-white"
              >
                <Globe className="h-3 w-3" />
                Website
              </a>
              <a
                href={`https://twitter.com/search?q=${coin.symbol}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-medium rounded-md bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors text-black dark:text-white"
              >
                <Twitter className="h-3 w-3" />
                Twitter
              </a>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChart(coin)}
                className="h-7 px-2 gap-1 text-[10px] text-gray-700 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-md"
              >
                <Maximize2 className="h-3 w-3" />
                Chart
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(coin.mint)
                }}
                className="h-7 px-2 gap-1 text-[10px] text-gray-700 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-md"
              >
                <Copy className="h-3 w-3" />
                Copy
              </Button>
            </div>
          </div>

          {/* All Metadata - Always Visible */}
          <div className="px-1 space-y-2 border-t border-gray-200 dark:border-neutral-800 pt-2">
            <div className="grid grid-cols-3 gap-2">
              {coin.volume24h && (
                <div className="text-center space-y-0.5">
                  <p className="text-[9px] font-semibold uppercase text-black dark:text-white">24h Vol</p>
                  <p className="text-xs font-bold text-gray-600 dark:text-neutral-400">{coin.volume24h}</p>
                </div>
              )}
              {coin.liquidity && (
                <div className="text-center space-y-0.5">
                  <p className="text-[9px] font-semibold uppercase text-black dark:text-white">Liq</p>
                  <p className="text-xs font-bold text-gray-600 dark:text-neutral-400">{coin.liquidity}</p>
                </div>
              )}
              <div className="text-center space-y-0.5">
                <p className="text-[9px] font-semibold uppercase text-black dark:text-white">Holders</p>
                <p className="text-xs font-bold text-gray-600 dark:text-neutral-400">{coin.holders || "N/A"}</p>
              </div>
              {coin.txns24h && (
                <div className="text-center space-y-0.5">
                  <p className="text-[9px] font-semibold uppercase text-black dark:text-white">24h Txns</p>
                  <p className="text-xs font-bold text-gray-600 dark:text-neutral-400">{coin.txns24h.toLocaleString()}</p>
                </div>
              )}
              <div className="text-center space-y-0.5">
                <p className="text-[9px] font-semibold uppercase text-black dark:text-white">FDV</p>
                <p className="text-xs font-bold text-gray-600 dark:text-neutral-400">—</p>
              </div>
              {coin.age && (
                <div className="text-center space-y-0.5">
                  <p className="text-[9px] font-semibold uppercase text-black dark:text-white">Pair Age</p>
                  <p className="text-xs font-bold text-gray-600 dark:text-neutral-400">{coin.age}</p>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center pt-1">Tap to collapse</p>
        </div>
      )}
    </div>
  )
}
