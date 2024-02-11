import 'dotenv/config';

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

import { migrationConnection } from './db';

const db = drizzle(migrationConnection);

const main = async () => {
  console.log('[INFO]\tMigration is running...');
  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, { migrationsFolder: './drizzle' });

  // Don't forget to close the connection, otherwise the script will hang
  await migrationConnection.end();
  console.log('[INFO]\tMigration completed');
};

main();
