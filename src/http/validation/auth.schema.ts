// src/http/validation/auth.schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    employeeCode: z.string().min(1, "Employee code is required"),
    password: z.string().min(1, "Password is required"),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>["body"];
