"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { fetchTokenChart } from "@/lib/api-enhanced"

interface TokenChartProps {
  tokenAddress: string
  tokenSymbol: string
  className?: string
}

type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d"

export function TokenChart({ tokenAddress, tokenSymbol, className }: TokenChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("15m")
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadChart() {
      setLoading(true)
      setError(null)
      
      try {
        const data: any = await fetchTokenChart(tokenAddress, timeframe)
        
        // Chart data not available - show external links
        if (!data) {
          setError("Chart data not available")
          setChartData([])
          return
        }

        // Handle different response structures
        const candles = data?.result || data?.data || data
        
        if (!candles || !Array.isArray(candles) || candles.length === 0) {
          setError("Chart data not available")
          setChartData([])
          return
        }

        // Transform OHLCV data for chart
        const transformed = candles.map((candle: any) => ({
          time: new Date(candle.timestamp || candle.time || candle.date).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          price: parseFloat(String(candle.close || candle.price || candle.c || "0")),
          high: parseFloat(String(candle.high || candle.h || "0")),
          low: parseFloat(String(candle.low || candle.l || "0")),
          volume: parseFloat(String(candle.volume || candle.v || "0")),
        }))

        setChartData(transformed)
      } catch (err) {
        setError("Chart data not available")
        setChartData([])
      } finally {
        setLoading(false)
      }
    }

    loadChart()
  }, [tokenAddress, timeframe])

  const timeframes: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "1d"]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
        <div className="mb-4">
          <p className="text-sm font-semibold text-muted-foreground mb-1">
            📊 Chart data will be available soon
          </p>
          <p className="text-xs text-muted-foreground">
            New tokens need time to build price history
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => window.open(`https://dexscreener.com/solana/${tokenAddress}`, '_blank')}
          >
            View on DexScreener
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => window.open(`https://birdeye.so/token/${tokenAddress}?chain=solana`, '_blank')}
          >
            View on Birdeye
          </Button>
        </div>
      </div>
    )
  }

  const minPrice = Math.min(...chartData.map(d => d.low || d.price))
  const maxPrice = Math.max(...chartData.map(d => d.high || d.price))
  const priceChange = chartData.length > 1 
    ? ((chartData[chartData.length - 1].price - chartData[0].price) / chartData[0].price) * 100
    : 0

  return (
    <div className={className}>
      {/* Timeframe Selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className="text-xs px-2 py-1 h-7"
            >
              {tf}
            </Button>
          ))}
        </div>
        <div className={`text-sm font-semibold ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={priceChange >= 0 ? "#22c55e" : "#ef4444"} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={priceChange >= 0 ? "#22c55e" : "#ef4444"} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="#888"
            fontSize={10}
            tickLine={false}
          />
          <YAxis 
            domain={[minPrice * 0.99, maxPrice * 1.01]}
            stroke="#888"
            fontSize={10}
            tickLine={false}
            tickFormatter={(value) => {
              if (value < 0.000001) return value.toExponential(2)
              if (value < 0.01) return value.toFixed(6)
              if (value < 1) return value.toFixed(4)
              return value.toFixed(2)
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: any) => {
              const num = parseFloat(value)
              if (num < 0.000001) return num.toExponential(6)
              if (num < 0.01) return `$${num.toFixed(8)}`
              if (num < 1) return `$${num.toFixed(6)}`
              return `$${num.toFixed(4)}`
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={priceChange >= 0 ? "#22c55e" : "#ef4444"}
            strokeWidth={2}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
        <div className="bg-secondary/30 rounded p-2">
          <p className="text-muted-foreground">High</p>
          <p className="font-semibold">${maxPrice < 0.01 ? maxPrice.toFixed(8) : maxPrice.toFixed(4)}</p>
        </div>
        <div className="bg-secondary/30 rounded p-2">
          <p className="text-muted-foreground">Low</p>
          <p className="font-semibold">${minPrice < 0.01 ? minPrice.toFixed(8) : minPrice.toFixed(4)}</p>
        </div>
        <div className="bg-secondary/30 rounded p-2">
          <p className="text-muted-foreground">Candles</p>
          <p className="font-semibold">{chartData.length}</p>
        </div>
      </div>
    </div>
  )
}
