export const IS_PUBLIC_KEY = 'isPublic';
export const PERMISSIONS_KEY = 'permissions';

export const TOKEN_TYPE = {
  ACCESS: 'access',
  REFRESH: 'refresh',
} as const;

export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const MODULE_ACCESS = {
  Full: 'full',
  Restricted: 'restricted',
  ReadOnly: 'readOnly',
} as const;

export const ROLE_CODE = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  COMPANY_ADMIN: 'COMPANY_ADMIN',
  HR_ADMIN: 'HR_ADMIN',
  HR_MANAGER: 'HR_MANAGER',
  EMPLOYEE: 'EMPLOYEE',
} as const;

export const TENANT_CODE = {
  NXERRA: 'NXERRA',
} as const;
