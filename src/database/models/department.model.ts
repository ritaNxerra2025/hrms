import {
  BelongsTo,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Tenant } from './tenant.model';
import { User } from './user.model';

@Table({
  tableName: 'departments',
  underscored: true,
  timestamps: true,
  paranoid: true,
  comment: 'Tenant-scoped organizational departments',
})
export class Department extends Model<
  Department,
  {
    id?: number;
    tenantId: number;
    name: string;
    code: string;
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

  @Column({ type: DataType.STRING(30), allowNull: false })
  declare code: string;

  @BelongsTo(() => Tenant, { foreignKey: 'tenantId' })
  declare tenant: Tenant;

  @HasMany(() => User, { foreignKey: 'departmentId' })
  declare users: User[];
}
