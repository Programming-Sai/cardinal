import 'dotenv/config';
import { pool } from './src/config/database.js';
import { runMigrations } from './src/db/bootstrap.js';

const run = async () => {
  try {
    await runMigrations();
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

run();
