import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(
    queryInterface: QueryInterface,
    Sequelize: typeof DataTypes & { literal: (value: string) => unknown },
  ) {
    await queryInterface.createTable('departments', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      tenant_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'tenants', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: { type: DataTypes.STRING(100), allowNull: false },
      code: { type: DataTypes.STRING(30), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'active',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: { type: DataTypes.DATE, allowNull: true },
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('departments');
  },
};