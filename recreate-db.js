require('dotenv').config({ path: '.env', override: true });
const mysql = require('mysql2/promise');

(async () => {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });
  const db = process.env.DB_NAME;
  await c.query('DROP DATABASE IF EXISTS ' + db);
  await c.query(
    'CREATE DATABASE ' + db + ' CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci',
  );
  console.log('Recreated database:', db);
  await c.end();
})().catch((e) => {
  console.log('FAIL:', e.code || e.message);
  process.exit(1);
});
