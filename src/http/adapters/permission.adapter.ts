// src/http/adapters/permission.adapter.ts
import { Request, Response, NextFunction } from "express";
import { PermissionController } from "../../domain/permission/PermissionController";
import { Permission } from "../../domain/permission/permissions";
import { success } from "../../utils/response";
import { ValidationError } from "../../errors/HttpError";
import { z } from "zod";

const assignRevokeSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  permissionKey: z.string().min(1, "permissionKey is required"),
});

const getUserPermissionsSchema = z.object({
  userId: z.string().min(1, "userId is required"),
});

export class PermissionAdapter {
  constructor(private readonly permissionController: PermissionController) {}

  // ── Get all permissions in the system ─────────────────────────────
  getAllPermissions = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await this.permissionController.getAllPermissions();
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  // ── Get permissions for a specific user ───────────────────────────
  getUserPermissions = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = getUserPermissionsSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.permissionController.getUserPermissions(
        parsed.data,
      );
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  // ── Assign a permission to a user ─────────────────────────────────
  assignPermission = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = assignRevokeSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      await this.permissionController.assignPermission({
        userId: parsed.data.userId,
        permissionKey: parsed.data.permissionKey as Permission,
      });
      res.status(200).json(success(null));
    } catch (error) {
      next(error);
    }
  };

  // ── Revoke a permission from a user ──────────────────────────────
  revokePermission = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = assignRevokeSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      await this.permissionController.revokePermission({
        userId: parsed.data.userId,
        permissionKey: parsed.data.permissionKey as Permission,
      });
      res.status(200).json(success(null));
    } catch (error) {
      next(error);
    }
  };
}
