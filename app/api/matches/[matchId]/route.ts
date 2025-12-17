import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function PATCH(
  request: Request,
  { params }: { params: { matchId: string } }
) {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status } = await request.json()

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Verify user is part of this match
    const { data: match, error: fetchError } = await supabase
      .from("matches")
      .select("*")
      .eq("id", params.matchId)
      .single()

    if (fetchError || !match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 })
    }

    if (match.user1_id !== session.user.id && match.user2_id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data: updatedMatch, error } = await supabase
      .from("matches")
      .update({ status })
      .eq("id", params.matchId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ match: updatedMatch })
  } catch (error) {
    console.error("Failed to update match:", error)
    return NextResponse.json(
      { error: "Failed to update match" },
      { status: 500 }
    )
  }
}
