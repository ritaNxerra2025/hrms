import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsInt } from 'class-validator';

export class AssignPermissionsDto {
  @ApiProperty({
    type: [Number],
    description: 'System-defined permission ids (empty array clears all)',
    example: [1, 2, 3],
  })
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  permissionIds: number[];
}
