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

    return this.tenantsRepository.create({
      name: dto.name,
      code: dto.code,
      description: dto.description ?? null,
      status: dto.status ?? 'active',
    });
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

    await this.tenantsRepository.update(id, {
      name: dto.name,
      description: dto.description,
      status: dto.status,
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const tenant = await this.findOne(id);
    await this.tenantsRepository.remove(tenant.id);
  }
}
