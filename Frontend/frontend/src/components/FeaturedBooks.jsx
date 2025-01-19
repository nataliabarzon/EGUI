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
  "https://covers.openlibrary.org/b/isbn/9780140328721-L.jpg", // "Matilda" by Roald Dahl
  "https://covers.openlibrary.org/b/isbn/9780439139601-L.jpg", // "Harry Potter and the Goblet of Fire" by J.K. Rowling
  "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg", // "To Kill a Mockingbird" by Harper Lee
  "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg", // "1984" by George Orwell
  "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg", // "The Great Gatsby" by F. Scott Fitzgerald
  "https://covers.openlibrary.org/b/isbn/9780316769488-L.jpg", // "The Catcher in the Rye" by J.D. Salinger
  "https://covers.openlibrary.org/b/isbn/9780618260300-L.jpg", // "The Hobbit" by J.R.R. Tolkien
  "https://covers.openlibrary.org/b/isbn/9780385472579-L.jpg", // "The Da Vinci Code" by Dan Brown
  "https://covers.openlibrary.org/b/isbn/9780140283334-L.jpg", // "The Alchemist" by Paulo Coelho
  "https://covers.openlibrary.org/b/isbn/9780747581086-L.jpg", // "Harry Potter and the Half-Blood Prince" by J.K. Rowling
  "https://covers.openlibrary.org/b/isbn/9780060256654-L.jpg", // "Where the Wild Things Are" by Maurice Sendak
  "https://covers.openlibrary.org/b/isbn/9780142437230-L.jpg", // "Moby-Dick" by Herman Melville
  "https://covers.openlibrary.org/b/isbn/9780140449136-L.jpg", // "Crime and Punishment" by Fyodor Dostoevsky
  "https://covers.openlibrary.org/b/isbn/9780141439600-L.jpg", // "Pride and Prejudice" by Jane Austen
  "https://covers.openlibrary.org/b/isbn/9780140449266-L.jpg", // "The Odyssey" by Homer
  "https://covers.openlibrary.org/b/isbn/9780140449181-L.jpg", // "The Iliad" by Homer
  "https://covers.openlibrary.org/b/isbn/9780140449273-L.jpg", // "War and Peace" by Leo Tolstoy
  "https://covers.openlibrary.org/b/isbn/9780140449204-L.jpg", // "Anna Karenina" by Leo Tolstoy
  "https://covers.openlibrary.org/b/isbn/9780140449242-L.jpg", // "Les Misérables" by Victor Hugo
  "https://covers.openlibrary.org/b/isbn/9780140449198-L.jpg", // "Madame Bovary" by Gustave Flaubert
  "https://covers.openlibrary.org/b/isbn/9780140449228-L.jpg", // "The Divine Comedy" by Dante Alighieri
  "https://covers.openlibrary.org/b/isbn/9780140449235-L.jpg", // "Don Quixote" by Miguel de Cervantes
  "https://covers.openlibrary.org/b/isbn/9780140449211-L.jpg", // "The Brothers Karamazov" by Fyodor Dostoevsky
  "https://covers.openlibrary.org/b/isbn/9780140449259-L.jpg", // "Ulysses" by James Joyce
  "https://covers.openlibrary.org/b/isbn/9780140449280-L.jpg", // "The Aeneid" by Virgil
  "https://covers.openlibrary.org/b/isbn/9780140449297-L.jpg", // "The Canterbury Tales" by Geoffrey Chaucer
  "https://covers.openlibrary.org/b/isbn/9780140449303-L.jpg", // "Faust" by Johann Wolfgang von Goethe
  "https://covers.openlibrary.org/b/isbn/9780140449310-L.jpg", // "Paradise Lost" by John Milton
  "https://covers.openlibrary.org/b/isbn/9780140449327-L.jpg", // "Gulliver's Travels" by Jonathan Swift
  "https://covers.openlibrary.org/b/isbn/9780140449334-L.jpg", // "Frankenstein" by Mary Shelley
];



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
    const tokenParsed = JSON.parse(token);
    if (token) {
      try {
        setUser(tokenParsed)
        setUserId(tokenParsed.user?.id)
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
        <div className="mb-6 border-1 border-gray-300 rounded-md p-4">
          <Input
            type="text"
            placeholder="Search books by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-white  max-w-md mx-auto"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book) => {
            const coverImage =  getRandomCover()
            const isReservedByUser = book.isReserved && book.reservedBy == user?.id

            return (
              <Card key={book.id} className="flex flex-col justify-between border-2 bg-blue-950 hover:shadow-lg transition-shadow duration-200">
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
    disabled={book.rentedBy !== null && book.rentedBy !== undefined}
    onClick={() => handleReserveBook(book.id)}

  >
    {book.rentedBy !== null && book.rentedBy !== undefined
      ? `Unavailable until ${new Date(book.reservedUntil || book.rentedUntil)
          .toLocaleDateString('en-GB')}` // Format date as DD-MM-YYYY
      : 'Reserve'}
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
