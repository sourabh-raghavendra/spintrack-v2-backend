// Path: server/src/http/validation/analytics.schema.ts
import { z } from "zod";

export const analyticsRangeSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});
