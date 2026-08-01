// src/http/validation/taper.schema.ts
import { z } from "zod";

export const createTaperSchema = z.object({
  body: z.object({
    taperType: z.string().trim().min(1).max(100),
  }),
});

export const updateTaperSchema = z.object({
  body: z.object({
    taperType: z.string().trim().min(1).max(100),
  }),
});

export const createTaperSpecSchema = z.object({
  body: z.object({
    specKey: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .regex(/^[a-zA-Z0-9_]+$/, "specKey must be alphanumeric/underscore only"),
    label: z.string().trim().min(1).max(255),
    min: z.number().default(0),
    max: z.number().default(0),
    unit: z.string().trim().max(50).default(""),
    include: z.boolean().default(false),
  }),
});

export const updateTaperSpecSchema = z.object({
  body: z.object({
    label: z.string().trim().min(1).max(255).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    unit: z.string().trim().max(50).optional(),
    include: z.boolean().optional(),
  }),
});

export type CreateTaperInput = z.infer<typeof createTaperSchema>["body"];
export type UpdateTaperInput = z.infer<typeof updateTaperSchema>["body"];
export type CreateTaperSpecInput = z.infer<typeof createTaperSpecSchema>["body"];
export type UpdateTaperSpecInput = z.infer<typeof updateTaperSpecSchema>["body"];
