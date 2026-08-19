import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'NxErra Solutions', description: 'Company / Organization name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  companyName: string;

  @ApiProperty({ example: 'NXERRA', description: 'Unique company tenant code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  companyCode: string;

  @ApiPropertyOptional({
    example: 'Primary company tenant for NxErra HRMS',
    description: 'Brief description of the company',
  })
  @IsOptional()
  @IsString()
  companyDescription?: string;

  @ApiProperty({ example: 'Super', description: 'Admin user first name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  adminFullName: string;

  // @ApiProperty({ example: 'Admin', description: 'Admin user last name' })
  // @IsString()
  // @IsNotEmpty()
  // @MaxLength(120)
  // adminLastName: string;

  @ApiProperty({ example: 'admin@nxerra.com', description: 'Admin user email for login' })
  @IsEmail()
  @MaxLength(190)
  adminEmail: string;

  @ApiProperty({ example: 'Nxerra@2026', minLength: 8, description: 'Admin user login password' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  adminPassword: string;

  @ApiPropertyOptional({ example: '+91 9876543210', description: 'Admin user phone number' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  adminPhone?: string;
}
