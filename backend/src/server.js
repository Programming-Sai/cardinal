import 'dotenv/config';
import app from './index.js';
import { bootstrapDatabase } from './db/bootstrap.js';

const port = Number(process.env.PORT || 5000);

const start = async () => {
  try {
    await bootstrapDatabase();
    app.listen(port, () => {
      console.log(`Cardinal Immersions backend listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start backend:', error.message);
    process.exit(1);
  }
};

start();
