import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '../../database/models/role.model';
import { PermissionsService } from '../permissions/permissions.service';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { toRoleCode } from '../../common/utils/helper.util';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService {
  constructor(
    private readonly rolesRepository: RolesRepository,
    private readonly permissionsService: PermissionsService,
  ) {}

  async create(tenantId: number, dto: CreateRoleDto): Promise<Role> {
    const code = toRoleCode(dto.name);
    await this.assertUnique(tenantId, dto.name, code);

    // const permissionIds = dto.permissionIds ?? [];
    // await this.permissionsService.ensureExist(permissionIds);

    const role = await this.rolesRepository.create({
      tenantId,
      name: dto.name,
      code,
      isSystem: false,
    });

    // if (permissionIds.length > 0) {
    //   await this.rolesRepository.replacePermissions(role.id, permissionIds);
    // }

    return this.findOne(tenantId, role.id);
  }

  findAll(tenantId: number): Promise<Role[]> {
    return this.rolesRepository.findAllForTenant(tenantId);
  }

  async findOne(tenantId: number, id: number): Promise<Role> {
    const role = await this.rolesRepository.findByIdForTenant(tenantId, id);
    if (!role) {
      throw new NotFoundException(`Role ${id} not found`);
    }
    return role;
  }

  async update(
    tenantId: number,
    id: number,
    dto: UpdateRoleDto,
  ): Promise<Role> {
    const role = await this.findOne(tenantId, id);

    if (dto.name && dto.name !== role.name) {
      const existing = await this.rolesRepository.findByNameForTenant(
        tenantId,
        dto.name,
      );
      if (existing && existing.id !== role.id) {
        throw new BadRequestException(`Role name "${dto.name}" already exists`);
      }
      await this.rolesRepository.update(id, { name: dto.name, code: toRoleCode(dto.name) });
    } else {
      await this.rolesRepository.update(id, { name: dto.name });
    }

    return this.findOne(tenantId, id);
  }

  async remove(tenantId: number, id: number): Promise<void> {
    const role = await this.findOne(tenantId, id);

    if (role.isSystem) {
      throw new ForbiddenException('System roles cannot be deleted');
    }

    await this.rolesRepository.remove(id);
  }

  async assignPermissions(
    tenantId: number,
    id: number,
    dto: AssignPermissionsDto,
  ): Promise<Role> {
    await this.findOne(tenantId, id);
    await this.permissionsService.ensureExist(dto.permissionIds);
    await this.rolesRepository.replacePermissions(id, dto.permissionIds);
    return this.findOne(tenantId, id);
  }

  private async assertUnique(
    tenantId: number,
    name: string,
    code: string,
  ): Promise<void> {
    const [byName, byCode] = await Promise.all([
      this.rolesRepository.findByNameForTenant(tenantId, name),
      this.rolesRepository.findByCodeForTenant(tenantId, code),
    ]);

    if (byName) {
      throw new BadRequestException(`Role name "${name}" already exists`);
    }
    if (byCode) {
      throw new BadRequestException(`Role code "${code}" already exists`);
    }
  }
}
