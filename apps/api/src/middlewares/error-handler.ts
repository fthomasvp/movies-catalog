import { createId } from '@paralleldrive/cuid2';
import { NextFunction, Request, Response } from 'express';
import { PostgresError } from 'postgres';
import { ZodError } from 'zod';

import { logger } from '../lib';
import { formatZodError, RequestLog } from '../utils';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const { headers, method, path, params, body, ip } = req;

  const requestId = (res.getHeader('X-Request-Id') as string) ?? createId();

  let request: RequestLog = {
    id: requestId,
  };

  if (method === 'GET') {
    request = {
      ...request,
      headers,
      method,
      path,
      params,
      body,
      ip,
    };
  }

  if (err instanceof ZodError) {
    logger.error(
      { request, error: err.stack },
      'Invalid or missing required properties sent by client',
    );
    res.status(400).json({
      error: {
        type: err.name,
        message: formatZodError(err),
      },
    });

    return;
  }

  if (err instanceof PostgresError) {
    logger.error({ request, error: err.stack }, 'Invalid database operation');
    res.status(422).json({ error: { type: err.name, message: err.message } });

    return;
  }

  logger.error({ request, error: err.stack }, 'Internal Server Error');
  res.status(500).json({ error: { type: err.name, message: err.message } });
}
