import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { CreationAttributes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Department } from '../../database/models/department.model';
import { Permission } from '../../database/models/permission.model';
import { Role } from '../../database/models/role.model';
import { User } from '../../database/models/user.model';
import { UserRole } from '../../database/models/user-role.model';

const PUBLIC_ATTRIBUTES = { exclude: ['passwordHash'] };

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(UserRole) private readonly userRoleModel: typeof UserRole,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {}

  findAllForTenant(tenantId: number): Promise<User[]> {
    return this.userModel.findAll({
      where: { tenantId },
      attributes: PUBLIC_ATTRIBUTES,
      include: [
        { model: Department, attributes: ['id', 'name', 'code'] },
        { model: Role, through: { attributes: [] } },
      ],
      order: [['id', 'ASC']],
    });
  }

  findByIdForTenant(tenantId: number, id: number): Promise<User | null> {
    return this.userModel.findOne({
      where: { id, tenantId },
      attributes: PUBLIC_ATTRIBUTES,
      include: [
        { model: Department, attributes: ['id', 'name', 'code'] },
        { model: Role, through: { attributes: [] } },
      ],
    });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ where: { email } });
  }

  findById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id, {
      attributes: PUBLIC_ATTRIBUTES,
      include: [
        { model: Department, attributes: ['id', 'name', 'code'] },
        { model: Role, through: { attributes: [] } },
      ],
    });
  }

  findWithRolesAndPermissions(userId: number): Promise<User | null> {
    return this.userModel.findOne({
      where: { id: userId },
      attributes: PUBLIC_ATTRIBUTES,
      include: [
        { model: Department, attributes: ['id', 'name', 'code'] },
        {
          model: Role,
          through: { attributes: [] },
          include: [{ model: Permission, through: { attributes: [] } }],
        },
      ],
    });
  }

  create(data: CreationAttributes<User>): Promise<User> {
    return this.userModel.create(data);
  }

  update(id: number, data: Partial<User>): Promise<[affectedCount: number]> {
    return this.userModel.update(data, { where: { id } });
  }

  remove(id: number): Promise<number> {
    return this.userModel.destroy({ where: { id } });
  }

  async replaceRoles(userId: number, roleIds: number[]): Promise<void> {
    await this.sequelize.transaction(async (transaction) => {
      await this.userRoleModel.destroy({ where: { userId }, transaction });
      if (roleIds.length > 0) {
        await this.userRoleModel.bulkCreate(
          roleIds.map((roleId) => ({ userId, roleId })),
          { transaction },
        );
      }
    });
  }
}
