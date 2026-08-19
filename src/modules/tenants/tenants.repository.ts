import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes } from 'sequelize';
import { Tenant } from '../../database/models/tenant.model';

@Injectable()
export class TenantsRepository {
  constructor(
    @InjectModel(Tenant)
    private readonly tenantModel: typeof Tenant,
  ) {}

  findAll(): Promise<Tenant[]> {
    return this.tenantModel.findAll({ order: [['id', 'ASC']] });
  }

  findById(id: number): Promise<Tenant | null> {
    return this.tenantModel.findByPk(id);
  }

  findByCode(code: string): Promise<Tenant | null> {
    return this.tenantModel.findOne({ where: { code } });
  }

  create(data: CreationAttributes<Tenant>): Promise<Tenant> {
    return this.tenantModel.create(data);
  }

  update(id: number, data: Partial<Tenant>): Promise<[affectedCount: number]> {
    return this.tenantModel.update(data, { where: { id } });
  }

  remove(id: number): Promise<number> {
    return this.tenantModel.destroy({ where: { id } });
  }
}
