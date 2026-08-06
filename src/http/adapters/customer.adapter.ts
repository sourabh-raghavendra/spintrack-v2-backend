// src/http/adapters/customer.adapter.ts
import { Request, Response, NextFunction } from "express";
import { CustomerController } from "../../domain/customer/CustomerController";
import { success } from "../../utils/response";
import { ValidationError, ForbiddenError } from "../../errors/HttpError";
import { z } from "zod";
import { createCustomerSchema, updateCustomerSchema } from "../validation/customer.schema";

const customerIdParamSchema = z.object({
  id: z.string().min(1, "Customer ID is required"),
});

export class CustomerAdapter {
  constructor(private readonly customerController: CustomerController) {}

  private checkZoneAccess(req: Request, customerZone: string): void {
    if (req.user!.isAdmin) return;
    if (customerZone !== req.user!.zone) {
      throw new ForbiddenError("You are not authorized to access this zone");
    }
  }

  list = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize
        ? parseInt(req.query.pageSize as string)
        : 20;
      const zone = req.query.zone as string | undefined;
      const search = req.query.search as string | undefined;

      const allowedZones = req.user!.isAdmin
        ? ["WISC", "SISC", "NISC"]
        : [req.user!.zone];

      if (zone) {
        if (!allowedZones.includes(zone)) {
          throw new ForbiddenError("You are not authorized to view this zone");
        }
      }

      const result = await this.customerController.list({
        page,
        pageSize,
        zone: zone || undefined,
        zones: zone ? undefined : allowedZones,
        search,
      });

      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = customerIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.customerController.getById(parsed.data.id);
      this.checkZoneAccess(req, result.zone);
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = createCustomerSchema.safeParse({ body: req.body });
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      this.checkZoneAccess(req, parsed.data.body.zone);
      const result = await this.customerController.create(parsed.data.body);
      res.status(201).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsedParams = customerIdParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      const parsedBody = updateCustomerSchema.safeParse({ body: req.body });
      if (!parsedBody.success) {
        return next(new ValidationError(parsedBody.error.issues[0].message));
      }
      
      const existing = await this.customerController.getById(parsedParams.data.id);
      this.checkZoneAccess(req, existing.zone);
      if (parsedBody.data.body.zone) {
        this.checkZoneAccess(req, parsedBody.data.body.zone);
      }

      const result = await this.customerController.update(
        parsedParams.data.id,
        parsedBody.data.body,
      );
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  deactivate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = customerIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const existing = await this.customerController.getById(parsed.data.id);
      this.checkZoneAccess(req, existing.zone);
      await this.customerController.deactivate(parsed.data.id);
      res.status(200).json(success(null));
    } catch (error) {
      next(error);
    }
  };

  restore = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = customerIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const existing = await this.customerController.getById(parsed.data.id);
      this.checkZoneAccess(req, existing.zone);
      await this.customerController.restore(parsed.data.id);
      res.status(200).json(success(null));
    } catch (error) {
      next(error);
    }
  };
}
