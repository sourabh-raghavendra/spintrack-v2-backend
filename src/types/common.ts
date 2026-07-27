// src/types/common.ts
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: Record<string, unknown>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export type SortOrder = "asc" | "desc";

export interface RequestUser {
  id: string;
  name: string;
  employeeCode: string;
  email: string | null;
  isAdmin: boolean;
  zone: string;
  userType: string;
  department: string;
  permissions: string[];
}
