// Path: server/src/http/validation/media.schema.ts
import { z } from "zod";

export const presignUploadSchema = z.object({
  body: z.object({
    fileName: z.string().min(1),
    contentType: z.string().min(1),
  }),
});

export const confirmUploadSchema = z.object({
  body: z.object({
    objectKey: z.string().min(1),
    mediaType: z.enum(["PHOTO", "VIDEO", "AUDIO", "FILE"]),
  }),
});
