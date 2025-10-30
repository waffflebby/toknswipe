"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { AlertTriangle, Clock, Activity, Users, Globe, PenTool } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { EnrichedCoin } from "@/lib/types"
import { MiniChart } from "./mini-chart"

interface SwipeCardProps {
  coin: EnrichedCoin
  onSwipe: (direction: "left" | "right") => void
  onTap: () => void
  onImageTap: () => void
  onDoubleTap: () => void
  onDevMetricsTap: () => void
  onScrollChange?: (isScrolling: boolean) => void // Added callback for scroll state
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

export function SwipeCard({
  coin,
  onSwipe,
  onTap,
  onImageTap,
  onDoubleTap,
  onDevMetricsTap,
  onScrollChange,
}: SwipeCardProps) {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [lastTap, setLastTap] = useState(0)
  const [canSwipe, setCanSwipe] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isPositiveChange = (coin.change24hNum ?? 0) >= 0

  const handleScroll = () => {
    if (onScrollChange) {
      onScrollChange(true)

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      scrollTimeoutRef.current = setTimeout(() => {
        onScrollChange(false)
      }, 150)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0]
    const startX = touch.clientX
    const startY = touch.clientY
    
    setTouchStart({ x: startX, y: startY })
    
    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect()
      const touchRelativeY = startY - cardRect.top
      const cardHeight = cardRect.height
      
      if (touchRelativeY < cardHeight * 0.5) {
        setCanSwipe(true)
      } else {
        setCanSwipe(false)
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.targetTouches[0]
    const currentX = touch.clientX
    const currentY = touch.clientY
    
    setTouchEnd({ x: currentX, y: currentY })
    
    const deltaX = Math.abs(currentX - touchStart.x)
    const deltaY = Math.abs(currentY - touchStart.y)
    
    if (!isDragging && (deltaX > 10 || deltaY > 10)) {
      if (deltaX > deltaY && canSwipe) {
        setIsDragging(true)
      } else {
        setCanSwipe(false)
      }
    }
    
    if (isDragging && canSwipe) {
      const offset = currentX - touchStart.x
      setDragOffset(offset)
    }
  }

  const handleTouchEnd = () => {
    const swipeThreshold = 120
    
    const now = Date.now()
    if (now - lastTap < 300 && Math.abs(dragOffset) < 10) {
      setLastTap(0)
      setDragOffset(0)
      setIsDragging(false)
      setCanSwipe(false)
      onDoubleTap()
      return
    }
    setLastTap(now)

    if (isDragging && canSwipe && Math.abs(dragOffset) > swipeThreshold) {
      setIsExpanded(true)
      const direction = dragOffset > 0 ? "right" : "left"

      setTimeout(() => {
        onSwipe(direction)
        setDragOffset(0)
        setIsExpanded(false)
        setIsDragging(false)
        setCanSwipe(false)
      }, 150)
    } else {
      setDragOffset(0)
      setIsDragging(false)
      setCanSwipe(false)
    }
  }

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onImageTap()
  }

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onImageTap()
  }

  const rotation = dragOffset * 0.04
  const opacity = Math.max(0.4, 1 - Math.abs(dragOffset) / 400)
  const scale = 1 - Math.abs(dragOffset) / 3000

  const riskColors = {
    low: "text-green-600 bg-green-50 border-green-200",
    medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
    high: "text-red-600 bg-red-50 border-red-200",
  }

  return (
    <div className="relative h-[calc(100dvh-200px)] md:h-[calc(100vh-200px)] w-full">
      <Card
        ref={cardRef}
        className={cn(
          "relative h-full w-full overflow-hidden glass border-2 border-white/40 dark:border-neutral-800 dark:bg-black shadow-2xl transition-all rounded-3xl flex flex-col",
          isExpanded && "duration-200 ease-out",
          !isExpanded && isDragging && "cursor-grabbing",
          !isDragging && "cursor-grab",
        )}
        style={{
          transform: `translateX(${dragOffset}px) rotate(${rotation}deg) scale(${scale})`,
          opacity: isDragging ? opacity : 1,
          transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease-out",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image Section with Launch Badge - Centered */}
        <div
          className="relative h-[40%] w-full bg-white dark:bg-black border-b border-gray-100 dark:border-neutral-800 shrink-0 cursor-pointer active:opacity-90 transition-opacity flex items-center justify-center p-4 overflow-hidden"
          onClick={handleImageClick}
        >
          {/* Launch Badge - Top Left */}
          {coin.launchpad && (
            <div className="absolute top-3 left-3 px-2 py-0.5 bg-gray-700 dark:bg-neutral-700 text-white text-[9px] font-semibold rounded-md shadow-sm">
              {coin.launchpad.toUpperCase()}
            </div>
          )}
          {/* Centered Image */}
          <div className="flex items-center justify-center">
            <Image
              src={coin.image || "/placeholder.svg"}
              alt={coin.name}
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto overscroll-contain bg-white dark:bg-black"
          onScroll={handleScroll}
        >
          {/* Hero Section - Big $TICKER */}
          <div className="text-center px-6 py-4 border-b border-gray-100 dark:border-neutral-800">
            <h1 className="text-2xl font-bold tracking-tight mb-1 font-sans">${coin.symbol}</h1>
            <p className="text-xs text-gray-500 mb-3">{coin.name}</p>
            <div className="flex items-center justify-center gap-6 py-1 mb-3">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-gray-400 font-medium">PRICE</span>
                <span className="text-lg font-bold text-black dark:text-white font-numbers">{coin.price}</span>
              </div>
              <div className="h-5 w-px bg-gray-200" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-gray-400 font-medium">MARKET CAP</span>
                <span className="text-lg font-bold text-gray-500 font-numbers">{coin.marketCap ?? "—"}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <span className="text-[9px] text-gray-700 dark:text-neutral-400 px-1.5 py-0.5 rounded-md bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700">
                Vol {coin.volume24h}
              </span>
              <span className="text-[9px] text-gray-700 dark:text-neutral-400 px-1.5 py-0.5 rounded-md bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700">
                Age {coin.age}
              </span>
              {coin.holders && (
                <span className="text-[9px] text-gray-700 dark:text-neutral-400 px-1.5 py-0.5 rounded-md bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700">
                  {coin.holders} holders
                </span>
              )}
            </div>
          </div>

          {/* Copy Address Button */}
          <div className="px-6 py-2 flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigator.clipboard.writeText(coin.mint)
              }}
              className="text-[10px] text-gray-700 dark:text-neutral-400 px-3 py-1.5 rounded-md bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-neutral-600 transition-colors"
            >
              Copy Address
            </button>
          </div>

          {/* Icon Row */}
          <div className="flex items-center justify-around gap-1 pt-2 pb-2">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="rounded-lg p-1.5">
                {coin.launchpad === "pumpfun" && (
                  <Image src="/launchpad-pumpfun.png" alt="Pump.fun" width={20} height={20} className="object-contain" />
                )}
                {coin.launchpad === "meteora" && (
                  <Image src="/launchpad-meteora.png" alt="Meteora" width={20} height={20} className="object-contain" />
                )}
                {coin.launchpad === "raydium" && (
                  <Image src="/raydium-ray-logo.png" alt="Raydium" width={20} height={20} className="object-contain" />
                )}
                {coin.launchpad === "jupiter" && (
                  <Image src="/launchpad-jupiter.jpg" alt="Jupiter" width={20} height={20} className="object-contain" />
                )}
                {coin.launchpad === "bonk" && (
                  <Image src="/bonk.png" alt="Bonk" width={20} height={20} className="object-contain" />
                )}
                {(!coin.launchpad ||
                  (coin.launchpad !== "pumpfun" &&
                    coin.launchpad !== "meteora" &&
                    coin.launchpad !== "raydium" &&
                    coin.launchpad !== "jupiter" &&
                    coin.launchpad !== "bonk")) && (
                  <div className="h-5 w-5 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg" />
                )}
              </div>
              <span className="text-[9px] text-gray-700 dark:text-neutral-400 font-medium capitalize">
                {coin.launchpad || "Launch"}
              </span>
            </div>

            <a
              href={coin.website || `https://dexscreener.com/solana/${coin.mint}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-1 flex-1 group"
            >
              <div className="rounded-lg p-1.5 group-hover:scale-110 active:scale-95 transition-all">
                <Globe className="h-5 w-5 text-gray-700 dark:text-neutral-400" />
              </div>
              <span className="text-[9px] text-gray-700 dark:text-neutral-400">Website</span>
            </a>

            <a
              href={`https://twitter.com/search?q=${coin.symbol}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-1 flex-1 group"
            >
              <div className="rounded-lg p-1.5 group-hover:scale-110 active:scale-95 transition-all">
                <svg className="h-5 w-5 text-gray-700 dark:text-neutral-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <span className="text-[9px] text-gray-700 dark:text-neutral-400">Twitter</span>
            </a>

          </div>

          <div className="pt-1">
            <p className="text-[9px] text-muted-foreground text-center truncate">
              Creator: <span className="font-mono font-medium text-[8px]">{coin.creator}</span>
            </p>
          </div>

          <div className="h-2" />
        </div>
      </Card>
    </div>
  )
}
