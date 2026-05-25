import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const isProduction = process.env.NODE_ENV === 'production';
const needsSsl =
  process.env.DATABASE_SSL === 'true' ||
  /neon\.tech/i.test(connectionString || '') ||
  /sslmode=require/i.test(connectionString || '');

export const pool = new Pool({
  connectionString,
  ssl: needsSsl || isProduction ? { rejectUnauthorized: false } : false,
  max: 10,
});

export const testConnection = async () => {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
  } finally {
    client.release();
  }
};

export const withTransaction = async (work) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
