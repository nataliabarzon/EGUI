import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../constants/roles.enum';

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ enum: Role })
  role: Role;

  
}
