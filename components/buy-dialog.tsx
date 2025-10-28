"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, ExternalLink, TrendingUp, Zap } from "lucide-react"
import type { EnrichedCoin } from "@/lib/types"
import { cn } from "@/lib/utils"

interface BuyDialogProps {
  coin: EnrichedCoin | null
  open: boolean
  onOpenChange: (open: boolean) => void
  amount: number
}

// Approximate SOL price for conversion (in production, fetch real-time price)
const SOL_PRICE = 150

export function BuyDialog({ coin, open, onOpenChange, amount }: BuyDialogProps) {
  if (!coin) return null

  const solAmount = (amount / SOL_PRICE).toFixed(3)
  const jupiterUrl = `https://jup.ag/swap/SOL-${coin.mint}?inAmount=${solAmount}`

  const priceNum = coin.priceUsd || Number.parseFloat(coin.price) || 0
  const priceChangeNum = coin.change24hNum || 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md p-0 gap-0 bg-background border-2 border-border/40">
        {/* Header */}
        <DialogHeader className="glass-dark px-5 py-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Quick Buy
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0 rounded-full hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Coin Info */}
          <div className="flex items-center gap-3 p-4 glass-dark rounded-xl border border-white/30">
            <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="h-12 w-12 rounded-full" />
            <div className="flex-1">
              <h3 className="font-bold text-base">{coin.symbol}</h3>
              <p className="text-xs text-muted-foreground">{coin.name}</p>
            </div>
            <div className="text-right">
              <p className="font-numbers font-bold text-sm">${priceNum.toFixed(6)}</p>
              <p
                className={cn(
                  "text-xs font-numbers font-semibold",
                  priceChangeNum >= 0 ? "text-green-500" : "text-red-500",
                )}
              >
                {priceChangeNum >= 0 ? "+" : ""}
                {priceChangeNum.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Purchase Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-500/10 rounded-lg border border-orange-200">
              <span className="text-sm font-medium text-muted-foreground">You're buying</span>
              <span className="font-bold text-lg">${amount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-500/10 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-muted-foreground">Equivalent in SOL</span>
              <span className="font-numbers font-bold text-lg">{solAmount} SOL</span>
            </div>
          </div>

          {/* Info */}
          <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-200">
            <p className="text-xs text-muted-foreground">
              You'll be redirected to Jupiter to complete your swap. Jupiter offers the best rates across Solana DEXs.
            </p>
          </div>

          {/* Action Button */}
          <Button
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-base gap-2 shadow-md hover:shadow-lg"
            onClick={() => {
              window.open(jupiterUrl, "_blank")
              onOpenChange(false)
            }}
          >
            <TrendingUp className="h-5 w-5" />
            Continue to Jupiter
            <ExternalLink className="h-4 w-4" />
          </Button>

          <Button variant="ghost" className="w-full h-10 text-sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
