"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, ArrowLeft } from "lucide-react"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  createdAt: string
  sender: {
    id: string
    name: string | null
    image: string | null
  }
}

interface ChatClientProps {
  currentUserId: string
  otherUser: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  matchId?: string
}

export function ChatClient({
  currentUserId,
  otherUser,
  matchId,
}: ChatClientProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    fetchMessages(supabase)

    // Set up Supabase Realtime subscription
    const channel = supabase
      .channel(`chat:${[currentUserId, otherUser.id].sort().join("-")}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `or(and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUser.id}),and(sender_id.eq.${otherUser.id},receiver_id.eq.${currentUserId}))`,
        },
        async (payload) => {
          // Fetch the new message
          const { data: newMsg } = await supabase
            .from("messages")
            .select("*")
            .eq("id", payload.new.id)
            .single()

          if (newMsg) {
            // Get sender profile
            const { data: senderProfile } = await supabase
              .from("profiles")
              .select("id, name, image")
              .eq("id", newMsg.sender_id)
              .single()

            const formattedMessage: Message = {
              id: newMsg.id,
              content: newMsg.content,
              senderId: newMsg.sender_id,
              receiverId: newMsg.receiver_id,
              createdAt: newMsg.created_at,
              sender: {
                id: senderProfile?.id || newMsg.sender_id,
                name: senderProfile?.name || null,
                image: senderProfile?.image || null,
              },
            }
            setMessages((prev) => [...prev, formattedMessage])
          }
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      channel.unsubscribe()
    }
  }, [currentUserId, otherUser.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async (supabase: ReturnType<typeof createClient>) => {
    try {
      const res = await fetch(`/api/messages?userId=${otherUser.id}`)
      const data = await res.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const messageContent = newMessage.trim()
    setNewMessage("")

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: otherUser.id,
          content: messageContent,
          matchId,
        }),
      })

      if (res.ok) {
        // Message will be added via Realtime subscription
        // No need to manually add it here
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      // Re-add message to input on error
      setNewMessage(messageContent)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading chat...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/matches")}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Matches
        </Button>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={otherUser.image || undefined} />
              <AvatarFallback>
                {otherUser.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{otherUser.name || "Anonymous"}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => {
                const isOwn = message.senderId === currentUserId
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        isOwn
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {!isOwn && (
                        <div className="text-xs font-medium mb-1">
                          {message.sender.name || "Anonymous"}
                        </div>
                      )}
                      <div className="text-sm">{message.content}</div>
                      <div
                        className={`text-xs mt-1 ${
                          isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={handleSend}
            className="border-t p-4 flex gap-2"
          >
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
