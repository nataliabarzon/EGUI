import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService, private configService: ConfigService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.jwt;
    if (!token) {
      throw new UnauthorizedException('JWT token is missing from cookies');
    }

    const secret = this.configService.get<string>('JWT_SECRET');
    try {
      const payload = this.jwtService.verify(token, { secret });
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return super.canActivate(context);
  }
}
