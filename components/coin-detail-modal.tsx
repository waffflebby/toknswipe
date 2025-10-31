"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Copy,
  Shield,
  Clock,
  Droplets,
  Activity,
  Users,
  AlertTriangle,
  Twitter,
  Send,
  Globe,
} from "lucide-react"
import Image from "next/image"
import type { EnrichedCoin } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CoinDetailModalProps {
  coin: EnrichedCoin | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CoinDetailModal({ coin, open, onOpenChange }: CoinDetailModalProps) {
  if (!coin) return null

  const isPositiveChange = coin.change24hNum >= 0

  const copyAddress = () => {
    navigator.clipboard.writeText(coin.mint)
  }

  const riskColors = {
    low: "text-green-600 bg-green-50 border-green-200",
    medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
    high: "text-red-600 bg-red-50 border-red-200",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0">
              <Image
                src={coin.image || "/placeholder.svg"}
                alt={coin.name}
                fill
                className="object-contain rounded-xl"
              />
              {coin.isVerified && (
                <div className="absolute -top-1 -right-1 rounded-full bg-blue-500 p-1 shadow-lg">
                  <Shield className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-2xl font-bold tracking-tight">{coin.name}</DialogTitle>
              <p className="text-sm text-muted-foreground font-medium">${coin.symbol}</p>
            </div>
            <Badge
              variant={isPositiveChange ? "default" : "destructive"}
              className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 shrink-0"
            >
              {isPositiveChange ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
              {coin.change24h}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Price Section */}
          <div>
            <p className="text-4xl font-bold tracking-tight">{coin.price}</p>
            <p className="text-sm text-muted-foreground mt-1">Market Cap: {coin.marketCap}</p>
          </div>

          <Separator />

          {/* Key Metrics */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-secondary/30 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-2">
                  <Clock className="h-4 w-4" />
                  <span>Age</span>
                </div>
                <p className="text-xl font-bold tracking-tight">{coin.age}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(() => {
                    const date = coin.createdAt instanceof Date ? coin.createdAt : new Date(coin.createdAt as any)
                    return isNaN(date.getTime()) ? "Unknown" : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  })()}
                </p>
              </div>

              <div className="rounded-xl border bg-secondary/30 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-2">
                  <Droplets className="h-4 w-4" />
                  <span>Liquidity</span>
                </div>
                <p className="text-xl font-bold tracking-tight">{coin.liquidity}</p>
              </div>

              <div className="rounded-xl border bg-secondary/30 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-2">
                  <Activity className="h-4 w-4" />
                  <span>Volume 24h</span>
                </div>
                <p className="text-xl font-bold tracking-tight">{coin.volume24h}</p>
              </div>

              <div className="rounded-xl border bg-secondary/30 p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium mb-2">
                  <Users className="h-4 w-4" />
                  <span>Top Holder %</span>
                </div>
                <p className="text-xl font-bold tracking-tight">{(coin.topHolderWeight !== undefined && coin.topHolderWeight !== null) ? `${coin.topHolderWeight.toFixed(2)}%` : "—"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Risk Assessment */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Risk Assessment</h3>
            <div className={cn("rounded-xl border p-4 flex items-start gap-3", riskColors[coin.riskLevel])}>
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold uppercase tracking-wide mb-1">Risk Level: {coin.riskLevel}</p>
                <p className="text-xs opacity-80 leading-relaxed">
                  Risk assessment based on liquidity depth, token age, trading volume, and transaction activity.
                  {coin.riskLevel === "high" && " Exercise caution with newer or low-liquidity tokens."}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contract Address */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Contract Address</h3>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg bg-secondary/50 px-3 py-2 text-xs font-mono break-all">
                {coin.mint}
              </code>
              <Button size="icon" variant="outline" onClick={copyAddress} className="shrink-0 bg-transparent">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Creator: <span className="font-mono">{coin.creator}</span>
            </p>
          </div>

          {/* Social Links */}
          {(coin.website || coin.twitter || coin.telegram) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Links</h3>
                <div className="flex flex-wrap gap-2">
                  {coin.website && (
                    <Button variant="outline" size="sm" asChild className="gap-2 bg-transparent">
                      <a href={coin.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4" />
                        Website
                      </a>
                    </Button>
                  )}
                  {coin.twitter && (
                    <Button variant="outline" size="sm" asChild className="gap-2 bg-transparent">
                      <a href={coin.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </a>
                    </Button>
                  )}
                  {coin.telegram && (
                    <Button variant="outline" size="sm" asChild className="gap-2 bg-transparent">
                      <a href={coin.telegram} target="_blank" rel="noopener noreferrer">
                        <Send className="h-4 w-4" />
                        Telegram
                      </a>
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://twitter.com/search?q=%24${coin.symbol}&src=typed_query&f=live`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Search ${coin.symbol}
                  </a>
                </div>
              </div>
            </>
          )}

          {/* External Links */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 gap-2 bg-transparent" asChild>
              <a href={`https://dexscreener.com/solana/${coin.mint}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                DexScreener
              </a>
            </Button>
            <Button variant="outline" className="flex-1 gap-2 bg-transparent" asChild>
              <a href={`https://solscan.io/token/${coin.mint}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Solscan
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}