export interface PermissionDefinition {
  module: string;
  action: string;
}

/**
 * SYSTEM-DEFINED permissions.
 * These are seeded into the database by the seeder and are the ONLY
 * permissions an application can ever reference. Frontends cannot create
 * arbitrary permissions; role management only assigns from this set.
 *
 * Naming convention: `module:action`.
 */
export const PERMISSIONS: PermissionDefinition[] = [
  // Core platform modules
  { module: 'dashboard', action: 'view' },

  { module: 'tenant', action: 'view' },
  { module: 'tenant', action: 'create' },
  { module: 'tenant', action: 'update' },
  { module: 'tenant', action: 'delete' },

  { module: 'user', action: 'view' },
  { module: 'user', action: 'create' },
  { module: 'user', action: 'update' },
  { module: 'user', action: 'delete' },

  { module: 'role', action: 'view' },
  { module: 'role', action: 'create' },
  { module: 'role', action: 'update' },
  { module: 'role', action: 'delete' },

  { module: 'permission', action: 'view' },

  // Organization / departments
  { module: 'organization', action: 'view' },
  { module: 'organization', action: 'create' },
  { module: 'organization', action: 'update' },
  { module: 'organization', action: 'delete' },
  { module: 'organization', action: 'department:create' },
  { module: 'organization', action: 'department:read' },
  { module: 'organization', action: 'department:update' },
  { module: 'organization', action: 'department:delete' },

  // Business modules (defined now, enforced in later steps)
  { module: 'recruitment', action: 'view' },
  { module: 'recruitment', action: 'create' },
  { module: 'recruitment', action: 'update' },
  { module: 'recruitment', action: 'delete' },

  { module: 'interview', action: 'view' },
  { module: 'interview', action: 'create' },
  { module: 'interview', action: 'update' },
  { module: 'interview', action: 'schedule' },

  { module: 'offer_letter', action: 'view' },
  { module: 'offer_letter', action: 'create' },
  { module: 'offer_letter', action: 'send' },

  { module: 'employee', action: 'view' },
  { module: 'employee', action: 'create' },
  { module: 'employee', action: 'update' },
  { module: 'employee', action: 'delete' },

  { module: 'leave', action: 'view' },
  { module: 'leave', action: 'create' },
  { module: 'leave', action: 'approve' },
  { module: 'leave', action: 'reject' },

  { module: 'payroll', action: 'view' },
  { module: 'payroll', action: 'process' },
  { module: 'payroll', action: 'approve' },
];

export const PERMISSION_NAMES: string[] = PERMISSIONS.map(
  (p) => `${p.module}:${p.action}`,
);
