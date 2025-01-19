'use client'

import { useState, useEffect } from 'react'
import * as Toast from "@radix-ui/react-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import AddBook from "@/components/AddBook"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const API_URL = 'https://egui.onrender.com'

export function BooksManagement() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newBook, setNewBook] = useState({ title: '', author: '', publisher: '', dateOfPublication: '', price: '' })
  const [editingBook, setEditingBook] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState([]);
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => {
    fetchBooks()
    fetchUsers(); 
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/books`)
      if (!response.ok) throw new Error('Failed to fetch books')
      const data = await response.json()
      setBooks(data)
    } catch (err) {
      setError(err.message)
      showToast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Handle error appropriately, e.g., show a toast message
    }
  };


  const handleCreateBook = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      })
      if (!response.ok) throw new Error('Failed to create book')
      await fetchBooks()
      setNewBook({ title: '', author: '', publisher: '', dateOfPublication: '', price: '' })
      showToast({ title: "Success", description: "Book created successfully", variant: "default" })
    } catch (err) {
      showToast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }



  const handleDeleteBook = async (id) => {
    try {
      const response = await fetch(`${API_URL}/books/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete book')
      await fetchBooks()
      showToast({ title: "Success", description: "Book deleted successfully", variant: "default" })
    } catch (err) {
      showToast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }
  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/books/${editingBook.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingBook,
          // Ensure that the flags reflect the existence of reservedBy/rentedBy
          isReserved: !!editingBook.rentedBy,
          isRented: !!editingBook.rentedBy,
        }),
      });
      if (!response.ok) throw new Error('Failed to update book');
      await fetchBooks();
      setEditingBook(null);
      showToast({ title: "Success", description: "Book updated successfully", variant: "default" });
    } catch (err) {
      showToast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };
  
  const handleReserveBook = async (id) => { 
    try {
      const response = await fetch(`${API_URL}/books/${id}/reserve`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Additional reservation data can be added here if needed.
        // Typically the server should set `isReserved` to true and define a `reservedUntil`
        // date, while leaving rental properties untouched.
      });
      if (!response.ok) throw new Error('Failed to reserve book');
      await fetchBooks();
      showToast({ title: "Success", description: "Book reserved successfully", variant: "default" });
    } catch (err) {
      showToast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };
  
  const handleRentBook = async (id) => {
    try {
      const response = await fetch(`${API_URL}/books/${id}/rent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isReserved: false,
          reservedUntil: null,
          rentedBy: null,
          isRented: true,
        }),
      });
      if (!response.ok) throw new Error('Failed to rent book');
      await fetchBooks();
      showToast({ title: "Success", description: "Book rented successfully", variant: "default" });
    } catch (err) {
      showToast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };
  
  const handleCancelReservation = async (id) => {
    try {
      const response = await fetch(`${API_URL}/books/${id}/cancel-reservation`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isReserved: false,
          reservedUntil: null,
          reservedBy: null,
          // Leave rental-related properties unchanged.
        }),
      });
      if (!response.ok) throw new Error('Failed to cancel reservation');
      await fetchBooks();
      showToast({ title: "Success", description: "Reservation cancelled successfully", variant: "default" });
    } catch (err) {
      showToast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };
  
  const handleReturnBook = async (id) => {
    try {
      const response = await fetch(`${API_URL}/books/${id}/return`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Clear both reservation and rental status upon return:
          isReserved: false,
          reservedUntil: null,
          reservedBy: null,
          isRented: false,
          rentedUntil: null,
          rentedBy: null,
        }),
      });
      if (!response.ok) throw new Error('Failed to return book');
      await fetchBooks();
      showToast({ title: "Success", description: "Book returned successfully", variant: "default" });
    } catch (err) {
      showToast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };
  
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <p className="text-center text-xl mt-8">Loading books...</p>
  if (error) return <p className="text-center text-xl mt-8 text-red-500">Error: {error}</p>

  return (
    <Toast.Provider swipeDirection="right">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Book Management</h1>
        <Card>
          <CardHeader>
            <CardTitle>Book List</CardTitle>
            <div className="mt-2">
              <Input
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Publisher</TableHead>
                  <TableHead>Date of Publication</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.publisher}</TableCell>
                    <TableCell>{new Date(book.dateOfPublication).toLocaleDateString()}</TableCell>
                    <TableCell>${book.price}</TableCell>
                    <TableCell>
                      {book.isReserved ? 'Reserved' : book.isRented ? 'Rented' : 'Available'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditingBook(book)}>Edit</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Book</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleUpdateBook} className="space-y-4">
                              <div>
                                <Label htmlFor="edit-title">Title</Label>
                                <Input
                                  id="edit-title"
                                  value={editingBook?.title || ''}
                                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-author">Author</Label>
                                <Input
                                  id="edit-author"
                                  value={editingBook?.author || ''}
                                  onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-publisher">Publisher</Label>
                                <Input
                                  id="edit-publisher"
                                  value={editingBook?.publisher || ''}
                                  onChange={(e) => setEditingBook({ ...editingBook, publisher: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-dateOfPublication">Date of Publication</Label>
                                <Input
                                  id="edit-dateOfPublication"
                                  type="date"
                                  value={editingBook?.dateOfPublication?.split('T')[0] || ''}
                                  onChange={(e) => setEditingBook({ ...editingBook, dateOfPublication: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-price">Price</Label>
                                <Input
                                  id="edit-price"
                                  type="number"
                                  step="0.01"
                                  value={editingBook?.price || ''}
                                  onChange={(e) => setEditingBook({ ...editingBook, price: e.target.value })}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-reservedUntil">Reserved Until</Label>
                                <Input
                                  id="edit-reservedUntil"
                                  type="date"
                                  value={editingBook?.reservedUntil?.split('T')[0] || ''}
                                  onChange={(e) => setEditingBook({ ...editingBook, reservedUntil: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-rentedBy">Taken By</Label>
                                <Select
                                  value={editingBook?.rentedBy?.toString() || ''}
                                  onValueChange={(value) => setEditingBook({ ...editingBook, rentedBy: value ? Number(value) : null })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select user" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="slt">None</SelectItem>
                                    {users.map((user) => (
                                      <SelectItem key={user.id} value={user.id.toString()}>{user.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="edit-rentedUntil">Rented Until</Label>
                                <Input
                                  id="edit-rentedUntil"
                                  type="date"
                                  value={editingBook?.rentedUntil?.split('T')[0] || ''}
                                  onChange={(e) => setEditingBook({ ...editingBook, rentedUntil: e.target.value })}
                                />
                              </div>
                            </form>
                            <DialogFooter>
                              <Button type="submit" onClick={handleUpdateBook}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteBook(book.id)}>Delete</Button>
                        {!book.isReserved && !book.isRented && (
                          <>
                            <Button variant="secondary" size="sm" onClick={() => handleReserveBook(book.id)}>Reserve</Button>
                            <Button variant="secondary" size="sm" onClick={() => handleRentBook(book.id)}>Rent</Button>
                          </>
                        )}
                        {book.isReserved && (
                          <Button variant="secondary" size="sm" onClick={() => handleCancelReservation(book.id)}>Cancel Reservation</Button>
                        )}
                        {book.isRented && (
                          <Button variant="secondary" size="sm" onClick={() => handleReturnBook(book.id)}>Return</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <AddBook newBook={newBook} setNewBook={setNewBook} handleCreateBook={handleCreateBook} />

        <Toast.Root
          open={toast.open}
          onOpenChange={hideToast}
          className={`${
            toast.variant === 'destructive' ? 'bg-red-600' : 'bg-green-600'
          } text-white p-4 rounded shadow-lg`}
        >
          <Toast.Title className="font-semibold">{toast.title}</Toast.Title>
          <Toast.Description>{toast.description}</Toast.Description>
          <Toast.Action className="absolute top-2 right-2" asChild altText="Close">
            <button onClick={hideToast} className="text-white">
              X
            </button>
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-full max-w-sm m-0 list-none z-50" />
      </div>
    </Toast.Provider>
  )
}

