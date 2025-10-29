"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { User, LogOut } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useDarkMode } from "@/hooks/use-dark-mode"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface ProfileSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileSheet({ open, onOpenChange }: ProfileSheetProps) {
  const { isDark, toggleDarkMode } = useDarkMode()

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

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            className="w-full justify-start h-12 text-sm font-medium hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
            onClick={toggleDarkMode}
          >
            {isDark ? (
              <>
                <svg className="h-5 w-5 mr-3 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Dark Mode
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-3 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Light Mode
              </>
            )}
          </Button>

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
