"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"

interface PriceChange {
  coin: string
  change: string
  isPositive: boolean
}

const PRICE_CHANGES: PriceChange[] = [
  { coin: "PEPE", change: "+24.5%", isPositive: true },
  { coin: "WIF", change: "+18.2%", isPositive: true },
  { coin: "BONK", change: "+31.7%", isPositive: true },
  { coin: "DOGE", change: "+12.3%", isPositive: true },
  { coin: "SHIB", change: "-5.8%", isPositive: false },
  { coin: "FLOKI", change: "+9.4%", isPositive: true },
  { coin: "SAMO", change: "+15.6%", isPositive: true },
  { coin: "MYRO", change: "+22.1%", isPositive: true },
]

export function ActivityBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 3) % PRICE_CHANGES.length)
        setIsVisible(true)
      }, 400)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const priceChange1 = PRICE_CHANGES[currentIndex]
  const priceChange2 = PRICE_CHANGES[(currentIndex + 1) % PRICE_CHANGES.length]
  const priceChange3 = PRICE_CHANGES[(currentIndex + 2) % PRICE_CHANGES.length]

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
