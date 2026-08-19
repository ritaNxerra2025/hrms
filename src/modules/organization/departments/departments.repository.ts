import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes } from 'sequelize';
import { Department } from '../../../database/models/department.model';

@Injectable()
export class DepartmentsRepository {
  constructor(
    @InjectModel(Department)
    private readonly departmentModel: typeof Department,
  ) {}

  findAllForTenant(tenantId: number): Promise<Department[]> {
    return this.departmentModel.findAll({
      where: { tenantId },
      order: [['id', 'ASC']],
    });
  }

  findByIdForTenant(tenantId: number, id: number): Promise<Department | null> {
    return this.departmentModel.findOne({ where: { id, tenantId } });
  }

  findByNameForTenant(
    tenantId: number,
    name: string,
  ): Promise<Department | null> {
    return this.departmentModel.findOne({ where: { tenantId, name } });
  }

  findByCodeForTenant(
    tenantId: number,
    code: string,
  ): Promise<Department | null> {
    return this.departmentModel.findOne({ where: { tenantId, code } });
  }

  create(data: CreationAttributes<Department>): Promise<Department> {
    return this.departmentModel.create(data);
  }

  update(
    id: number,
    data: Partial<Department>,
  ): Promise<[affectedCount: number]> {
    return this.departmentModel.update(data, { where: { id } });
  }

  remove(id: number): Promise<number> {
    return this.departmentModel.destroy({ where: { id } });
  }
}
