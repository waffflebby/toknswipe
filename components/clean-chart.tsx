"use client"

import { useEffect, useState } from "react"
import { ComposedChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Customized } from "recharts"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { fetchTokenChartFromAPI } from "@/lib/api-client"

interface CleanChartProps {
  tokenAddress: string
  tokenSymbol: string
  className?: string
  variant?: "full" | "compact"
  height?: number
  showStats?: boolean
}

type Timeframe = "1H" | "1D" | "1W" | "1M" | "ALL"

export function CleanChart({ tokenAddress, tokenSymbol, className, variant = "full", height, showStats = true }: CleanChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("1D")
  const [chartType, setChartType] = useState<"line" | "candles">("line")
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showError, setShowError] = useState(false)
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
      setShowError(false)

      try {
        // Fetch real price data from Moralis
        const data: any = await fetchTokenChartFromAPI(tokenAddress, timeframe)

        const raw = (data?.result ?? data?.data ?? data) as any[]
        if (!raw || !Array.isArray(raw) || raw.length === 0) {
          setError("No chart data available")
          setChartData([])
          return
        }

        const candles = raw

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

        // Transform data for chart with robust OHLC fallbacks
        let lastClose = 0
        const transformed = candles.map((candle: any, index: number) => {
          const date = new Date(candle.timestamp || candle.time || candle.date)
          // Format time based on timeframe
          let timeStr = ''
          if (timeframe === '1H') {
            timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          } else if (timeframe === '1D' || timeframe === '1W') {
            timeStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          } else {
            timeStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' })
          }
          const priceValRaw = candle.close ?? candle.c ?? candle.price
          const priceVal = priceValRaw != null ? parseFloat(String(priceValRaw)) : lastClose || 0
          const oRaw = candle.open ?? candle.o
          const hRaw = candle.high ?? candle.h
          const lRaw = candle.low ?? candle.l
          const cRaw = candle.close ?? candle.c
          const o = oRaw != null ? parseFloat(String(oRaw)) : priceVal
          const h = hRaw != null ? parseFloat(String(hRaw)) : priceVal
          const l = lRaw != null ? parseFloat(String(lRaw)) : priceVal
          const c = cRaw != null ? parseFloat(String(cRaw)) : priceVal
          lastClose = c
          return {
            time: timeStr,
            price: priceVal,
            open: o,
            high: h,
            low: l,
            close: c,
            index,
          }
        })

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

    // Show error message after 1 second if still loading or errored
    const timer = setTimeout(() => {
      setShowError(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [tokenAddress, timeframe])

  const timeframes: Timeframe[] = ["1H", "1D", "1W", "1M", "ALL"]
  const chartHeight = height ?? (variant === "compact" ? 220 : (showStats ? 420 : 480))
  const chartColor = stats.change24h >= 0 ? "#22c55e" : "#ef4444"
  const yMinRaw = chartData.length ? Math.min(...chartData.map((d) => Math.min(d.low ?? d.close ?? d.price))) : 0
  const yMaxRaw = chartData.length ? Math.max(...chartData.map((d) => Math.max(d.high ?? d.close ?? d.price))) : 1
  const range = Math.max(1e-12, yMaxRaw - yMinRaw)
  // Use larger padding for very small ranges to make candles visible
  const pad = range < yMinRaw * 0.001 ? yMinRaw * 0.02 : Math.max(range * 0.05, 1e-12)
  const yMin = yMinRaw - pad
  const yMax = yMaxRaw + pad

  if ((error || chartData.length === 0) && showError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center px-4 bg-white dark:bg-black">
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

  return (
    <div className={`flex flex-col bg-white dark:bg-black ${className}`}>

      {/* Chart - Full height for mobile */}
      <div className="relative px-4 py-4 bg-white dark:bg-black">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 z-10 rounded">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )}
        <ResponsiveContainer width="100%" height={chartHeight}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 0, bottom: 10, left: 0 }}>
            {/* No grid lines for clean look */}
            <XAxis dataKey="index" hide />
            <YAxis
              orientation="right"
              stroke="#9CA3AF"
              style={{ fontSize: '10px', fontWeight: 400 }}
              domain={[yMin, yMax]}
              tickLine={false}
              axisLine={false}
              width={50}
              tickFormatter={(value) => {
                if (value < 0.000001) return value.toExponential(1)
                if (value < 0.01) return `$${value.toFixed(4)}`
                if (value < 1) return `$${value.toFixed(3)}`
                return `$${value.toFixed(2)}`
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                padding: '8px 12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
              wrapperStyle={{ outline: 'none' }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null
                const data = payload[0].payload
                const price = data.close || data.price || 0
                const time = data.time || ''
                return (
                  <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    <div style={{ color: '#9CA3AF', fontSize: '10px', marginBottom: '4px', fontWeight: 500 }}>
                      {time}
                    </div>
                    <div style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>
                      ${typeof price === 'number' ? price.toFixed(6) : price}
                    </div>
                  </div>
                )
              }}
            />
            {chartType === "candles" ? (
              <Customized component={(props: any) => {
                const { xAxisMap, yAxisMap, data, offset } = props
                if (!xAxisMap || !yAxisMap || !data || !offset) return null
                
                const xKey = Object.keys(xAxisMap)[0]
                const yKey = Object.keys(yAxisMap)[0]
                const xScale = xAxisMap[xKey]?.scale
                const yScale = yAxisMap[yKey]?.scale
                if (!xScale || !yScale) return null
                
                // Robinhood-style: wider candles, minimal gaps
                const candleWidth = Math.max(3, offset.width / data.length * 0.85)
                
                return (
                  <g>
                    {data.map((d: any, i: number) => {
                      const x = xScale(d.index)
                      const open = d.open ?? d.close
                      const close = d.close
                      const high = d.high ?? d.close
                      const low = d.low ?? d.close
                      const isUp = close >= open
                      
                      const yHigh = yScale(high)
                      const yLow = yScale(low)
                      const yOpen = yScale(open)
                      const yClose = yScale(close)
                      const bodyTop = Math.min(yOpen, yClose)
                      const bodyHeight = Math.max(Math.abs(yClose - yOpen), 2)
                      
                      return (
                        <g key={i}>
                          <line
                            x1={x}
                            y1={yHigh}
                            x2={x}
                            y2={yLow}
                            stroke={isUp ? "#22c55e" : "#ef4444"}
                            strokeWidth={1.5}
                          />
                          <rect
                            x={x - candleWidth / 2}
                            y={bodyTop}
                            width={candleWidth}
                            height={bodyHeight}
                            fill={isUp ? "#22c55e" : "#ef4444"}
                            opacity={0.9}
                            rx={1}
                          />
                        </g>
                      )
                    })}
                  </g>
                )
              }} />
            ) : (
              <Line 
                type="monotone" 
                dataKey="close" 
                stroke={chartColor} 
                strokeWidth={2.5} 
                dot={false} 
                isAnimationActive={true}
                animationDuration={800}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Time toggles + Chart type below chart */}
      {variant === "full" && (
        <div className="border-t border-gray-100 bg-white dark:bg-black">
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    timeframe === tf 
                      ? "bg-black dark:bg-white text-white dark:text-black shadow-sm" 
                      : "text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setChartType("line")}
                className={`px-2.5 py-1 text-[10px] font-medium rounded transition-all ${
                  chartType === "line"
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType("candles")}
                className={`px-2.5 py-1 text-[10px] font-medium rounded transition-all ${
                  chartType === "candles" 
                    ? "bg-black dark:bg-white text-white dark:text-black" 
                    : "text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
              >
                Candles
              </button>
            </div>
          </div>
          
          {/* Subtle stats */}
          <div className="flex items-center justify-between px-4 py-2 text-[10px] border-t border-gray-50">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-gray-400">24h High:</span>
                <span className="ml-1 font-semibold text-gray-700">${stats.high24h.toFixed(4)}</span>
              </div>
              <div>
                <span className="text-gray-400">24h Low:</span>
                <span className="ml-1 font-semibold text-gray-700">${stats.low24h.toFixed(4)}</span>
              </div>
            </div>
            <div>
              <span className="text-gray-400">Change:</span>
              <span className={`ml-1 font-semibold ${
                stats.change24h >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                {stats.change24h >= 0 ? "+" : ""}{stats.change24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {variant === "full" && showStats && (
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 px-6 py-4 border-t border-gray-100 bg-white dark:bg-black">
          <div>
            <p className="text-[11px] text-gray-400 font-medium mb-0.5">Price</p>
            <p className="text-lg font-semibold text-black font-numbers">${stats.currentPrice.toFixed(8)}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium mb-0.5">24h Change</p>
            <p className={`text-lg font-semibold font-numbers ${stats.change24h >= 0 ? "text-green-600" : "text-red-600"}`}>
              {stats.change24h >= 0 ? "+" : ""}{stats.change24h.toFixed(2)}%
            </p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium mb-0.5">24h High</p>
            <p className="text-sm font-medium text-gray-700 font-numbers">${stats.high24h.toFixed(8)}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 font-medium mb-0.5">24h Low</p>
            <p className="text-sm font-medium text-gray-700 font-numbers">${stats.low24h.toFixed(8)}</p>
          </div>
        </div>
      )}
    </div>
  )
}
