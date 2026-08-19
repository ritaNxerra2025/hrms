import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { STATUS } from '../../../common/constants/system.constants';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Rahul' })
  @IsOptional()
  @IsString()
  @MaxLength(220)
  fullName?: string;

  // @ApiPropertyOptional({ example: 'Verma' })
  // @IsOptional()
  // @IsString()
  // @MaxLength(120)
  // lastName?: string;

  @ApiPropertyOptional({ example: 'rahul.verma@nxerra.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(190)
  email?: string;

  @ApiPropertyOptional({ example: '+91 9876501234' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive'] })
  @IsOptional()
  @IsEnum(STATUS)
  status?: string;

  @ApiPropertyOptional({
    example: 2,
    description: 'Department ID selected from GET /api/v1/departments dropdown',
  })
  @IsOptional()
  @IsInt()
  departmentId?: number;

  @ApiPropertyOptional({
    type: [Number],
    example: [2, 3],
    description: 'Array of Role IDs selected from GET /api/v1/roles dropdown',
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  roleIds?: number[];

  @ApiPropertyOptional({ description: 'Reset the user password', minLength: 8 })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password?: string;
}
