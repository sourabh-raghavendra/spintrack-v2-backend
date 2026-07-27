import { User } from "./User";
import { UserType, Zone, Department } from "../../generated/prisma/client";
import { FindAllParams } from "../../infrastructure/database/BaseRepository";

export interface CreateUserInput {
  name: string;
  employeeCode: string;
  email?: string | null;
  password: string;
  zone: Zone;
  userType: UserType;
  department: Department;
  isAdmin?: boolean;
  isActive?: boolean;
}

export interface UpdateUserInput {
  name?: string;
  employeeCode?: string;
  email?: string | null;
  password?: string;
  zone?: Zone;
  userType?: UserType;
  department?: Department;
  isActive?: boolean;
  isAdmin?: boolean;
  lastLoginAt?: Date | null;
}

export interface UserFilters {
  isActive?: boolean;
  userType?: UserType;
  isAdmin?: boolean;
  zone?: Zone;
  department?: Department;
  email?: string;
  employeeCode?: string;
  includeDeleted?: boolean;
}

export interface IUserRepository {
  findById(id: string, includeDeleted?: boolean): Promise<User | null>;
  findByEmail(email: string, includeDeleted?: boolean): Promise<User | null>;
  findByEmployeeCode(employeeCode: string, includeDeleted?: boolean): Promise<User | null>;
  findAll(params?: FindAllParams, filters?: UserFilters): Promise<User[]>;
  create(data: CreateUserInput): Promise<User>;
  update(id: string, data: UpdateUserInput): Promise<User>;
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<void>;
  hardDelete(id: string): Promise<void>;
  count(filters?: UserFilters): Promise<number>;
}
