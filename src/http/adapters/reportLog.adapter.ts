import { Request, Response, NextFunction } from "express";
import { OrderReportLogController } from "../../domain/reportLog/OrderReportLogController";
import { success } from "../../utils/response";
import { ValidationError } from "../../errors/HttpError";
import { reportNameParamSchema } from "../validation/reportLog.schema";
import { z } from "zod";

const timelineParamsSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
});

export class OrderReportLogAdapter {
  constructor(private readonly controller: OrderReportLogController) {}

  getTimeline = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = timelineParamsSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.controller.getTimeline(parsed.data.orderId);
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  initiate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = reportNameParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.controller.initiate(
        parsed.data.orderId,
        parsed.data.reportName,
        req.user!.id
      );
      res.status(201).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  close = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = reportNameParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.controller.close(
        parsed.data.orderId,
        parsed.data.reportName,
        req.user!.id
      );
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };
}
