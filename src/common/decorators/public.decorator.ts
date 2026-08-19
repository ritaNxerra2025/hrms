import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constants/system.constants';

/**
 * Marks a route as publicly accessible (skips AuthGuard).
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
