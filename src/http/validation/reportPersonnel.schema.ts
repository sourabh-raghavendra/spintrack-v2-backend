// Path: server/src/http/validation/reportPersonnel.schema.ts
import { z } from "zod";

export const addPersonnelSchema = z.object({
  body: z.object({
    userId: z.string().min(1),
    role: z.string().min(1), // validated against REPORT_PERSONNEL_ROLES in the service, not here
  }),
});
