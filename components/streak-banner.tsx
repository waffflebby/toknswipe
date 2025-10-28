"use client"

import { Flame, Trophy, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface StreakBannerProps {
  streak: number
  className?: string
}

export function StreakBanner({ streak, className }: StreakBannerProps) {
  if (streak < 3) return null

  const isHotStreak = streak >= 7
  const isMegaStreak = streak >= 14

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold shadow-sm",
        isMegaStreak && "bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30 text-purple-600",
        isHotStreak &&
          !isMegaStreak &&
          "bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30 text-orange-600",
        !isHotStreak && "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30 text-blue-600",
        className,
      )}
    >
      {isMegaStreak ? (
        <Trophy className="h-2.5 w-2.5" />
      ) : isHotStreak ? (
        <Flame className="h-2.5 w-2.5 animate-pulse" />
      ) : (
        <Zap className="h-2.5 w-2.5" />
      )}
      <span>{streak}d</span>
    </div>
  )
}
