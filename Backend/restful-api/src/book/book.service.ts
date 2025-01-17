import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BookService {
  private readonly logger = new Logger(BookService.name);

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  // private checkLibrarianRole(role: string) {
  //   if (role !== 'librarian') {
  //     throw new ForbiddenException('Access denied. Only librarians can perform this action.');
  //   }
  // }

  async createBook(createBookDto: CreateBookDto) {
    const newBook = this.bookRepository.create(createBookDto);
    await this.bookRepository.save(newBook);
    return { message: 'Book created successfully', book: newBook };
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.findBookById(id);
    Object.assign(book, updateBookDto);
    await this.bookRepository.save(book);
    return { message: `Book with ID ${id} updated successfully`, book };
  }

  async deleteBook(id: string) {
    const result = await this.bookRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return { message: `Book with ID ${id} deleted successfully` };
  }

  async findAllBooks() {
    return this.bookRepository.find();
  }

  async findBookById(id: string) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async reserveBook(id: string) {
    const book = await this.findBookById(id);
    if (book.isReserved || book.isRented) {
      throw new BadRequestException(`Book with ID ${id} is already reserved or rented`);
    }
    book.isReserved = true;
    book.reservedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // Reserve for 24 hours
    await this.bookRepository.save(book);
    return { message: `Book with ID ${id} reserved for 24 hours`, book };
  }

  async rentBook(id: string, rentedBy: string) {
    const book = await this.findBookById(id);
    if (book.isReserved) {
      throw new BadRequestException(`Book with ID ${id} is reserved and cannot be rented`);
    }
    book.isRented = true;
    book.rentedBy = rentedBy;
    book.rentedUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Rent for 30 days
    await this.bookRepository.save(book);
    return { message: `Book with ID ${id} rented for 30 days`, book };
  }

  async cancelReservation(id: string) {
    const book = await this.findBookById(id);
    if (!book.isReserved) {
      throw new BadRequestException(`Book with ID ${id} is not reserved`);
    }
    book.isReserved = false;
    book.reservedUntil = null;
    await this.bookRepository.save(book);
    return { message: `Reservation for Book with ID ${id} canceled`, book };
  }

  async returnBook(id: string) {
    const book = await this.findBookById(id);
    if (!book.isRented) {
      throw new BadRequestException(`Book with ID ${id} is not rented`);
    }
    book.isRented = false;
    book.rentedBy = null;
    book.rentedUntil = null;
    await this.bookRepository.save(book);
    return { message: `Book with ID ${id} returned successfully`, book };
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleExpiredReservations() {
    const now = new Date();
    const expiredBooks = await this.bookRepository.find({
      where: { isReserved: true, reservedUntil: LessThan(now) },
    });
    for (const book of expiredBooks) {
      book.isReserved = false;
      book.reservedUntil = null;
      await this.bookRepository.save(book);
      this.logger.log(`Reservation expired for Book ID: ${book.id}`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleExpiredRentals() {
    const now = new Date();
    const expiredBooks = await this.bookRepository.find({
      where: { isRented: true, rentedUntil: LessThan(now) },
    });
    for (const book of expiredBooks) {
      book.isRented = false;
      book.rentedBy = null;
      book.rentedUntil = null;
      await this.bookRepository.save(book);
      this.logger.log(`Rental expired for Book ID: ${book.id}`);
    }
  }
}
