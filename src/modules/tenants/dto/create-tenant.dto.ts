import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { STATUS } from '../../../common/constants/system.constants';

export class CreateTenantDto {
  @ApiProperty({ example: 'Acme Corp', description: 'Tenant display name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'ACME',
    description: 'Unique tenant code (A-Z, 0-9, _)',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9_]{2,20}$/, {
    message: 'code must be 2-20 characters using A-Z, 0-9 or _',
  })
  code: string;

  @ApiPropertyOptional({ example: 'Primary tenant for Acme Corp' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive'], default: 'active' })
  @IsOptional()
  @IsEnum(STATUS)
  status?: string;
}
