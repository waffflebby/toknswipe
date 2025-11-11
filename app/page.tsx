import { MobileLayout } from "@/components/mobile-layout"
import { SwipeView } from "@/components/swipe-view"
import { MarketOverview } from "@/components/market-overview"

export default function Home() {
  return (
    <MobileLayout>
      <div className="flex h-full flex-col gap-4 p-4">
        <MarketOverview />
        <div className="flex-1 overflow-hidden">
          <SwipeView />
        </div>
      </div>
    </MobileLayout>
  )
}
