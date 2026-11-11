import { serve } from '@hono/node-server';
import { sql } from 'drizzle-orm';
import { createApp } from './app';
import { readConfig } from './config';
import { createDatabase } from './db/client';
const config = readConfig(process.env);
const { db, pool } = createDatabase(config.DATABASE_URL);
const log = (entry: Record<string, unknown>) => console.log(JSON.stringify(entry));
pool.on('error', () => log({ event: 'database_pool_error' }));
const app = createApp({
  origins: config.WEB_ORIGINS,
  checkDatabase: async () => {
    // Checks both connectivity and that the initial migration has been applied.
    await db.execute(sql`select key from application_metadata limit 1`);
  },
  log,
});
const server = serve({ fetch: app.fetch, port: config.PORT, hostname: '0.0.0.0' }, () => log({ event: 'listening', port: config.PORT }));
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.once(signal, () => {
    const timeout = setTimeout(() => process.exit(1), 5000).unref();
    server.close(() => { void pool.end().finally(() => { clearTimeout(timeout); process.exit(0); }); });
  });
}
