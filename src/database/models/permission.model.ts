import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Role } from './role.model';
import { RolePermission } from './role-permission.model';

/**
 * System-defined permission. Global (not tenant-scoped) and read-only
 * at runtime; the only source of permissions is the seed data.
 */
@Table({
  tableName: 'permissions',
  underscored: true,
  timestamps: true,
  comment: 'System-defined permissions (module:action)',
})

export class Permission extends Model<
  Permission,
  {
    id?: number;
    name: string;
    module: string;
    action: string;
    description?: string | null;
  }
> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({ type: DataType.STRING(100), allowNull: false, unique: true })
  declare name: string;

  @Column({ type: DataType.STRING(60), allowNull: false })
  declare module: string;

  @Column({ type: DataType.STRING(60), allowNull: false })
  declare action: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description: string | null;

  @BelongsToMany(() => Role, {
    through: () => RolePermission,
    foreignKey: 'permissionId',
    otherKey: 'roleId',
  })
  declare roles: Role[];

  @HasMany(() => RolePermission, { foreignKey: 'permissionId' })
  declare rolePermissions: RolePermission[];
}
