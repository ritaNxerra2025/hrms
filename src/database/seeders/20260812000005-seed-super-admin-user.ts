import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { QueryInterface, QueryTypes } from 'sequelize';
import { TENANT_CODE } from '../../common/constants/system.constants';

export default {
  async up(queryInterface: QueryInterface) {
    const email = process.env.SUPER_ADMIN_EMAIL ?? 'superadmin@nxerra.com';
    const password = process.env.SUPER_ADMIN_PASSWORD ?? 'Nxerra@2026';
    const fullName = process.env.SUPER_ADMIN_FULL_NAME ?? 'Super Admin';

    const tenantRows = await queryInterface.sequelize.query<{ id: number }>(
      'SELECT id FROM tenants WHERE code = ? LIMIT 1',
      { type: QueryTypes.SELECT, replacements: [TENANT_CODE.NXERRA] },
    );

    const tenantId = tenantRows[0]?.id;
    if (!tenantId) {
      throw new Error('NxErra tenant not found. Run the tenant seeder first.');
    }

    const deptRows = await queryInterface.sequelize.query<{ id: number }>(
      'SELECT id FROM departments WHERE code = ? AND tenant_id = ? LIMIT 1',
      { type: QueryTypes.SELECT, replacements: ['MGMT', tenantId] },
    );
    const departmentId = deptRows[0]?.id ?? null;
    const moduleAccess = 'full';

    const passwordHash = bcrypt.hashSync(password, 10);
    const now = new Date();

    await queryInterface.bulkInsert(
      'users',
      [
        {
          tenant_id: tenantId,
          department_id: departmentId,
          full_name: fullName,
          email,
          password_hash: passwordHash,
          phone: '+91 9876543210',
          status: 'active',
          last_login_at: null,
          created_at: now,
          updated_at: now,
          module_access: moduleAccess,
        },
      ],
      {},
    );
  },

  async down(queryInterface: QueryInterface) {
    const email = process.env.SUPER_ADMIN_EMAIL ?? 'superadmin@nxerra.com';
    await queryInterface.bulkDelete('users', { email }, {});
  },
};
