import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'HR Admin' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  // @ApiPropertyOptional({
  //   type: [Number],
  //   description: 'System-defined permission ids to attach to the role',
  // })
  // @IsOptional()
  // @IsArray()
  // @IsInt({ each: true })

  // permissionIds?: number[];
}
