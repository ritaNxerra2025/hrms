import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { STATUS } from '../../../common/constants/system.constants';

export class CreateUserDto {
  @ApiProperty({ example: 'Rahul' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(220)
  fullName: string;

  @ApiProperty({ example: 'rahul.verma@nxerra.com' })
  @IsEmail()
  @MaxLength(190)
  email: string;

  @ApiProperty({ example: 'Password@123', minLength: 8 })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  @ApiPropertyOptional({ example: '+91 9876501234' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive'], default: 'active' })
  @IsOptional()
  @IsEnum(STATUS)
  status?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Department ID selected from GET /api/v1/departments dropdown',
  })
  @IsOptional()
  @IsInt()
  departmentId?: number;

  @ApiPropertyOptional({
    type: [Number],
    example: [2],
    description: 'Array of Role IDs selected from GET /api/v1/roles dropdown',
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  roleIds?: number[];
}
