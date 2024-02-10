import { createId } from '@paralleldrive/cuid2';
import { NextFunction, Request, Response } from 'express';

import { logger } from '../lib';

export function networkTracer(req: Request, res: Response, next: NextFunction) {
  const { headers, method, path, params, body, ip } = req;

  if (method !== 'GET') {
    const requestId = req.headers['x-request-id'] ?? createId();
    res.setHeader('X-Request-Id', requestId);

    logger.info(
      {
        request: {
          id: requestId,
          headers,
          method,
          path,
          params,
          body,
          ip,
        },
      },
      '[REQUEST] Incoming',
    );
  }

  next();
}
