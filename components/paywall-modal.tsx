"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PaywallModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const premiumFeatures = [
  "Unlimited filtered swipes",
  "Advanced market analytics",
  "Early access to new launches",
  "Whale wallet tracking",
  "Priority matching",
  "Ad-free experience",
  "Custom notifications",
  "Portfolio insights",
]

export function PaywallModal({ open, onOpenChange }: PaywallModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-premium/20">
            <Sparkles className="h-8 w-8 text-premium" />
          </div>
          <DialogTitle className="text-center text-2xl text-balance">Unlock Premium Features</DialogTitle>
          <DialogDescription className="text-center text-pretty">
            Get unlimited access to all filters and exclusive features to find the best meme coins
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Pricing */}
          <div className="rounded-xl border-2 border-premium bg-premium/5 p-6 text-center">
            <Badge className="mb-2 bg-premium text-premium-foreground">Limited Time Offer</Badge>
            <div className="mb-1">
              <span className="text-4xl font-bold">$9.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-xs text-muted-foreground">Cancel anytime</p>
          </div>

          {/* Features list */}
          <div className="space-y-2">
            {premiumFeatures.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent">
                  <Check className="h-3 w-3 text-accent-foreground" />
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2 pt-2">
            <Button className="w-full bg-premium text-premium-foreground hover:bg-premium/90" size="lg">
              Start Free Trial
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
              Maybe Later
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            7-day free trial, then $9.99/month. Cancel anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
