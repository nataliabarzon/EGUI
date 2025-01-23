'use client';

import React, { useEffect, useState } from 'react';
import * as Toast from '@radix-ui/react-toast';
import ProtectedRoute from '../protected-route';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CalendarIcon, BookOpenIcon, XCircleIcon } from 'lucide-react';

const MyReservations = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState();
  const [cancellingId, setCancellingId] = useState(null);

  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', description: '' });

  useEffect(() => {
    const token = localStorage.getItem('user');
    if (token) {
      try {
        const tokenParsed = JSON.parse(token);
        setUser(tokenParsed);
        console.log(tokenParsed.user.id);
        setUserId(tokenParsed.user?.id);
        console.log(userId)
      } catch (err) {
        console.error('Error parsing user token:', err);
      }
    }
    console.log(userBooks)
  }, []);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('https://egui.onrender.com/books');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Only cancel reservations. If the book is rented, we don't allow cancelling/returning.
  const cancelBooking = async (book) => {
    // Ensure that this function is only called for a reserved book
    if (book.isRented) return;

    setCancellingId(book.id);
    try {
      const res = await fetch(`https://egui.onrender.com/books/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isReserved: false,
          reservedUntil: null,
          isRented: false,
          rentedUntil: null,
          rentedBy: null,
          // We leave rental-related properties intact
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      await fetchBooks(); 
      showToast("Reservation Cancelled", "Your book reservation has been successfully cancelled.");
    } catch (err) {
      showToast("Error", `Failed to cancel reservation: ${err.message}`);
    } finally {
      setCancellingId(null);
    }
  };

  const showToast = (title, description) => {
    setToastMessage({ title, description });
    setToastOpen(true);
  };

  // Filter books that are either reserved or rented by the user.
  const userBooks = books.filter(book =>
    book.rentedBy == userId 
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 mt-8 py-8">
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          {error && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="text-red-600 py-4">
                Error: {error}
              </CardContent>
            </Card>
          )}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userBooks.map(book => (
                <Card
                  key={book.id}
                  className={`overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg ${book.isRented ? 'bg-blue-50' : 'bg-green-50'}`}
                >
                  <CardHeader className={book.isRented ? 'bg-blue-950' : 'bg-green-950'}>
                    <CardTitle className="flex items-center text-lg font-semibold text-primary">
                      <BookOpenIcon className="mr-2 h-5 w-5" />
                      {book.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="flex items-center text-sm text-gray-600 mb-2">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {book.isRented 
                        ? 'Rented until: ' + new Date(book.rentedUntil).toLocaleDateString('en-GB')
                        : 'Reserved until: ' + new Date(book.reservedUntil).toLocaleDateString('en-GB')
                      }
                    </p>
                  </CardContent>
                  <CardFooter>
                    {book.isRented ? (
                      // Calculate and display how many days are left for the rented book.
                      <div className="w-full text-center text-sm text-gray-600">
                        {(() => {
                          const now = new Date();
                          const dueDate = new Date(book.rentedUntil);
                          const daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
                          return daysLeft > 0 
                            ? `Due in ${daysLeft} day(s)` 
                            : 'Due date passed';
                        })()}
                      </div>
                    ) : (
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={() => cancelBooking(book)}
                        disabled={cancellingId == book.id}
                      >
                        {cancellingId == book.id ? (
                          <>
                            <Skeleton className="h-5 w-5 mr-2" />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="mr-2 h-5 w-5" />
                            Cancel Reservation
                          </>
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          { userBooks.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-600">You don't have any reservations or rentals yet.</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
      <Toast.Provider swipeDirection="right">
        <Toast.Root open={toastOpen} onOpenChange={setToastOpen}>
          <Toast.Title>{toastMessage.title}</Toast.Title>
          <Toast.Description>{toastMessage.description}</Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 p-4" />
      </Toast.Provider>
    </ProtectedRoute>
  );
};

export default MyReservations;
