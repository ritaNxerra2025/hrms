import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

/**
 * Loads a user's effective permissions from the database on every check.
 * Permissions are never read from JWTs so changes take effect immediately.
 */
@Injectable()
export class UserPermissionsService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getPermissionNames(userId: number): Promise<string[]> {
    const user = await this.usersRepository.findWithRolesAndPermissions(userId);
    if (!user) {
      return [];
    }
    const permissionNames = new Set<string>();
    for (const role of user.roles ?? []) {
      for (const permission of role.permissions ?? []) {
        if (permission?.name) {
          permissionNames.add(permission.name);
        }
      }
    }

    return [...permissionNames];
  }
}
