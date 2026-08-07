// src/http/adapters/spindle.adapter.ts
import { Request, Response, NextFunction } from "express";
import { SpindleController } from "../../domain/spindle/SpindleController";
import { success } from "../../utils/response";
import { ValidationError } from "../../errors/HttpError";
import { z } from "zod";
import {
  createSpindleSchema,
  updateSpindleSchema,
  spindleSerialLookupSchema,
} from "../validation/spindle.schema";

const spindleIdParamSchema = z.object({
  id: z.string().min(1, "Spindle ID is required"),
});

export class SpindleAdapter {
  constructor(private readonly spindleController: SpindleController) {}

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
      const search = req.query.search as string | undefined;

      const result = await this.spindleController.list({
        page,
        pageSize,
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
      const parsed = spindleIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.spindleController.getById(parsed.data.id);
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  lookupBySerialNumber = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = spindleSerialLookupSchema.safeParse({ query: req.query });
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.spindleController.lookupBySerialNumber(
        parsed.data.query.serialNumber,
      );
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
      const parsed = createSpindleSchema.safeParse({ body: req.body });
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.spindleController.create({
        ...parsed.data.body,
        createdById: req.user!.id,
      });
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
      const parsedParams = spindleIdParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      const parsedBody = updateSpindleSchema.safeParse({ body: req.body });
      if (!parsedBody.success) {
        return next(new ValidationError(parsedBody.error.issues[0].message));
      }
      const result = await this.spindleController.update(
        parsedParams.data.id,
        parsedBody.data.body,
      );
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };
}
