import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const DB_URL = String(process.env.DB_URL);

/** This should be used for migrations only */
export const migrationConnection = postgres(DB_URL, {
  max: 1,
});

/** This should be used for querying data in general */
export const connection = postgres(DB_URL);

// TODO: maybe create a Singleton for this `db` property ?
export const db = drizzle(connection);
