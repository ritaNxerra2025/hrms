import { QueryInterface, QueryTypes } from 'sequelize';
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

    const now = new Date();
    await queryInterface.bulkInsert(
      'roles',
      [
        {
          tenant_id: tenantId,
          name: 'Super Admin',
          code: ROLE_CODE.SUPER_ADMIN,
          is_system: true,
          created_at: now,
          updated_at: now,
        },
        {
          tenant_id: tenantId,
          name: 'HR Admin',
          code: ROLE_CODE.HR_ADMIN,
          is_system: false,
          created_at: now,
          updated_at: now,
        },
        {
          tenant_id: tenantId,
          name: 'HR Manager',
          code: ROLE_CODE.HR_MANAGER,
          is_system: false,
          created_at: now,
          updated_at: now,
        },
        {
          tenant_id: tenantId,
          name: 'Employee',
          code: ROLE_CODE.EMPLOYEE,
          is_system: false,
          created_at: now,
          updated_at: now,
        },
      ],
      {},
    );
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete(
      'roles',
      {
        code: [
          ROLE_CODE.SUPER_ADMIN,
          ROLE_CODE.HR_ADMIN,
          ROLE_CODE.HR_MANAGER,
          ROLE_CODE.EMPLOYEE,
        ],
      },
      {},
    );
  },
};
