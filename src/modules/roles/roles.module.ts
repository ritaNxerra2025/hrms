import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '../../database/models/permission.model';
import { Role } from '../../database/models/role.model';
import { RolePermission } from '../../database/models/role-permission.model';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolesController } from './roles.controller';
import { RolesRepository } from './roles.repository';
import { RolesService } from './roles.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Role, RolePermission, Permission]),
    PermissionsModule,
  ],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository],
  exports: [RolesService, RolesRepository],
})
export class RolesModule {}
