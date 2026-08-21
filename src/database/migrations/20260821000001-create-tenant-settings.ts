import { DataTypes, QueryInterface } from 'sequelize';

export default {
  async up(
    queryInterface: QueryInterface,
    Sequelize: typeof DataTypes & { literal: (value: string) => unknown },
  ) {
    await queryInterface.createTable('tenant_settings', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      tenant_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        references: { model: 'tenants', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      legal_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      display_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      cin: {
        type: DataTypes.STRING(21),
        allowNull: true,
      },
      gstin: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      support_email: {
        type: DataTypes.STRING(190),
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      default_currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'INR',
      },
      timezone: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'Asia/Kolkata',
      },
      financial_year_start_month: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 4,
      },
      week_starts_on: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'monday',
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
    await queryInterface.dropTable('tenant_settings');
  },
};
