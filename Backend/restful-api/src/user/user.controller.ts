import {Controller,Get,Post,Body,Param,Delete,Put,UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserEntity } from './user.entity';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth} from '@nestjs/swagger';
import { Roles } from '../decorators/role.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserNotFoundException } from '../exceptions/custom-exceptions';
import { Role } from 'src/constants/roles.enum';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll(): Promise<UserEntity[]> {
    return await this.userService.findAll();
  }

  @Get(':id')

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  async findOne(@Param('id') id: number): Promise<UserEntity> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return user;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    
    const newUser = new UserEntity();
    newUser.name = createUserDto.name;
    newUser.surname = createUserDto.surname;
    newUser.email = createUserDto.email;
    newUser.password = createUserDto.password;
    newUser.role = createUserDto.role;
    
   
    return await this.userService.create(newUser);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const existingUser = await this.userService.findOne(id);
    if (!existingUser) {
      throw new UserNotFoundException(id);
    }
    
    if (updateUserDto.name) existingUser.name = updateUserDto.name;
    if (updateUserDto.surname) existingUser.surname = updateUserDto.surname;
    if (updateUserDto.password) existingUser.password = updateUserDto.password;
    if (updateUserDto.role) existingUser.role = updateUserDto.role;
    if (updateUserDto.email ) existingUser.email = updateUserDto.email;

    return await this.userService.update(id, existingUser);
  }

  @Delete(':id')
  @Roles(Role.Librarian)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', type: 'number' })
  async delete(@Param('id') id: number): Promise<void> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new UserNotFoundException(id);
    }
    return this.userService.delete(id);
  }
}
