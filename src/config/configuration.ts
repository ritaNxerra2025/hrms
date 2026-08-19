export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  logging: boolean;
}

export interface JwtConfig {
  accessSecret: string;
  refreshSecret: string;
  accessExpiresIn: string;
  refreshExpiresIn: string;
}

export interface ThrottlerConfig {
  ttlSeconds: number;
  limit: number;
}

export interface BootstrapConfig {
  superAdminEmail: string;
  superAdminPassword: string;
  superAdminFirstName: string;
  superAdminLastName: string;
}

export interface AppConfiguration {
  env: string;
  port: number;
  apiPrefix: string;
  database: DatabaseConfig;
  jwt: JwtConfig;
  corsOrigins: string[];
  throttler: ThrottlerConfig;
  bootstrap: BootstrapConfig;
}

export default (): AppConfiguration => ({
  env: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  apiPrefix: process.env.API_PREFIX ?? 'api/v1',
  database: {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'hrms_nxerra',
    logging: (process.env.DB_LOGGING ?? 'false').toLowerCase() === 'true',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? '',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? '',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '1d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
  corsOrigins: (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  throttler: {
    ttlSeconds: parseInt(process.env.THROTTLE_TTL_SECONDS ?? '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT ?? '120', 10),
  },
  bootstrap: {
    superAdminEmail: process.env.SUPER_ADMIN_EMAIL ?? 'superadmin@nxerra.com',
    superAdminPassword: process.env.SUPER_ADMIN_PASSWORD ?? 'Nxerra@2026',
    superAdminFirstName: process.env.SUPER_ADMIN_FIRST_NAME ?? 'Super',
    superAdminLastName: process.env.SUPER_ADMIN_LAST_NAME ?? 'Admin',
  },
});
