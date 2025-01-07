import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'natatia' })
  email: string;

  @ApiProperty({ example: 'natalia' })
  password: string;
}
