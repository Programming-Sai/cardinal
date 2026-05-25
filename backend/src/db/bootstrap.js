import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool, testConnection } from '../config/database.js';
import { seedDatabase } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const runMigrations = async () => {
  await testConnection();
  const sql = await readFile(resolve(__dirname, 'migrations/001_initial.sql'), 'utf8');
  await pool.query(sql);
};

export const bootstrapDatabase = async () => {
  await runMigrations();
  await seedDatabase();
};
