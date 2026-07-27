// src/domain/user/UserService.ts
import {
  IUserRepository,
  UpdateUserInput,
  UserFilters,
} from "./IUserRepository";
import { User } from "./User";
import { FindAllParams } from "../../infrastructure/database/BaseRepository";
import { comparePassword, hashPassword } from "../../utils/hash";
import {
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} from "../../errors/HttpError";
import { ErrorCodes } from "../../errors/errorCodes";
import { PaginatedResult } from "../../types/common";

export interface UpdateMeInput {
  email?: string | null;
  name?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found", ErrorCodes.USER_NOT_FOUND);
    }
    return user;
  }

  async getAll(
    params?: FindAllParams,
    filters?: UserFilters,
  ): Promise<PaginatedResult<User>> {
    const [users, total] = await Promise.all([
      this.userRepository.findAll(params, filters),
      this.userRepository.count(filters),
    ]);

    const page = params?.page ?? 1;
    const limit = params?.limit ?? 10;

    return {
      data: users,
      total,
      page,
      limit,
      hasMore: page * limit < total,
    };
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found", ErrorCodes.USER_NOT_FOUND);
    }

    if (data.email && data.email !== user.email) {
      const existing = await this.userRepository.findByEmail(data.email);
      if (existing) {
        throw new ConflictError(
          "Email already in use",
          ErrorCodes.USER_ALREADY_EXISTS,
        );
      }
    }

    if (data.employeeCode && data.employeeCode !== user.employeeCode) {
      const existing = await this.userRepository.findByEmployeeCode(data.employeeCode);
      if (existing) {
        throw new ConflictError(
          "Employee code already in use",
          ErrorCodes.USER_ALREADY_EXISTS,
        );
      }
    }

    return this.userRepository.update(id, data);
  }

  async changePassword(id: string, input: ChangePasswordInput): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found", ErrorCodes.USER_NOT_FOUND);
    }

    if (!user.password) {
      throw new UnauthorizedError(
        "Cannot change password",
        ErrorCodes.INVALID_CREDENTIALS,
      );
    }

    const valid = await comparePassword(input.currentPassword, user.password);
    if (!valid) {
      throw new UnauthorizedError(
        "Current password is incorrect",
        ErrorCodes.INVALID_CREDENTIALS,
      );
    }

    const newHash = await hashPassword(input.newPassword);
    await this.userRepository.update(id, { password: newHash });
  }

  async softDelete(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found", ErrorCodes.USER_NOT_FOUND);
    }
    await this.userRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    const user = await this.userRepository.findById(id, true);
    if (!user) {
      throw new NotFoundError("User not found", ErrorCodes.USER_NOT_FOUND);
    }
    await this.userRepository.restore(id);
  }
}
