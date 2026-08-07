// src/http/validation/spindle.schema.ts
import { z } from "zod";

export const createSpindleSchema = z.object({
  body: z.object({
    serialNumber: z.string().trim().min(1).max(100),
    make: z.string().trim().min(1).max(100),
    type: z.string().trim().min(1).max(100),
    taperId: z.string().min(1),
    maxRpm: z.string().trim().max(50).optional().nullable(),
  }),
});

export const updateSpindleSchema = z.object({
  body: z.object({
    serialNumber: z.string().trim().min(1).max(100).optional(),
    make: z.string().trim().min(1).max(100).optional(),
    type: z.string().trim().min(1).max(100).optional(),
    taperId: z.string().min(1).optional(),
    maxRpm: z.string().trim().max(50).nullable().optional(),
  }),
});

export const spindleSerialLookupSchema = z.object({
  query: z.object({
    serialNumber: z.string().trim().min(1),
  }),
});

export type CreateSpindleInput = z.infer<typeof createSpindleSchema>["body"];
export type UpdateSpindleInput = z.infer<typeof updateSpindleSchema>["body"];
