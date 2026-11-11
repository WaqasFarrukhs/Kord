import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
export function createDatabase(connectionString: string) {
  const pool = new pg.Pool({ connectionString, max: 5, connectionTimeoutMillis: 3000, query_timeout: 3000, statement_timeout: 3000 });
  return { pool, db: drizzle(pool, { schema }) };
}
