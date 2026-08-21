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
import { User } from '../../database/models/user.model';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermission('user:create')
  @ApiOperation({ summary: 'Create a user in the current tenant' })
  create(
    @CurrentTenant() tenant: Tenant,
    @Body() dto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.create(tenant.id, dto);
  }

  @Get()
  @RequirePermission('user:view')
  @ApiOperation({ summary: 'List users of the current tenant' })
  findAll(@CurrentTenant() tenant: Tenant): Promise<User[]> {
    return this.usersService.findAll(tenant.id);
  }

  @Get(':id')
  @RequirePermission('user:view')
  @ApiOperation({ summary: 'Get a single user with roles' })
  @ApiParam({ name: 'id', type: Number })
  findOne(
    @CurrentTenant() tenant: Tenant,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<User> {
    return this.usersService.findOne(tenant.id, id);
  }

  @Put(':id')
  @RequirePermission('user:update')
  @ApiOperation({ summary: 'Update a user (profile, status, password)' })
  @ApiParam({ name: 'id', type: Number })
  update(
    @CurrentTenant() tenant: Tenant,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(tenant.id, id, dto);
  }

  @Delete(':id')
  @RequirePermission('user:delete')
  @ApiOperation({ summary: 'Soft-delete a user' })
  @ApiParam({ name: 'id', type: Number })
  remove(
    @CurrentTenant() tenant: Tenant,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.usersService.remove(tenant.id, id);
  }

  @Patch(':id/roles')
  @RequirePermission('user:update')
  @ApiOperation({ summary: 'Replace the roles assigned to a user' })
  @ApiParam({ name: 'id', type: Number })
  assignRoles(
    @CurrentTenant() tenant: Tenant,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignRolesDto,
  ): Promise<User> {
    return this.usersService.assignRoles(tenant.id, id, dto);
  }
}
