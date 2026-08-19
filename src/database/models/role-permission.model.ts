import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Permission } from './permission.model';
import { Role } from './role.model';

@Table({
  tableName: 'role_permissions',
  underscored: true,
  timestamps: true,
  comment: 'Many-to-many: role to permission',
})
export class RolePermission extends Model<
  RolePermission,
  { id?: number; roleId: number; permissionId: number }
> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare roleId: number;

  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare permissionId: number;

  @BelongsTo(() => Role, { foreignKey: 'roleId' })
  declare role: Role;

  @BelongsTo(() => Permission, { foreignKey: 'permissionId' })
  declare permission: Permission;
}
