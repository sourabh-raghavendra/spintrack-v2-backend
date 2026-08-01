// src/http/validation/customer.schema.ts
import { z } from "zod";
import { Zone } from "../../generated/prisma/client";

export const createCustomerSchema = z.object({
  body: z.object({
    customerId: z.string().trim().min(1).max(50),
    customerName: z.string().trim().min(1).max(255),
    customerState: z.string().trim().min(1).max(100),
    customerCity: z.string().trim().min(1).max(100),
    postalCode: z.string().trim().max(20).nullable().optional(),
    zone: z.nativeEnum(Zone),
  }),
});

export const updateCustomerSchema = z.object({
  body: z.object({
    customerName: z.string().trim().min(1).max(255).optional(),
    customerState: z.string().trim().min(1).max(100).optional(),
    customerCity: z.string().trim().min(1).max(100).optional(),
    postalCode: z.string().trim().max(20).nullable().optional(),
    zone: z.nativeEnum(Zone).optional(),
  }),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>["body"];
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>["body"];
