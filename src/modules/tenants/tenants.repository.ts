import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { CreationAttributes, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Tenant } from '../../database/models/tenant.model';
import { TenantSettings } from '../../database/models/tenant-setting.model';

@Injectable()
export class TenantsRepository {
  constructor(
    @InjectModel(Tenant)
    private readonly tenantModel: typeof Tenant,
    @InjectModel(TenantSettings)
    private readonly tenantSettingsModel: typeof TenantSettings,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {}

  findAll(): Promise<Tenant[]> {
    return this.tenantModel.findAll({
      include: [{ model: TenantSettings, required: false }],
      order: [['id', 'ASC']],
    });
  }

  findById(id: number): Promise<Tenant | null> {
    return this.tenantModel.findByPk(id, {
      include: [{ model: TenantSettings, required: false }],
    });
  }

  findByCode(code: string): Promise<Tenant | null> {
    return this.tenantModel.findOne({ where: { code } });
  }

  async createWithSettings(
    tenantData: CreationAttributes<Tenant>,
    settingsData: Partial<CreationAttributes<TenantSettings>> | undefined,
  ): Promise<Tenant> {
    return this.sequelize.transaction(async (transaction) => {
      const tenant = await this.tenantModel.create(tenantData, { transaction });

      if (settingsData) {
        await this.tenantSettingsModel.create(
          { ...settingsData, tenantId: tenant.id } as CreationAttributes<TenantSettings>,
          { transaction },
        );
      }

      return tenant;
    });
  }

  update(id: number, data: Partial<Tenant>): Promise<[affectedCount: number]> {
    return this.tenantModel.update(data, { where: { id } });
  }

  async upsertSettings(
    tenantId: number,
    data: Partial<CreationAttributes<TenantSettings>>,
    transaction?: Transaction,
  ): Promise<TenantSettings> {
    const existing = await this.tenantSettingsModel.findOne({ where: { tenantId }, transaction });
    if (existing) {
      return existing.update(data, { transaction });
    }
    return this.tenantSettingsModel.create(
      { ...data, tenantId } as CreationAttributes<TenantSettings>,
      { transaction },
    );
  }

  remove(id: number): Promise<number> {
    return this.tenantModel.destroy({ where: { id } });
  }
}
