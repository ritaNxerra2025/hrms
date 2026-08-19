import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Permission } from './permission.model';
import { RolePermission } from './role-permission.model';
import { Tenant } from './tenant.model';
import { UserRole } from './user-role.model';

@Table({
  tableName: 'roles',
  underscored: true,
  timestamps: true,
  paranoid: true,
  comment: 'Tenant-scoped roles',
})
export class Role extends Model<
  Role,
  {
    id?: number;
    tenantId: number;
    name: string;
    code: string;
    isSystem: boolean;
  }
> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare tenantId: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare code: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare isSystem: boolean;

  @BelongsTo(() => Tenant, { foreignKey: 'tenantId' })
  declare tenant: Tenant;

  @BelongsToMany(() => Permission, {
    through: () => RolePermission,
    foreignKey: 'roleId',
    otherKey: 'permissionId',
  })
  declare permissions: Permission[];

  @HasMany(() => UserRole, { foreignKey: 'roleId' })
  declare userRoles: UserRole[];

  @HasMany(() => RolePermission, { foreignKey: 'roleId' })
  declare rolePermissions: RolePermission[];
}
