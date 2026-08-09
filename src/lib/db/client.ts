import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import { getEnv } from '../config/env';

import * as schema from './schema';

export type Database = ReturnType<typeof drizzle<typeof schema>>;

let database: Database | null = null;

export function getDb(): Database {
  if (database) {
    return database;
  }

  const { DATABASE_URL } = getEnv();
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is required before using the Postgres client.');
  }

  database = drizzle(neon(DATABASE_URL), { schema });

  return database;
}
