// src/http/middleware/logging.middleware.ts
import { Request, Response, NextFunction } from "express";
import logger from "../../observability/logger";

export function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const logData = {
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    };

    if (res.statusCode >= 500) {
      logger.error(logData, "Request completed");
    } else if (res.statusCode >= 400) {
      logger.warn(logData, "Request completed");
    } else {
      logger.info(logData, "Request completed");
    }
  });

  next();
}
