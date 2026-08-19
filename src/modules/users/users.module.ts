import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Department } from '../../database/models/department.model';
import { Permission } from '../../database/models/permission.model';
import { Role } from '../../database/models/role.model';
import { User } from '../../database/models/user.model';
import { UserRole } from '../../database/models/user-role.model';
import { DepartmentsModule } from '../organization/departments/departments.module';
import { RolesModule } from '../roles/roles.module';
import { UserPermissionsService } from './user-permissions.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User, UserRole, Role, Permission, Department]),
    RolesModule,
    DepartmentsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserPermissionsService],
  exports: [UsersService, UsersRepository, UserPermissionsService],
})
export class UsersModule {}
