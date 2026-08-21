import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('users', 'module_access', {
      type: DataTypes.STRING(80),
      allowNull: true,
      defaultValue: 'readOnly',
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('users', 'module_access');
  },
};
