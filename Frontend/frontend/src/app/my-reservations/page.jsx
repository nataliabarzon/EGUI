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
  const [userId, setUserId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', description: '' });

  useEffect(() => {
    const token = localStorage.getItem('user');

    if (token) {
      try {
        
        setUser(token);
        setUserId(token.user?.id);
      } catch (err) {
        console.error('Error parsing user token:', err);
      }
    }
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

  const cancelReservation = async (bookId) => {
    setCancellingId(bookId);
    try {
      const res = await fetch(`https://egui.onrender.com/books/${bookId}/cancel-reservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      await fetchBooks(); // Refresh the book list
      showToast("Reservation Cancelled", "Your book reservation has been successfully cancelled.");
    } catch (err) {
      showToast("Error", `Failed to cancel reservation: ${err.message}`, "destructive");
    } finally {
      setCancellingId(null);
    }
  };

  const showToast = (title, description, variant = "default") => {
    setToastMessage({ title, description });
    setToastOpen(true);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">My Reservations</h1>
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
              {books
                .filter(book => book.rentedBy == userId)
                .map(book => (
                  <Card key={book.id} className="overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg">
                    <CardHeader className="bg-primary/10">
                      <CardTitle className="flex items-center text-lg font-semibold text-primary">
                        <BookOpenIcon className="mr-2 h-5 w-5" />
                        {book.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="flex items-center text-sm text-gray-600 mb-2">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Reserved until: {new Date(book.reservedUntil).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {book.id}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="destructive" 
                        className="w-full"
                        onClick={() => cancelReservation(book.id)}
                        disabled={cancellingId === book.id}
                      >
                        {cancellingId === book.id ? (
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
                    </CardFooter>
                  </Card>
                ))}
            </div>
          )}
          {!loading && !error && books.filter(book => book.rentedBy == userId).length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-600">You don't have any reservations yet.</p>
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
