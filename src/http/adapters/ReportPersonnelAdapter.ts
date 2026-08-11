// Path: server/src/http/adapters/ReportPersonnelAdapter.ts
import { Request, Response, NextFunction } from "express";
import { ReportPersonnelController } from "../../domain/reportPersonnel/ReportPersonnelController";
import { success } from "../../utils/response";
import { ValidationError } from "../../errors/HttpError";
import { addPersonnelSchema } from "../validation/reportPersonnel.schema";
import { REPORTS } from "../../domain/permission/permissions";
import { z } from "zod";

const paramsSchema = z.object({
  orderId: z.string().min(1),
  reportName: z.enum(REPORTS as unknown as [string, ...string[]]),
});

const deleteParamsSchema = z.object({
  orderId: z.string().min(1),
  reportName: z.enum(REPORTS as unknown as [string, ...string[]]),
  id: z.string().min(1),
});

export class ReportPersonnelAdapter {
  constructor(private readonly controller: ReportPersonnelController) {}

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

  add = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedParams = paramsSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      const parsedBody = addPersonnelSchema.safeParse(req);
      if (!parsedBody.success) {
        return next(new ValidationError(parsedBody.error.issues[0].message));
      }
      const result = await this.controller.addPersonnel(
        parsedParams.data.orderId,
        parsedParams.data.reportName,
        parsedBody.data.body.userId,
        parsedBody.data.body.role
      );
      res.status(201).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = deleteParamsSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      await this.controller.removePersonnel(parsed.data.id);
      res.status(200).json(success({ success: true }));
    } catch (error) {
      next(error);
    }
  };

  getInspectionHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.userId;
      if (!userId) {
        return next(new ValidationError("User ID is required"));
      }
      const result = await this.controller.getInspectionHistoryForUser(userId);
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };
}
