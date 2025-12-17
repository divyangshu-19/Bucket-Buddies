import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { findMatches, createMatch } from "@/lib/matching"

export async function GET() {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find potential matches
    const matches = await findMatches(session.user.id)

    // Create/update match records in database
    for (const match of matches) {
      await createMatch(session.user.id, match.user.id, match.sharedItemsCount)
    }

    // Get existing matches from database (to include status)
    const { data: existingMatches, error: matchesError } = await supabase
      .from("matches")
      .select("*")
      .or(`user1_id.eq.${session.user.id},user2_id.eq.${session.user.id}`)

    if (matchesError) {
      throw matchesError
    }

    if (!existingMatches) {
      return NextResponse.json({ matches: [] })
    }

    // Get user IDs for profiles
    const userIds = [
      ...new Set(
        existingMatches.flatMap((m) => [m.user1_id, m.user2_id]).filter((id) => id !== session.user.id)
      ),
    ]

    // Fetch profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .in("id", userIds)

    if (profilesError) {
      throw profilesError
    }

    const profilesMap = new Map(profiles?.map((p) => [p.id, p]) || [])

    // Format matches to always show the other user
    const formattedMatches = existingMatches.map((match) => {
      const otherUserId =
        match.user1_id === session.user.id ? match.user2_id : match.user1_id
      const otherUser = profilesMap.get(otherUserId)
      const matchData = matches.find((m) => m.user.id === otherUserId)

      return {
        matchId: match.id,
        user: otherUser
          ? {
              id: otherUser.id,
              name: otherUser.name,
              email: otherUser.email,
              image: otherUser.image,
              city: otherUser.city,
            }
          : null,
        sharedItemsCount: match.shared_items_count,
        sharedItems: matchData?.sharedItems || [],
        status: match.status,
      }
    })

    return NextResponse.json({
      matches: formattedMatches.filter((m) => m.user !== null),
    })
  } catch (error) {
    console.error("Failed to fetch matches:", error)
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    )
  }
}
