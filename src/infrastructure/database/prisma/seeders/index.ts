// src/infrastructure/database/prisma/seeders/index.ts
import "dotenv/config";
import { connectDb, disconnectDb } from "../../../../config/database";
import logger from "../../../../observability/logger";
import { seedPermissions } from "./PermissionSeeder";

async function main(): Promise<void> {
  await connectDb();

  await seedPermissions();

  await disconnectDb();
  logger.info("Seeding complete");
}

main().catch((error) => {
  logger.error({ error }, "Seeding failed");
  process.exit(1);
});
