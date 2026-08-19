import {
  BelongsTo,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Role } from './role.model';
import { User } from './user.model';

@Table({
  tableName: 'user_roles',
  underscored: true,
  timestamps: true,
  comment: 'Many-to-many: user to role',
})
export class UserRole extends Model<
  UserRole,
  { id?: number; userId: number; roleId: number }
> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare userId: number;

  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare roleId: number;

  @BelongsTo(() => User, { foreignKey: 'userId' })
  declare user: User;

  @BelongsTo(() => Role, { foreignKey: 'roleId' })
  declare role: Role;
}
