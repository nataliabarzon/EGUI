"use client";

import { Header } from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-center">About Our Library</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground">
              Welcome to our library! We are dedicated to fostering a love for reading and learning in our community.
              Our library offers a wide range of books, digital resources, and educational programs for all ages.
            </p>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
              <p className="text-muted-foreground">
                Our mission is to provide free and open access to information, promote literacy, and support lifelong learning.
                We strive to create a welcoming environment where everyone can explore, discover, and grow.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-3">History</h2>
              <p className="text-muted-foreground">
                Founded in 1950, our library has been serving the community for over 70 years. We've grown from a small
                collection of books to a modern, multi-faceted resource center that embraces technology while maintaining
                the charm and warmth of a traditional library.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-3">Visit Us</h2>
              <p className="text-muted-foreground">
                We're located at 123 Library Street, Booktown, BT 12345. Our doors are open Monday through Saturday,
                from 9 AM to 8 PM. We look forward to seeing you soon!
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}