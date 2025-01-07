import { Controller, Post, Body, UseGuards, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { InvalidCredentialsException, RegistrationFailedException, InternalServerErrorException } from '../exceptions/custom-exceptions';  
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Log in' })
  @ApiBody({ type: LoginDto })
  async login(@Request() req, @Response() res) {
    try {
      console.log("the user req in auth controler is",req.user)

      const { token, user } = await this.authService.login(req.user);
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
      });
      return res.send(user);
    } catch (error) {
      console.log('Sorry, invalid credentials');
      throw new InvalidCredentialsException();
    }
  }
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() registerDto: RegisterDto) {
    try {
      const newUser = await this.authService.register(registerDto);
      if (!newUser) {
        throw new RegistrationFailedException();
      }
      return newUser;
    } catch (error) {
      console.error('Error during registration:', error);
      throw new InternalServerErrorException('An error occurred during registration');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Log out' })
  async logout(@Request() req, @Response() res) {
    try {
      res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "None",
      });
      return res.send({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Error during logout:', error);
      throw new InternalServerErrorException('An unexpected error occurred during logout');
    }
  }
}
