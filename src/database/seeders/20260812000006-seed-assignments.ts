import 'dotenv/config';
import { Op, QueryInterface, QueryTypes } from 'sequelize';
import {
  ROLE_CODE,
  TENANT_CODE,
} from '../../common/constants/system.constants';

export default {
  async up(queryInterface: QueryInterface) {
    const tenantRows = await queryInterface.sequelize.query<{ id: number }>(
      'SELECT id FROM tenants WHERE code = ? LIMIT 1',
      { type: QueryTypes.SELECT, replacements: [TENANT_CODE.NXERRA] },
    );
    const tenantId = tenantRows[0]?.id;
    if (!tenantId) {
      throw new Error('NxErra tenant not found. Run the tenant seeder first.');
    }

    const superAdminRoleRows = await queryInterface.sequelize.query<{ id: number }>(
      'SELECT id FROM roles WHERE code = ? AND tenant_id = ? LIMIT 1',
      {
        type: QueryTypes.SELECT,
        replacements: [ROLE_CODE.SUPER_ADMIN, tenantId],
      },
    );
    const superAdminRoleId = superAdminRoleRows[0]?.id;
    if (!superAdminRoleId) {
      throw new Error('SUPER_ADMIN role not found. Run the role seeder first.');
    }

    const hrAdminRoleRows = await queryInterface.sequelize.query<{ id: number }>(
      'SELECT id FROM roles WHERE code = ? AND tenant_id = ? LIMIT 1',
      {
        type: QueryTypes.SELECT,
        replacements: [ROLE_CODE.HR_ADMIN, tenantId],
      },
    );
    const hrAdminRoleId = hrAdminRoleRows[0]?.id;

    const allPermissionRows = await queryInterface.sequelize.query<{ id: number; module: string }>(
      'SELECT id, module FROM permissions',
      { type: QueryTypes.SELECT },
    );
    if (!allPermissionRows.length) {
      throw new Error('No permissions found. Run the permissions seeder first.');
    }

    const now = new Date();

    // 1. Assign all permissions to Super Admin
    const rolePermissionRecords = allPermissionRows.map((row) => ({
      role_id: superAdminRoleId,
      permission_id: row.id,
      created_at: now,
      updated_at: now,
    }));

    // 2. Assign HR, User, Department, Organization permissions to HR Admin
    if (hrAdminRoleId) {
      const hrPermissions = allPermissionRows.filter((p) =>
        ['user', 'organization', 'employee', 'leave', 'recruitment', 'interview', 'offer_letter'].includes(
          p.module,
        ),
      );
      for (const p of hrPermissions) {
        rolePermissionRecords.push({
          role_id: hrAdminRoleId,
          permission_id: p.id,
          created_at: now,
          updated_at: now,
        });
      }
    }

    await queryInterface.bulkInsert('role_permissions', rolePermissionRecords, {});

    // 3. Assign Super Admin role to the super admin user
    const userRows = await queryInterface.sequelize.query<{ id: number }>(
      'SELECT id FROM users WHERE email = ? AND tenant_id = ? LIMIT 1',
      {
        type: QueryTypes.SELECT,
        replacements: [
          process.env.SUPER_ADMIN_EMAIL ?? 'superadmin@nxerra.com',
          tenantId,
        ],
      },
    );
    const userId = userRows[0]?.id;
    if (!userId) {
      throw new Error('SUPER_ADMIN user not found. Run the user seeder first.');
    }

    await queryInterface.bulkInsert(
      'user_roles',
      [
        {
          user_id: userId,
          role_id: superAdminRoleId,
          created_at: now,
          updated_at: now,
        },
      ],
      {},
    );
  },

  async down(queryInterface: QueryInterface) {
    const tenantRows = await queryInterface.sequelize.query<{ id: number }>(
      'SELECT id FROM tenants WHERE code = ? LIMIT 1',
      { type: QueryTypes.SELECT, replacements: [TENANT_CODE.NXERRA] },
    );
    const tenantId = tenantRows[0]?.id;
    if (!tenantId) return;

    const roleRows = await queryInterface.sequelize.query<{ id: number }>(
      'SELECT id FROM roles WHERE tenant_id = ?',
      { type: QueryTypes.SELECT, replacements: [tenantId] },
    );
    const roleIds = roleRows.map((r) => r.id);
    if (roleIds.length > 0) {
      await queryInterface.bulkDelete(
        'role_permissions',
        { role_id: { [Op.in]: roleIds } },
        {},
      );
      await queryInterface.bulkDelete(
        'user_roles',
        { role_id: { [Op.in]: roleIds } },
        {},
      );
    }
  },
};
