import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET() {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: items, error } = await supabase
      .from("bucket_items")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    // Transform snake_case to camelCase for frontend
    const transformedItems = (items || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      location: item.location,
      timeframe: item.timeframe,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      userId: item.user_id,
    }))

    return NextResponse.json({ items: transformedItems })
  } catch (error) {
    console.error("Failed to fetch bucket items:", error)
    return NextResponse.json(
      { error: "Failed to fetch bucket items" },
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

    const { title, category, location, timeframe } = await request.json()

    if (!title || !category || !timeframe) {
      return NextResponse.json(
        { error: "Title, category, and timeframe are required" },
        { status: 400 }
      )
    }

    const { data: item, error } = await supabase
      .from("bucket_items")
      .insert({
        title,
        category,
        location: location || null,
        timeframe,
        user_id: session.user.id,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Transform to camelCase
    const transformedItem = {
      id: item.id,
      title: item.title,
      category: item.category,
      location: item.location,
      timeframe: item.timeframe,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      userId: item.user_id,
    }

    return NextResponse.json({ item: transformedItem }, { status: 201 })
  } catch (error) {
    console.error("Failed to create bucket item:", error)
    return NextResponse.json(
      { error: "Failed to create bucket item" },
      { status: 500 }
    )
  }
}
