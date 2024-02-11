import dotenv from 'dotenv';

import { app } from './app';
import { logger } from './lib';

dotenv.config();

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

// [Graceful Shutdown]
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');

  server.close(() => {
    logger.info('HTTP server closed');
  });
});
