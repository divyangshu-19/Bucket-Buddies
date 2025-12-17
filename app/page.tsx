import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export default async function Home() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/bucket-list")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold tracking-tight">
            Find Your Adventure Partners
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with people who share your bucket list dreams. Plan experiences together and make memories that last a lifetime.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Create Your Bucket List</CardTitle>
              <CardDescription>
                Add all the experiences you want to have in life
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                From travel adventures to learning new skills, organize your dreams by category and timeframe.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Find Your Buddies</CardTitle>
              <CardDescription>
                Get matched with people who share your interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our matching algorithm connects you with others who have similar bucket list items.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plan Together</CardTitle>
              <CardDescription>
                Chat and coordinate your adventures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use our real-time chat to plan experiences, share ideas, and make your bucket list dreams come true.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
