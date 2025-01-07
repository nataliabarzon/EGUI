import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // User entity for authentication
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Ensure this is in your .env file
        signOptions: { expiresIn: '1h' },
      }),
    }),
    ConfigModule, // Global configuration
    forwardRef(() => UserModule), // ForwardRef to avoid circular dependency
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD, // Make RolesGuard a global guard
      useClass: RolesGuard,
    },
  ],
  controllers: [AuthController],
  exports: [
    AuthService,
    JwtModule, // Export JwtModule to make JwtService available in other modules
  ],
})
export class AuthModule {}
