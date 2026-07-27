// src/config/env.ts
import { z } from "zod";

const envSchema = z.object({
  // App
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // JWT
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRY_HOURS: z.coerce.number().default(8),

  // AWS
  AWS_ACCESS_KEY_ID: z.string().min(1, "AWS_ACCESS_KEY_ID is required"),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, "AWS_SECRET_ACCESS_KEY is required"),

  // SMTP
  SMTP_USER: z.string().min(1, "SMTP_USER is required"),
  SMTP_PASS: z.string().min(1, "SMTP_PASS is required"),
  CORS_ORIGIN: z.string().min(1, "CORS_ORIGIN is required").optional(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("❌ Invalid environment variables:");
  result.error.issues.forEach((issue) => {
    console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
  });
  process.exit(1);
}

export const env = result.data;
export type Env = typeof env;
