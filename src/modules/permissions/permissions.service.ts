import { Injectable, NotFoundException } from '@nestjs/common';
import { Permission } from '../../database/models/permission.model';
import { PermissionsRepository } from './permissions.repository';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  async findAll(): Promise<Permission[]> {
    return this.permissionsRepository.findAll();
  }

  async findOne(id: number): Promise<Permission> {
    const permission = await this.permissionsRepository.findById(id);
    if (!permission) {
      throw new NotFoundException(`Permission ${id} not found`);
    }
    return permission;
  }

  /**
   * Ensures every id exists and is a system-defined permission.
   * Returns the found permissions. Used when assigning permissions to roles.
   */
  async ensureExist(ids: number[]): Promise<Permission[]> {
    const uniqueIds = [...new Set(ids)];
    if (uniqueIds.length === 0) {
      return [];
    }
    const permissions = await this.permissionsRepository.findByIds(uniqueIds);
    if (permissions.length !== uniqueIds.length) {
      throw new NotFoundException(
        'One or more permissions do not exist in the system',
      );
    }
    return permissions;
  }
}
