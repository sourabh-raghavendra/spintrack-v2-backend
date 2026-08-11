// Path: server/src/http/validation/note.schema.ts
import { z } from "zod";

export const createNoteSchema = z.object({
  body: z.object({
    content: z.string().trim().min(1).max(5000),
  }),
});

export const updateNoteSchema = z.object({
  body: z.object({
    content: z.string().trim().min(1).max(5000),
  }),
});
