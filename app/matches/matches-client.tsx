"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MessageCircle, X, MapPin } from "lucide-react"

interface SharedItem {
  item1Id: string
  item2Id: string
  title: string
  category: string
  matchType: "exact" | "category"
}

interface Match {
  matchId: string
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
    city: string | null
  }
  sharedItemsCount: number
  sharedItems: SharedItem[]
  status: string
}

interface MatchesClientProps {
  userId: string
}

export function MatchesClient({ userId }: MatchesClientProps) {
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const res = await fetch("/api/matches")
      const data = await res.json()
      setMatches(data.matches || [])
    } catch (error) {
      console.error("Failed to fetch matches:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartChat = (matchId: string, otherUserId: string) => {
    router.push(`/chat/${otherUserId}?matchId=${matchId}`)
  }

  const handleSkip = async (matchId: string) => {
    try {
      await fetch(`/api/matches/${matchId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      })
      setMatches(matches.filter((m) => m.matchId !== matchId))
    } catch (error) {
      console.error("Failed to skip match:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading matches...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Find Buddies</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Connect with people who share your bucket list dreams
        </p>
      </div>

      {matches.length === 0 ? (
        <Card className="card-modern">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg mb-2">
              No matches found yet
            </p>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Add more items to your bucket list to find people with similar interests!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {matches.map((match) => (
            <Card key={match.matchId} className="card-modern hover:scale-[1.02] transition-transform duration-200">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={match.user.image || undefined} />
                    <AvatarFallback>
                      {match.user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle>{match.user.name || "Anonymous"}</CardTitle>
                    {match.user.city && (
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {match.user.city}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">
                    {match.sharedItemsCount} shared item
                    {match.sharedItemsCount !== 1 ? "s" : ""}
                  </p>
                  <div className="space-y-1">
                    {match.sharedItems.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <span className="text-primary">•</span>
                        <span>{item.title}</span>
                        <span className="text-xs bg-muted px-1.5 py-0.5 rounded capitalize">
                          {item.category}
                        </span>
                      </div>
                    ))}
                    {match.sharedItems.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{match.sharedItems.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleStartChat(match.matchId, match.user.id)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Start Chat
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleSkip(match.matchId)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

