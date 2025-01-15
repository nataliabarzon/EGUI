import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function BookList({ books }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <Card key={book.id}>
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><span className="font-semibold">Author:</span> {book.author}</p>
              <p><span className="font-semibold">Publisher:</span> {book.publisher}</p>
              <p><span className="font-semibold">Publication Date:</span> {new Date(book.dateOfPublication).toLocaleDateString()}</p>
              <p><span className="font-semibold">Price:</span> ${book.price}</p>
              <div className="mt-2">
                {book.isReserved && (
                  <Badge variant="secondary" className="mr-2">
                    Reserved until {new Date(book.reservedUntil).toLocaleDateString()}
                  </Badge>
                )}
                {book.isRented && (
                  <Badge variant="destructive">
                    Rented until {new Date(book.rentedUntil).toLocaleDateString()}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

BookList.propTypes = {
  books: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    publisher: PropTypes.string.isRequired,
    dateOfPublication: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    isReserved: PropTypes.bool.isRequired,
    reservedUntil: PropTypes.string,
    isRented: PropTypes.bool.isRequired,
    rentedUntil: PropTypes.string,
    rentedBy: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired
  })).isRequired
};

export default BookList;

