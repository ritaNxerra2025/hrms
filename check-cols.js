require('dotenv').config({ path: '.env', override: true });
const mysql = require('mysql2/promise');

(async () => {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  for (const t of ['users', 'roles', 'tenants', 'permissions', 'user_roles', 'role_permissions']) {
    const [r] = await c.query('SHOW COLUMNS FROM ' + t);
    console.log(t + ':', r.map((x) => x.Field).join(', '));
  }
  await c.end();
})().catch((e) => {
  console.log('FAIL:', e.code || e.message);
  process.exit(1);
});
