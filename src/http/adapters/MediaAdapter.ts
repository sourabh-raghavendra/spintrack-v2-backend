// Path: server/src/http/adapters/MediaAdapter.ts
import { Request, Response, NextFunction } from "express";
import { MediaController } from "../../domain/media/MediaController";
import { success } from "../../utils/response";
import { ValidationError } from "../../errors/HttpError";
import { presignUploadSchema, confirmUploadSchema } from "../validation/media.schema";
import { REPORTS } from "../../domain/permission/permissions";
import { z } from "zod";

const paramsSchema = z.object({
  orderId: z.string().min(1),
  reportName: z.enum(REPORTS as unknown as [string, ...string[]]),
});

const orderParamsSchema = z.object({
  orderId: z.string().min(1),
});

const mediaIdSchema = z.object({
  id: z.string().min(1),
});

export class MediaAdapter {
  constructor(private readonly controller: MediaController) {}

  presign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedParams = paramsSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      const parsedBody = presignUploadSchema.safeParse(req);
      if (!parsedBody.success) {
        return next(new ValidationError(parsedBody.error.issues[0].message));
      }
      const result = await this.controller.getPresignedUpload(
        parsedParams.data.orderId,
        parsedParams.data.reportName,
        parsedBody.data.body.fileName,
        parsedBody.data.body.contentType
      );
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  confirm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedParams = paramsSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      const parsedBody = confirmUploadSchema.safeParse(req);
      if (!parsedBody.success) {
        return next(new ValidationError(parsedBody.error.issues[0].message));
      }
      const result = await this.controller.confirmUpload(
        parsedParams.data.orderId,
        parsedParams.data.reportName,
        parsedBody.data.body.objectKey,
        parsedBody.data.body.mediaType,
        req.user!.id
      );
      res.status(201).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = paramsSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.controller.listForReport(
        parsed.data.orderId,
        parsed.data.reportName
      );
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  listAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = orderParamsSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.controller.listForOrder(parsed.data.orderId);
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedParams = mediaIdSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      await this.controller.deleteMedia(parsedParams.data.id);
      res.status(200).json(success({ success: true }));
    } catch (error) {
      next(error);
    }
  };
}
