"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, Gift, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import type { JackpotReward } from "@/lib/types"

interface JackpotModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reward: JackpotReward | null
}

export function JackpotModal({ open, onOpenChange, reward }: JackpotModalProps) {
  if (!reward) return null

  const rarityColors = {
    common: "from-blue-500 to-cyan-500",
    rare: "from-purple-500 to-pink-500",
    legendary: "from-amber-500 to-orange-500",
  }

  const rarityIcons = {
    common: Gift,
    rare: Sparkles,
    legendary: Trophy,
  }

  const Icon = rarityIcons[reward.rarity]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 overflow-hidden border-2">
        <div className={cn("relative bg-gradient-to-br p-8 text-white", rarityColors[reward.rarity])}>
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />

          <div className="relative space-y-4 text-center">
            <div className="mx-auto w-fit rounded-full bg-white/20 p-4 backdrop-blur-sm">
              <Icon className="h-12 w-12" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-90">{reward.rarity} Reward</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">🎉 Jackpot!</h2>
            </div>

            <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4 border border-white/20">
              <p className="text-lg font-bold">{reward.title}</p>
              <p className="mt-1 text-sm opacity-90">{reward.description}</p>
              <p className="mt-2 text-2xl font-bold">{reward.value}</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <Button onClick={() => onOpenChange(false)} className="w-full h-11 font-semibold">
            Claim Reward
          </Button>
          <p className="text-center text-xs text-muted-foreground">Keep swiping for more chances to win!</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
