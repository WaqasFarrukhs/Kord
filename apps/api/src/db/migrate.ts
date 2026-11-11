import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { createDatabase } from './client';
import { readConfig } from '../config';
const { db, pool } = createDatabase(readConfig(process.env).DATABASE_URL);
try {
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log(JSON.stringify({ event: 'migrations_complete' }));
} catch {
  console.error(JSON.stringify({ event: 'migrations_failed' }));
  process.exitCode = 1;
} finally {
  await pool.end();
}
