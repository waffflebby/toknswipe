"use client"

import { Users, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface MatchNotification {
  user: string
  coin: string
  emoji: string
}

const MOCK_MATCHES: MatchNotification[] = [
  { user: "@cryptowhale", coin: "BONK", emoji: "🐕" },
  { user: "@degenking", coin: "PEPE", emoji: "🐸" },
  { user: "@trader123", coin: "WIF", emoji: "🎩" },
  { user: "@moonboy", coin: "DOGE", emoji: "🐶" },
]

export function MatchNotificationBubble() {
  const [currentMatch, setCurrentMatch] = useState<MatchNotification | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const showNotification = () => {
      const randomMatch = MOCK_MATCHES[Math.floor(Math.random() * MOCK_MATCHES.length)]
      setCurrentMatch(randomMatch)
      setIsVisible(true)

      setTimeout(() => {
        setIsVisible(false)
      }, 5000)
    }

    const interval = setInterval(showNotification, 15000)
    showNotification()

    return () => clearInterval(interval)
  }, [])

  if (!currentMatch || !isVisible) return null

  return (
    <div className="fixed top-4 left-4 z-50 animate-in slide-in-from-left-5 fade-in duration-300">
      <div className="glass rounded-2xl px-3 py-2 shadow-xl border border-white/40 flex items-center gap-2 max-w-[200px]">
        <Users className="h-3.5 w-3.5 text-accent shrink-0" />
        <p className="text-[9px] font-semibold text-foreground truncate">
          {currentMatch.user} matched with {currentMatch.coin} {currentMatch.emoji}
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="h-4 w-4 p-0 hover:bg-white/50 rounded-full shrink-0 ml-auto"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-2.5 w-2.5" />
        </Button>
      </div>
    </div>
  )
}
