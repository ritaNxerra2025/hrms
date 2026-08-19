import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentTenant } from '../../../common/decorators/current-tenant.decorator';
import { RequirePermission } from '../../../common/decorators/require-permission.decorator';
import { Department } from '../../../database/models/department.model';
import { Tenant } from '../../../database/models/tenant.model';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@ApiTags('Departments')
@ApiBearerAuth()
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @RequirePermission('organization:department:create')
  @ApiOperation({ summary: 'Create a department in the current tenant' })
  create(
    @CurrentTenant() tenant: Tenant,
    @Body() dto: CreateDepartmentDto,
  ): Promise<Department> {
    return this.departmentsService.create(tenant.id, dto);
  }

  @Get()
  @RequirePermission('organization:department:read')
  @ApiOperation({ summary: 'List departments of the current tenant' })
  findAll(@CurrentTenant() tenant: Tenant): Promise<Department[]> {
    return this.departmentsService.findAll(tenant.id);
  }

  @Get(':id')
  @RequirePermission('organization:department:read')
  @ApiOperation({ summary: 'Get a single department' })
  @ApiParam({ name: 'id', type: Number })
  findOne(
    @CurrentTenant() tenant: Tenant,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Department> {
    return this.departmentsService.findOne(tenant.id, id);
  }

  @Patch(':id')
  @RequirePermission('organization:department:update')
  @ApiOperation({ summary: 'Update a department' })
  @ApiParam({ name: 'id', type: Number })
  update(
    @CurrentTenant() tenant: Tenant,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDepartmentDto,
  ): Promise<Department> {
    return this.departmentsService.update(tenant.id, id, dto);
  }

  @Delete(':id')
  @RequirePermission('organization:department:delete')
  @ApiOperation({ summary: 'Soft-delete a department' })
  @ApiParam({ name: 'id', type: Number })
  remove(
    @CurrentTenant() tenant: Tenant,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.departmentsService.remove(tenant.id, id);
  }
}
