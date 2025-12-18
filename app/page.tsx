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
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gradient">
              Find Your Adventure Partners
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
              Connect with people who share your bucket list dreams. Plan experiences together and make memories that last a lifetime.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4 pt-4">
            <Button size="lg" className="btn-primary text-lg px-8 py-6" asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="btn-secondary text-lg px-8 py-6" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
          <Card className="card-modern hover:scale-105 transition-transform duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-primary">Create Your Bucket List</CardTitle>
              <CardDescription className="text-base">
                Add all the experiences you want to have in life
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                From travel adventures to learning new skills, organize your dreams by category and timeframe.
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern hover:scale-105 transition-transform duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-primary">Find Your Buddies</CardTitle>
              <CardDescription className="text-base">
                Get matched with people who share your interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our matching algorithm connects you with others who have similar bucket list items.
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern hover:scale-105 transition-transform duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-primary">Plan Together</CardTitle>
              <CardDescription className="text-base">
                Chat and coordinate your adventures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Use our real-time chat to plan experiences, share ideas, and make your bucket list dreams come true.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
