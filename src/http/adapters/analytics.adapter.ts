// Path: server/src/http/adapters/analytics.adapter.ts
import { Request, Response, NextFunction } from "express";
import { AnalyticsController } from "../../domain/analytics/AnalyticsController";
import { success } from "../../utils/response";
import { ValidationError } from "../../errors/HttpError";
import { analyticsRangeSchema } from "../validation/analytics.schema";

export class AnalyticsAdapter {
  constructor(private readonly controller: AnalyticsController) {}

  private parseRange(req: Request) {
    const parsed = analyticsRangeSchema.safeParse(req.query);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues[0].message);
    }
    return parsed.data;
  }

  technicianActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const range = this.parseRange(req);
      const data = await this.controller.technicianActivity(range);
      res.status(200).json(success(data));
    } catch (error) {
      next(error);
    }
  };

  customerWiseRepairs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const range = this.parseRange(req);
      const data = await this.controller.customerWiseRepairs(range);
      res.status(200).json(success(data));
    } catch (error) {
      next(error);
    }
  };

  top10Customers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const range = this.parseRange(req);
      const data = await this.controller.top10Customers(range);
      res.status(200).json(success(data));
    } catch (error) {
      next(error);
    }
  };

  machineWiseSpindles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const range = this.parseRange(req);
      const data = await this.controller.machineWiseSpindles(range);
      res.status(200).json(success(data));
    } catch (error) {
      next(error);
    }
  };

  orderTypeBreakdown = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const range = this.parseRange(req);
      const data = await this.controller.orderTypeBreakdown(range);
      res.status(200).json(success(data));
    } catch (error) {
      next(error);
    }
  };

  spindleMakeWiseRepairs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const range = this.parseRange(req);
      const data = await this.controller.spindleMakeWiseRepairs(range);
      res.status(200).json(success(data));
    } catch (error) {
      next(error);
    }
  };

  taperWiseReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const range = this.parseRange(req);
      const data = await this.controller.taperWiseReport(range);
      res.status(200).json(success(data));
    } catch (error) {
      next(error);
    }
  };

  underWarrantyRepairs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const range = this.parseRange(req);
      const data = await this.controller.underWarrantyRepairs(range);
      res.status(200).json(success(data));
    } catch (error) {
      next(error);
    }
  };
}
