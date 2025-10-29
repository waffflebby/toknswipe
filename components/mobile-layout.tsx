"use client"

import type React from "react"

interface MobileLayoutProps {
  children: React.ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="flex h-[100dvh] md:h-screen flex-col bg-background overflow-hidden">
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
