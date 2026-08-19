import { QueryInterface } from 'sequelize';
import { TENANT_CODE } from '../../common/constants/system.constants';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert(
      'tenants',
      [
        {
          name: 'NxErra',
          code: TENANT_CODE.NXERRA,
          description: 'Primary Nxerra tenant',
          status: 'active',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete(
      'tenants',
      { code: TENANT_CODE.NXERRA },
      {},
    );
  },
};
