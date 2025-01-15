import React from 'react';
import BookList from '../../components/BookList';

async function getBooks() {
  // In a real application, you would fetch this data from an API
  // For this example, we'll return a static array of books
  return [
    {
      "id": "78a73bcc-d3fd-4bcc-8b57-ee613f56c975",
      "title": "To Kill a Mockingbird",
      "author": "Harper Lee",
      "publisher": "J.B. Lippincott & Co.",
      "dateOfPublication": "1960-07-11",
      "price": "9.99",
      "isReserved": false,
      "reservedUntil": null,
      "isRented": false,
      "rentedUntil": null,
      "rentedBy": null,
      "createdAt": "2025-01-14T23:09:02.589Z",
      "updatedAt": "2025-01-14T23:09:02.589Z"
    },
    // Add more books here...
  ];
}

export default async function BooksPage() {
  const books = await getBooks();

  return <BookList books={books} />;
}

