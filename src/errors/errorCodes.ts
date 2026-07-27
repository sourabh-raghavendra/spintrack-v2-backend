// src/errors/errorCodes.ts
// Every error in the system has a machine-readable code — a constant string that the client can use to handle errors programmatically. Grouped by domain so it's easy to find and extend.

export const ErrorCodes = {
  // ── General ─────────────────────────────────────────────────
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  BAD_REQUEST: "BAD_REQUEST",

  // ── Auth ────────────────────────────────────────────────────
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  TOKEN_INVALID: "TOKEN_INVALID",
  UNAUTHORIZED: "UNAUTHORIZED",

  // Auth providers
  PROVIDER_ALREADY_LINKED: "PROVIDER_ALREADY_LINKED",
  PROVIDER_NOT_FOUND: "PROVIDER_NOT_FOUND",
  PASSWORD_REQUIRED: "PASSWORD_REQUIRED", // when local user has no password set

  // ── Permissions ─────────────────────────────────────────────
  PERMISSION_DENIED: "PERMISSION_DENIED",
  ADMIN_ONLY: "ADMIN_ONLY",

  // ── User ────────────────────────────────────────────────────
  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  USER_INACTIVE: "USER_INACTIVE",

  // ── Session ─────────────────────────────────────────────────
  SESSION_NOT_FOUND: "SESSION_NOT_FOUND",
  SESSION_LIMIT_REACHED: "SESSION_LIMIT_REACHED",
  SESSION_EXPIRED: "SESSION_EXPIRED",

  // ── Rate Limiting ────────────────────────────────────────────
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",

  // ── File Upload ──────────────────────────────────────────────
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  FILE_TYPE_NOT_ALLOWED: "FILE_TYPE_NOT_ALLOWED",

  // ── Maintenance ──────────────────────────────────────────────
  MAINTENANCE_MODE: "MAINTENANCE_MODE",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
