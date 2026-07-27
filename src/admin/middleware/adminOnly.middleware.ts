// src/admin/middleware/adminOnly.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../../errors/HttpError";
import { ErrorCodes } from "../../errors/errorCodes";

export function adminOnlyMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    throw new UnauthorizedError(
      "Authentication required",
      ErrorCodes.UNAUTHORIZED,
    );
  }

  if (!req.user.isAdmin) {
    throw new ForbiddenError("Admin access required", ErrorCodes.ADMIN_ONLY);
  }

  next();
}
