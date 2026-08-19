import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { Permission } from '../../database/models/permission.model';
import { PermissionsService } from './permissions.service';

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @RequirePermission('permission:view')
  @ApiOperation({
    summary: 'List all system-defined permissions (module:action)',
  })
  findAll(): Promise<Permission[]> {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @RequirePermission('permission:view')
  @ApiOperation({ summary: 'Get a single system-defined permission' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Permission> {
    return this.permissionsService.findOne(id);
  }
}
