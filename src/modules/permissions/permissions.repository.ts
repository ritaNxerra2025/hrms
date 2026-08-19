import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Permission } from '../../database/models/permission.model';

@Injectable()
export class PermissionsRepository {
  constructor(
    @InjectModel(Permission)
    private readonly permissionModel: typeof Permission,
  ) {}

  findAll(): Promise<Permission[]> {
    return this.permissionModel.findAll({
      order: [
        ['module', 'ASC'],
        ['action', 'ASC'],
      ],
    });
  }

  findById(id: number): Promise<Permission | null> {
    return this.permissionModel.findByPk(id);
  }

  findByIds(ids: number[]): Promise<Permission[]> {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }
    return this.permissionModel.findAll({ where: { id: { [Op.in]: ids } } });
  }
}
