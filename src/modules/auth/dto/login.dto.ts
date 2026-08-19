import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'superadmin@nxerra.com' })
  @IsEmail()
  @MaxLength(190)
  email: string;

  @ApiProperty({ example: 'Nxerra@2026' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(72)
  password: string;
}
