import { z } from "zod";

export const createCustomerContactSchema = z.object({
  customerId: z.string().min(1),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
  name: z.string().trim().max(255).optional(),
  phone: z.string().trim().max(50).optional(),
});

export const updateCustomerContactSchema = z.object({
  email: z.string().trim().toLowerCase().email().optional(),
  name: z.string().trim().max(255).nullable().optional(),
  phone: z.string().trim().max(50).nullable().optional(),
});
