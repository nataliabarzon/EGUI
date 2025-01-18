'use client';

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const AddBook = ({ newBook, setNewBook, handleCreateBook }) => {
  return (
    <Card className="mb-8 border w-[80%] mt-8 mx-auto">
      <CardHeader>
        <CardTitle>Add New Book</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateBook} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                value={newBook.publisher}
                onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="dateOfPublication">Date of Publication</Label>
              <Input
                id="dateOfPublication"
                type="date"
                value={newBook.dateOfPublication}
                onChange={(e) => setNewBook({ ...newBook, dateOfPublication: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={newBook.price}
                onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleCreateBook}>Add Book</Button>
      </CardFooter>
    </Card>
  );
};

export default AddBook;
