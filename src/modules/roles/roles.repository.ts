import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { CreationAttributes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Permission } from '../../database/models/permission.model';
import { Role } from '../../database/models/role.model';
import { RolePermission } from '../../database/models/role-permission.model';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectModel(Role) private readonly roleModel: typeof Role,
    @InjectModel(RolePermission)
    private readonly rolePermissionModel: typeof RolePermission,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {}

  findAllForTenant(tenantId: number): Promise<Role[]> {
    return this.roleModel.findAll({
      where: { tenantId },
      include: [{ model: Permission, through: { attributes: [] } }],
      order: [['id', 'ASC']],
    });
  }

  findByIdForTenant(tenantId: number, id: number): Promise<Role | null> {
    return this.roleModel.findOne({
      where: { id, tenantId },
      include: [{ model: Permission, through: { attributes: [] } }],
    });
  }

  findByNameForTenant(tenantId: number, name: string): Promise<Role | null> {
    return this.roleModel.findOne({ where: { tenantId, name } });
  }

  findByCodeForTenant(tenantId: number, code: string): Promise<Role | null> {
    return this.roleModel.findOne({ where: { tenantId, code } });
  }

  create(data: CreationAttributes<Role>): Promise<Role> {
    return this.roleModel.create(data);
  }

  update(id: number, data: Partial<Role>): Promise<[affectedCount: number]> {
    return this.roleModel.update(data, { where: { id } });
  }

  remove(id: number): Promise<number> {
    return this.roleModel.destroy({ where: { id } });
  }

  async replacePermissions(
    roleId: number,
    permissionIds: number[],
  ): Promise<void> {
    await this.sequelize.transaction(async (transaction) => {
      await this.rolePermissionModel.destroy({
        where: { roleId },
        transaction,
      });
      if (permissionIds.length > 0) {
        await this.rolePermissionModel.bulkCreate(
          permissionIds.map((permissionId) => ({ roleId, permissionId })),
          { transaction },
        );
      }
    });
  }
}
