import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Department } from '../../../database/models/department.model';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentsRepository } from './departments.repository';

@Injectable()
export class DepartmentsService {
  constructor(private readonly departmentsRepository: DepartmentsRepository) {}

  async create(
    tenantId: number,
    dto: CreateDepartmentDto,
  ): Promise<Department> {
    await this.assertUnique(tenantId, dto.name, dto.code);

    return this.departmentsRepository.create({
      tenantId,
      name: dto.name,
      code: dto.code,
      // description: dto.description ?? null,
      // status: dto.status ?? 'active',
    });
  }

  findAll(tenantId: number): Promise<Department[]> {
    return this.departmentsRepository.findAllForTenant(tenantId);
  }

  async findOne(tenantId: number, id: number): Promise<Department> {
    const department = await this.departmentsRepository.findByIdForTenant(
      tenantId,
      id,
    );
    if (!department) {
      throw new NotFoundException(`Department ${id} not found`);
    }
    return department;
  }

  async update(
    tenantId: number,
    id: number,
    dto: UpdateDepartmentDto,
  ): Promise<Department> {
    const department = await this.findOne(tenantId, id);

    if (dto.name && dto.name !== department.name) {
      const existing = await this.departmentsRepository.findByNameForTenant(
        tenantId,
        dto.name,
      );
      if (existing && existing.id !== department.id) {
        throw new BadRequestException(
          `Department name "${dto.name}" already exists`,
        );
      }
    }

    await this.departmentsRepository.update(id, {
      name: dto.name,
      // description: dto.description,
      // status: dto.status,
    });

    return this.findOne(tenantId, id);
  }

  async remove(tenantId: number, id: number): Promise<void> {
    const department = await this.findOne(tenantId, id);
    await this.departmentsRepository.remove(department.id);
  }

  private async assertUnique(
    tenantId: number,
    name: string,
    code: string,
  ): Promise<void> {
    const [byName, byCode] = await Promise.all([
      this.departmentsRepository.findByNameForTenant(tenantId, name),
      this.departmentsRepository.findByCodeForTenant(tenantId, code),
    ]);

    if (byName) {
      throw new BadRequestException(
        `Department name "${name}" already exists in this tenant`,
      );
    }
    if (byCode) {
      throw new BadRequestException(
        `Department code "${code}" already exists in this tenant`,
      );
    }
  }
}
