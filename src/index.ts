import "dotenv/config";
import { createApp } from "./http/server";
import { env } from "./config/env";
import logger from "./observability/logger";
import { connectDb, disconnectDb } from "./config/database";

const app = createApp();

const start = async (): Promise<void> => {
  await connectDb();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received — starting graceful shutdown`);

    // 1. Stop accepting new connections
    server.close(async () => {
      logger.info("HTTP server closed — no longer accepting connections");

      try {
        // 2. Close DB
        await disconnectDb();
        logger.info("Database connection closed");

        logger.info("Graceful shutdown complete");
        process.exit(0);
      } catch (error) {
        logger.error({ error }, "Error during shutdown");
        process.exit(1);
      }
    });

    // Force exit if shutdown takes too long
    setTimeout(() => {
      logger.error("Shutdown timed out — forcing exit");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error({ reason }, "Unhandled promise rejection");
    process.exit(1);
  });

  process.on("uncaughtException", (error) => {
    logger.error({ error }, "Uncaught exception");
    process.exit(1);
  });
};

start();
