import { Department } from './department.model';
import { Permission } from './permission.model';
import { Role } from './role.model';
import { RolePermission } from './role-permission.model';
import { Tenant } from './tenant.model';
import { User } from './user.model';
import { UserRole } from './user-role.model';

export const allModels = [
  Tenant,
  Permission,
  Role,
  User,
  UserRole,
  RolePermission,
  Department,
];

export * from './tenant.model';
export * from './permission.model';
export * from './role.model';
export * from './user.model';
export * from './user-role.model';
export * from './role-permission.model';
export * from './department.model';
