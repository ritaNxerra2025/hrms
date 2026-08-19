import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(
    queryInterface: QueryInterface,
    Sequelize: typeof DataTypes & {
      literal: (value: string) => unknown;
    },
  ) {
    await queryInterface.createTable('role_permissions', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      permission_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'permissions', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

    await queryInterface.addIndex('role_permissions', ['role_id'], {
      name: 'idx_role_permissions_role_id',
    });
    await queryInterface.addIndex('role_permissions', ['permission_id'], {
      name: 'idx_role_permissions_permission_id',
    });
    await queryInterface.addIndex(
      'role_permissions',
      ['role_id', 'permission_id'],
      {
        name: 'uq_role_permissions_role_permission',
        unique: true,
      },
    );
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('role_permissions');
  },
};
