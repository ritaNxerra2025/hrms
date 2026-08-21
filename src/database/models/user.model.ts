import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Department } from './department.model';
import { Role } from './role.model';
import { Tenant } from './tenant.model';
import { UserRole } from './user-role.model';

@Table({
  tableName: 'users',
  underscored: true,
  timestamps: true,
  paranoid: true,
  comment: 'Tenant-scoped user accounts',
})
export class User extends Model<
  User,
  {
    id?: number;
    tenantId: number;
    departmentId?: number | null;
    fullName: string; 
    email: string;
    passwordHash: string;
    phone?: string | null;
    status: string;
    lastLoginAt?: Date | null;
    moduleAccess?: string | null
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

  @ForeignKey(() => Department)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: true })
  declare departmentId: number | null;

  @Column({ type: DataType.STRING(120), allowNull: false })
  declare fullName: string;

  @Column({ type: DataType.STRING(190), allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare passwordHash: string;

  @Column({ type: DataType.STRING(30), allowNull: true })
  declare phone: string | null;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: 'active',
  })
  declare status: string;

  @Column({ type: DataType.DATE, allowNull: true })
  declare lastLoginAt: Date | null;
 
  @Column({type:DataType.STRING(80),allowNull:true,defaultValue:'readOnly'})
  declare moduleAccess: string | null;

  @BelongsTo(() => Tenant, { foreignKey: 'tenantId' })
  declare tenant: Tenant;

  @BelongsTo(() => Department, { foreignKey: 'departmentId' })
  declare department: Department | null;

  @BelongsToMany(() => Role, {
    through: () => UserRole,
    foreignKey: 'userId',
    otherKey: 'roleId',
  })
  declare roles: Role[];

  @HasMany(() => UserRole, { foreignKey: 'userId' })
  declare userRoles: UserRole[];

}
