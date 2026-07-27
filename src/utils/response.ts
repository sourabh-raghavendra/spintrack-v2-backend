// src/utils/response.ts
import { ApiResponse, PaginatedResult } from "../types/common";

export function success<T>(
  data: T,
  meta?: Record<string, unknown>,
): ApiResponse<T> {
  return {
    success: true,
    data,
    meta,
  };
}

export function failure(code: string, message: string): ApiResponse<never> {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
}

export function paginated<T>(
  result: PaginatedResult<T>,
): ApiResponse<PaginatedResult<T>> {
  return {
    success: true,
    data: result,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      hasMore: result.hasMore,
    },
  };
}
