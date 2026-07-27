import { BaseRepository, FindAllParams } from "./BaseRepository";
import {
  IUserRepository,
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
} from "../../domain/user/IUserRepository";
import { User } from "../../domain/user/User";
import { UserType, Zone, Department } from "../../generated/prisma/client";
import { PrismaClient } from "../../generated/prisma/client";

export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(client?: PrismaClient) {
    super(client);
  }

  private toDomain(record: {
    id: string;
    name: string;
    employeeCode: string;
    email: string | null;
    password: string;
    zone: Zone;
    userType: UserType;
    department: Department;
    isAdmin: boolean;
    isActive: boolean;
    lastLoginAt: Date | null;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return {
      id: record.id,
      name: record.name,
      employeeCode: record.employeeCode,
      email: record.email,
      password: record.password,
      zone: record.zone,
      userType: record.userType,
      department: record.department,
      isAdmin: record.isAdmin,
      isActive: record.isActive,
      lastLoginAt: record.lastLoginAt,
      deletedAt: record.deletedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private buildWhereClause(filters?: UserFilters) {
    return {
      ...(filters?.includeDeleted ? {} : { deletedAt: null }),
      ...(filters?.isActive !== undefined && { isActive: filters.isActive }),
      ...(filters?.isAdmin !== undefined && { isAdmin: filters.isAdmin }),
      ...(filters?.userType !== undefined && { userType: filters.userType }),
      ...(filters?.zone !== undefined && { zone: filters.zone }),
      ...(filters?.department !== undefined && { department: filters.department }),
      ...(filters?.email && {
        email: { contains: filters.email, mode: "insensitive" as const },
      }),
      ...(filters?.employeeCode && {
        employeeCode: { contains: filters.employeeCode, mode: "insensitive" as const },
      }),
    };
  }

  async findById(id: string, includeDeleted = false): Promise<User | null> {
    const record = await this.db.user.findUnique({
      where: { id, ...(!includeDeleted && { deletedAt: null }) },
    });
    return record ? this.toDomain(record) : null;
  }

  async findByEmail(
    email: string,
    includeDeleted = false,
  ): Promise<User | null> {
    const record = await this.db.user.findFirst({
      where: { email, ...(!includeDeleted && { deletedAt: null }) },
    });
    return record ? this.toDomain(record) : null;
  }

  async findByEmployeeCode(
    employeeCode: string,
    includeDeleted = false,
  ): Promise<User | null> {
    const record = await this.db.user.findFirst({
      where: { employeeCode, ...(!includeDeleted && { deletedAt: null }) },
    });
    return record ? this.toDomain(record) : null;
  }

  async findAll(
    params?: FindAllParams,
    filters?: UserFilters,
  ): Promise<User[]> {
    const records = await this.db.user.findMany({
      where: this.buildWhereClause(filters),
      ...this.getPaginationParams(params),
      orderBy: this.getSortParams(params),
    });
    return records.map((r) => this.toDomain(r));
  }

  async count(filters?: UserFilters): Promise<number> {
    return this.db.user.count({
      where: this.buildWhereClause(filters),
    });
  }

  async create(data: CreateUserInput): Promise<User> {
    const record = await this.db.user.create({
      data: {
        name: data.name,
        employeeCode: data.employeeCode,
        email: data.email ?? null,
        password: data.password,
        zone: data.zone,
        userType: data.userType,
        department: data.department,
        isAdmin: data.isAdmin ?? false,
        isActive: data.isActive ?? true,
      },
    });
    return this.toDomain(record);
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const record = await this.db.user.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.employeeCode !== undefined && { employeeCode: data.employeeCode }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.password !== undefined && { password: data.password }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.isAdmin !== undefined && { isAdmin: data.isAdmin }),
        ...(data.zone !== undefined && { zone: data.zone }),
        ...(data.userType !== undefined && { userType: data.userType }),
        ...(data.department !== undefined && { department: data.department }),
        ...(data.lastLoginAt !== undefined && {
          lastLoginAt: data.lastLoginAt,
        }),
      },
    });
    return this.toDomain(record);
  }

  async softDelete(id: string): Promise<void> {
    await this.db.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string): Promise<void> {
    await this.db.user.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async hardDelete(id: string): Promise<void> {
    await this.db.user.delete({ where: { id } });
  }
}
