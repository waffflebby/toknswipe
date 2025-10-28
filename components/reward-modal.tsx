"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Gift, Twitter, Wallet } from "lucide-react"
import { useEffect, useState } from "react"

interface RewardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClaim: () => void
}

export function RewardModal({ open, onOpenChange, onClaim }: RewardModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (open) {
      setShowConfetti(true)
      // Trigger confetti animation
      const duration = 3000
      const animationEnd = Date.now() + duration
      const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

      const frame = () => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          setShowConfetti(false)
          return
        }

        const particleCount = 3
        // Create confetti effect using DOM elements
        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement("div")
          particle.className = "confetti-particle"
          particle.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            border-radius: 50%;
            animation: confetti-fall ${1 + Math.random()}s linear forwards;
            z-index: 9999;
          `
          document.body.appendChild(particle)
          setTimeout(() => particle.remove(), 2000)
        }

        requestAnimationFrame(frame)
      }

      frame()
    }
  }, [open])

  const handleShare = () => {
    const text = "Just won $25 in $BONK from @CoinSwipe! 🎉"
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  }

  const handleClaim = () => {
    onClaim()
    onOpenChange(false)
  }

  return (
    <>
      <style jsx global>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              <div className="flex flex-col items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center animate-bounce">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  CONGRATULATIONS!
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold">You won:</p>
              <p className="text-3xl font-bold text-green-600">$25 in $BONK</p>
              <p className="text-sm text-muted-foreground">100 swipes completed!</p>
            </div>

            <div className="space-y-3">
              <Button onClick={handleClaim} className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white">
                <Wallet className="h-4 w-4" />
                Claim to Wallet
              </Button>
              <Button onClick={handleShare} variant="outline" className="w-full gap-2 bg-transparent">
                <Twitter className="h-4 w-4" />
                Share on Twitter
              </Button>
              <Button onClick={() => onOpenChange(false)} variant="ghost" className="w-full">
                Keep Swiping
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
