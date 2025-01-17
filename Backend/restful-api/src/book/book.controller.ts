import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { Roles } from '../decorators/role.decorator';
import { Role } from 'src/constants/roles.enum';

@ApiTags('books')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('books')
export class BookController {
  constructor(
    private readonly bookService: BookService
  ) {}

  @Post()
  @ApiBody({
    description: 'Request body to create a new book',
    type: CreateBookDto,
    examples: {
      example1: {
        summary: 'Create a New Book',
        description: 'An example request body for adding a new book.',
        value: {
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          publisher: 'J.B. Lippincott & Co.',
          dateOfPublication: '1960-07-11',
          price: 9.99
        },
      },
    },
  })
  createBook(@Body() createBookDto: CreateBookDto) {
    return this.bookService.createBook(createBookDto);
  }

  @Get()
  findAllBooks() {
    return this.bookService.findAllBooks();
  }

  @Get(':id')
  findBookById(@Param('id') id: string) {
    return this.bookService.findBookById(id);
  }

  @Patch(':id')
  @ApiBody({
    description: 'Request body to update an existing book',
    type: UpdateBookDto,
    examples: {
      example1: {
        summary: 'Update Book Details',
        description: 'An example request body for updating an existing book.',
        value: {
          title: 'Updated Title',
          author: 'Updated Author',
          publisher: 'Updated Publisher',
          dateOfPublication: '2024-01-01',
          price: 15.99,
          isReserved: false,
          isRented: true,
          reservedUntil: null,
          rentedUntil: '2024-12-31T23:59:59.999Z',
        },
      },
    },
  })
  updateBook(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.bookService.updateBook(id, updateBookDto);
  }

  @Delete(':id')
  deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(id);
  }

  @Post(':id/reserve')
  reserveBook(@Param('id') id: string) {
    return this.bookService.reserveBook(id);
  }

  @Post(':id/rent')
  @ApiBody({
    description: 'Request body for renting a book',
    examples: {
      example1: {
        summary: 'Rent a Book',
        description: 'Provide the name of the person renting the book.',
        value: {
          rentedBy: 'John Doe'
        },
      },
    },
  })
  rentBook(@Param('id') id: string, @Body('rentedBy') rentedBy: string) {
    return this.bookService.rentBook(id, rentedBy);
  }

  @Patch(':id/cancel-reservation')
  cancelReservation(@Param('id') id: string) {
    return this.bookService.cancelReservation(id);
  }

  @Patch(':id/return')
  returnBook(@Param('id') id: string) {
    return this.bookService.returnBook(id);
  }
}
