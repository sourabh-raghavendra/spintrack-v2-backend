// src/http/adapters/auth.adapter.ts
import { Request, Response, NextFunction } from "express";
import { AuthController } from "../../domain/auth/AuthController";
import { success } from "../../utils/response";
import { ValidationError } from "../../errors/HttpError";
import { loginSchema } from "../validation/auth.schema";

export class AuthAdapter {
  constructor(private readonly authController: AuthController) {}

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = loginSchema.safeParse({ body: req.body });
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.authController.login(parsed.data.body);
      res.status(200).json(
        success({
          accessToken: result.accessToken,
          user: result.user,
          permissions: result.permissions,
        }),
      );
    } catch (error) {
      next(error);
    }
  };

  logout = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      res.status(200).json(success(null));
    } catch (error) {
      next(error);
    }
  };
}
