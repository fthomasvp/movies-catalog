import { createId } from "@paralleldrive/cuid2";
import type { NextFunction, Request, Response } from "express";

import { logger } from "../libs";

export function networkTracer(req: Request, res: Response, next: NextFunction) {
  const { headers, method, path, params, body, ip } = req;

  const startTime = Date.now();
  const requestId = req.headers["x-request-id"] ?? createId();
  res.setHeader("X-Request-Id", requestId);

  const attributes = {
    "http.headers": headers,
    "http.method": method,
    "http.path": path,
    "http.params": params,
    "http.body": body,
    "http.ip": ip,
  };

  const duration = Date.now() - startTime;

  if (method !== "GET") {
    logger.info({ requestId, attributes, duration }, "Incoming request");
  }

  next();
}
