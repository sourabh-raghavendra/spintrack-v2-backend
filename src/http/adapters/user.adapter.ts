// src/http/adapters/user.adapter.ts
import { Request, Response, NextFunction } from "express";
import { UserController } from "../../domain/user/UserController";
import { success } from "../../utils/response";
import { ValidationError } from "../../errors/HttpError";
import { Zone, UserType, Department } from "../../generated/prisma/client";
import {
  updateMeSchema,
  changePasswordSchema,
  updateUserSchema,
  userIdParamSchema,
} from "../validation/user.schema";

export class UserAdapter {
  constructor(private readonly userController: UserController) {}

  getMe = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.userController.getById(req.user!.id);
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  updateMe = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = updateMeSchema.safeParse({ body: req.body });
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.userController.updateMe(
        req.user!.id,
        parsed.data.body,
      );
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = changePasswordSchema.safeParse({ body: req.body });
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      await this.userController.changePassword(req.user!.id, parsed.data.body);
      res.status(200).json(success(null));
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
      const parsed = userIdParamSchema.safeParse({ params: req.params });
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.userController.getById(parsed.data.params.id);
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const sortBy = (req.query.sortBy as string) ?? "createdAt";
      const sortOrder = (req.query.sortOrder as "asc" | "desc") ?? "desc";

      const filters = {
        isActive:
          req.query.isActive !== undefined
            ? req.query.isActive === "true"
            : undefined,
        isAdmin:
          req.query.isAdmin !== undefined
            ? req.query.isAdmin === "true"
            : undefined,
        email: req.query.email as string | undefined,
        employeeCode: req.query.employeeCode as string | undefined,
        zone: req.query.zone as Zone | undefined,
        userType: req.query.userType as UserType | undefined,
        department: req.query.department as Department | undefined,
      };

      const result = await this.userController.getAll(
        { page, limit, sortBy, sortOrder },
        filters,
      );
      res.status(200).json(success(result));
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
      const parsed = updateUserSchema.safeParse({
        body: req.body,
        params: req.params,
      });
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.userController.update(
        parsed.data.params.id,
        parsed.data.body,
      );
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  softDelete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = userIdParamSchema.safeParse({ params: req.params });
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      await this.userController.softDelete(parsed.data.params.id);
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
      const parsed = userIdParamSchema.safeParse({ params: req.params });
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      await this.userController.restore(parsed.data.params.id);
      res.status(200).json(success(null));
    } catch (error) {
      next(error);
    }
  };
}
