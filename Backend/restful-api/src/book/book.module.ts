import { Module, forwardRef } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Book } from './book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    forwardRef(() => AuthModule),
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
