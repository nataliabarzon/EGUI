import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../constants/roles.enum';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  surname?: string;

  @ApiProperty({ required: false })
  password?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ enum: Role, required: false })
  role?: Role;

}
