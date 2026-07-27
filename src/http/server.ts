import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "../config/env";
import { API } from "../config/constants";
import logger from "../observability/logger";
import { requestIdMiddleware } from "./middleware/requestId.middleware";
import { loggingMiddleware } from "./middleware/logging.middleware";
import { compressionMiddleware } from "./middleware/compression.middleware";
import { errorHandlerMiddleware } from "./middleware/errorHandler.middleware";
import router from "./routes/index";
import adminRouter from "../admin/routes/index";

export function createApp(): Application {
  const app = express();

  // ── 1. Request ID ─────────────────────────────────────────────────
  app.use(requestIdMiddleware);

  // ── 2. Security ───────────────────────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: env.NODE_ENV === "production" ? env.CORS_ORIGIN : "*",
      credentials: true,
    }),
  );

  // ── 3. Request Parsing ────────────────────────────────────────────
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // ── 4. Performance ────────────────────────────────────────────────
  app.use(compressionMiddleware);

  // ── 5. Logging ────────────────────────────────────────────────────
  app.use(loggingMiddleware);

  // ── 7. API Routes ─────────────────────────────────────────────────
  app.use(API.PREFIX, router);

  // ── 9. Admin Routes ───────────────────────────────────────────────
  app.use("/admin", adminRouter);

  // ── 10. Error Handler — must be last ──────────────────────────────
  app.use(errorHandlerMiddleware);

  return app;
}
