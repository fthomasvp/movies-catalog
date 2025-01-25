import "dotenv/config";

import { exit } from "node:process";

import { app } from "./app";
import { connection } from "./db";
import { logger } from "./libs";
import type { CustomError } from "./utils";

const port = process.env.PORT || 8080;

async function init() {
  try {
    // check if database connection is available
    await connection`SELECT NOW();`;

    const server = app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });

    // [Graceful Shutdown]
    process.on("SIGTERM", () => {
      logger.warn("SIGTERM signal received: closing HTTP server");

      server.close(() => {
        logger.warn("HTTP server closed");
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      const errorCode = (error as CustomError).code;

      if (errorCode && errorCode === "ECONNREFUSED") {
        logger.error(error, "Database is NOT available");

        exit(1);
      }
    }
  }
}
init();
