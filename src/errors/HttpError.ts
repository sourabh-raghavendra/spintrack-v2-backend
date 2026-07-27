// src/errors/HttpError.ts
import { AppError } from "./AppError";
import { ErrorCode, ErrorCodes } from "./errorCodes";

export class BadRequestError extends AppError {
  constructor(
    message: string = "Bad request",
    errorCode: ErrorCode = ErrorCodes.BAD_REQUEST,
  ) {
    super(message, 400, errorCode);
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    message: string = "Unauthorized",
    errorCode: ErrorCode = ErrorCodes.UNAUTHORIZED,
  ) {
    super(message, 401, errorCode);
  }
}

export class ForbiddenError extends AppError {
  constructor(
    message: string = "Forbidden",
    errorCode: ErrorCode = ErrorCodes.PERMISSION_DENIED,
  ) {
    super(message, 403, errorCode);
  }
}

export class NotFoundError extends AppError {
  constructor(
    message: string = "Not found",
    errorCode: ErrorCode = ErrorCodes.NOT_FOUND,
  ) {
    super(message, 404, errorCode);
  }
}

export class ConflictError extends AppError {
  constructor(
    message: string = "Conflict",
    errorCode: ErrorCode = ErrorCodes.USER_ALREADY_EXISTS,
  ) {
    super(message, 409, errorCode);
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string = "Validation failed",
    errorCode: ErrorCode = ErrorCodes.VALIDATION_ERROR,
  ) {
    super(message, 422, errorCode);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(
    message: string = "Too many requests",
    errorCode: ErrorCode = ErrorCodes.TOO_MANY_REQUESTS,
  ) {
    super(message, 429, errorCode);
  }
}

export class InternalServerError extends AppError {
  constructor(
    message: string = "Internal server error",
    errorCode: ErrorCode = ErrorCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message, 500, errorCode, false);
  }
}

export class MaintenanceError extends AppError {
  constructor(message: string = "Service under maintenance") {
    super(message, 503, ErrorCodes.MAINTENANCE_MODE);
  }
}
