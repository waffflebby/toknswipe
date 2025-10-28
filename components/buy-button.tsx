"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { EnrichedCoin } from "@/lib/types"
import { BuyDialog } from "@/components/buy-dialog"

interface BuyButtonProps {
  coin: EnrichedCoin
}

const QUICK_BUY_OPTIONS = [
  { label: "$100", amount: 100, type: "usd" as const },
  { label: "1 SOL", amount: 1, type: "sol" as const },
]

const SOL_PRICE = 150 // Approximate SOL price for conversion

export function BuyButton({ coin }: BuyButtonProps) {
  const [showAmounts, setShowAmounts] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [showBuyDialog, setShowBuyDialog] = useState(false)

  const handleBuyClick = (amount: number) => {
    setSelectedAmount(amount)
    setShowAmounts(false)
    setShowBuyDialog(true)
  }

  return (
    <>
      <div className="relative">
        {showAmounts && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white/98 backdrop-blur-xl border-2 border-border/40 rounded-xl p-1.5 shadow-xl animate-in fade-in duration-150 min-w-[90px]">
            <div className="space-y-1">
              {QUICK_BUY_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleBuyClick(option.type === "sol" ? option.amount * SOL_PRICE : option.amount)}
                  className="w-full px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-orange-500 hover:text-white hover:shadow-sm bg-gray-100 text-gray-900"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <Button
          size="sm"
          variant="ghost"
          className={cn(
            "h-11 w-11 rounded-full bg-white/95 dark:bg-transparent backdrop-blur-xl border border-border/20 dark:border-white/40 text-primary dark:text-white transition-colors hover:border-primary/40 dark:hover:border-white/60 hover:bg-primary/5 dark:hover:bg-white/10 shadow-lg",
            showAmounts && "border-primary/60 bg-primary/10",
          )}
          onClick={() => setShowAmounts(!showAmounts)}
        >
          <ShoppingCart className="h-4.5 w-4.5" strokeWidth={2.5} />
        </Button>
      </div>

      <BuyDialog coin={coin} open={showBuyDialog} onOpenChange={setShowBuyDialog} amount={selectedAmount || 0} />
    </>
  )
}
