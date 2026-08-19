import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsInt } from 'class-validator';

export class AssignRolesDto {
  @ApiProperty({
    type: [Number],
    description: 'Tenant role ids (empty array removes all roles)',
    example: [1, 2],
  })
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  roleIds: number[];
}
