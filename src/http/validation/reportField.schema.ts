import { z } from "zod";
import { REPORTS } from "../../domain/permission/permissions";

export const reportFieldParamSchema = z.object({
  orderId: z.string().min(1),
  reportName: z.enum(REPORTS as unknown as [string, ...string[]]),
});

export const writeReportFieldsSchema = z.object({
  body: z.object({
    recordKey: z.record(z.string(), z.any()).optional(), // e.g. { position: "FRONT_1" } or { measurementKey: "shaft_od_front_size" }
    fields: z.record(z.string(), z.any()), // whitelisted and checked at service layer
  }),
});

export const testingBalancingTrialParamSchema = z.object({
  orderId: z.string().min(1),
});

export const testingBalancingTrialUpdateParamSchema = z.object({
  orderId: z.string().min(1),
  trialId: z.string().min(1),
});

export const createTestingBalancingTrialSchema = z.object({
  body: z.object({
    trialRunNumber: z.string().optional(),
    rpm: z.string().optional(),
    temp: z.string().optional(),
    vibrationFront: z.string().optional(),
    vibrationRear: z.string().optional(),
    amp: z.string().optional(),
    voltage: z.string().optional(),
    time: z.string().optional(),
  }),
});

export const updateTestingBalancingTrialSchema = createTestingBalancingTrialSchema;
