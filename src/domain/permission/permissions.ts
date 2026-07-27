// src/domain/permission/permissions.ts
export const Permissions = {
  // ── Users ────────────────────────────────────────────────────────
  USERS_READ: "users:read",
  USERS_CREATE: "users:create",
  USERS_UPDATE: "users:update",
  USERS_DELETE: "users:delete",

  // ── Profile ──────────────────────────────────────────────────────
  PROFILE_READ: "profile:read",
  PROFILE_UPDATE: "profile:update",

  // ── Settings ─────────────────────────────────────────────────────
  SETTINGS_READ: "settings:read",
  SETTINGS_UPDATE: "settings:update",

  // ── Permissions ──────────────────────────────────────────────────
  PERMISSIONS_READ: "permissions:read",
  PERMISSIONS_ASSIGN: "permissions:assign",
  PERMISSIONS_REVOKE: "permissions:revoke",

  // ── Sessions ─────────────────────────────────────────────────────
  SESSIONS_DELETE: "sessions:delete", // remotely terminate another user's sessions
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];
