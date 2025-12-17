import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, category, location, timeframe } = await request.json()

    // Verify ownership
    const { data: existingItem, error: fetchError } = await supabase
      .from("bucket_items")
      .select("user_id")
      .eq("id", params.id)
      .single()

    if (fetchError || !existingItem) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      )
    }

    if (existingItem.user_id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data: item, error } = await supabase
      .from("bucket_items")
      .update({
        title,
        category,
        location: location || null,
        timeframe,
      })
      .eq("id", params.id)
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

    return NextResponse.json({ item: transformedItem })
  } catch (error) {
    console.error("Failed to update bucket item:", error)
    return NextResponse.json(
      { error: "Failed to update bucket item" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify ownership
    const { data: existingItem, error: fetchError } = await supabase
      .from("bucket_items")
      .select("user_id")
      .eq("id", params.id)
      .single()

    if (fetchError || !existingItem) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      )
    }

    if (existingItem.user_id !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { error } = await supabase
      .from("bucket_items")
      .delete()
      .eq("id", params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ message: "Item deleted" })
  } catch (error) {
    console.error("Failed to delete bucket item:", error)
    return NextResponse.json(
      { error: "Failed to delete bucket item" },
      { status: 500 }
    )
  }
}
