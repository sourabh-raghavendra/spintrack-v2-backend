// src/http/middleware/customerAuth.middleware.ts
import { Request, Response, NextFunction } from "express";
import { verifyCustomerToken } from "../../utils/customerJwt";
import { UnauthorizedError } from "../../errors/HttpError";
import { ErrorCodes } from "../../errors/errorCodes";
import { customerContactRepository } from "../../di/container";

export async function customerAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Authentication required", ErrorCodes.UNAUTHORIZED);
    }

    const token = authHeader.split(" ")[1];
    let payload;
    try {
      payload = verifyCustomerToken(token);
    } catch (err) {
      throw new UnauthorizedError("Invalid or expired portal token", ErrorCodes.UNAUTHORIZED);
    }

    const contact = await customerContactRepository.findById(payload.contactId);
    if (!contact || !contact.isActive) {
      throw new UnauthorizedError("Account not found or deactivated", ErrorCodes.UNAUTHORIZED);
    }

    req.customerAuth = {
      contactId: payload.contactId,
      customerId: payload.customerId,
    };

    next();
  } catch (error) {
    next(error);
  }
}
