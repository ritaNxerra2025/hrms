import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface) {
    const tableDesc = await queryInterface.describeTable('departments');
    if (tableDesc['description']) {
      await queryInterface.removeColumn('departments', 'description');
    }
    if (tableDesc['status']) {
      await queryInterface.removeColumn('departments', 'status');
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.addColumn('departments', 'description', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('departments', 'status', {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active',
    });
  },
};
