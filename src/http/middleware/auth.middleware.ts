// src/http/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../utils/jwt";
import { UnauthorizedError } from "../../errors/HttpError";
import { ErrorCodes } from "../../errors/errorCodes";
import { userRepository, permissionService } from "../../di/container";

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "Authentication required",
        ErrorCodes.UNAUTHORIZED,
      );
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    const user = await userRepository.findById(payload.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError(
        "Account not found or deactivated",
        ErrorCodes.UNAUTHORIZED,
      );
    }

    const permissions = await permissionService.getUserPermissions(user.id);

    req.user = {
      id: user.id,
      name: user.name,
      employeeCode: user.employeeCode,
      email: user.email,
      isAdmin: user.isAdmin,
      zone: user.zone,
      userType: user.userType,
      department: user.department,
      permissions,
    };

    next();
  } catch (error) {
    next(error);
  }
}
