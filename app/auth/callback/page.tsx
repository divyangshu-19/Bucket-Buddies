"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClient()

        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          setError(error.message)
          return
        }

        if (data.session) {
          // Successfully authenticated, redirect to bucket list
          router.push("/bucket-list")
          router.refresh()
        } else {
          // No session, redirect to sign in
          router.push("/auth/signin")
        }
      } catch (err) {
        console.error("Auth callback error:", err)
        setError("Authentication failed. Please try again.")
      }
    }

    handleAuthCallback()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md card-modern">
          <CardHeader>
            <CardTitle className="text-destructive">Authentication Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={() => router.push("/auth/signin")}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Completing Sign In...
          </CardTitle>
          <CardDescription>
            Please wait while we complete your authentication.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
