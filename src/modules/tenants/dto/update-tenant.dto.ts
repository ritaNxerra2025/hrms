import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { STATUS } from '../../../common/constants/system.constants';
import { TenantSettingsDto } from './tenant-settings.dto';

export class UpdateTenantDto {
  @ApiPropertyOptional({ example: 'Acme Corporation' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'Primary tenant for Acme Corp' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive'] })
  @IsOptional()
  @IsEnum(STATUS)
  status?: string;

  @ApiPropertyOptional({ type: TenantSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => TenantSettingsDto)
  settings?: Partial<TenantSettingsDto>;
}
