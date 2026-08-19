import { QueryInterface, QueryTypes } from 'sequelize';
import { TENANT_CODE } from '../../common/constants/system.constants';

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
      'departments',
      [
        {
          tenant_id: tenantId,
          name: 'Management',
          code: 'MGMT',

          created_at: now,
          updated_at: now,
        },
        {
          tenant_id: tenantId,
          name: 'Information Technology',
          code: 'IT',

          created_at: now,
          updated_at: now,
        },
        {
          tenant_id: tenantId,
          name: 'Human Resources',
          code: 'HR',

          created_at: now,
          updated_at: now,
        },
        {
          tenant_id: tenantId,
          name: 'Finance & Accounts',
          code: 'FIN',

          created_at: now,
          updated_at: now,
        },
        {
          tenant_id: tenantId,
          name: 'Sales & Marketing',
          code: 'SALES',

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
    if (tenantId) {
      await queryInterface.bulkDelete(
        'departments',
        { tenant_id: tenantId },
        {},
      );
    }
  },
};
