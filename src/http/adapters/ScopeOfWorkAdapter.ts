import { Request, Response, NextFunction } from "express";
import { ScopeOfWorkController } from "../../domain/scopeOfWork/ScopeOfWorkController";
import { success } from "../../utils/response";
import { ValidationError } from "../../errors/HttpError";
import { z } from "zod";

const listParamsSchema = z.object({
  orderId: z.string().min(1),
});

const searchParamsSchema = z.object({
  q: z.string().default(""),
});

const addBodySchema = z.object({
  statementId: z.string().optional(),
  text: z.string().optional(),
});

const deleteParamsSchema = z.object({
  orderId: z.string().min(1),
  id: z.string().min(1),
});

export class ScopeOfWorkAdapter {
  constructor(private readonly controller: ScopeOfWorkController) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = listParamsSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.controller.listForOrder(parsed.data.orderId);
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = (req.query.q as string) || "";
      const result = await this.controller.searchStatements(query);
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  add = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedParams = listParamsSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      const parsedBody = addBodySchema.safeParse(req.body);
      if (!parsedBody.success) {
        return next(new ValidationError(parsedBody.error.issues[0].message));
      }
      const result = await this.controller.addStatementToOrder(
        parsedParams.data.orderId,
        parsedBody.data,
        req.user!.id
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
      await this.controller.removeFromOrder(parsed.data.id);
      res.status(200).json(success({ success: true }));
    } catch (error) {
      next(error);
    }
  };
}
