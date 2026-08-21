import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class TenantSettingsDto {
  @ApiProperty({ example: 'Acme Corp Private Limited' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  legalName: string;

  @ApiPropertyOptional({ example: 'Acme Corp' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  displayName?: string | null;

  @ApiPropertyOptional({ example: 'U72900MH2010PTC123456', description: '21-character CIN' })
  @IsOptional()
  @IsString()
  @MaxLength(21)
  cin?: string | null;

  @ApiPropertyOptional({ example: '27ABCDE1234F1Z5', description: '15-character GSTIN' })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  gstin?: string | null;

  @ApiPropertyOptional({ example: 'support@acme.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(190)
  supportEmail?: string | null;

  @ApiPropertyOptional({ example: 'https://www.acme.com' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  website?: string | null;

  @ApiPropertyOptional({ example: 'INR', default: 'INR' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  defaultCurrency?: string;

  @ApiPropertyOptional({ example: 'Asia/Kolkata', default: 'Asia/Kolkata' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  timezone?: string;

  @ApiPropertyOptional({
    example: 4,
    description: 'Financial year start month (1-12)',
    default: 4,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  financialYearStartMonth?: number;

  @ApiPropertyOptional({
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    default: 'monday',
  })
  @IsOptional()
  @IsIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
  weekStartsOn?: string;
}
