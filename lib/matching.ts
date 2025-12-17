import { createClient } from "./supabase-server"

/**
 * Matching Logic
 * 
 * Matches users based on shared bucket items.
 * 
 * Matching criteria:
 * 1. Exact title match
 * 2. Same category + similar keywords (simple keyword matching for MVP)
 * 
 * Returns users with shared items and match details.
 */

interface SharedItem {
  item1Id: string
  item2Id: string
  title: string
  category: string
  matchType: "exact" | "category"
}

interface MatchResult {
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
    city: string | null
  }
  sharedItemsCount: number
  sharedItems: SharedItem[]
}

/**
 * Simple keyword extraction for similarity matching
 */
function extractKeywords(title: string): string[] {
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "is", "was", "are", "were", "be",
    "been", "being", "have", "has", "had", "do", "does", "did", "will",
    "would", "should", "could", "may", "might", "must", "can", "this",
    "that", "these", "those", "i", "you", "he", "she", "it", "we", "they",
  ])

  return title
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word))
}

/**
 * Check if two titles are similar based on shared keywords
 */
function areSimilar(title1: string, title2: string): boolean {
  const keywords1 = extractKeywords(title1)
  const keywords2 = extractKeywords(title2)

  if (keywords1.length === 0 || keywords2.length === 0) return false

  // Calculate similarity: at least 30% keyword overlap
  const intersection = keywords1.filter((k) => keywords2.includes(k))
  const union = new Set([...keywords1, ...keywords2])
  const similarity = intersection.length / union.size

  return similarity >= 0.3
}

/**
 * Find matches for a user based on their bucket items
 */
export async function findMatches(userId: string): Promise<MatchResult[]> {
  const supabase = createClient()

  // Get current user's bucket items
  const { data: userItems, error: userItemsError } = await supabase
    .from("bucket_items")
    .select("*")
    .eq("user_id", userId)

  if (userItemsError || !userItems || userItems.length === 0) {
    return []
  }

  // Get all other users' bucket items
  const { data: allItems, error: allItemsError } = await supabase
    .from("bucket_items")
    .select("*")
    .neq("user_id", userId)

  if (allItemsError || !allItems) {
    return []
  }

  // Get unique user IDs from other items
  const otherUserIds = [...new Set(allItems.map((item) => item.user_id))]

  // Fetch profiles for other users
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .in("id", otherUserIds)

  if (profilesError || !profiles) {
    return []
  }

  // Create a map of user profiles
  const profilesMap = new Map(profiles.map((p) => [p.id, p]))

  // Group items by user
  const userItemsMap = new Map<string, typeof allItems>()
  for (const item of allItems) {
    if (!userItemsMap.has(item.user_id)) {
      userItemsMap.set(item.user_id, [])
    }
    userItemsMap.get(item.user_id)!.push(item)
  }

  // Find matches
  const matches: MatchResult[] = []

  for (const [otherUserId, otherItems] of userItemsMap.entries()) {
    const sharedItems: SharedItem[] = []

    for (const userItem of userItems) {
      for (const otherItem of otherItems) {
        // Exact title match
        if (
          userItem.title.toLowerCase().trim() ===
          otherItem.title.toLowerCase().trim()
        ) {
          sharedItems.push({
            item1Id: userItem.id,
            item2Id: otherItem.id,
            title: userItem.title,
            category: userItem.category,
            matchType: "exact",
          })
          continue
        }

        // Same category + similar keywords
        if (
          userItem.category === otherItem.category &&
          areSimilar(userItem.title, otherItem.title)
        ) {
          sharedItems.push({
            item1Id: userItem.id,
            item2Id: otherItem.id,
            title: userItem.title,
            category: userItem.category,
            matchType: "category",
          })
        }
      }
    }

    // Only include if there's at least one shared item
    if (sharedItems.length > 0) {
      const profile = profilesMap.get(otherUserId)
      if (profile) {
        matches.push({
          user: {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            image: profile.image,
            city: profile.city,
          },
          sharedItemsCount: sharedItems.length,
          sharedItems,
        })
      }
    }
  }

  // Sort by number of shared items (descending)
  matches.sort((a, b) => b.sharedItemsCount - a.sharedItemsCount)

  return matches
}

/**
 * Create or update a match record between two users
 */
export async function createMatch(
  user1Id: string,
  user2Id: string,
  sharedItemsCount: number
) {
  const supabase = createClient()
  
  // Ensure consistent ordering (smaller ID first)
  const [id1, id2] = [user1Id, user2Id].sort()

  // Check if match exists
  const { data: existingMatch } = await supabase
    .from("matches")
    .select("*")
    .eq("user1_id", id1)
    .eq("user2_id", id2)
    .single()

  if (existingMatch) {
    // Update existing match
    const { data: match, error } = await supabase
      .from("matches")
      .update({
        shared_items_count: sharedItemsCount,
        status: "pending",
      })
      .eq("id", existingMatch.id)
      .select()
      .single()

    if (error) throw error
    return match
  } else {
    // Create new match
    const { data: match, error } = await supabase
      .from("matches")
      .insert({
        user1_id: id1,
        user2_id: id2,
        shared_items_count: sharedItemsCount,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error
    return match
  }
}
