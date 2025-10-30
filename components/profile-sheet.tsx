"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { User, LogOut, Settings, Moon, Sun } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface ProfileSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileSheet({ open, onOpenChange }: ProfileSheetProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      toast.success("Logged out successfully")
      onOpenChange(false)
      setTimeout(() => window.location.reload(), 100)
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to log out")
    }
  }

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[50vh] p-0 bg-white dark:bg-black rounded-t-2xl">
        <SheetHeader className="bg-white dark:bg-black border-b border-gray-100 dark:border-neutral-800 px-6 py-4">
          <SheetTitle className="text-lg font-bold flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </SheetTitle>
        </SheetHeader>

        <div className="px-6 py-6 space-y-4">
          {/* Profile Header */}
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <User className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Crypto Trader</h3>
              <p className="text-xs text-muted-foreground">Member since 2025</p>
            </div>
          </div>

          <Separator className="bg-gray-200 dark:bg-neutral-800" />

          {/* Settings Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-neutral-900 transition-colors">
              <div className="flex items-center gap-3">
                {mounted && theme === "dark" ? (
                  <Moon className="h-5 w-5 text-purple-500" />
                ) : (
                  <Sun className="h-5 w-5 text-amber-500" />
                )}
                <div>
                  <p className="text-sm font-medium">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">
                    {mounted && theme === "dark" ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
              <Switch
                checked={mounted && theme === "dark"}
                onCheckedChange={toggleDarkMode}
                className="data-[state=checked]:bg-purple-500"
              />
            </div>
          </div>

          <Separator className="bg-gray-200 dark:bg-neutral-800" />

          {/* Logout Button */}
          <Button
            variant="ghost"
            className="w-full justify-start h-12 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Log Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
