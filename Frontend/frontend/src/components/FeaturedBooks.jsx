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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import * as Toast from '@radix-ui/react-toast'

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

function getRandomCover() {
  const randomIndex = Math.floor(Math.random() * coverImages.length)
  return coverImages[randomIndex]
}

export function FeaturedBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [user, setUser] = useState(null)
  const [userId, setUserId] = useState(null)

  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: '', description: '' })

  useEffect(() => {
    const token = localStorage.getItem('user')
    if (token) {
      try {
        setUser(token)
        setUserId(token.user?.id)
      } catch (err) {
        console.error('Error parsing user token:', err)
      }
    }
  }, [])

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

  const handleReserveBook = async (bookId) => {
    if (!user) {
      showToast("Error", "Please log in to reserve books")
      return
    }

    try {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)

      const response = await fetch(`https://egui.onrender.com/books/${bookId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isReserved: true,
          reservedUntil: tomorrow.toISOString(),
          rentedBy: userId

        })
      })

      if (!response.ok) {
        throw new Error('Failed to reserve book')
      }
      setBooks(books.map(book => {
        if (book.id === bookId) {
          return {
            ...book,
            isReserved: true,
            reservedUntil: tomorrow.toISOString(),
            rentedBy: userId
          }
        }
        return book
      }))

      showToast("Success", "Book reserved successfully")
    } catch (err) {
      showToast("Error", err.message)
    }
  }

  const showToast = (title, description) => {
    setToastMessage({ title, description })
    setToastOpen(true)
  }

  if (loading) return <p className="text-center text-xl mt-8">Loading books...</p>
  if (error) return <p className="text-center text-xl mt-8 text-red-500">Error loading books: {error}</p>

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Featured Books</h2>
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search books by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book) => {
            const coverImage = book.coverImage || getRandomCover()
            const isReservedByUser = book.isReserved && book.reservedBy == user?.id

            return (
              <Card key={book.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-center">{book.title}</CardTitle>
                  <CardDescription className="text-center">{book.author}</CardDescription>
                  <Image
                    src={coverImage || "/placeholder.svg"}
                    alt={`Cover of ${book.title}`}
                    width={200}
                    height={300}
                    className="mx-auto mb-4 rounded-md shadow-md"
                  />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center mb-2">{book.publisher}</p>
                  <div className="flex justify-center space-x-2 mb-4">
                    <Badge variant="secondary">Published: {new Date(book.dateOfPublication).getFullYear()}</Badge>
                    <Badge variant="secondary">${book.price}</Badge>
                  </div>
                  {book.isReserved && (
                    <Badge 
                      variant={isReservedByUser ? "secondary" : "destructive"} 
                      className="w-full justify-center"
                    >
                      {isReservedByUser ? 'Reserved by you' : 'Reserved'}
                    </Badge>
                  )}
                  {book.isRented && (
                    <Badge variant="destructive" className="w-full justify-center">Rented</Badge>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    disabled={book.isReserved || book.isRented}
                    onClick={() => handleReserveBook(book.id)}
                  >
                    {isReservedByUser ? 'Reserved by you' : 
                      book.isReserved ? 'Reserved' : 
                      book.isRented ? 'Rented' : 
                      'Reserve'}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </section>
      <Toast.Provider swipeDirection="right">
        <Toast.Root open={toastOpen} onOpenChange={setToastOpen}>
          <Toast.Title>{toastMessage.title}</Toast.Title>
          <Toast.Description>{toastMessage.description}</Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 p-4" />
      </Toast.Provider>
    </>
  )
}
