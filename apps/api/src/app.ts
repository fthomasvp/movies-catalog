import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import helmet from 'helmet';

import { errorHandler, networkTracer } from './middlewares';
import { authRouterV1, moviesRouterV1, usersRouterV1 } from './routes/v1';

export const app: Express = express();

// [Extensions]
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.json());

// [Security]
app.disable('x-powered-by');

// [Middlewares]
// app.use(networkTracer);

/**
 * [Routes]
 *
 * Avoid using the same "use()" function with different routes, such as:
 * `app.use('/api/v1/movies', moviesRouterV1, otherRouterV1)`
 * Because it will trigger middlewares from both routes.
 * */
app.use('/api/v1/movies', moviesRouterV1);
app.use('/api/v1/users', usersRouterV1);
app.use('/api/v1/auth', authRouterV1);

// [Error Handlers]
app.use(errorHandler);
