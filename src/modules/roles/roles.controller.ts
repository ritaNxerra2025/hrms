import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';
import { RequirePermission } from '../../common/decorators/require-permission.decorator';
import { Tenant } from '../../database/models/tenant.model';
import { Role } from '../../database/models/role.model';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@ApiTags('Roles as dropdown')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequirePermission('role:create')
  @ApiOperation({ summary: 'Create a tenant-scoped role' })
  create(
    @CurrentTenant() tenant: Tenant,
    @Body() dto: CreateRoleDto,
  ): Promise<Role> {
    return this.rolesService.create(tenant.id, dto);
  }

  @Get()
  @RequirePermission('role:view')
  @ApiOperation({
    summary: 'List roles of the current tenant (frontend role dropdown source)',
  })
  findAll(@CurrentTenant() tenant: Tenant): Promise<Role[]> {
    return this.rolesService.findAll(tenant.id);
  }

  @Get(':id')
  @RequirePermission('role:view')
  @ApiOperation({ summary: 'Get a single role with its permissions' })
  @ApiParam({ name: 'id', type: Number })
  findOne(
    @CurrentTenant() tenant: Tenant,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Role> {
    return this.rolesService.findOne(tenant.id, id);
  }

  @Patch(':id')
  @RequirePermission('role:update')
  @ApiOperation({ summary: 'Update a role (name)' })
  @ApiParam({ name: 'id', type: Number })
  update(
    @CurrentTenant() tenant: Tenant,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ): Promise<Role> {
    return this.rolesService.update(tenant.id, id, dto);
  }

  @Delete(':id')
  @RequirePermission('role:delete')
  @ApiOperation({ summary: 'Soft-delete a role (system roles are protected)' })
  @ApiParam({ name: 'id', type: Number })
  remove(
    @CurrentTenant() tenant: Tenant,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.rolesService.remove(tenant.id, id);
  }

  @Put(':id/permissions')
  @RequirePermission('role:update')
  @ApiOperation({ summary: 'Replace the permissions attached to a role' })
  @ApiParam({ name: 'id', type: Number })
  assignPermissions(
    @CurrentTenant() tenant: Tenant,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignPermissionsDto,
  ): Promise<Role> {
    return this.rolesService.assignPermissions(tenant.id, id, dto);
  }
}
