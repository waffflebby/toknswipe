"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, Sparkles } from "lucide-react"
import { PaywallModal } from "@/components/paywall-modal"

const filters = [
  { id: "trending", label: "Trending", premium: false },
  { id: "new", label: "New Launches", premium: true },
  { id: "gainers", label: "Top Gainers", premium: true },
  { id: "volume", label: "High Volume", premium: true },
  { id: "verified", label: "Verified", premium: false },
  { id: "lowcap", label: "Low Cap Gems", premium: true },
]

export function FilterBar() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [filterCount, setFilterCount] = useState(0)
  const [showPaywall, setShowPaywall] = useState(false)
  const maxFreeFilters = 3

  const toggleFilter = (filterId: string, isPremium: boolean) => {
    // Check if trying to add a premium filter when limit reached
    if (isPremium && filterCount >= maxFreeFilters && !activeFilters.includes(filterId)) {
      setShowPaywall(true)
      return
    }

    setActiveFilters((prev) => {
      if (prev.includes(filterId)) {
        setFilterCount((c) => c - 1)
        return prev.filter((id) => id !== filterId)
      } else {
        setFilterCount((c) => c + 1)
        return [...prev, filterId]
      }
    })
  }

  return (
    <>
      <div className="space-y-3 border-b border-border px-6 pb-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Filters</p>
          <Badge variant="secondary" className="text-xs">
            {filterCount}/{maxFreeFilters} free filters
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const isActive = activeFilters.includes(filter.id)
            const isLocked = filter.premium && filterCount >= maxFreeFilters && !isActive

            return (
              <Button
                key={filter.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter(filter.id, filter.premium)}
                className="gap-1.5 text-xs"
              >
                {filter.label}
                {isLocked && <Lock className="h-3 w-3" />}
              </Button>
            )
          })}
        </div>

        {filterCount >= maxFreeFilters && (
          <div className="flex items-center gap-2 rounded-lg bg-premium/10 p-3 text-sm">
            <Sparkles className="h-4 w-4 text-premium" />
            <p className="flex-1 text-xs text-muted-foreground">
              Upgrade to Premium for unlimited filters and exclusive features
            </p>
            <Button size="sm" variant="default" className="bg-premium text-premium-foreground hover:bg-premium/90">
              Upgrade
            </Button>
          </div>
        )}
      </div>

      <PaywallModal open={showPaywall} onOpenChange={setShowPaywall} />
    </>
  )
}
