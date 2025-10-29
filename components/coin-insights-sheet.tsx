"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState, useEffect } from "react"
import {
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Copy,
  Shield,
  Wallet,
  BarChart3,
  MessageSquare,
  Twitter,
  Send,
  Users,
  Flame,
  Maximize2,
  Globe,
  Code,
  Coins,
  ChevronDown,
  Activity,
  DollarSign,
  X,
} from "lucide-react"
import Image from "next/image"
import type { EnrichedCoin } from "@/lib/types"
import { CleanChart } from "@/components/clean-chart"
import { fetchTokenHoldersFromAPI } from "@/lib/api-client"
import { cn } from "@/lib/utils"

interface CoinInsightsSheetProps {
  coin: EnrichedCoin | null
  open: boolean
  onOpenChange: (open: boolean) => void
  viewMode?: "full" | "devMetrics"
}

export function CoinInsightsSheet({ coin, open, onOpenChange, viewMode = "full" }: CoinInsightsSheetProps) {
  const [showFullChart, setShowFullChart] = useState(false)
  const [livePrice, setLivePrice] = useState(coin?.priceUsd || 0)
  const [priceChange, setPriceChange] = useState(0)
  const [topHoldersOpen, setTopHoldersOpen] = useState(false)
  const [socialBuzzOpen, setSocialBuzzOpen] = useState(false)
  const [realTopHolders, setRealTopHolders] = useState<any[]>([])
  const [loadingHolders, setLoadingHolders] = useState(false)

  useEffect(() => {
    if (!coin || !open) return

    setLivePrice(coin.priceUsd)

    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * 0.01
      setLivePrice((prev) => {
        const newPrice = prev * (1 + fluctuation)
        const change = ((newPrice - coin.priceUsd) / coin.priceUsd) * 100
        setPriceChange(change)
        return newPrice
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [coin, open])

  // Load real top holders when sheet opens
  useEffect(() => {
    async function loadHolders() {
      if (!coin || !open || !topHoldersOpen) return
      
      setLoadingHolders(true)
      try {
        const holdersData = await fetchTokenHoldersFromAPI(coin.mint)
        if (holdersData && holdersData.holders) {
          setRealTopHolders(holdersData.holders.slice(0, 10))
        }
      } catch (error) {
        console.error("[Holders] Error loading holders:", error)
      } finally {
        setLoadingHolders(false)
      }
    }

    loadHolders()
  }, [coin, open, topHoldersOpen])

  if (!coin) return null

  const isPositiveChange = (coin.change24hNum ?? 0) >= 0
  const isPriceUp = priceChange >= 0

  const copyAddress = () => {
    navigator.clipboard.writeText(coin.mint)
  }

  const devMetrics = {
    totalCoins: 3,
    successRate: 66.7,
    totalVolume: "$2.4M",
    reputation: 8.5,
  }

  const otherCoinsByDev = [
    { name: "DOGE2.0", symbol: "DOGE2", status: "✅ Active", mcap: "$1.2M" },
    { name: "MoonShib", symbol: "MSHIB", status: "❌ Rugged", mcap: "$0" },
  ]

  const topHolders = [
    { address: "7xKXt...9Qp2", percentage: 12.5, value: "$1.2M" },
    { address: "9mNvB...3Lk8", percentage: 8.3, value: "$830K" },
    { address: "4pQwE...7Hn5", percentage: 6.1, value: "$610K" },
    { address: "2kRtY...4Mp9", percentage: 4.8, value: "$480K" },
    { address: "8vCxZ...1Qw6", percentage: 3.2, value: "$320K" },
  ]

  const socialPosts = [
    {
      platform: "twitter",
      author: "@cryptowhale",
      content: "This coin is going to the moon! 🚀 Just loaded up my bags",
      likes: 1234,
      time: "2h ago",
    },
    {
      platform: "twitter",
      author: "@memecoinmaster",
      content: "Chart looking bullish AF. Volume is insane today 📈",
      likes: 892,
      time: "4h ago",
    },
    {
      platform: "telegram",
      author: "SolanaGems",
      content: "Dev is based and active in TG. Community is strong 💪",
      likes: 567,
      time: "6h ago",
    },
  ]

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh] p-0 bg-white dark:bg-black flex flex-col">
          <VisuallyHidden>
            <SheetTitle>Coin Insights</SheetTitle>
          </VisuallyHidden>
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-neutral-800 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFullChart(true)}
              className="h-6 px-1.5 gap-0.5 text-[10px] text-gray-700 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-md"
            >
              <Maximize2 className="h-2.5 w-2.5" />
              View Chart
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Centered Logo */}
              <div className="flex justify-center">
                <div className="relative h-16 w-16">
                  <Image
                    src={coin.image || "/placeholder.svg"}
                    alt={coin.name}
                    fill
                    className="object-contain rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                  {coin.isVerified && (
                    <div className="absolute -top-1 -right-1 rounded-full bg-blue-500 p-0.5 shadow-lg">
                      <Shield className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Coin Name and Symbol */}
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-black dark:text-white">{coin.name}</p>
                <p className="text-xs text-muted-foreground">${coin.symbol}</p>
              </div>

              {viewMode === "full" && (
                <>
                  {/* Price and MCap Only */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center space-y-1">
                      <p className="text-[9px] font-semibold uppercase text-gray-400 dark:text-gray-400">Price</p>
                      <p className="text-sm font-bold font-numbers text-black dark:text-white">{coin.price}</p>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-[9px] font-semibold uppercase text-gray-400 dark:text-gray-400">MCap</p>
                      <p className="text-sm font-bold font-numbers text-black dark:text-white">{coin.marketCap}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Metadata Section */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 w-full">
                      <div className="text-center space-y-1">
                        <p className="text-[9px] font-semibold uppercase text-black dark:text-white">24h Vol</p>
                        <p className="text-xs font-bold font-numbers text-gray-600 dark:text-neutral-400">{coin.volume24h}</p>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-[9px] font-semibold uppercase text-black dark:text-white">Liq</p>
                        <p className="text-xs font-bold font-numbers text-gray-600 dark:text-neutral-400">{coin.liquidity}</p>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-[9px] font-semibold uppercase text-black dark:text-white">Holders</p>
                        <p className="text-xs font-bold font-numbers text-gray-600 dark:text-neutral-400">{coin.holders?.toLocaleString() || "2.8K"}</p>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-[9px] font-semibold uppercase text-black dark:text-white">24h Txns</p>
                        <p className="text-xs font-bold font-numbers text-gray-600 dark:text-neutral-400">{coin.txns24h?.toLocaleString() || "—"}</p>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-[9px] font-semibold uppercase text-black dark:text-white">FDV</p>
                        <p className="text-xs font-bold font-numbers text-gray-600 dark:text-neutral-400">{coin.fdv || "—"}</p>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-[9px] font-semibold uppercase text-black dark:text-white">Pair Age</p>
                        <p className="text-xs font-bold font-numbers text-gray-600 dark:text-neutral-400">{coin.age || "—"}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              {viewMode === "full" && (
                <>
                  <Separator />

                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-black dark:text-white">Advanced</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {coin.txns24h && (
                        <div className="space-y-1">
                          <p className="text-[10px] text-black dark:text-white font-medium">24h Txns</p>
                          <p className="text-sm font-bold text-gray-500 dark:text-neutral-500">{coin.txns24h.toLocaleString()}</p>
                        </div>
                      )}
                      {coin.riskLevel && (
                        <div className="space-y-1">
                          <p className="text-[10px] text-black dark:text-white font-medium">Risk Level</p>
                          <p className={`text-sm font-bold ${
                            coin.riskLevel === 'low' ? 'text-green-600' :
                            coin.riskLevel === 'medium' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {coin.riskLevel.charAt(0).toUpperCase() + coin.riskLevel.slice(1)}
                          </p>
                        </div>
                      )}
                    </div>

                    {coin.description && (
                      <div className="space-y-1">
                        <p className="text-[10px] text-black dark:text-white font-medium">Description</p>
                        <p className="text-xs text-gray-600 dark:text-neutral-400 line-clamp-2">{coin.description}</p>
                      </div>
                    )}

                    {coin.creator && (
                      <div className="space-y-1">
                        <p className="text-[10px] text-black dark:text-white font-medium">Creator</p>
                        <code className="text-[9px] text-gray-600 dark:text-neutral-400 font-mono break-all">{coin.creator.slice(0, 20)}...</code>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-black dark:text-white">Contract</h3>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded-lg bg-secondary/50 px-2.5 py-2 text-[10px] font-mono break-all">
                        {coin.mint}
                      </code>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={copyAddress}
                        className="shrink-0 h-8 w-8 text-muted-foreground"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-black dark:text-white">Links</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={`https://solscan.io/token/${coin.mint}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[100px] text-center px-3 py-2 text-xs font-medium rounded-md bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors text-black dark:text-white"
                      >
                        Solscan
                      </a>
                      <a
                        href={`https://twitter.com/search?q=${coin.symbol}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[100px] text-center px-3 py-2 text-xs font-medium rounded-md bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors text-black dark:text-white"
                      >
                        Twitter
                      </a>
                      {coin.website && (
                        <a
                          href={coin.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 min-w-[100px] text-center px-3 py-2 text-xs font-medium rounded-md bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors text-black dark:text-white"
                        >
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <Dialog open={showFullChart} onOpenChange={setShowFullChart}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[85vh] p-0 gap-0 bg-white dark:bg-black animate-in fade-in duration-300" showCloseButton={false}>
          <VisuallyHidden>
            <DialogTitle>{coin.name} Chart</DialogTitle>
          </VisuallyHidden>
          <div className="h-full w-full flex flex-col bg-background rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur shrink-0">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Image
                  src={coin.image || "/placeholder.svg"}
                  alt={coin.name}
                  width={32}
                  height={32}
                  className="object-contain rounded shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold truncate">{coin.name}</h3>
                  <p className="text-xs text-muted-foreground">${coin.symbol}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFullChart(false)}
                className="h-8 w-8 shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto animate-in fade-in duration-500 delay-100">
              <CleanChart 
                tokenAddress={coin.mint} 
                tokenSymbol={coin.symbol}
                showStats={false}
                height={360}
                className="w-full"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
