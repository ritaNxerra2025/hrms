import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(
    queryInterface: QueryInterface,
    Sequelize: typeof DataTypes & {
      literal: (value: string) => unknown;
    },
  ) {
    await queryInterface.createTable('user_roles', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      role_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
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

    await queryInterface.addIndex('user_roles', ['user_id'], {
      name: 'idx_user_roles_user_id',
    });
    await queryInterface.addIndex('user_roles', ['role_id'], {
      name: 'idx_user_roles_role_id',
    });
    await queryInterface.addIndex('user_roles', ['user_id', 'role_id'], {
      name: 'uq_user_roles_user_role',
      unique: true,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('user_roles');
  },
};
