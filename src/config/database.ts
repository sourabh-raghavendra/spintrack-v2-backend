// src/config/database.ts
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";
import logger from "../observability/logger";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });

export async function connectDb(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info("Database connected");
  } catch (error) {
    logger.error({ error }, "Database connection failed");
    process.exit(1);
  }
}

export async function disconnectDb(): Promise<void> {
  await prisma.$disconnect();
  logger.info("Database disconnected");
}

export default prisma;
