"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Flame, Wallet, MessageSquare, Heart, Share2, ExternalLink } from "lucide-react"

interface WhaleActivity {
  id: string
  wallet: string
  action: "buy" | "sell"
  coin: string
  amount: string
  value: string
  timestamp: string
}

interface TrendingPost {
  id: string
  author: string
  content: string
  coin: string
  likes: number
  comments: number
  timestamp: string
  isVerified?: boolean
}

const mockWhaleActivity: WhaleActivity[] = [
  {
    id: "1",
    wallet: "0x742d...35a9",
    action: "buy",
    coin: "PEPE",
    amount: "1.2B",
    value: "$1.2M",
    timestamp: "5m ago",
  },
  {
    id: "2",
    wallet: "0x8f3c...92b1",
    action: "sell",
    coin: "SHIB",
    amount: "500M",
    value: "$4.5K",
    timestamp: "12m ago",
  },
  {
    id: "3",
    wallet: "0x1a2b...7c8d",
    action: "buy",
    coin: "BONK",
    amount: "50M",
    value: "$600K",
    timestamp: "18m ago",
  },
  {
    id: "4",
    wallet: "0x9e4f...3d2a",
    action: "buy",
    coin: "DOGE",
    amount: "2M",
    value: "$160K",
    timestamp: "25m ago",
  },
]

const mockTrendingPosts: TrendingPost[] = [
  {
    id: "1",
    author: "@cryptowhale",
    content: "PEPE is showing strong support at current levels. Accumulation phase looking bullish. NFA 🐸",
    coin: "PEPE",
    likes: 234,
    comments: 45,
    timestamp: "2h ago",
    isVerified: true,
  },
  {
    id: "2",
    author: "@memecoinmaster",
    content: "New BONK partnership announcement coming this week. Big things ahead for Solana memes!",
    coin: "BONK",
    likes: 189,
    comments: 67,
    timestamp: "4h ago",
    isVerified: false,
  },
  {
    id: "3",
    author: "@dogefather",
    content: "DOGE community is the strongest in crypto. Been holding since 2014 and not selling. 💎🙌",
    coin: "DOGE",
    likes: 512,
    comments: 123,
    timestamp: "6h ago",
    isVerified: true,
  },
]

export function SocialFeed() {
  const [activeTab, setActiveTab] = useState("trending")

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight">Social</h1>
        <p className="text-sm text-muted-foreground">What's happening in meme coins</p>
      </header>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col">
        <TabsList className="mx-6 mt-4 grid w-auto grid-cols-3 gap-2">
          <TabsTrigger value="trending" className="gap-1.5">
            <Flame className="h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="whales" className="gap-1.5">
            <Wallet className="h-4 w-4" />
            Whales
          </TabsTrigger>
          <TabsTrigger value="community" className="gap-1.5">
            <MessageSquare className="h-4 w-4" />
            Community
          </TabsTrigger>
        </TabsList>

        {/* Trending Tab */}
        <TabsContent value="trending" className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="space-y-3">
            {mockTrendingPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <div className="space-y-3 p-4">
                  {/* Post header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-muted" />
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-semibold">{post.author}</p>
                          {post.isVerified && (
                            <Badge variant="secondary" className="h-4 px-1 text-xs">
                              ✓
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      ${post.coin}
                    </Badge>
                  </div>

                  {/* Post content */}
                  <p className="text-sm leading-relaxed text-pretty">{post.content}</p>

                  {/* Post actions */}
                  <div className="flex items-center gap-4 pt-2">
                    <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      <span className="text-xs">{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-xs">{post.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Whales Tab */}
        <TabsContent value="whales" className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="mb-4 rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground text-pretty">
              Track large wallet movements in real-time. Whale activity often signals market trends.
            </p>
          </div>

          <div className="space-y-2">
            {mockWhaleActivity.map((activity) => {
              const isBuy = activity.action === "buy"

              return (
                <Card key={activity.id} className="overflow-hidden">
                  <div className="flex items-center gap-3 p-4">
                    {/* Action indicator */}
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                        isBuy ? "bg-accent/20" : "bg-destructive/20"
                      }`}
                    >
                      {isBuy ? (
                        <TrendingUp className="h-5 w-5 text-accent" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-destructive" />
                      )}
                    </div>

                    {/* Activity details */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold">
                          {isBuy ? "Bought" : "Sold"} {activity.coin}
                        </p>
                        <Badge variant={isBuy ? "default" : "destructive"} className="text-xs">
                          {activity.value}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{activity.wallet}</span>
                        <span>{activity.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{activity.amount} tokens</p>
                    </div>

                    {/* View button */}
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <MessageSquare className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Community Chat Coming Soon</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Connect with other meme coin enthusiasts and share your insights
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
