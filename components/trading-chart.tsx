"use client"

import { useEffect, useRef, useState } from "react"
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, Bar, Line } from "recharts";
import { Button } from "@/components/ui/button"
import { Loader2, TrendingUp, TrendingDown } from "lucide-react"
import { fetchTokenChart } from "@/lib/api-enhanced"

interface TradingChartProps {
  tokenAddress: string
  tokenSymbol: string
  className?: string
}

type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d"
type ChartType = "candlestick" | "line" | "area"

export function TradingChart({ tokenAddress, tokenSymbol, className }: TradingChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("1h")
  const [chartType, setChartType] = useState<ChartType>("candlestick")
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    currentPrice: 0,
    change24h: 0,
    high24h: 0,
    low24h: 0,
    volume24h: 0
  })

  useEffect(() => {
    async function loadChartData() {
      setLoading(true)
      setError(null)

      try {
        const data: any = await fetchTokenChart(tokenAddress, timeframe)

        if (!data || !data.result || data.result.length === 0) {
          setError("No chart data available")
          setChartData([])
          return
        }

        const candles = data.result

        // Calculate stats
        const prices = candles.map((c: any) => parseFloat(String(c.close)))
        const volumes = candles.map((c: any) => parseFloat(String(c.volume)))
        const currentPrice = prices[prices.length - 1]
        const firstPrice = prices[0]
        const change24h = ((currentPrice - firstPrice) / firstPrice) * 100

        setStats({
          currentPrice,
          change24h,
          high24h: Math.max(...prices),
          low24h: Math.min(...prices),
          volume24h: volumes.reduce((a: number, b: number) => a + b, 0)
        })

        // Transform data for Recharts
        const transformed = candles.map((candle: any) => ({
          time: new Date(candle.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          open: parseFloat(String(candle.open)),
          high: parseFloat(String(candle.high)),
          low: parseFloat(String(candle.low)),
          close: parseFloat(String(candle.close)),
          volume: parseFloat(String(candle.volume))
        }))

        setChartData(transformed)
      } catch (err) {
        console.error("[Chart] Error:", err)
        setError("Failed to load chart data")
        setChartData([])
      } finally {
        setLoading(false)
      }
    }

    loadChartData()
  }, [tokenAddress, timeframe, chartType])

  const timeframes: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "1d"]
  const chartTypes: { value: ChartType; label: string }[] = [
    { value: "candlestick", label: "Candles" },
    { value: "area", label: "Area" },
    { value: "line", label: "Line" },
  ]

  if (error || chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center px-4 bg-white">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-600 mb-1">
            📊 Chart data will be available soon
          </p>
          <p className="text-xs text-gray-400">
            New tokens need time to build price history
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => window.open(`https://dexscreener.com/solana/${tokenAddress}`, "_blank")}
          >
            View on DexScreener
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => window.open(`https://birdeye.so/token/${tokenAddress}?chain=solana`, "_blank")}
          >
            View on Birdeye
          </Button>
        </div>
      </div>
    )
  }

  const chartColor = stats.change24h >= 0 ? "#22c55e" : "#ef4444"

  return (
    <div className={`flex flex-col bg-white ${className}`}>
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-4 pt-2">
        <div className="space-y-1">
          <p className="text-xs text-gray-400">Price</p>
          <p className="text-base font-bold">${stats.currentPrice.toFixed(8)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-400">24h Change</p>
          <p className={`text-base font-bold flex items-center gap-1 ${stats.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
            {stats.change24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {stats.change24h >= 0 ? "+" : ""}{stats.change24h.toFixed(2)}%
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-400">24h High</p>
          <p className="text-base font-bold">${stats.high24h.toFixed(8)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-400">24h Low</p>
          <p className="text-base font-bold">${stats.low24h.toFixed(8)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-400">24h Volume</p>
          <p className="text-base font-bold">${(stats.volume24h / 1000000).toFixed(2)}M</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 gap-3">
        {/* Timeframe Selector */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant="ghost"
              size="sm"
              onClick={() => setTimeframe(tf)}
              className={`h-8 px-4 text-xs font-medium transition-all ${
                timeframe === tf 
                  ? "bg-white dark:bg-gray-700 shadow-sm" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              {tf}
            </Button>
          ))}
        </div>

        {/* Chart Type Selector */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {chartTypes.map((ct) => (
            <Button
              key={ct.value}
              variant="ghost"
              size="sm"
              onClick={() => setChartType(ct.value)}
              className={`h-8 px-4 text-xs font-medium transition-all ${
                chartType === ct.value 
                  ? "bg-white dark:bg-gray-700 shadow-sm" 
                  : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}
            >
              {ct.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Chart - Clean Candlesticks */}
      <div className="relative px-4 py-4">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              domain={['dataMin', 'dataMax']}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px',
                padding: '8px 12px'
              }}
              labelStyle={{ color: '#6b7280', fontWeight: 500 }}
            />
            <Bar 
              dataKey="close" 
              fill={chartColor}
              maxBarSize={8}
            />
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke={chartColor}
              strokeWidth={1.5}
              dot={false}
              opacity={0.3}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
