import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Tenant } from '../../database/models/tenant.model';

/**
 * Returns the Tenant instance attached by the TenantGuard.
 * Example: `@CurrentTenant() tenant: Tenant`
 */
export const CurrentTenant = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Tenant | undefined => {
    const request = context.switchToHttp().getRequest();
    return request.tenant as Tenant | undefined;
  },
);
