import mysql from 'mysql2/promise';

let pool;

export function getPool() {
  if (!pool) {
    const host = process.env.DB_HOST || '127.0.0.1';
    const port = parseInt(process.env.DB_PORT || '3306', 10);
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '';
    const database = process.env.DB_NAME || 'Manoj';

    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
  }
  return pool;
}

export async function query(sql, params = []) {
  const pool = getPool();
  const [results] = await pool.execute(sql, params);
  return results;
}

export default { getPool, query };

