// src/config/constants.ts
export const COOKIE_NAMES = {
  REFRESH_TOKEN: "refreshToken",
} as const;

export const CACHE_KEYS = {
  PERMISSIONS: "permissions:",
  SETTINGS: "settings:",
  SESSION: "session:",
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const API = {
  PREFIX: "/api/v1",
  ADMIN_PREFIX: "/admin",
} as const;

export const BCRYPT_ROUNDS = 12;

export const TOKEN_LENGTHS = {
  PASSWORD_RESET: 64,
  EMAIL_VERIFICATION: 64,
} as const;
