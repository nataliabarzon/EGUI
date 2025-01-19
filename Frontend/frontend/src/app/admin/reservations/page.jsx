'use client'

import { useState, useEffect, Fragment } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/Header"

const API_URL = 'https://egui.onrender.com'

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingReservation, setEditingReservation] = useState(null)
  const { toast, showToast } = useToast()

  useEffect(() => {
    fetchReservations()
    fetchUsers()
  }, [])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/books`)
      if (!response.ok) throw new Error('Failed to fetch books')
      const data = await response.json()
      const reservedBooks = data.filter(book => book.isReserved || book.isRented)
      setReservations(reservedBooks)
    } catch (err) {
      setError(err.message)
      showToast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`)
      if (!response.ok) throw new Error('Failed to fetch users')
      const data = await response.json()
      setUsers(data)
    } catch (err) {
      console.error('Error fetching users:', err)
      showToast({ title: "Error", description: "Failed to fetch users", variant: "destructive" })
    }
  }

  const handleUpdateReservation = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/books/${editingReservation.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingReservation,
          isReserved: !!editingReservation.reservedBy,
          isRented: !!editingReservation.rentedBy
        })
      })
      if (!response.ok) throw new Error('Failed to update reservation')
      await fetchReservations()
      setEditingReservation(null)
      showToast({ title: "Success", description: "Reservation updated successfully", variant: "default" })
    } catch (err) {
      showToast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  const handleCancelReservation = async (id) => {
    try {
      const response = await fetch(`${API_URL}/books/${id}/cancel-reservation`, { method: 'PATCH' })
      if (!response.ok) throw new Error('Failed to cancel reservation')
      await fetchReservations()
      showToast({ title: "Success", description: "Reservation cancelled successfully", variant: "default" })
    } catch (err) {
      showToast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  const handleReturnBook = async (id) => {
    try {
      const response = await fetch(`${API_URL}/books/${id}/return`, { method: 'PATCH' })
      if (!response.ok) throw new Error('Failed to return book')
      await fetchReservations()
      showToast({ title: "Success", description: "Book returned successfully", variant: "default" })
    } catch (err) {
      showToast({ title: "Error", description: err.message, variant: "destructive" })
    }
  }

  const calculateDuration = (date) => {
    if (!date) return <span className="font-bold text-red-600">ASSIGN</span>
    const now = new Date()
    const end = new Date(date)
    const diffTime = Math.abs(end.getTime() - now.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`
  }

  const getUserEmail = (userId) => {
    const user = users.find(u => u.id == userId)
    return user ? user.email : <span className="font-bold text-red-600">ASSIGN</span>
  }

  if (loading) return <p className="text-center text-xl mt-8">Loading reservations...</p>
  if (error) return <p className="text-center text-xl mt-8 text-red-500">Error: {error}</p>

  return (
    <Fragment>
    <Header />
    <div className="container mx-auto mt-12 p-4">
      <h1 className="text-3xl font-bold mb-6">Book Reservations and Rentals</h1>
      <Card>
        <CardHeader>
          <CardTitle>Current Reservations and Rentals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Taken By</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.isReserved ? 'Reserved' : 'Rented'}</TableCell>
                  <TableCell>{getUserEmail(book.reservedBy || book.rentedBy)}</TableCell>
                  <TableCell>
                    {calculateDuration(book.rentedUntil || book.reservedUntil)}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingReservation(book)}>Edit</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Reservation</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleUpdateReservation} className="space-y-4">
                            <div>
                              <Label htmlFor="edit-takenBy">Taken By</Label>
                              <Select
                                value={(book.reservedBy || book.rentedBy)?.toString()}
                                onValueChange={(value) => setEditingReservation({ ...editingReservation, reservedBy: Number(value), rentedBy: Number(value) })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select user" />
                                </SelectTrigger>
                                <SelectContent>
                                  {users.map((user) => (
                                    <SelectItem key={user.id} value={user.id.toString()}>{user.email}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="edit-until">Rented Until</Label>
                              <Input
                                id="edit-until"
                                type="date"
                                value={(editingReservation?.rentedUntil || editingReservation?.reservedUntil)?.split('T')[0] || ''}
                                onChange={(e) => setEditingReservation({ ...editingReservation, rentedUntil: e.target.value, reservedUntil: e.target.value })}
                              />
                            </div>
                          </form>
                          <DialogFooter>
                            <Button type="submit" onClick={handleUpdateReservation}>Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      {book.isReserved && (
                        <Button variant="secondary" size="sm" onClick={() => handleCancelReservation(book.id)}>Cancel Reservation</Button>
                      )}
                      {book.isRented && (
                        <Button variant="secondary" size="sm" onClick={() => handleReturnBook(book.id)}>Return Book</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </Fragment>
  )
}

