import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../../database/models/user.model';
import { hashPassword } from '../../common/utils/password.util';
import { DepartmentsService } from '../organization/departments/departments.service';
import { RolesService } from '../roles/roles.service';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesService: RolesService,
    private readonly departmentsService: DepartmentsService,
  ) {}

  async create(tenantId: number, dto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException(`Email "${dto.email}" is already registered`);
    }

    if (dto.departmentId) {
      await this.assertDepartmentBelongsToTenant(tenantId, dto.departmentId);
    }

    const roleIds = dto.roleIds ?? [];
    await this.assertRolesBelongToTenant(tenantId, roleIds);

    const passwordHash = await hashPassword(dto.password);

    const user = await this.usersRepository.create({
      tenantId,
      departmentId: dto.departmentId ?? null,
      fullName: dto.fullName,
      email: dto.email.trim().toLowerCase(),
      passwordHash,
      phone: dto.phone ?? null,
      status: dto.status ?? 'active',
      moduleAccess: dto.moduleAccess ?? 'readOnly',
    });

    if (roleIds.length > 0) {
      await this.usersRepository.replaceRoles(user.id, roleIds);
    }

    return this.findOne(tenantId, user.id);
  }

  findAll(tenantId: number): Promise<User[]> {
   
    return this.usersRepository.findAllForTenant(tenantId);
  }

  async findOne(tenantId: number, id: number): Promise<User> {
  
    const user = await this.usersRepository.findByIdForTenant(tenantId, id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async update(
    tenantId: number,
    id: number,
    dto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.findOne(tenantId, id);

    if (dto.email && dto.email.trim().toLowerCase() !== user.email) {
      const existing = await this.usersRepository.findByEmail(dto.email);
      if (existing && existing.id !== user.id) {
        throw new BadRequestException(
          `Email "${dto.email}" is already registered`,
        );
      }
    }

    if (dto.departmentId !== undefined && dto.departmentId !== null) {
      await this.assertDepartmentBelongsToTenant(tenantId, dto.departmentId);
    }

    if (dto.roleIds !== undefined) {
      await this.assertRolesBelongToTenant(tenantId, dto.roleIds);
      await this.usersRepository.replaceRoles(user.id, dto.roleIds);
    }

    const patch: Partial<User> = {
      fullName: dto.fullName,
      email: dto.email?.trim().toLowerCase(),
      phone: dto.phone,
      status: dto.status,
    };

    if (dto.departmentId !== undefined) {
      patch.departmentId = dto.departmentId;
    }

    if (dto.moduleAccess !== undefined) {
      patch.moduleAccess = dto.moduleAccess;
    }

    if (dto.password) {
      patch.passwordHash = await hashPassword(dto.password);
    }

    await this.usersRepository.update(id, patch);

    return this.findOne(tenantId, id);
  }

  async remove(tenantId: number, id: number): Promise<void> {
    const user = await this.findOne(tenantId, id);
    await this.usersRepository.remove(user.id);
  }

  async assignRoles(
    tenantId: number,
    id: number,
    dto: AssignRolesDto,
  ): Promise<User> {
    const user = await this.findOne(tenantId, id);
    await this.assertRolesBelongToTenant(tenantId, dto.roleIds);
    await this.usersRepository.replaceRoles(user.id, dto.roleIds);
    return this.findOne(tenantId, id);
  }

  private async assertDepartmentBelongsToTenant(
    tenantId: number,
    departmentId: number,
  ): Promise<void> {
    try {
      await this.departmentsService.findOne(tenantId, departmentId);
    } catch {
      throw new BadRequestException(
        `Department with ID ${departmentId} does not belong to this tenant`,
      );
    }
  }

  private async assertRolesBelongToTenant(
    tenantId: number,
    roleIds: number[],
  ): Promise<void> {
    if (roleIds.length === 0) {
      return;
    }
    const roles = await this.rolesService.findAll(tenantId);
    const roleIdSet = new Set(roles.map((role) => role.id));
    const missing = roleIds.filter((id) => !roleIdSet.has(id));
    if (missing.length > 0) {
      throw new BadRequestException(
        `Roles ${missing.join(', ')} do not exist in this tenant`,
      );
    }
  }
}
