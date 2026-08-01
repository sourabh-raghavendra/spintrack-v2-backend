// src/domain/user/UserController.ts
import { UserService, UpdateMeInput, ChangePasswordInput } from "./UserService";
import {
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
} from "./IUserRepository";
import { FindAllParams } from "../../infrastructure/database/BaseRepository";
import { User } from "./User";
import { PaginatedResult } from "../../types/common";
import { SafeUser, toSafeUser } from "./User";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async create(data: CreateUserInput): Promise<SafeUser> {
    const user = await this.userService.create(data);
    return toSafeUser(user);
  }

  async getById(id: string): Promise<SafeUser> {
    const user = await this.userService.getById(id);
    return toSafeUser(user);
  }

  async getAll(
    params?: FindAllParams,
    filters?: UserFilters,
  ): Promise<PaginatedResult<SafeUser>> {
    const result = await this.userService.getAll(params, filters);
    return { ...result, data: result.data.map(toSafeUser) };
  }

  async updateMe(id: string, data: UpdateMeInput): Promise<SafeUser> {
    const user = await this.userService.update(id, data);
    return toSafeUser(user);
  }

  async changePassword(id: string, input: ChangePasswordInput): Promise<void> {
    return this.userService.changePassword(id, input);
  }

  async update(id: string, data: UpdateUserInput): Promise<SafeUser> {
    const user = await this.userService.update(id, data);
    return toSafeUser(user);
  }

  async softDelete(id: string): Promise<void> {
    return this.userService.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    return this.userService.restore(id);
  }

  async adminResetPassword(id: string, newPassword: string): Promise<void> {
    return this.userService.adminResetPassword(id, newPassword);
  }
}
