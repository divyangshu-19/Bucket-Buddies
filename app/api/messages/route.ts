import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const otherUserId = searchParams.get("userId")

    if (!otherUserId) {
      return NextResponse.json(
        { error: "userId parameter required" },
        { status: 400 }
      )
    }

    // Get messages between current user and other user
    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${session.user.id})`)
      .order("created_at", { ascending: true })

    if (error) {
      throw error
    }

    // Get sender profiles
    const senderIds = Array.from(
      new Set(messages?.map((m: any) => m.sender_id) || [])
    )
    
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name, image")
      .in("id", senderIds)

    const profilesMap = new Map(profiles?.map((p: any) => [p.id, p]) || [])

    // Format messages
    const formattedMessages = messages?.map((msg: any) => {
      const sender = profilesMap.get(msg.sender_id)
      return {
        id: msg.id,
        content: msg.content,
        senderId: msg.sender_id,
        receiverId: msg.receiver_id,
        createdAt: msg.created_at,
        sender: {
          id: sender?.id || msg.sender_id,
          name: sender?.name || null,
          image: sender?.image || null,
        },
      }
    }) || []

    return NextResponse.json({ messages: formattedMessages })
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { receiverId, content, matchId } = await request.json()

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: "receiverId and content are required" },
        { status: 400 }
      )
    }

    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        content,
        sender_id: session.user.id,
        receiver_id: receiverId,
        match_id: matchId || null,
      })
      .select("*")
      .single()

    if (error) {
      throw error
    }

    // Get sender profile
    const { data: senderProfile } = await supabase
      .from("profiles")
      .select("id, name, image")
      .eq("id", session.user.id)
      .single()

    const formattedMessage = {
      id: message.id,
      content: message.content,
      senderId: message.sender_id,
      receiverId: message.receiver_id,
      createdAt: message.created_at,
      sender: {
        id: senderProfile?.id || message.sender_id,
        name: senderProfile?.name || null,
        image: senderProfile?.image || null,
      },
    }

    return NextResponse.json({ message: formattedMessage }, { status: 201 })
  } catch (error) {
    console.error("Failed to create message:", error)
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    )
  }
}
