"use client"

import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react"

import { useMarketOverview } from "@/hooks/useMarketOverview"
import { formatCurrency, formatPercent } from "@/lib/number-formatters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MarketOverview() {
  const { data, isLoading, error } = useMarketOverview()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading market data…</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">Unable to load market overview.</p>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Market Overview
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Updated {new Date(data.generatedAt).toLocaleTimeString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total Market Cap</p>
            <p className="text-lg font-semibold">
              {formatCurrency(data.totalMarketCapUsd)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Average 24h Move</p>
            <p
              className="text-lg font-semibold"
              data-positive={data.averageChange24h >= 0}
            >
              {formatPercent(data.averageChange24h / 100)}
            </p>
          </div>
        </section>

        <section className="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              Top Gainers
            </p>
            <ul className="space-y-2">
              {data.topGainers.map((coin) => (
                <li
                  key={coin.id}
                  className="flex items-center justify-between rounded-lg bg-emerald-500/10 px-3 py-2 text-emerald-600 dark:text-emerald-400"
                >
                  <span className="font-medium">{coin.name}</span>
                  <span className="flex items-center gap-1 text-xs">
                    <ArrowUpRight className="h-4 w-4" />
                    {coin.change24h}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              Top Losers
            </p>
            <ul className="space-y-2">
              {data.topLosers.map((coin) => (
                <li
                  key={coin.id}
                  className="flex items-center justify-between rounded-lg bg-rose-500/10 px-3 py-2 text-rose-600 dark:text-rose-400"
                >
                  <span className="font-medium">{coin.name}</span>
                  <span className="flex items-center gap-1 text-xs">
                    <ArrowDownRight className="h-4 w-4" />
                    {coin.change24h}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <p className="text-xs text-muted-foreground">
          Based on {data.sampleSize} trending Solana assets.
        </p>
      </CardContent>
    </Card>
  )
}
