// tenant-settings.model.ts
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Tenant } from './tenant.model';

@Table({
  tableName: 'tenant_settings',
  underscored: true,
  timestamps: true,
  paranoid: true,
  comment: 'Company profile and regional/fiscal defaults per tenant',
})
export class TenantSettings extends Model<
  TenantSettings,
  {
    id?: number;
    tenantId: number;
    legalName: string;
    displayName?: string | null;
    cin?: string | null;
    gstin?: string | null;
    supportEmail?: string | null;
    website?: string | null;
    defaultCurrency: string;
    timezone: string;
    financialYearStartMonth: number; // 1-12, e.g. 4 = April
    weekStartsOn: string; // 'monday' | 'sunday' etc.
  }
> {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => Tenant)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, unique: true })
  declare tenantId: number;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare legalName: string;

  @Column({ type: DataType.STRING(100), allowNull: true })
  declare displayName: string | null;

  @Column({ type: DataType.STRING(21), allowNull: true }) // CIN is fixed 21 chars
  declare cin: string | null;

  @Column({ type: DataType.STRING(15), allowNull: true }) // GSTIN is fixed 15 chars
  declare gstin: string | null;

  @Column({ type: DataType.STRING(190), allowNull: true })
  declare supportEmail: string | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare website: string | null;

  @Column({ type: DataType.STRING(3), allowNull: false, defaultValue: 'INR' })
  declare defaultCurrency: string;

  @Column({ type: DataType.STRING(50), allowNull: false, defaultValue: 'Asia/Kolkata' })
  declare timezone: string;

  @Column({ type: DataType.TINYINT.UNSIGNED, allowNull: false, defaultValue: 4 })
  declare financialYearStartMonth: number;

  @Column({ type: DataType.STRING(10), allowNull: false, defaultValue: 'monday' })
  declare weekStartsOn: string;

  @BelongsTo(() => Tenant, { foreignKey: 'tenantId' })
  declare tenant: Tenant;
}