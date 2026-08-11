// Path: server/src/http/adapters/PortalOrderAdapter.ts
import { Request, Response, NextFunction } from "express";
import { PortalOrderController } from "../../domain/portal/PortalOrderController";
import { success } from "../../utils/response";
import { ValidationError } from "../../errors/HttpError";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.string().min(1),
});

export class PortalOrderAdapter {
  constructor(private readonly controller: PortalOrderController) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = req.customerAuth!.customerId;
      const result = await this.controller.listOrders(customerId);
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = paramsSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const customerId = req.customerAuth!.customerId;
      const result = await this.controller.getOrderDetails(parsed.data.id, customerId);
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  getMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = paramsSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const customerId = req.customerAuth!.customerId;
      const result = await this.controller.getOrderMedia(parsed.data.id, customerId);
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  getRemarks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = paramsSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const customerId = req.customerAuth!.customerId;
      const result = await this.controller.getOrderRemarks(parsed.data.id, customerId);
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };
}
