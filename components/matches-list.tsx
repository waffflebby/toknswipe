"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  TrendingUp,
  TrendingDown,
  MessageCircle,
  ExternalLink,
  Users,
  Send,
  Sparkles,
  Heart,
  Search,
  Waves,
  ArrowLeft,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Match {
  id: string
  name: string
  symbol: string
  price: string
  change24h: string
  matchedAt: string
  image: string
  unreadMessages: number
}

interface FriendMatch {
  friendName: string
  friendAvatar: string
  coinName: string
  coinSymbol: string
  matchedAt: string
}

interface ChatMessage {
  id: string
  user: string
  avatar: string
  message: string
  timestamp: string
}

const mockMatches: Match[] = [
  {
    id: "1",
    name: "PEPE",
    symbol: "PEPE",
    price: "$0.000001",
    change24h: "+45.2%",
    matchedAt: "2h ago",
    image: "/pepe-meme-coin.png",
    unreadMessages: 3,
  },
  {
    id: "2",
    name: "BONK",
    symbol: "BONK",
    price: "$0.000012",
    change24h: "+156.3%",
    matchedAt: "5h ago",
    image: "/bonk-dog-coin-solana-logo.jpg",
    unreadMessages: 0,
  },
  {
    id: "3",
    name: "DOGE",
    symbol: "DOGE",
    price: "$0.08",
    change24h: "+12.5%",
    matchedAt: "1d ago",
    image: "/shiba-inu-doge-coin-logo.jpg",
    unreadMessages: 1,
  },
  {
    id: "4",
    name: "FLOKI",
    symbol: "FLOKI",
    price: "$0.00003",
    change24h: "+8.7%",
    matchedAt: "2d ago",
    image: "/floki-inu-viking-dog-coin-logo.jpg",
    unreadMessages: 0,
  },
]

const mockFriendMatches: FriendMatch[] = [
  {
    friendName: "Alex",
    friendAvatar: "/placeholder.svg?height=40&width=40",
    coinName: "BONK",
    coinSymbol: "BONK",
    matchedAt: "3h ago",
  },
  {
    friendName: "Sarah",
    friendAvatar: "/placeholder.svg?height=40&width=40",
    coinName: "PEPE",
    coinSymbol: "PEPE",
    matchedAt: "5h ago",
  },
]

const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    user: "Alex",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "This coin is going to moon! 🚀",
    timestamp: "2m ago",
  },
  {
    id: "2",
    user: "Sarah",
    avatar: "/placeholder.svg?height=32&width=32",
    message: "Just bought more, LFG!",
    timestamp: "5m ago",
  },
]

export function MatchesList() {
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [activeTab, setActiveTab] = useState("your-matches")

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-background to-muted/20">
      <header className="glass px-4 py-4 shadow-sm shrink-0 border-b border-white/20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (window.location.href = "/")}
            className="h-8 w-8 p-0 rounded-full hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight">Your Matches</h1>
            <p className="text-xs text-muted-foreground mt-1">Coins you loved & friend activity</p>
          </div>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-4 mt-4 grid w-auto grid-cols-3 glass h-11 p-1 gap-1">
          <TabsTrigger
            value="your-matches"
            className="text-xs gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
          >
            <Heart className="h-3.5 w-3.5" />
            Yours
          </TabsTrigger>
          <TabsTrigger
            value="friend-matches"
            className="text-xs gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
          >
            <Users className="h-3.5 w-3.5" />
            Friends
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="text-xs gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="your-matches" className="flex-1 overflow-hidden mt-4">
          <ScrollArea className="h-full">
            {mockMatches.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full glass">
                  <Heart className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="mb-2 text-base font-semibold">No matches yet</h3>
                  <p className="text-sm text-muted-foreground text-pretty">Start swiping to find coins you love</p>
                </div>
                <Button asChild size="default" className="mt-2">
                  <Link href="/">Start Swiping</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4 px-4 pb-6">
                {mockMatches.map((match) => {
                  const isPositiveChange = match.change24h.startsWith("+")

                  return (
                    <Card
                      key={match.id}
                      className="overflow-hidden transition-all hover:shadow-lg active:scale-[0.98] glass border-2 border-white/40"
                    >
                      <div className="flex items-center gap-3 p-4">
                        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-white/60 shadow-sm">
                          <Image
                            src={match.image || "/placeholder.svg"}
                            alt={match.name}
                            fill
                            className="object-contain p-1.5"
                          />
                        </div>

                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-base truncate">{match.name}</h3>
                            <Badge
                              variant={isPositiveChange ? "default" : "destructive"}
                              className="flex items-center gap-1 text-xs px-2 py-0.5 h-auto shrink-0 font-numbers"
                            >
                              {isPositiveChange ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              {match.change24h}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <p className="text-muted-foreground font-medium">{match.symbol}</p>
                            <p className="font-bold font-numbers">{match.price}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">Matched {match.matchedAt}</p>
                        </div>

                        {match.unreadMessages > 0 && (
                          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow-sm font-numbers">
                            {match.unreadMessages}
                          </div>
                        )}
                      </div>

                      <div className="flex border-t border-white/20 bg-white/10">
                        <Button
                          variant="ghost"
                          className="flex-1 gap-1.5 rounded-none text-xs h-12 hover:bg-white/20"
                          onClick={() => window.open(`https://twitter.com/search?q=%24${match.symbol}`, "_blank")}
                        >
                          <Search className="h-3.5 w-3.5" />
                          Twitter
                        </Button>
                        <div className="w-px bg-white/20" />
                        <Button
                          variant="ghost"
                          className="flex-1 gap-1.5 rounded-none text-xs h-12 hover:bg-white/20"
                          onClick={() => window.open(`https://solscan.io/token/${match.symbol}`, "_blank")}
                        >
                          <Waves className="h-3.5 w-3.5" />
                          Whales
                        </Button>
                        <div className="w-px bg-white/20" />
                        <Button
                          variant="ghost"
                          className="flex-1 gap-1.5 rounded-none text-xs h-12 hover:bg-white/20"
                          onClick={() => window.open(`https://dexscreener.com/solana/${match.symbol}`, "_blank")}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Chart
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="friend-matches" className="flex-1 overflow-hidden mt-4">
          <ScrollArea className="h-full">
            <div className="space-y-4 px-4 pb-6">
              <div className="glass rounded-xl p-4 mb-2 border-2 border-white/40">
                <p className="text-xs text-muted-foreground font-medium text-center">
                  See what your friends are matching with
                </p>
              </div>
              {mockFriendMatches.map((friendMatch, idx) => (
                <Card key={idx} className="p-4 glass border-2 border-white/40 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-white/30 shadow-sm">
                      <AvatarImage src={friendMatch.friendAvatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs font-bold">{friendMatch.friendName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">
                        <span className="text-primary">{friendMatch.friendName}</span> matched{" "}
                        <span className="text-accent">{friendMatch.coinName}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{friendMatch.matchedAt}</p>
                    </div>
                    <Sparkles className="h-4 w-4 text-yellow-500 shrink-0" />
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="chat" className="flex-1 flex flex-col mt-4 overflow-hidden">
          <div className="glass mx-4 rounded-xl p-4 mb-4 border-2 border-white/40">
            <p className="text-xs text-muted-foreground font-medium text-center">
              Chat with others who matched the same coins
            </p>
          </div>
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 pb-6">
              {mockChatMessages.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0 border border-white/20">
                    <AvatarImage src={msg.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">{msg.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold">{msg.user}</p>
                      <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
                    </div>
                    <div className="mt-2 rounded-xl glass p-3 border-2 border-white/40 shadow-sm">
                      <p className="text-xs leading-relaxed">{msg.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="glass border-t border-white/20 p-4 shrink-0">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 glass border-2 border-white/40 h-10 text-xs px-3"
              />
              <Button size="icon" className="shrink-0 h-10 w-10">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
