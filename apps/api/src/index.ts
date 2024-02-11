import dotenv from 'dotenv';

import { app } from './app';

dotenv.config();

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// [Graceful Shutdown]
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');

  server.close(() => {
    console.log('HTTP server closed');
  });
});
