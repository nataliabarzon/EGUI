import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as cookieParser from 'cookie-parser';
import JwtCookieMiddleware from './auth/jwt-cookie.middleware';
import { User } from './user/user.entity';
import { BookController } from './book/book.controller';
import { BookService } from './book/book.service';
import { BookModule } from './book/book.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Book } from './book/book.entity';


@Module({
  imports: [
    
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: process.env.DATABASE_URL, 
        entities: [Book, User], 
        migrations: [__dirname + '/migrations/**/*.ts'], 
        synchronize: true, 
        ssl: {
          rejectUnauthorized: false,
        }, 
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forFeature([Book]), AuthModule, UserModule, BookModule, ScheduleModule.forRoot(),

  ],
  controllers: [AppController, BookController],
  providers: [AppService, BookService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser(), JwtCookieMiddleware)
      .forRoutes('*');
  }
}
