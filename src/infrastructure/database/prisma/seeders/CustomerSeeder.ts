// src/infrastructure/database/prisma/seeders/CustomerSeeder.ts
//
// Seeds Customer from a JSON export of the legacy Mongo `customers`
// collection. Idempotent — safe to re-run.
//
// IMPORTANT: legacy data uses "WIC"/"SIC"/"NIC" for center; the new Zone
// enum uses "WISC"/"SISC"/"NISC". CENTER_TO_ZONE below maps between them.
// Any record with a center value not in this map is skipped and logged,
// not silently defaulted — a wrong zone assignment for a real customer
// is worse than a customer missing from the first seed pass.
//
// orderList and customerContact (the legacy email-array field) are
// intentionally ignored here — orders don't exist yet at this step, and
// customerContact's replacement (CustomerContact, with real login) is
// built in a later step, not seeded from this array.
//
// Source data file: prisma/seeders/data/customers.json

import fs from "node:fs";
import path from "node:path";
import prisma from "../../../../config/database";
import logger from "../../../../observability/logger";

const CENTER_TO_ZONE: Record<string, "WISC" | "SISC" | "NISC"> = {
  WIC: "WISC",
  SIC: "SISC",
  NIC: "NISC",
};

interface MongoCustomerDoc {
  customerId: string;
  customerName: string;
  customerState: string;
  customerCity: string;
  postalCode?: string | number;
  center?: string;
}

const DATA_PATH = path.join(
  __dirname,
  "../../../../../prisma/seeders/data/customers.json",
);

export async function seedCustomers(): Promise<void> {
  logger.info("Seeding customers...");

  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  const customers: MongoCustomerDoc[] = JSON.parse(raw);

  let created = 0;
  let skipped = 0;
  const skippedDetails: string[] = [];

  for (const doc of customers) {
    const zone = doc.center ? CENTER_TO_ZONE[doc.center] : undefined;

    if (!zone) {
      skipped++;
      skippedDetails.push(
        `${doc.customerId} (${doc.customerName}) — unrecognized center: "${doc.center}"`,
      );
      continue;
    }

    if (!doc.customerId || !doc.customerName) {
      skipped++;
      skippedDetails.push(
        `Record missing customerId or customerName: ${JSON.stringify(doc)}`,
      );
      continue;
    }

    try {
      await prisma.customer.upsert({
        where: { customerId: doc.customerId },
        update: {}, // never overwrite on re-seed
        create: {
          customerId: doc.customerId,
          customerName: doc.customerName.trim(),
          customerState: doc.customerState?.trim() ?? "",
          customerCity: doc.customerCity?.trim() ?? "",
          postalCode:
            doc.postalCode === undefined || doc.postalCode === null
              ? null
              : String(doc.postalCode),
          zone,
        },
      });
      created++;
    } catch (err) {
      // Most likely a customerName uniqueness collision — log and move on
      // rather than aborting the whole batch on one bad record.
      skipped++;
      skippedDetails.push(
        `${doc.customerId} (${doc.customerName}) — insert failed: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
  }

  logger.info(
    `Customers seeded — ${created} created/confirmed, ${skipped} skipped`,
  );
  if (skippedDetails.length > 0) {
    logger.warn({ skippedDetails }, "Some customer records were skipped");
  }
}
