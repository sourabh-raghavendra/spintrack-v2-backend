// Path: server/src/http/adapters/warranty.adapter.ts
import { Request, Response, NextFunction } from "express";
import { WarrantyController } from "../../domain/warranty/WarrantyController";
import { success } from "../../utils/response";
import { ValidationError, NotFoundError } from "../../errors/HttpError";
import { z } from "zod";

const paramsSchema = z.object({
  orderId: z.string().min(1),
});

export class WarrantyAdapter {
  constructor(private readonly controller: WarrantyController) {}

  getStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = paramsSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const data = await this.controller.getStatus(parsed.data.orderId);
      res.status(200).json(success(data));
    } catch (error) {
      next(error);
    }
  };

  getCertificate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = paramsSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const pdfBuffer = await this.controller.getCertificate(parsed.data.orderId);
      if (!pdfBuffer) {
        return next(new NotFoundError("Warranty certificate not available until order closure is complete"));
      }
      res.setHeader("Content-Type", "application/pdf");
      res.status(200).send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  };

  getPortalStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = paramsSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const customerId = req.customerAuth!.customerId;
      const data = await this.controller.getPortalStatus(parsed.data.orderId, customerId);
      res.status(200).json(success(data));
    } catch (error) {
      next(error);
    }
  };

  getPortalCertificate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = paramsSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const customerId = req.customerAuth!.customerId;
      const pdfBuffer = await this.controller.getPortalCertificate(parsed.data.orderId, customerId);
      if (!pdfBuffer) {
        return next(new NotFoundError("Warranty certificate not available until order closure is complete"));
      }
      res.setHeader("Content-Type", "application/pdf");
      res.status(200).send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  };
}
