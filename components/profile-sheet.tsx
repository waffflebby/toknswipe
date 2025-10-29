"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  User,
  Crown,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Zap,
  TrendingUp,
  Heart,
  ShoppingCart,
  ChevronUp,
  Gift,
  Sparkles,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { getBadges, getTotalSwipes, getSwipeProgress, getProStatus, getProSinceDate, setProStatus } from "@/lib/storage"
import { useDarkMode } from "@/hooks/use-dark-mode"
import type { Badge as BadgeType } from "@/lib/types"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface ProfileSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileSheet({ open, onOpenChange }: ProfileSheetProps) {
  const { isDark, toggleDarkMode } = useDarkMode()
  const [isPro, setIsPro] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [badges, setBadges] = useState<BadgeType[]>([])
  const [totalSwipes, setTotalSwipes] = useState(0)
  const [swipeProgress, setSwipeProgress] = useState(0)
  const [proSince, setProSince] = useState<Date | null>(null)

  useEffect(() => {
    if (open) {
      const proStatus = getProStatus()
      setIsPro(proStatus)
      setProSince(getProSinceDate())

      const userBadges = getBadges()
      const mockBadges: BadgeType[] = [
        { id: "early-bird", name: "Early Bird", description: "First 10,000 users", icon: "🌟", earned: true },
        { id: "og-swiper", name: "OG Swiper", description: "Downloaded in first month", icon: "💎", earned: true },
        { id: "degen", name: "Degen", description: "10,000+ swipes", icon: "🔥", earned: true },
      ]

      if (proStatus) {
        mockBadges.push({ id: "pro", name: "PRO Member", description: "Premium subscriber", icon: "👑", earned: true })
      }

      setBadges(userBadges.length > 0 ? userBadges : mockBadges)
      setTotalSwipes(getTotalSwipes())
      setSwipeProgress(getSwipeProgress())
    } else {
      // Reset settings immediately when closing
      setShowSettings(false)
    }
  }, [open])

  const handleSettingsClick = () => {
    setShowSettings(!showSettings)
  }

  const handleQuickBuySettingsClick = () => {
    alert("Quick Buy Settings - Customize your quick buy amounts (Coming soon!)")
  }

  const handleNotificationsClick = () => {
    alert("Notifications settings - Coming soon!")
  }

  const handlePrivacyClick = () => {
    alert("Privacy & Security settings - Coming soon!")
  }

  const handleHelpClick = () => {
    alert("Help & Support - Coming soon!")
  }

  const handleLogoutClick = async () => {
    if (confirm("Are you sure you want to log out?")) {
      try {
        const supabase = createClient()
        await supabase.auth.signOut()
        toast.success("Logged out successfully")
        window.location.reload()
      } catch (error) {
        console.error("Logout error:", error)
        toast.error("Failed to log out")
      }
    }
  }

  const handleUpgradeClick = () => {
    alert("Upgrade to PRO - Coming soon!")
  }

  const handleManageSubscription = () => {
    alert("Manage Subscription - Coming soon!")
  }

  const handleTogglePro = () => {
    const newProStatus = !isPro
    setProStatus(newProStatus)
    setIsPro(newProStatus)
    if (newProStatus) {
      setProSince(new Date())
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] p-0 fixed bg-white dark:bg-black rounded-t-2xl">
        <SheetHeader className="bg-white dark:bg-black border-b border-gray-100 dark:border-neutral-800 px-6 py-4">
          <SheetTitle className="text-lg font-bold flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </SheetTitle>
        </SheetHeader>

        <div className="h-[calc(85vh-70px)] overflow-y-auto bg-white dark:bg-black">
          <div className="px-6 pb-6 space-y-4 pt-4">
            {/* Profile Header */}
            <div className="bg-white dark:bg-black border border-gray-100 dark:border-neutral-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                  <User className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base truncate">Crypto Trader</h3>
                  <p className="text-xs text-muted-foreground">Member since 2025</p>
                  <TooltipProvider>
                    {badges.length > 0 ? (
                      <div className="flex items-center gap-1 mt-1">
                        {badges.map((badge) => (
                          <Tooltip key={badge.id}>
                            <TooltipTrigger asChild>
                              <span className="text-sm cursor-help">{badge.icon}</span>
                            </TooltipTrigger>
                            <TooltipContent
                              className="bg-white border border-gray-200 text-gray-700 shadow-lg"
                              sideOffset={5}
                            >
                              <p className="text-xs font-medium">{badge.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-muted-foreground/60 mt-1">Earn badges by swiping!</p>
                    )}
                  </TooltipProvider>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-neutral-100 dark:hover:bg-neutral-800 shrink-0 transition-colors rounded-lg bg-black/5 dark:bg-white/5"
                    onClick={toggleDarkMode}
                  >
                    {isDark ? (
                      <svg className="h-4 w-4 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-gray-100 shrink-0 transition-colors"
                    onClick={handleSettingsClick}
                  >
                    {showSettings ? (
                      <ChevronUp className="h-4 w-4 text-gray-700" />
                    ) : (
                      <Settings className="h-4 w-4 text-gray-700" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {showSettings && (
              <div className="bg-white dark:bg-black border border-gray-100 dark:border-neutral-800 rounded-xl p-3 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-8 text-xs font-medium hover:bg-gray-100 hover:shadow-sm text-foreground border border-transparent hover:border-gray-200/50 transition-all"
                  onClick={handleQuickBuySettingsClick}
                >
                  <ShoppingCart className="h-3.5 w-3.5 mr-2.5 text-green-500" />
                  Quick Buy Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-8 text-xs font-medium hover:bg-gray-100 hover:shadow-sm text-foreground border border-transparent hover:border-gray-200/50 transition-all"
                  onClick={handleNotificationsClick}
                >
                  <Bell className="h-3.5 w-3.5 mr-2.5 text-yellow-500" />
                  Notifications
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-8 text-xs font-medium hover:bg-gray-100 hover:shadow-sm text-foreground border border-transparent hover:border-gray-200/50 transition-all"
                  onClick={handlePrivacyClick}
                >
                  <Shield className="h-3.5 w-3.5 mr-2.5 text-purple-500" />
                  Privacy & Security
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-8 text-xs font-medium hover:bg-gray-100 hover:shadow-sm text-foreground border border-transparent hover:border-gray-200/50 transition-all"
                  onClick={handleHelpClick}
                >
                  <HelpCircle className="h-3.5 w-3.5 mr-2.5 text-orange-500" />
                  Help & Support
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-8 text-xs font-medium hover:bg-gray-100 hover:shadow-sm text-foreground border border-transparent hover:border-gray-200/50 transition-all"
                  onClick={handleTogglePro}
                >
                  <Crown className="h-3.5 w-3.5 mr-2.5 text-yellow-500" />
                  Toggle PRO (Demo)
                </Button>
                <Separator className="bg-gray-200/50 my-1" />
                <Button
                  variant="ghost"
                  className="w-full justify-start h-8 text-xs font-medium text-red-500 hover:bg-red-50 hover:shadow-sm hover:text-red-600 border border-transparent hover:border-red-200/50 transition-all"
                  onClick={handleLogoutClick}
                >
                  <LogOut className="h-3.5 w-3.5 mr-2.5" />
                  Log Out
                </Button>
              </div>
            )}

            {/* Next Reward */}
            <div className="bg-white dark:bg-black border border-gray-100 dark:border-neutral-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-purple-500" />
                  <span className="text-xs font-medium text-gray-700">Next Reward</span>
                </div>
                <span className="text-xs font-semibold text-purple-600">{swipeProgress}/100</span>
              </div>
              <Progress value={swipeProgress} max={100} className="h-1.5" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white dark:bg-black border border-gray-100 dark:border-neutral-800 rounded-xl p-4 text-center">
                <Zap className="h-5 w-5 text-yellow-500 mx-auto mb-2" />
                <p className="font-numbers font-bold text-lg">{totalSwipes}</p>
                <p className="text-xs text-gray-500 mt-1">Swipes</p>
              </div>
              <div className="bg-white dark:bg-black border border-gray-100 dark:border-neutral-800 rounded-xl p-4 text-center">
                <Heart className="h-5 w-5 text-red-500 mx-auto mb-2" />
                <p className="font-numbers font-bold text-lg">--</p>
                <p className="text-xs text-gray-500 mt-1">Matches</p>
              </div>
              <div className="bg-white dark:bg-black border border-gray-100 dark:border-neutral-800 rounded-xl p-4 text-center">
                <TrendingUp className="h-5 w-5 text-green-500 mx-auto mb-2" />
                <p className="font-numbers font-bold text-lg">--</p>
                <p className="text-xs text-gray-500 mt-1">Streak</p>
              </div>
            </div>

            {/* PRO Section */}
            {isPro ? (
              <div className="bg-white dark:bg-black border border-gray-100 dark:border-neutral-800 rounded-xl p-5">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="flex items-center gap-2">
                    <Crown className="h-6 w-6 text-yellow-500" />
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1 text-yellow-600">PRO Member</h3>
                    <p className="text-[11px] text-muted-foreground mb-1">
                      Unlimited swipes, advanced filters, and exclusive features
                    </p>
                    {proSince && (
                      <p className="text-xs text-muted-foreground">
                        Active since {proSince.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="bg-white/80 hover:bg-gray-100 text-gray-700 font-medium text-xs h-8 px-5 border-gray-200/50 hover:border-gray-300 hover:shadow-sm transition-all"
                    onClick={handleManageSubscription}
                  >
                    Manage Subscription
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-black border border-gray-100 dark:border-neutral-800 rounded-xl p-5">
                <div className="flex flex-col items-center text-center gap-2">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  <div>
                    <h3 className="font-bold text-sm mb-1">Upgrade to PRO</h3>
                    <p className="text-[11px] text-muted-foreground mb-1">
                      Unlimited swipes, advanced filters, and exclusive features
                    </p>
                    <p className="text-sm font-bold text-yellow-600">$9.99/month</p>
                  </div>
                  {/* Simplified button */}
                  <Button
                    className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs h-8 px-5 shadow-sm hover:shadow-md transition-all"
                    onClick={handleUpgradeClick}
                  >
                    <Crown className="h-3.5 w-3.5 mr-1.5" />
                    Upgrade Now
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
