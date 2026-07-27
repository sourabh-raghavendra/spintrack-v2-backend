// src/types/enums.ts
export enum UserType {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum TokenType {
  PASSWORD_RESET = "PASSWORD_RESET",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

export enum JobName {
  EMAIL = "EMAIL",
  SESSION_CLEANUP = "SESSION_CLEANUP",
  SOFT_DELETE_PURGE = "SOFT_DELETE_PURGE",
}
