import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

import { migrationConnection } from "./db";
import { logger } from "./libs";

const db = drizzle(migrationConnection);

const main = async () => {
  logger.info("Migration is running...");

  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, { migrationsFolder: "./drizzle" });

  // Don't forget to close the connection, otherwise the script will hang
  await migrationConnection.end();

  logger.info("Migration completed");
};

main();
