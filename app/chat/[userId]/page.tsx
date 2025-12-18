import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ChatClient } from "./chat-client"

interface ChatPageProps {
  params: { userId: string }
  searchParams: { matchId?: string }
}

export default async function ChatPage({
  params,
  searchParams,
}: ChatPageProps) {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/signin")
  }

  // Get the other user's info
  const { data: otherUser, error } = await supabase
    .from("profiles")
    .select("id, name, email, image")
    .eq("id", params.userId)
    .single()

  if (error || !otherUser) {
    redirect("/matches")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-2 md:px-4 py-4 md:py-8">
        <ChatClient
          currentUserId={session.user.id}
          otherUser={otherUser}
          matchId={searchParams.matchId}
        />
      </main>
    </div>
  )
}
