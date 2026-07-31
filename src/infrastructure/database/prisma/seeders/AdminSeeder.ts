// src/infrastructure/database/prisma/seeders/AdminSeeder.ts
//
// Standalone, one-time seed for the initial admin user. NOT part of
// seeders/index.ts — run this manually and separately, exactly once per
// environment. is_admin is seed-only by design (see 1-6.md decisions);
// this script is the only code path that ever sets it to true.
//
// Usage:
//   npx tsx src/infrastructure/database/prisma/seeders/AdminSeeder.ts
//
// Requires these variables in .env:
//   ADMIN_EMPLOYEE_CODE
//   ADMIN_NAME
//   ADMIN_PASSWORD          (temporary — change from within the app after first login)
//   ADMIN_ZONE              (WISC | SISC | NISC)

import "dotenv/config";
import prisma from "../../../../config/database";
import { connectDb, disconnectDb } from "../../../../config/database";
import {
  Zone,
  UserType,
  Department,
} from "../../../../generated/prisma/client";
import bcrypt from "bcryptjs";

export async function seedAdmin(): Promise<void> {
  const employeeCode = process.env.ADMIN_EMPLOYEE_CODE;
  const name = process.env.ADMIN_NAME;
  const password = process.env.ADMIN_PASSWORD;
  const zone = process.env.ADMIN_ZONE as Zone | undefined;

  if (!employeeCode || !name || !password || !zone) {
    throw new Error(
      "Missing one or more required env vars: ADMIN_EMPLOYEE_CODE, ADMIN_NAME, ADMIN_PASSWORD, ADMIN_ZONE",
    );
  }

  if (!Object.values(Zone).includes(zone)) {
    throw new Error(
      `ADMIN_ZONE must be one of: ${Object.values(Zone).join(", ")}`,
    );
  }

  const existing = await prisma.user.findUnique({ where: { employeeCode } });

  if (existing) {
    console.log(
      `Admin with employeeCode "${employeeCode}" already exists — skipping. ` +
        `This script never overwrites an existing user's password.`,
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      employeeCode,
      name,
      password: passwordHash,
      zone,
      userType: UserType.SUPERVISOR,
      department: Department.ADMIN,
      isAdmin: true,
      isActive: true,
    },
  });

  console.log(`Admin user created: ${admin.employeeCode} (${admin.id})`);
  console.log(
    "Reminder: this password is temporary — log in and change it via " +
      "PATCH /users/me/password as soon as possible.",
  );
}

// Runnable standalone — deliberately NOT called from seeders/index.ts.
// `require.main === module` guards this so importing seedAdmin elsewhere
// later doesn't trigger it automatically.
if (require.main === module) {
  (async () => {
    await connectDb();
    try {
      await seedAdmin();
    } finally {
      await disconnectDb();
    }
  })().catch((error) => {
    console.error("Admin seed failed:", error);
    process.exitCode = 1;
  });
}
