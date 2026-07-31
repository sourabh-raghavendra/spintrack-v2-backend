// src/infrastructure/database/prisma/seeders/TaperSeeder.ts
//
// Seeds Taper + TaperSpec from a JSON export of the legacy Mongo `tapers`
// collection. Idempotent — safe to re-run.
//
// specKey is kept identical to the original Mongo field name
// (afterGrindingROOfShaft, goNoGo, ...) rather than remapped to a new
// naming convention — no benefit to renaming a stable identifier.
//
// Source data file: prisma/seeders/data/tapers.json
// (raw Mongo export — _id/$oid/createdAt/$date/__v fields are ignored)

import fs from "node:fs";
import path from "node:path";
import prisma from "../../../../config/database";
import logger from "../../../../observability/logger";

interface MongoTaperSpecField {
  label: string;
  min: number;
  max: number;
  unit: string;
  include: boolean;
}

interface MongoTaperDoc {
  taperType: string;
  taperSpecs: Record<string, MongoTaperSpecField>;
}

const DATA_PATH = path.join(
  __dirname,
  "../../../../../prisma/seeders/data/tapers.json",
);

export async function seedTapers(): Promise<void> {
  logger.info("Seeding tapers...");

  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  const tapers: MongoTaperDoc[] = JSON.parse(raw);

  let taperCount = 0;
  let specCount = 0;

  for (const doc of tapers) {
    const taper = await prisma.taper.upsert({
      where: { taperType: doc.taperType },
      update: {}, // never overwrite on re-seed
      create: { taperType: doc.taperType },
    });
    taperCount++;

    for (const [specKey, field] of Object.entries(doc.taperSpecs)) {
      if (!field) continue; // guard against a wholly null/undefined spec entry

      await prisma.taperSpec.upsert({
        where: {
          taperId_specKey: {
            taperId: taper.id,
            specKey,
          },
        },
        update: {}, // never overwrite on re-seed
        create: {
          taperId: taper.id,
          specKey,
          label: field.label ?? specKey, // fall back to the key itself if label is missing
          min: field.min ?? 0,
          max: field.max ?? 0,
          unit: field.unit ?? "",
          include: field.include ?? false,
        },
      });
      specCount++;
    }
  }

  logger.info(
    `Tapers seeded — ${taperCount} taper types, ${specCount} spec rows`,
  );
}
