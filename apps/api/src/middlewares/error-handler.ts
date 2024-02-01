import { NextFunction, Request, Response } from 'express';
import { RequestLog } from '../utils';
import { ZodError } from 'zod';
import { createId } from '@paralleldrive/cuid2';
import { logger } from '../lib';

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
      'Invalid or Missing Properties Sent by Client',
    );
    res.status(400).send(err.message);

    return;
  }

  // TODO: add another instances of err

  logger.error({ request, error: err.stack }, 'Internal Server Error');
  res.status(500).send('Internal Server Error');
}
