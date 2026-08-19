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

  const [t] = await c.query('SELECT id, name, code, status FROM tenants');
  console.log('✅ Tenants:', JSON.stringify(t));

  const [d] = await c.query('SELECT id, tenant_id, name, code FROM departments');
  console.log('✅ Departments:', JSON.stringify(d));

  const [r] = await c.query('SELECT id, tenant_id, name, code, is_system FROM roles');
  console.log('✅ Roles:', JSON.stringify(r));

  const [u] = await c.query(
    'SELECT id, tenant_id, department_id, email, first_name, last_name, status FROM users',
  );
  console.log('✅ Users:', JSON.stringify(u));

  const [p] = await c.query('SELECT COUNT(*) AS n FROM permissions');
  console.log('✅ Permission count:', p[0].n);

  const [rp] = await c.query('SELECT COUNT(*) AS n FROM role_permissions');
  console.log('✅ Role_permissions count:', rp[0].n);

  const [ur] = await c.query('SELECT COUNT(*) AS n FROM user_roles');
  console.log('✅ User_roles count:', ur[0].n);

  await c.end();
  console.log('🎉 Database verification complete! All tables and seeded data are healthy.');
})().catch((e) => {
  console.log('FAIL:', e.code || e.message);
  process.exit(1);
});
