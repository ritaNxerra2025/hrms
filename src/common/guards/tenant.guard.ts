import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { STATUS } from '../constants/system.constants';
import { AuthenticatedUser } from '../types/authenticated-user';
import { TenantsRepository } from '../../modules/tenants/tenants.repository';

/**
 * Resolves the current tenant from the authenticated user's tenantId,
 * verifies it exists and is active, and attaches it to the request
 * as `request.tenant`.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly tenantsRepository: TenantsRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser | undefined;

    if (!user) {
      return true;
    }

    const tenant = await this.tenantsRepository.findById(user.tenantId);

    if (!tenant || tenant.status !== STATUS.ACTIVE) {
      throw new UnauthorizedException('Tenant is inactive or does not exist');
    }

    request.tenant = tenant;
    return true;
  }
}
