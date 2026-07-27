// src/infrastructure/database/prisma/seeders/PermissionSeeder.ts
import prisma from "../../../../config/database";
import { Permissions } from "../../../../domain/permission/permissions";
import logger from "../../../../observability/logger";

const permissionDescriptions: Record<string, string> = {
  // Users
  [Permissions.USERS_READ]: "Read and list users",
  [Permissions.USERS_CREATE]: "Create new users",
  [Permissions.USERS_UPDATE]: "Update existing users",
  [Permissions.USERS_DELETE]: "Delete users",

  // Profile
  [Permissions.PROFILE_READ]: "Read user profiles",
  [Permissions.PROFILE_UPDATE]: "Update user profiles",

  // Settings
  [Permissions.SETTINGS_READ]: "Read application settings",
  [Permissions.SETTINGS_UPDATE]: "Update application settings",

  // Permissions
  [Permissions.PERMISSIONS_READ]: "View permissions",
  [Permissions.PERMISSIONS_ASSIGN]: "Assign permissions to users",
  [Permissions.PERMISSIONS_REVOKE]: "Revoke permissions from users",

  // Sessions
  [Permissions.SESSIONS_DELETE]: "Remotely terminate another user's sessions",
};

export async function seedPermissions(): Promise<void> {
  logger.info("Seeding permissions...");

  const permissionKeys = Object.values(Permissions);

  for (const key of permissionKeys) {
    await prisma.permission.upsert({
      where: { key },
      update: {}, // never overwrite existing
      create: {
        key,
        description: permissionDescriptions[key] ?? null,
      },
    });
  }

  logger.info(`Permissions seeded — ${permissionKeys.length} permissions`);
}
