import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Tenant } from '../../database/models/tenant.model';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantsRepository } from './tenants.repository';

@Injectable()
export class TenantsService {
  constructor(private readonly tenantsRepository: TenantsRepository) {}

  async create(dto: CreateTenantDto): Promise<Tenant> {
    const existing = await this.tenantsRepository.findByCode(dto.code);
    if (existing) {
      throw new BadRequestException(`Tenant code "${dto.code}" already exists`);
    }

    const { settings, ...tenantData } = dto;

    await this.tenantsRepository.createWithSettings(
      {
        name: tenantData.name,
        code: tenantData.code,
        description: tenantData.description ?? null,
        status: tenantData.status ?? 'active',
      },
      settings,
    );

    const created = await this.tenantsRepository.findByCode(dto.code);
    if (!created) {
      throw new NotFoundException('Tenant could not be loaded after creation');
    }
    return created;
  }

  findAll(): Promise<Tenant[]> {
    return this.tenantsRepository.findAll();
  }

  async findOne(id: number): Promise<Tenant> {
    const tenant = await this.tenantsRepository.findById(id);
    if (!tenant) {
      throw new NotFoundException(`Tenant ${id} not found`);
    }
    return tenant;
  }

  async update(id: number, dto: UpdateTenantDto): Promise<Tenant> {
    await this.findOne(id);

    const { settings, ...tenantData } = dto;

    if (Object.keys(tenantData).length > 0) {
      await this.tenantsRepository.update(id, tenantData);
    }

    if (settings && Object.keys(settings).length > 0) {
      await this.tenantsRepository.upsertSettings(id, settings);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const tenant = await this.findOne(id);
    await this.tenantsRepository.remove(tenant.id);
  }
}
