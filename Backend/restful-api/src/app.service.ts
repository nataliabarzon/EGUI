import { Injectable, OnModuleInit } from '@nestjs/common';
import { User } from './user/user.entity';
import { UserService } from './user/user.service';


import { Role } from './constants/roles.enum';
@Injectable()
export class AppService  {
  // constructor(

  //   private readonly userService: UserService,
  // ) {} 
  //  async onModuleInit() {
  //   const user = new User();
  //   user.surname = 'user';
  //   user.email = "user100";
  //   user.name = 'user';
  //   user.password = 'user'; 
  //   user.age = '10';
   
  //   const createdUser = await this.userService.create(user);

  // }
  getHello(): string {
    return 'Hello World!';
  }
}
