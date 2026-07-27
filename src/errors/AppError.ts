// src/errors/AppError.ts
import { ErrorCode, ErrorCodes } from "./errorCodes";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCode;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    errorCode: ErrorCode = ErrorCodes.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace in V8 (Node.js)
    Error.captureStackTrace(this, this.constructor);

    // Fix instanceof checks when extending built-in classes in TypeScript
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
