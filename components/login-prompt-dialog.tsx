"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Heart, Zap, Star, TrendingUp } from "lucide-react"
import { LoginButton } from "@/components/login-button"

interface LoginPromptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  action?: "swipe" | "star"
}

export function LoginPromptDialog({ open, onOpenChange, action = "swipe" }: LoginPromptDialogProps) {
  const actionText = action === "swipe" ? "swipe on coins" : "save favorites"
  const actionIcon = action === "swipe" ? Heart : Star

  const Icon = actionIcon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Icon className="h-5 w-5 text-pink-500" />
            Sign in to {actionText}
          </DialogTitle>
          <DialogDescription className="text-left pt-2">
            Create a free account to unlock:
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Heart className="h-4 w-4 text-pink-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Save your matches</p>
              <p className="text-xs text-muted-foreground">Track coins you love across all devices</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Build your watchlist</p>
              <p className="text-xs text-muted-foreground">Star coins and get alerts on price changes</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Track your portfolio</p>
              <p className="text-xs text-muted-foreground">See your performance and analytics</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="w-full">
            <LoginButton />
          </div>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full text-sm text-muted-foreground hover:text-foreground"
          >
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
