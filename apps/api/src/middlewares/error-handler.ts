import { createId } from "@paralleldrive/cuid2";
import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import { PostgresError } from "postgres";
import { ZodError } from "zod";

import { InactiveUserError } from "../exceptions";
import { logger } from "../libs";
import { formatZodError } from "../utils";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const { headers, method, path, params, body, ip } = req;

  const requestId = (res.getHeader("X-Request-Id") as string) ?? createId();
  let request = {};

  if (method === "GET") {
    request = {
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
      { requestId, request, error: err.stack },
      "Invalid or missing required properties sent by client",
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
    logger.error(
      { requestId, request, error: err.stack },
      "Invalid database operation",
    );
    res.status(422).json({ error: { type: err.name, message: err.message } });

    return;
  }

  if (err instanceof JsonWebTokenError) {
    logger.error(
      { requestId, request, error: err.stack },
      "Invalid or missing JWT token",
    );
    res
      .status(422)
      .json({ error: { type: "AuthError", message: err.message } });

    return;
  }

  if (err instanceof ReferenceError) {
    logger.error(
      { requestId, request, error: err.stack },
      "Invalid or missing data",
    );
    res.status(422).json({
      error: {
        type: err.name,
        message: err.message || "Invalid or missing data",
      },
    });

    return;
  }

  if (err instanceof InactiveUserError) {
    logger.error(
      { requestId, request, error: err.stack },
      "User is not active",
    );
    res.status(422).json({ error: { type: err.name, message: err.message } });

    return;
  }

  logger.error(
    { requestId, request, error: err.stack },
    "Internal Server Error",
  );
  res.status(500).json({ error: { type: err.name, message: err.message } });
}
