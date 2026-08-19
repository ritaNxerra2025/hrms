import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Engineering' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    example: 'ENG',
    description: 'Department code (A-Z, 0-9, _ or -)',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9_-]{2,30}$/, {
    message: 'code must be 2-30 characters using A-Z, 0-9, _ or -',
  })
  code!: string;
}
