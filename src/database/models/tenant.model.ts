import { Column, DataType, HasMany, HasOne, Model, Table } from 'sequelize-typescript';
import { Department } from './department.model';
import { Role } from './role.model';
import { User } from './user.model';
import { TenantSettings } from './tenant-setting.model';
@Table({
  tableName: 'tenants',
  underscored: true,
  timestamps: true,
  paranoid: true,
  comment: 'Tenants sharing the same database and tables',
})
export class Tenant extends Model<
  Tenant,
  {
    id?: number;
    name: string;
    code: string;
    description?: string | null;
    status: string;
  }
> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({ type: DataType.STRING(100), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(20), allowNull: false, unique: true })
  declare code: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    defaultValue: 'active',
  })
  declare status: string;

  @HasOne(() => TenantSettings, { foreignKey: 'tenantId' })
  declare settings: TenantSettings;

  @HasMany(() => User, { foreignKey: 'tenantId' })
  declare users: User[];

  @HasMany(() => Role, { foreignKey: 'tenantId' })
  declare roles: Role[];

  @HasMany(() => Department, { foreignKey: 'tenantId' })
  declare departments: Department[];
}
