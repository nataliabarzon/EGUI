import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/user.entity';
import { RegisterDto } from './dto/register.dto';
import { Role } from '../constants/roles.enum';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    console.log(user);
    if (!user) {
      console.log('User not found');
      return null;
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (isPasswordValid) {
      const { password, ...result } = user;
      return result;
    } else {
      console.log("Problem in validateUser");
      return null;
    }
  }

  async login(user: any) {
    const payload = { email: user.email, id: user.id, role: user.role };
    console.log("the payload in auth service is", payload);
  
    try {
      const token = this.jwtService.sign(payload);
      console.log("the token in auth service is", token);
  
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      console.error('Error generating JWT token:');
    }
  }
  
  async register(registerDto: RegisterDto): Promise<User> {
    console.log("I am in register service");
    const user = new User();
    user.name = registerDto.name;

    user.surname = registerDto.surname;
    user.email = registerDto.email;
                    
    user.password = registerDto.password;
    user.role = Role.User;  
 
    return await this.usersService.create(user); 
}

}
