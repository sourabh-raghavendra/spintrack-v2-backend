// src/http/middleware/errorHandler.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../errors/AppError";
import { ErrorCodes } from "../../errors/errorCodes";
import { failure } from "../../utils/response";
import logger from "../../observability/logger";
import { env } from "../../config/env";

export function errorHandlerMiddleware(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // ── Operational errors (AppError) ────────────────────────────
  if (error instanceof AppError) {
    logger.warn(
      {
        requestId: req.requestId,
        errorCode: error.errorCode,
        statusCode: error.statusCode,
        message: error.message,
      },
      "Operational error",
    );

    res.status(error.statusCode).json(failure(error.errorCode, error.message));
    return;
  }

  // ── Programmer errors (unexpected) ───────────────────────────
  logger.error(
    {
      requestId: req.requestId,
      error: {
        message: error.message,
        stack: error.stack,
      },
    },
    "Unexpected error",
  );

  // Never leak error details in production
  const message =
    env.NODE_ENV === "production"
      ? "An unexpected error occurred"
      : error.message;

  res.status(500).json(failure(ErrorCodes.INTERNAL_SERVER_ERROR, message));
}
