"use client"

import { useState, useId } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { useSliderWithInput } from "@/hooks/use-slider-with-input"
import { cn } from "@/lib/utils"

interface AdvancedFilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type FilterMode = "degen" | "normal" | "safe" | null

export function AdvancedFilterModal({ open, onOpenChange }: AdvancedFilterModalProps) {
  const volumeId = useId()
  const liquidityId = useId()
  const marketCapId = useId()

  const [selectedMode, setSelectedMode] = useState<FilterMode>(null)
  const [ageMin, setAgeMin] = useState("")
  const [ageMax, setAgeMax] = useState("")

  const volumeSlider = useSliderWithInput({
    minValue: 0,
    maxValue: 1000000,
    initialValue: [0, 1000000],
  })

  const liquiditySlider = useSliderWithInput({
    minValue: 0,
    maxValue: 200000,
    initialValue: [0, 200000],
  })

  const marketCapSlider = useSliderWithInput({
    minValue: 0,
    maxValue: 10000000,
    initialValue: [0, 10000000],
  })

  const applyModePreset = (mode: FilterMode) => {
    if (selectedMode === mode) {
      setSelectedMode(null)
      resetFilters()
      return
    }

    setSelectedMode(mode)

    if (mode === "degen") {
      marketCapSlider.handleSliderChange([10000, 100000])
      setAgeMin("1")
      setAgeMax("6")
      liquiditySlider.handleSliderChange([5000, 200000])
    } else if (mode === "normal") {
      marketCapSlider.handleSliderChange([1000000, 4000000])
      setAgeMin("168")
      setAgeMax("")
      liquiditySlider.handleSliderChange([10000, 200000])
    } else if (mode === "safe") {
      marketCapSlider.handleSliderChange([5000000, 10000000])
      setAgeMin("168")
      setAgeMax("")
      liquiditySlider.handleSliderChange([50000, 200000])
    }
  }

  const resetFilters = () => {
    setSelectedMode(null)
    volumeSlider.handleSliderChange([0, 1000000])
    liquiditySlider.handleSliderChange([0, 200000])
    marketCapSlider.handleSliderChange([0, 10000000])
    setAgeMin("")
    setAgeMax("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden bg-white dark:bg-black rounded-2xl">
        <DialogHeader className="pb-4 border-b border-gray-200 dark:border-neutral-800">
          <DialogTitle className="text-lg font-bold">Filters</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-160px)]">
          <div className="space-y-5 py-2 pr-4">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-600 dark:text-neutral-400 uppercase tracking-wide">Presets</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  onClick={() => applyModePreset("degen")}
                  className={cn(
                    "h-9 px-3 text-xs font-semibold transition-all rounded-lg",
                    selectedMode === "degen"
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-800",
                  )}
                >
                  Degen
                </Button>

                <Button
                  size="sm"
                  onClick={() => applyModePreset("normal")}
                  className={cn(
                    "h-9 px-3 text-xs font-semibold transition-all rounded-lg",
                    selectedMode === "normal"
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : "bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-800",
                  )}
                >
                  Normal
                </Button>

                <Button
                  size="sm"
                  onClick={() => applyModePreset("safe")}
                  className={cn(
                    "h-9 px-3 text-xs font-semibold transition-all rounded-lg",
                    selectedMode === "safe"
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-800",
                  )}
                >
                  Safe
                </Button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-neutral-800">
              <p className="text-xs font-semibold text-gray-600 dark:text-neutral-400 uppercase tracking-wide">Manual Filters</p>

              {/* Volume Filter with Slider */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Volume (24h)</Label>
                <div>
                  <Slider
                    value={volumeSlider.sliderValue}
                    onValueChange={volumeSlider.handleSliderChange}
                    min={0}
                    max={1000000}
                    step={10000}
                    aria-label="Volume range"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        id={`${volumeId}-min`}
                        className="peer h-8 text-xs ps-6"
                        type="text"
                        inputMode="decimal"
                        value={volumeSlider.inputValues[0]}
                        onChange={(e) => volumeSlider.handleInputChange(e, 0)}
                        onBlur={() => volumeSlider.validateAndUpdateValue(volumeSlider.inputValues[0], 0)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            volumeSlider.validateAndUpdateValue(volumeSlider.inputValues[0], 0)
                          }
                        }}
                        placeholder="Min"
                      />
                      <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-xs text-muted-foreground">
                        $
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        id={`${volumeId}-max`}
                        className="peer h-8 text-xs ps-6"
                        type="text"
                        inputMode="decimal"
                        value={volumeSlider.inputValues[1]}
                        onChange={(e) => volumeSlider.handleInputChange(e, 1)}
                        onBlur={() => volumeSlider.validateAndUpdateValue(volumeSlider.inputValues[1], 1)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            volumeSlider.validateAndUpdateValue(volumeSlider.inputValues[1], 1)
                          }
                        }}
                        placeholder="Max"
                      />
                      <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-xs text-muted-foreground">
                        $
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Liquidity Filter with Slider */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Liquidity</Label>
                <div>
                  <Slider
                    value={liquiditySlider.sliderValue}
                    onValueChange={liquiditySlider.handleSliderChange}
                    min={0}
                    max={200000}
                    step={5000}
                    aria-label="Liquidity range"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        id={`${liquidityId}-min`}
                        className="peer h-8 text-xs ps-6"
                        type="text"
                        inputMode="decimal"
                        value={liquiditySlider.inputValues[0]}
                        onChange={(e) => liquiditySlider.handleInputChange(e, 0)}
                        onBlur={() => liquiditySlider.validateAndUpdateValue(liquiditySlider.inputValues[0], 0)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            liquiditySlider.validateAndUpdateValue(liquiditySlider.inputValues[0], 0)
                          }
                        }}
                        placeholder="Min"
                      />
                      <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-xs text-muted-foreground">
                        $
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        id={`${liquidityId}-max`}
                        className="peer h-8 text-xs ps-6"
                        type="text"
                        inputMode="decimal"
                        value={liquiditySlider.inputValues[1]}
                        onChange={(e) => liquiditySlider.handleInputChange(e, 1)}
                        onBlur={() => liquiditySlider.validateAndUpdateValue(liquiditySlider.inputValues[1], 1)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            liquiditySlider.validateAndUpdateValue(liquiditySlider.inputValues[1], 1)
                          }
                        }}
                        placeholder="Max"
                      />
                      <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-xs text-muted-foreground">
                        $
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market Cap Filter with Slider */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Market Cap</Label>
                <div>
                  <Slider
                    value={marketCapSlider.sliderValue}
                    onValueChange={marketCapSlider.handleSliderChange}
                    min={0}
                    max={10000000}
                    step={100000}
                    aria-label="Market cap range"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        id={`${marketCapId}-min`}
                        className="peer h-8 text-xs ps-6"
                        type="text"
                        inputMode="decimal"
                        value={marketCapSlider.inputValues[0]}
                        onChange={(e) => marketCapSlider.handleInputChange(e, 0)}
                        onBlur={() => marketCapSlider.validateAndUpdateValue(marketCapSlider.inputValues[0], 0)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            marketCapSlider.validateAndUpdateValue(marketCapSlider.inputValues[0], 0)
                          }
                        }}
                        placeholder="Min"
                      />
                      <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-xs text-muted-foreground">
                        $
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        id={`${marketCapId}-max`}
                        className="peer h-8 text-xs ps-6"
                        type="text"
                        inputMode="decimal"
                        value={marketCapSlider.inputValues[1]}
                        onChange={(e) => marketCapSlider.handleInputChange(e, 1)}
                        onBlur={() => marketCapSlider.validateAndUpdateValue(marketCapSlider.inputValues[1], 1)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            marketCapSlider.validateAndUpdateValue(marketCapSlider.inputValues[1], 1)
                          }
                        }}
                        placeholder="Max"
                      />
                      <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-xs text-muted-foreground">
                        $
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Age Filter */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">Age (hours)</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (ageMax === "1") {
                        setAgeMin("")
                        setAgeMax("")
                      } else {
                        setAgeMin("0")
                        setAgeMax("1")
                      }
                    }}
                    className={cn(
                      "text-[10px] h-7 transition-all border shadow-sm rounded-lg",
                      ageMax === "1"
                        ? "bg-orange-500/10 border-orange-200 text-orange-700 hover:bg-orange-500/15"
                        : "bg-white/80 hover:bg-gray-100 hover:shadow-md hover:border-gray-300 hover:text-gray-900 text-gray-700 border-border/30",
                    )}
                  >
                    {"<1h"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (ageMin === "1" && ageMax === "6") {
                        setAgeMin("")
                        setAgeMax("")
                      } else {
                        setAgeMin("1")
                        setAgeMax("6")
                      }
                    }}
                    className={cn(
                      "text-[10px] h-7 transition-all border shadow-sm rounded-lg",
                      ageMin === "1" && ageMax === "6"
                        ? "bg-orange-500/10 border-orange-200 text-orange-700 hover:bg-orange-500/15"
                        : "bg-white/80 hover:bg-gray-100 hover:shadow-md hover:border-gray-300 hover:text-gray-900 text-gray-700 border-border/30",
                    )}
                  >
                    1-6h
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (ageMin === "6" && ageMax === "24") {
                        setAgeMin("")
                        setAgeMax("")
                      } else {
                        setAgeMin("6")
                        setAgeMax("24")
                      }
                    }}
                    className={cn(
                      "text-[10px] h-7 transition-all border shadow-sm rounded-lg",
                      ageMin === "6" && ageMax === "24"
                        ? "bg-orange-500/10 border-orange-200 text-orange-700 hover:bg-orange-500/15"
                        : "bg-white/80 hover:bg-gray-100 hover:shadow-md hover:border-gray-300 hover:text-gray-900 text-gray-700 border-border/30",
                    )}
                  >
                    6-24h
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (ageMin === "24" && ageMax === "168") {
                        setAgeMin("")
                        setAgeMax("")
                      } else {
                        setAgeMin("24")
                        setAgeMax("168")
                      }
                    }}
                    className={cn(
                      "text-[10px] h-7 transition-all border shadow-sm rounded-lg",
                      ageMin === "24" && ageMax === "168"
                        ? "bg-orange-500/10 border-orange-200 text-orange-700 hover:bg-orange-500/15"
                        : "bg-white/80 hover:bg-gray-100 hover:shadow-md hover:border-gray-300 hover:text-gray-900 text-gray-700 border-border/30",
                    )}
                  >
                    1-7d
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min (hours)"
                    value={ageMin}
                    onChange={(e) => setAgeMin(e.target.value)}
                    className="h-8 text-xs flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Max (hours)"
                    value={ageMax}
                    onChange={(e) => setAgeMax(e.target.value)}
                    className="h-8 text-xs flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-3 pt-3 pb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="flex-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow transition-all duration-200"
          >
            Reset
          </Button>
          <Button
            size="sm"
            onClick={() => onOpenChange(false)}
            className="flex-1 text-xs font-semibold bg-gradient-to-b from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
