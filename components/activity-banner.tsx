
"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"
import { useCoins } from "@/hooks/useCoins"

interface PriceChange {
  coin: string
  change: string
  isPositive: boolean
}

export function ActivityBanner() {
  const { data: coins, isLoading } = useCoins('trending')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [priceChanges, setPriceChanges] = useState<PriceChange[]>([])

  useEffect(() => {
    if (coins && coins.length > 0) {
      // Extract price changes from trending coins
      const changes = coins
        .filter(coin => coin.priceChange24h !== undefined && coin.priceChange24h !== null)
        .map(coin => ({
          coin: coin.symbol || coin.name || 'Unknown',
          change: `${coin.priceChange24h > 0 ? '+' : ''}${coin.priceChange24h.toFixed(1)}%`,
          isPositive: coin.priceChange24h > 0
        }))
        .slice(0, 15) // Get top 15 for rotation

      if (changes.length > 0) {
        setPriceChanges(changes)
      }
    }
  }, [coins])

  useEffect(() => {
    if (priceChanges.length === 0) return

    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 3) % priceChanges.length)
        setIsVisible(true)
      }, 400)
    }, 6000)

    return () => clearInterval(interval)
  }, [priceChanges])

  if (isLoading || priceChanges.length === 0) {
    return (
      <div className="overflow-hidden w-full flex justify-start">
        <div className="flex items-center gap-2 text-[9px] font-semibold text-muted-foreground">
          <span>Loading prices...</span>
        </div>
      </div>
    )
  }

  const priceChange1 = priceChanges[currentIndex]
  const priceChange2 = priceChanges[(currentIndex + 1) % priceChanges.length]
  const priceChange3 = priceChanges[(currentIndex + 2) % priceChanges.length]

  return (
    <div className="overflow-hidden w-full flex justify-start">
      <div
        className={`flex items-center gap-2 text-[9px] font-semibold whitespace-nowrap text-muted-foreground transition-all duration-500 ease-in-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
        }`}
        key={currentIndex}
      >
        <div className="flex items-center gap-1">
          {priceChange1.isPositive ? (
            <TrendingUp className="h-2.5 w-2.5 text-green-600" />
          ) : (
            <TrendingDown className="h-2.5 w-2.5 text-red-600" />
          )}
          <span className={priceChange1.isPositive ? "text-green-600" : "text-red-600"}>
            {priceChange1.coin} {priceChange1.change}
          </span>
        </div>

        <span className="text-gray-400">•</span>

        <div className="flex items-center gap-1">
          {priceChange2.isPositive ? (
            <TrendingUp className="h-2.5 w-2.5 text-green-600" />
          ) : (
            <TrendingDown className="h-2.5 w-2.5 text-red-600" />
          )}
          <span className={priceChange2.isPositive ? "text-green-600" : "text-red-600"}>
            {priceChange2.coin} {priceChange2.change}
          </span>
        </div>

        <span className="text-gray-400">•</span>

        <div className="flex items-center gap-1">
          {priceChange3.isPositive ? (
            <TrendingUp className="h-2.5 w-2.5 text-green-600" />
          ) : (
            <TrendingDown className="h-2.5 w-2.5 text-red-600" />
          )}
          <span className={priceChange3.isPositive ? "text-green-600" : "text-red-600"}>
            {priceChange3.coin} {priceChange3.change}
          </span>
        </div>
      </div>
    </div>
  )
}
