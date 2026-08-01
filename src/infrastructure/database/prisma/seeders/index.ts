// src/infrastructure/database/prisma/seeders/index.ts
import "dotenv/config";
import { connectDb, disconnectDb } from "../../../../config/database";
import logger from "../../../../observability/logger";
import { seedPermissions } from "./PermissionSeeder";
import prisma from "../../../../config/database";
import { seedAdmin } from "./AdminSeeder";
import { seedTapers } from "./TaperSeeder";
import { seedCustomers } from "./CustomerSeeder";

async function main(): Promise<void> {
  await connectDb();

  await seedPermissions();
  // await seedTapers();

  // await seedCustomers();

  await disconnectDb();
  logger.info("Seeding complete");
}

main().catch((error) => {
  logger.error({ error }, "Seeding failed");
  process.exit(1);
});
