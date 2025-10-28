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
  BarChart3,
  Zap,
  Copy,
  Globe,
  Twitter,
  MoreVertical,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface Match {
  id: string
  name: string
  symbol: string
  price: string
  change24h: string
  matchedAt: string
  image: string
  unreadMessages: number
  mint?: string
  volume24h?: string
  marketCap?: string
  liquidity?: string
  holders?: number
  txns24h?: number
  riskLevel?: string
  website?: string
  twitter?: string
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
    mint: "4k3Dyjzvzp8eMZWUUbCbRCw6gZAqvHn5C2MZt4wa7524",
    volume24h: "$329.71M",
    marketCap: "$6.89B",
    liquidity: "$184.86M",
    holders: 629543,
    txns24h: 47728,
    riskLevel: "low",
    website: "https://pepe.vip",
    twitter: "https://twitter.com/pepecoineth",
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
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixVqXaSL1shNorWMaWRd",
    volume24h: "$125.43M",
    marketCap: "$2.15B",
    liquidity: "$89.23M",
    holders: 245821,
    txns24h: 32156,
    riskLevel: "medium",
    website: "https://bonkcoin.com",
    twitter: "https://twitter.com/bonkcoin",
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
    mint: "9B2F8q6639PsE4Ajw1N6iB8c2Bp8IksLLxMHU5MKcqH1",
    volume24h: "$456.78M",
    marketCap: "$12.34B",
    liquidity: "$567.89M",
    holders: 1234567,
    txns24h: 89234,
    riskLevel: "low",
    website: "https://dogecoin.com",
    twitter: "https://twitter.com/dogecoin",
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
    mint: "EchesyfXePKdLsHn3sqsRe1vDvReNsFiYbMXwaLLzM1s",
    volume24h: "$78.92M",
    marketCap: "$890.12M",
    liquidity: "$123.45M",
    holders: 456789,
    txns24h: 23456,
    riskLevel: "medium",
    website: "https://floki.io",
    twitter: "https://twitter.com/RealFlokiInu",
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
  const [viewMode, setViewMode] = useState<"list" | "advanced">("list")
  const [selectedCoinForDetails, setSelectedCoinForDetails] = useState<Match | null>(null)

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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode(viewMode === "list" ? "advanced" : "list")}
            className="h-8 px-2 rounded-lg hover:bg-white/20"
            title={viewMode === "list" ? "Switch to advanced view" : "Switch to list view"}
          >
            {viewMode === "list" ? (
              <BarChart3 className="h-4 w-4" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
          </Button>
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
            ) : viewMode === "advanced" ? (
              // Advanced Grid View
              <div className="grid grid-cols-1 gap-4 px-4 pb-6 pt-4">
                {mockMatches.map((match) => {
                  const isPositiveChange = match.change24h.startsWith("+")

                  return (
                    <Card
                      key={match.id}
                      className="overflow-hidden transition-all hover:shadow-lg active:scale-[0.98] glass border-2 border-white/40"
                    >
                      {/* Advanced Card Header with Image */}
                      <div className="relative h-40 w-full bg-white dark:bg-black border-b border-gray-100 dark:border-neutral-800 flex items-center justify-center p-4">
                        <Image
                          src={match.image || "/placeholder.svg"}
                          alt={match.name}
                          width={120}
                          height={120}
                          className="object-contain"
                        />
                      </div>

                      {/* Advanced Card Content */}
                      <div className="p-4 space-y-3">
                        <div className="text-center">
                          <h3 className="text-2xl font-bold text-black dark:text-white">${match.symbol}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{match.name}</p>
                        </div>

                        <div className="flex items-center justify-center gap-6">
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] text-gray-400 font-medium">PRICE</span>
                            <span className="text-lg font-bold text-black dark:text-white">{match.price}</span>
                          </div>
                          <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] text-gray-400 font-medium">24H</span>
                            <Badge
                              variant={isPositiveChange ? "default" : "destructive"}
                              className="text-xs px-2 py-0.5 h-auto font-numbers mt-1"
                            >
                              {match.change24h}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="ghost"
                            className="flex-1 gap-1.5 text-xs h-10 hover:bg-white/20"
                            onClick={() => window.open(`https://twitter.com/search?q=%24${match.symbol}`, "_blank")}
                          >
                            <Search className="h-3.5 w-3.5" />
                            Twitter
                          </Button>
                          <Button
                            variant="ghost"
                            className="flex-1 gap-1.5 text-xs h-10 hover:bg-white/20"
                            onClick={() => window.open(`https://dexscreener.com/solana/${match.symbol}`, "_blank")}
                          >
                            <BarChart3 className="h-3.5 w-3.5" />
                            Chart
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            ) : (
              // List View
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
                          onClick={() => setSelectedCoinForDetails(match)}
                        >
                          <BarChart3 className="h-3.5 w-3.5" />
                          Advanced
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
                          onClick={() => window.open(`https://twitter.com/search?q=${match.symbol}`, "_blank")}
                        >
                          <Twitter className="h-3.5 w-3.5" />
                          Twitter
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

      {/* Advanced Coin Details Modal */}
      <Dialog open={!!selectedCoinForDetails} onOpenChange={(open) => !open && setSelectedCoinForDetails(null)}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto bg-white dark:bg-black">
          <VisuallyHidden>
            <DialogTitle>{selectedCoinForDetails?.name} Details</DialogTitle>
          </VisuallyHidden>
          {selectedCoinForDetails && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0">
                    <Image
                      src={selectedCoinForDetails.image || "/placeholder.svg"}
                      alt={selectedCoinForDetails.name}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{selectedCoinForDetails.name}</h2>
                    <p className="text-xs text-muted-foreground">${selectedCoinForDetails.symbol}</p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                {/* Price Section */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase text-black dark:text-white">Price</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold font-numbers">{selectedCoinForDetails.price}</p>
                    <p className={`text-sm font-semibold ${selectedCoinForDetails.change24h.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                      {selectedCoinForDetails.change24h}
                    </p>
                  </div>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {selectedCoinForDetails.volume24h && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-semibold uppercase text-black dark:text-white">24h Vol</p>
                      <p className="text-sm font-bold text-gray-600 dark:text-neutral-400">{selectedCoinForDetails.volume24h}</p>
                    </div>
                  )}
                  {selectedCoinForDetails.marketCap && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-semibold uppercase text-black dark:text-white">MCap</p>
                      <p className="text-sm font-bold text-gray-600 dark:text-neutral-400">{selectedCoinForDetails.marketCap}</p>
                    </div>
                  )}
                  {selectedCoinForDetails.liquidity && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-semibold uppercase text-black dark:text-white">Liq</p>
                      <p className="text-sm font-bold text-gray-600 dark:text-neutral-400">{selectedCoinForDetails.liquidity}</p>
                    </div>
                  )}
                  {selectedCoinForDetails.holders && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-semibold uppercase text-black dark:text-white">Holders</p>
                      <p className="text-sm font-bold text-gray-600 dark:text-neutral-400">{selectedCoinForDetails.holders.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {/* Advanced Stats */}
                <div className="space-y-3 border-t border-gray-200 dark:border-neutral-800 pt-3">
                  <p className="text-xs font-semibold uppercase text-black dark:text-white">Advanced</p>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedCoinForDetails.txns24h && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-semibold uppercase text-black dark:text-white">24h Txns</p>
                        <p className="text-sm font-bold text-gray-600 dark:text-neutral-400">{selectedCoinForDetails.txns24h.toLocaleString()}</p>
                      </div>
                    )}
                    {selectedCoinForDetails.riskLevel && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-semibold uppercase text-black dark:text-white">Risk Level</p>
                        <p className={`text-sm font-bold ${
                          selectedCoinForDetails.riskLevel === "low" ? "text-green-600" :
                          selectedCoinForDetails.riskLevel === "medium" ? "text-yellow-600" :
                          "text-red-600"
                        }`}>
                          {selectedCoinForDetails.riskLevel.charAt(0).toUpperCase() + selectedCoinForDetails.riskLevel.slice(1)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Links & Copy */}
                <div className="space-y-3 border-t border-gray-200 dark:border-neutral-800 pt-3">
                  <p className="text-xs font-semibold uppercase text-black dark:text-white">Links</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedCoinForDetails.website && (
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="text-xs h-8"
                      >
                        <a href={selectedCoinForDetails.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-3 w-3 mr-1" />
                          Website
                        </a>
                      </Button>
                    )}
                    {selectedCoinForDetails.twitter && (
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="text-xs h-8"
                      >
                        <a href={selectedCoinForDetails.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-3 w-3 mr-1" />
                          Twitter
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Copy Address */}
                {selectedCoinForDetails.mint && (
                  <div className="space-y-2 border-t border-gray-200 dark:border-neutral-800 pt-3">
                    <p className="text-[10px] font-semibold uppercase text-black dark:text-white">Contract</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 rounded-lg bg-gray-100 dark:bg-neutral-900 px-2.5 py-2 text-[9px] font-mono break-all text-gray-700 dark:text-neutral-300">
                        {selectedCoinForDetails.mint.slice(0, 20)}...
                      </code>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedCoinForDetails.mint!)
                        }}
                        className="shrink-0 h-8 w-8"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
