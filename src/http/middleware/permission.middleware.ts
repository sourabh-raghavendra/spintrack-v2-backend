// src/http/middleware/permission.middleware.ts
import { Request, Response, NextFunction } from "express";
import { Permission } from "../../domain/permission/permissions";
import { permissionService } from "../../di/container";
import { ForbiddenError, UnauthorizedError } from "../../errors/HttpError";
import { ErrorCodes } from "../../errors/errorCodes";

export function requirePermission(permission: Permission) {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Auth middleware must run before this — req.user must exist
      if (!req.user) {
        throw new UnauthorizedError(
          "Authentication required",
          ErrorCodes.UNAUTHORIZED,
        );
      }

      const { id: userId, isAdmin } = req.user;

      const hasPermission = await permissionService.hasPermission(
        userId,
        isAdmin,
        permission,
      );

      if (!hasPermission) {
        throw new ForbiddenError(
          `Permission denied: ${permission}`,
          ErrorCodes.PERMISSION_DENIED,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
