import { z } from "zod";
import { REPORTS } from "../../domain/permission/permissions";

export const reportNameParamSchema = z.object({
  orderId: z.string().min(1),
  reportName: z.enum(REPORTS as unknown as [string, ...string[]]),
});
