import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS_KEY } from '../constants/system.constants';

/**
 * Declares the `module:action` permissions required to access a route.
 * Enforced by the PermissionGuard.
 */
export const RequirePermission = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
