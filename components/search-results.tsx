"use client"

import { useState, useEffect } from "react"
import { searchCoinsFromAPI } from "@/lib/api-client"
import { useThemeStorage } from "@/hooks/useThemeStorage"
import type { EnrichedCoin } from "@/lib/types"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Plus, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchResultsProps {
  query: string
  onSelectCoin: (coin: EnrichedCoin) => void
}

export function SearchResults({ query, onSelectCoin }: SearchResultsProps) {
  const [results, setResults] = useState<EnrichedCoin[]>([])
  const [loading, setLoading] = useState(false)
  const { addCoin, isCoinInTheme } = useThemeStorage()

  useEffect(() => {
    if (!query || query.length < 1) {
      setResults([])
      return
    }

    const search = async () => {
      setLoading(true)
      const result = await searchCoinsFromAPI(query)
      setResults(result.tokens || [])
      setLoading(false)
    }

    const timeout = setTimeout(search, 300)
    return () => clearTimeout(timeout)
  }, [query])

  if (!query) return null

  return (
    <div className="space-y-2">
      {loading && (
        <div className="px-4 py-2 text-xs text-muted-foreground">
          Searching...
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <div className="px-4 py-2 text-xs text-muted-foreground">
          No coins found
        </div>
      )}

      {results.map((coin) => (
        <div
          key={coin.mint}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-neutral-900 cursor-pointer rounded-lg transition-colors"
          onClick={() => onSelectCoin(coin)}
        >
          <Image
            src={coin.image}
            alt={coin.name}
            width={32}
            height={32}
            className="rounded-full"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"
            }}
          />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">${coin.symbol}</p>
            <p className="text-xs text-gray-500 truncate">{coin.name}</p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              addCoin("trending", coin.mint)
            }}
            className="h-6 w-6 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  )
}
