import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(
    queryInterface: QueryInterface,
    Sequelize: typeof DataTypes & {
      literal: (value: string) => unknown;
    },
  ) {
    await queryInterface.createTable('permissions', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      module: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
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
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('permissions');
  },
};
