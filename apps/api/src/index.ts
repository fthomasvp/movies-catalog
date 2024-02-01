import { errorHandler, networkTracer } from './middlewares';
import express, { Express } from 'express';
import compression from 'compression';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { moviesRouterV1 } from './routes/v1';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// [Extensions]
app.use(compression());
app.use(helmet());
app.use(express.json());

// [Security]
app.disable('x-powered-by');

// [Middlewares]
app.use(networkTracer);

/**
 * [Routes]
 *
 * Avoid using the same "use()" function with different routes, such as:
 * `app.use('/api/v1/movies', moviesRouterV1, otherRouterV1)`
 * Because it will trigger middlewares from both routes.
 * */
app.use('/api/v1/movies', moviesRouterV1);

// [Error Handlers]
app.use(errorHandler);

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
