// src/http/validation/portalAuth.schema.ts
import { z } from "zod";

export const portalLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, "Password is required"),
});
