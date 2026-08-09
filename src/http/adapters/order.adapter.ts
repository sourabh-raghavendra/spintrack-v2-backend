// src/http/adapters/order.adapter.ts
import { Request, Response, NextFunction } from "express";
import { OrderController } from "../../domain/order/OrderController";
import { success } from "../../utils/response";
import { ValidationError, ForbiddenError } from "../../errors/HttpError";
import { z } from "zod";
import {
  createOrderSchema,
  updateOrderSchema,
  orderListFiltersSchema,
} from "../validation/order.schema";
import { generateQrJpeg } from "../../utils/qrCode";

const orderIdParamSchema = z.object({
  id: z.string().min(1, "Order ID is required"),
});

export class OrderAdapter {
  constructor(private readonly orderController: OrderController) {}

  getQrCode = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = orderIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const order = await this.orderController.getById(parsed.data.id);
      const buffer = await generateQrJpeg(order.jo);
      res.setHeader("Content-Type", "image/jpeg");
      res.status(200).send(buffer);
    } catch (error) {
      next(error);
    }
  };

  private checkAdmin(req: Request): void {
    if (!req.user || !req.user.isAdmin) {
      throw new ForbiddenError("Admin access required");
    }
  }

  list = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsedQuery = orderListFiltersSchema.safeParse({ query: req.query });
      if (!parsedQuery.success) {
        return next(new ValidationError(parsedQuery.error.issues[0].message));
      }

      const result = await this.orderController.list(
        parsedQuery.data.query,
        req.user!,
      );
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
      const parsed = orderIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.orderController.getById(parsed.data.id);
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
      const parsed = createOrderSchema.safeParse({ body: req.body });
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.orderController.create(
        parsed.data.body,
        req.user!,
      );
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
      const parsedParams = orderIdParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      const parsedBody = updateOrderSchema.safeParse({ body: req.body });
      if (!parsedBody.success) {
        return next(new ValidationError(parsedBody.error.issues[0].message));
      }
      const result = await this.orderController.update(
        parsedParams.data.id,
        parsedBody.data.body,
        req.user!,
      );
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  archive = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      this.checkAdmin(req);
      const parsed = orderIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.orderController.archive(parsed.data.id);
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  unarchive = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      this.checkAdmin(req);
      const parsed = orderIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.orderController.unarchive(parsed.data.id);
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  remove = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      this.checkAdmin(req);
      const parsed = orderIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      await this.orderController.remove(parsed.data.id);
      res.status(200).json(success(null));
    } catch (error) {
      next(error);
    }
  };
}
