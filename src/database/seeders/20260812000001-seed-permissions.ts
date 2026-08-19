import { Op, QueryInterface } from 'sequelize';
import {
  PERMISSIONS,
  PERMISSION_NAMES,
} from '../../common/constants/permission.constants';

export default {
  async up(queryInterface: QueryInterface) {
    const rows = PERMISSIONS.map((permission) => ({
      name: `${permission.module}:${permission.action}`,
      module: permission.module,
      action: permission.action,
      description: `Allows "${permission.action.replace(/_/g, ' ')}" on ${permission.module.replace(/_/g, ' ')}`,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('permissions', rows, {});
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete(
      'permissions',
      { name: { [Op.in]: PERMISSION_NAMES } },
      {},
    );
  },
};
