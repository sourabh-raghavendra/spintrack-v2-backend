import "dotenv/config";
import prisma from "../config/database";

async function main() {
  console.log("Starting Inspected By migration...");
  const oldEntries = await prisma.inspectionMeasurement.findMany({
    where: { measurementKey: "finalInspectionInspectedBy" },
  });

  console.log(`Found ${oldEntries.length} entries to migrate.`);

  for (const entry of oldEntries) {
    const userId = entry.actualValue as string; // stored as the raw user id
    if (!userId) continue;

    // Check if user exists first to prevent foreign key constraint violations
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) {
      console.warn(`User with ID ${userId} does not exist. Skipping entry.`);
      continue;
    }

    await prisma.reportPersonnel.upsert({
      where: {
        orderId_reportName_role_userId: {
          orderId: entry.orderId,
          reportName: "in_process_inspection",
          role: "inspected_by",
          userId,
        },
      },
      update: {},
      create: {
        orderId: entry.orderId,
        reportName: "in_process_inspection",
        role: "inspected_by",
        userId,
      },
    });
  }

  // Then delete the old rows:
  const deleted = await prisma.inspectionMeasurement.deleteMany({
    where: { measurementKey: "finalInspectionInspectedBy" },
  });
  console.log(`Deleted ${deleted.count} old rows.`);
  console.log("Migration complete!");
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
