// src/http/adapters/taper.adapter.ts
import { Request, Response, NextFunction } from "express";
import { TaperController } from "../../domain/taper/TaperController";
import { success } from "../../utils/response";
import { ValidationError } from "../../errors/HttpError";
import { z } from "zod";
import {
  createTaperSchema,
  updateTaperSchema,
  createTaperSpecSchema,
  updateTaperSpecSchema,
} from "../validation/taper.schema";

const taperIdParamSchema = z.object({
  id: z.string().min(1, "Taper ID is required"),
});

const taperIdSpecKeyParamSchema = z.object({
  id: z.string().min(1, "Taper ID is required"),
  specKey: z.string().min(1, "Spec Key is required"),
});

export class TaperAdapter {
  constructor(private readonly taperController: TaperController) {}

  list = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.taperController.list();
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
      const parsed = taperIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.taperController.getById(parsed.data.id);
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
      const parsed = createTaperSchema.safeParse({ body: req.body });
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.taperController.create(parsed.data.body);
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
      const parsedParams = taperIdParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      const parsedBody = updateTaperSchema.safeParse({ body: req.body });
      if (!parsedBody.success) {
        return next(new ValidationError(parsedBody.error.issues[0].message));
      }
      const result = await this.taperController.update(
        parsedParams.data.id,
        parsedBody.data.body,
      );
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
      const parsed = taperIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      await this.taperController.remove(parsed.data.id);
      res.status(200).json(success(null));
    } catch (error) {
      next(error);
    }
  };

  // ── Spec Operations ────────────────────────────────────────────────
  addSpec = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsedParams = taperIdParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      const parsedBody = createTaperSpecSchema.safeParse({ body: req.body });
      if (!parsedBody.success) {
        return next(new ValidationError(parsedBody.error.issues[0].message));
      }
      const result = await this.taperController.addSpec(
        parsedParams.data.id,
        parsedBody.data.body,
      );
      res.status(201).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  updateSpec = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsedParams = taperIdSpecKeyParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      const parsedBody = updateTaperSpecSchema.safeParse({ body: req.body });
      if (!parsedBody.success) {
        return next(new ValidationError(parsedBody.error.issues[0].message));
      }
      const result = await this.taperController.updateSpec(
        parsedParams.data.id,
        parsedParams.data.specKey,
        parsedBody.data.body,
      );
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  removeSpec = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsedParams = taperIdSpecKeyParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      await this.taperController.removeSpec(
        parsedParams.data.id,
        parsedParams.data.specKey,
      );
      res.status(200).json(success(null));
    } catch (error) {
      next(error);
    }
  };
}
