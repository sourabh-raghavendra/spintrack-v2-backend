// src/http/validation/order.schema.ts
import { z } from "zod";
import { OrderType, Zone } from "../../generated/prisma/client";

export const createOrderSchema = z.object({
  body: z.object({
    rma: z.string().trim().min(1).max(50),
    so: z.string().trim().min(1).max(50),
    jo: z.string().trim().min(1).max(50),
    quotation: z.string().trim().min(1).max(50),
    orderType: z.nativeEnum(OrderType),
    spindleReceivedDate: z.coerce.date(),
    customerId: z.string().min(1, "Customer ID is required"),
    spindleId: z.string().min(1, "Spindle ID is required"),
    customerContactId: z.string().min(1).optional(),
  }),
});

export const updateOrderSchema = z.object({
  body: z.object({
    rma: z.string().trim().min(1).max(50).optional(),
    so: z.string().trim().min(1).max(50).optional(),
    jo: z.string().trim().min(1).max(50).optional(),
    quotation: z.string().trim().min(1).max(50).optional(),
    spindleReceivedDate: z.coerce.date().nullable().optional(),
    customerId: z.string().min(1).optional(),
    spindleId: z.string().min(1).optional(),
    customerContactId: z.string().min(1).nullable().optional(),
  }),
});

export const orderListFiltersSchema = z.object({
  query: z.object({
    orderType: z.nativeEnum(OrderType).optional(),
    orderStage: z.enum(["RECEIVED", "ONGOING", "COMPLETED", "ARCHIVED"]).optional(),
    zone: z.nativeEnum(Zone).optional(),
    search: z.string().trim().optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>["body"];
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>["body"];
