"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, X, Clock, UserPlus, Search, TrendingUp, ArrowLeft } from "lucide-react"

interface Friend {
  id: string
  username: string
  avatar: string
  isOnline: boolean
  lastActive: string
  recentActivity?: {
    action: "liked" | "passed"
    coin: string
    timestamp: string
  }
  matchRate: number
}

const mockFriends: Friend[] = [
  {
    id: "1",
    username: "cryptoking",
    avatar: "",
    isOnline: true,
    lastActive: "Online",
    recentActivity: {
      action: "liked",
      coin: "PEPE",
      timestamp: "2m ago",
    },
    matchRate: 87,
  },
  {
    id: "2",
    username: "moonboi",
    avatar: "",
    isOnline: true,
    lastActive: "Online",
    recentActivity: {
      action: "liked",
      coin: "BONK",
      timestamp: "15m ago",
    },
    matchRate: 72,
  },
  {
    id: "3",
    username: "hodlqueen",
    avatar: "",
    isOnline: false,
    lastActive: "2h ago",
    recentActivity: {
      action: "passed",
      coin: "SHIB",
      timestamp: "3h ago",
    },
    matchRate: 65,
  },
  {
    id: "4",
    username: "degentrader",
    avatar: "",
    isOnline: false,
    lastActive: "5h ago",
    recentActivity: {
      action: "liked",
      coin: "DOGE",
      timestamp: "6h ago",
    },
    matchRate: 91,
  },
]

export function FriendsActivity() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddFriend, setShowAddFriend] = useState(false)

  const filteredFriends = mockFriends.filter((friend) =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const onlineFriends = filteredFriends.filter((f) => f.isOnline)
  const offlineFriends = filteredFriends.filter((f) => !f.isOnline)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="border-b border-border px-4 py-4">
        <div className="mb-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (window.location.href = "/")}
            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">Friends</h1>
            <p className="text-sm text-muted-foreground">
              {onlineFriends.length} online · {mockFriends.length} total
            </p>
          </div>
          <Button size="sm" onClick={() => setShowAddFriend(!showAddFriend)} className="gap-1.5">
            <UserPlus className="h-4 w-4" />
            Add
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </header>

      {/* Friends list */}
      <div className="flex-1 overflow-y-auto">
        {filteredFriends.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <UserPlus className="h-10 w-10 text-muted-foreground" />
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">No friends yet</h3>
              <p className="text-sm text-muted-foreground text-pretty">
                Add friends to see what coins they're swiping on and compare your tastes
              </p>
            </div>
            <Button>Add Friends</Button>
          </div>
        ) : (
          <div className="space-y-6 p-4">
            {/* Online friends */}
            {onlineFriends.length > 0 && (
              <div className="space-y-2">
                <h3 className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Online — {onlineFriends.length}
                </h3>
                {onlineFriends.map((friend) => (
                  <FriendCard key={friend.id} friend={friend} />
                ))}
              </div>
            )}

            {/* Offline friends */}
            {offlineFriends.length > 0 && (
              <div className="space-y-2">
                <h3 className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Offline — {offlineFriends.length}
                </h3>
                {offlineFriends.map((friend) => (
                  <FriendCard key={friend.id} friend={friend} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function FriendCard({ friend }: { friend: Friend }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="flex items-center gap-3 p-4">
        {/* Avatar with online indicator */}
        <div className="relative flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-lg font-bold text-white">
            {friend.username[0].toUpperCase()}
          </div>
          {friend.isOnline && (
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-accent" />
          )}
        </div>

        {/* Friend info */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{friend.username}</p>
            <Badge variant="secondary" className="gap-1 text-xs">
              <TrendingUp className="h-3 w-3" />
              {friend.matchRate}% match
            </Badge>
          </div>

          {friend.recentActivity ? (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {friend.recentActivity.action === "liked" ? (
                <Heart className="h-3 w-3 fill-accent text-accent" />
              ) : (
                <X className="h-3 w-3 text-destructive" />
              )}
              <span>
                {friend.recentActivity.action === "liked" ? "Liked" : "Passed"} {friend.recentActivity.coin}
              </span>
              <span>·</span>
              <span>{friend.recentActivity.timestamp}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{friend.lastActive}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
