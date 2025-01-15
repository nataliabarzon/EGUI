export type Book = {
    id: string;
    title: string;
    author: string;
    publisher: string;
    dateOfPublication: string;
    price: string;
    isReserved: boolean;
    reservedUntil: string | null;
    isRented: boolean;
    rentedUntil: string | null;
    rentedBy: string | null;
    createdAt: string;
    updatedAt: string;
  };
  
  