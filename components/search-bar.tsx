"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { EnrichedCoin } from "@/lib/types"
import { MEME_THEMES } from "@/lib/theme-detector"
import { searchCoins } from "@/lib/search-service"

interface SearchBarProps {
  coins: EnrichedCoin[]
  onSelectCoin: (coin: EnrichedCoin) => void
  onSelectTheme: (themeId: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ coins, onSelectCoin, onSelectTheme, placeholder = "Search...", className }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [searchResults, setSearchResults] = useState<EnrichedCoin[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Search via Moralis API
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const performSearch = async () => {
      setIsSearching(true)
      const results = await searchCoins(query)
      setSearchResults(results)
      setIsSearching(false)
    }

    const timeout = setTimeout(performSearch, 300)
    return () => clearTimeout(timeout)
  }, [query])

  // Filter local coins and themes
  const filteredCoins = query.trim()
    ? coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(query.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : []

  const filteredThemes = query.trim()
    ? Object.values(MEME_THEMES).filter(
        (theme) =>
          theme.name.toLowerCase().includes(query.toLowerCase()) ||
          theme.keywords.some((kw) => kw.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 2)
    : []

  // Combine results: local coins first, then search results, then themes
  const allResults = [
    ...filteredCoins,
    ...searchResults.filter(r => !filteredCoins.some(c => c.mint === r.mint)),
    ...filteredThemes.map(t => ({ ...t, isTheme: true }))
  ]

  // Show dropdown when typing
  useEffect(() => {
    setShowDropdown(query.trim().length > 0)
  }, [query])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleClear = () => {
    setQuery("")
    setShowDropdown(false)
  }

  const handleSelectCoin = (coin: EnrichedCoin) => {
    setQuery("")
    setShowDropdown(false)
    onSelectCoin(coin)
  }

  const handleSelectTheme = (themeId: string) => {
    setQuery("")
    setShowDropdown(false)
    onSelectTheme(themeId)
  }

  return (
    <div className={cn("relative", className)}>
      {/* Always-open search bar */}
      <div className="flex items-center gap-3 px-0 py-0 bg-transparent w-full">
        <Search className="h-4 w-4 text-gray-500 dark:text-neutral-500 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setShowDropdown(true)}
          placeholder="Coins, themes, etc"
          className="border-0 p-0 h-auto text-sm focus-visible:outline-none bg-transparent flex-1 min-w-0 placeholder:text-[12px] placeholder:text-gray-400 dark:placeholder:text-neutral-600 caret-gray-400 dark:caret-neutral-500"
        />
        {query && (
          <button
            onClick={handleClear}
            className="shrink-0 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors"
          >
            <X className="h-4 w-4 text-gray-500 dark:text-neutral-500" />
          </button>
        )}
      </div>

      {/* Fire dropdown with results */}
      {showDropdown && (filteredCoins.length > 0 || filteredThemes.length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full mt-0 w-full bg-white dark:bg-black rounded-none border-b border-gray-200 dark:border-neutral-800 shadow-lg z-[100] max-h-[432px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Coins section - FIRST */}
          {filteredCoins.length > 0 && (
            <div className="p-2.5">
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider px-2 mb-1.5">💰 Coins</p>
              <div className="space-y-0.5">
                {filteredCoins.map((coin) => (
                  <button
                    key={coin.id}
                    onClick={() => handleSelectCoin(coin)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-gray-50 rounded-lg transition-all text-left border border-transparent hover:border-gray-200 hover:shadow-sm"
                  >
                    <img
                      src={coin.image}
                      alt={coin.symbol}
                      className="h-7 w-7 rounded-full shrink-0 border border-gray-100"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=32&width=32"
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900">${coin.symbol}</p>
                      <p className="text-[9px] text-gray-400 truncate">{coin.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-gray-900">{coin.price}</p>
                      <p className={cn(
                        "text-xs font-semibold",
                        (coin.change24hNum ?? 0) >= 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {coin.change24h}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Themes section - SECOND */}
          {filteredThemes.length > 0 && (
            <div className="px-2.5 py-1.5 border-t border-gray-100 bg-gray-50/50">
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider px-2 mb-1.5">🎯 Themes</p>
              <div className="space-y-0.5">
                {filteredThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleSelectTheme(theme.id)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-left border border-transparent hover:border-gray-200"
                  >
                    <span className="text-lg">{theme.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900">{theme.name}</p>
                      <p className="text-[9px] text-gray-500 truncate">{theme.keywords.slice(0, 4).join(" • ")}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {filteredCoins.length === 0 && filteredThemes.length === 0 && query.trim() && (
            <div className="p-6 text-center">
              <p className="text-sm text-gray-500 mb-1">No results for <span className="font-semibold">"{query}"</span></p>
              <p className="text-xs text-gray-400">Try searching for a coin name, symbol, or theme</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
