'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from './ui/button'

const coverImages = [
  "https://tse1.mm.bing.net/th?id=OIP.0qxWWiv5uAS-T2OK11jpawHaLZ&pid=Api",
  "https://tse2.mm.bing.net/th?id=OIP.PoJkOCVEIeVPuLPCFpZliwHaLG&pid=Api",
  "https://tse1.mm.bing.net/th?id=OIP.fjy0J4oxduE_KEQYBQI6jgHaLY&pid=Api",
  "https://tse3.mm.bing.net/th?id=OIP.WyicmsRIDPlv34fLnTu-JgHaLH&pid=Api",
  "https://tse1.mm.bing.net/th?id=OIP.0qxWWiv5uAS-T2OK11jpawHaLZ&pid=Api",
  "https://tse2.mm.bing.net/th?id=OIP.PoJkOCVEIeVPuLPCFpZliwHaLG&pid=Api",
  "https://tse1.mm.bing.net/th?id=OIP.fjy0J4oxduE_KEQYBQI6jgHaLY&pid=Api",
  "https://tse3.mm.bing.net/th?id=OIP.WyicmsRIDPlv34fLnTu-JgHaLH&pid=Api",
  "https://tse1.mm.bing.net/th?id=OIP.0qxWWiv5uAS-T2OK11jpawHaLZ&pid=Api",
  "https://tse2.mm.bing.net/th?id=OIP.PoJkOCVEIeVPuLPCFpZliwHaLG&pid=Api",
  "https://tse1.mm.bing.net/th?id=OIP.fjy0J4oxduE_KEQYBQI6jgHaLY&pid=Api",
  "https://tse3.mm.bing.net/th?id=OIP.WyicmsRIDPlv34fLnTu-JgHaLH&pid=Api",
  "https://tse1.mm.bing.net/th?id=OIP.0qxWWiv5uAS-T2OK11jpawHaLZ&pid=Api",
  "https://tse2.mm.bing.net/th?id=OIP.PoJkOCVEIeVPuLPCFpZliwHaLG&pid=Api",
  "https://tse1.mm.bing.net/th?id=OIP.fjy0J4oxduE_KEQYBQI6jgHaLY&pid=Api",
  "https://tse3.mm.bing.net/th?id=OIP.WyicmsRIDPlv34fLnTu-JgHaLH&pid=Api",
  "https://tse1.mm.bing.net/th?id=OIP.0qxWWiv5uAS-T2OK11jpawHaLZ&pid=Api",
  "https://tse2.mm.bing.net/th?id=OIP.PoJkOCVEIeVPuLPCFpZliwHaLG&pid=Api",
  "https://tse1.mm.bing.net/th?id=OIP.fjy0J4oxduE_KEQYBQI6jgHaLY&pid=Api",
  "https://tse3.mm.bing.net/th?id=OIP.WyicmsRIDPlv34fLnTu-JgHaLH&pid=Api",
]

// Helper function to retrieve a random cover image URL
function getRandomCover() {
  const randomIndex = Math.floor(Math.random() * coverImages.length)
  return coverImages[randomIndex]
}

export function FeaturedBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch('https://egui.onrender.com/books')
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json()
        setBooks(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  if (loading) return <p>Loading books...</p>
  if (error) return <p>Error loading books: {error}</p>

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Featured Books</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => {
          // Either use the cover from the API or pick a random cover image.
          // If you always want a random image, just call getRandomCover().
          const coverImage = book.coverImage || getRandomCover()

          return (
            <Card key={book.id}>
              <CardHeader>
                <CardTitle>{book.title}</CardTitle>
                <CardDescription>{book.author}</CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  src={coverImage}
                  alt={`Cover of ${book.title}`}
                  width={150}
                  height={200}
                  className="mx-auto mb-4"
                />
                <p className="text-sm text-muted-foreground">
                  {book.description || 'No description available.'}
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Borrow</Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
