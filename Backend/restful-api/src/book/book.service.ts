import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
    Logger,
  } from '@nestjs/common';
  import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
  import { Cron, CronExpression } from '@nestjs/schedule';
  
  @Injectable()
  export class BookService {
    private readonly logger = new Logger(BookService.name);
    private books = [];
  
    private checkLibrarianRole(role: string) {
      if (role !== 'Librarian') {
        throw new ForbiddenException('Access denied. Only librarians can perform this action.');
      }
    }
  
    createBook(createBookDto: CreateBookDto, role: string) {
      this.checkLibrarianRole(role);
      const newBook = { ...createBookDto, isReserved: false, isRented: false, reservedUntil: null, rentedUntil: null };
      this.books.push(newBook);
      return { message: 'Book created successfully', book: newBook };
    }
  
    updateBook(id: string, updateBookDto: UpdateBookDto, role: string) {
      this.checkLibrarianRole(role);
      const book = this.findBookById(id);
  
      Object.assign(book, updateBookDto);
      return { message: `Book with ID ${id} updated successfully`, book };
    }
  
    deleteBook(id: string, role: string) {
      this.checkLibrarianRole(role);
      const bookIndex = this.books.findIndex((book) => book.id === id);
  
      if (bookIndex === -1) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
  
      const deletedBook = this.books.splice(bookIndex, 1);
      return { message: `Book with ID ${id} deleted successfully`, book: deletedBook };
    }
  
    findAllBooks() {
      return this.books;
    }
  
    findBookById(id: string) {
      const book = this.books.find((book) => book.id === id);
      if (!book) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      return book;
    }
  
    reserveBook(id: string) {
      const book = this.findBookById(id);
  
      if (book.isReserved || book.isRented) {
        throw new BadRequestException(
          `Book with ID ${id} is already reserved or rented`,
        );
      }
  
      book.isReserved = true;
      book.reservedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); 
      return { message: `Book with ID ${id} reserved for 24 hours`, book };
    }
  
    rentBook(id: string) {
      const book = this.findBookById(id);
  
      if (book.isRented) {
        throw new BadRequestException(`Book with ID ${id} is already rented`);
      }
  
      if (book.isReserved) {
        throw new BadRequestException(
          `Book with ID ${id} is reserved and cannot be rented`,
        );
      }
  
      book.isRented = true;
      book.rentedUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); 
      return { message: `Book with ID ${id} rented for 30 days`, book };
    }
  
    cancelReservation(id: string) {
      const book = this.findBookById(id);
  
      if (!book.isReserved) {
        throw new BadRequestException(`Book with ID ${id} is not reserved`);
      }
  
      book.isReserved = false;
      book.reservedUntil = null;
      return { message: `Reservation for Book with ID ${id} canceled`, book };
    }
  
    returnBook(id: string) {
      const book = this.findBookById(id);
  
      if (!book.isRented) {
        throw new BadRequestException(`Book with ID ${id} is not rented`);
      }
  
      book.isRented = false;
      book.rentedUntil = null;
      return { message: `Book with ID ${id} returned successfully`, book };
    }
  
    
    @Cron(CronExpression.EVERY_HOUR) 
    handleExpiredReservations() {
      const now = new Date();
      this.logger.log('Checking for expired reservations...');
  
      this.books.forEach((book) => {
        if (book.isReserved && book.reservedUntil && book.reservedUntil < now) {
          book.isReserved = false;
          book.reservedUntil = null;
          this.logger.log(`Reservation expired for Book ID: ${book.id}`);
        }
      });
    }
  
    
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) 
    handleExpiredRentals() {
      const now = new Date();
      this.logger.log('Checking for expired rentals...');
  
      this.books.forEach((book) => {
        if (book.isRented && book.rentedUntil && book.rentedUntil < now) {
          book.isRented = false;
          book.rentedUntil = null;
          this.logger.log(`Rental expired for Book ID: ${book.id}`);
        }
      });
    }
  }
  