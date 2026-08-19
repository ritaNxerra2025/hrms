import 'dotenv/config';
import type { Options } from 'sequelize';

const database = process.env.DB_NAME ?? 'hrms_nxerra';

const base: Options = {
  dialect: 'mysql',
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database,
  define: {
    underscored: true,
  },
  logging: false,
};

export interface SequelizeCliConfig {
  development: Options;
  test: Options;
  production: Options;
}

const config: SequelizeCliConfig = {
  development: base,
  test: { ...base, database: `${database}_test` },
  production: { ...base },
};

export default config;
