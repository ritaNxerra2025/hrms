import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(
    queryInterface: QueryInterface,
    Sequelize: typeof DataTypes & {
      literal: (value: string) => unknown;
    },
  ) {
    await queryInterface.createTable('roles', {
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
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      is_system: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('roles', ['tenant_id'], {
      name: 'idx_roles_tenant_id',
    });
    await queryInterface.addIndex('roles', ['tenant_id', 'name'], {
      name: 'uq_roles_tenant_name',
      unique: true,
    });
    await queryInterface.addIndex('roles', ['tenant_id', 'code'], {
      name: 'uq_roles_tenant_code',
      unique: true,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('roles');
  },
};
