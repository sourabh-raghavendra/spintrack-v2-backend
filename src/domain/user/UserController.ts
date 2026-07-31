// src/domain/user/UserController.ts
import { UserService, UpdateMeInput, ChangePasswordInput } from "./UserService";
import { CreateUserInput, UpdateUserInput, UserFilters } from "./IUserRepository";
import { FindAllParams } from "../../infrastructure/database/BaseRepository";
import { User } from "./User";
import { PaginatedResult } from "../../types/common";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async create(data: CreateUserInput): Promise<User> {
    return this.userService.create(data);
  }

  async getById(id: string): Promise<User> {
    return this.userService.getById(id);
  }

  async getAll(
    params?: FindAllParams,
    filters?: UserFilters,
  ): Promise<PaginatedResult<User>> {
    return this.userService.getAll(params, filters);
  }

  async updateMe(id: string, data: UpdateMeInput): Promise<User> {
    return this.userService.update(id, data);
  }

  async changePassword(id: string, input: ChangePasswordInput): Promise<void> {
    return this.userService.changePassword(id, input);
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    return this.userService.update(id, data);
  }

  async softDelete(id: string): Promise<void> {
    return this.userService.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    return this.userService.restore(id);
  }
}
