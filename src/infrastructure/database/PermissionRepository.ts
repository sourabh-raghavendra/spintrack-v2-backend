// src/infrastructure/database/PermissionRepository.ts
import { BaseRepository, FindAllParams } from "./BaseRepository";
import {
  IPermissionRepository,
  PermissionRecord,
} from "../../domain/permission/IPermissionRepository";
import { Permission } from "../../domain/permission/permissions";
import { PrismaClient } from "../../generated/prisma/client";

export class PermissionRepository
  extends BaseRepository<PermissionRecord>
  implements IPermissionRepository
{
  constructor(client?: PrismaClient) {
    super(client);
  }

  // ── Map Prisma model to domain record ─────────────────────────────
  private toDomain(record: {
    id: string;
    key: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): PermissionRecord {
    return {
      id: record.id,
      key: record.key as Permission,
      description: record.description,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  // ── IPermissionRepository ─────────────────────────────────────────
  async findAllPermissions(): Promise<PermissionRecord[]> {
    const records = await this.db.permission.findMany({
      orderBy: { key: "asc" },
    });
    return records.map((r) => this.toDomain(r));
  }

  async findByKey(key: Permission): Promise<PermissionRecord | null> {
    const record = await this.db.permission.findUnique({
      where: { key },
    });
    return record ? this.toDomain(record) : null;
  }

  async findUserPermissions(userId: string): Promise<Permission[]> {
    const records = await this.db.userPermission.findMany({
      where: { userId },
      include: { permission: true },
    });
    return records.map((r) => r.permission.key as Permission);
  }

  async assignPermission(userId: string, permissionId: string): Promise<void> {
    await this.db.userPermission.create({
      data: { userId, permissionId },
    });
  }

  async revokePermission(userId: string, permissionId: string): Promise<void> {
    await this.db.userPermission.deleteMany({
      where: { userId, permissionId },
    });
  }

  // ── BaseRepository abstract methods ───────────────────────────────
  async findById(id: string): Promise<PermissionRecord | null> {
    const record = await this.db.permission.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findAll(params?: FindAllParams): Promise<PermissionRecord[]> {
    const records = await this.db.permission.findMany({
      ...this.getPaginationParams(params),
      orderBy: this.getSortParams(params),
    });
    return records.map((r) => this.toDomain(r));
  }

  async create(data: {
    key: string;
    description?: string;
  }): Promise<PermissionRecord> {
    const record = await this.db.permission.create({ data });
    return this.toDomain(record);
  }

  async update(
    id: string,
    data: { description?: string },
  ): Promise<PermissionRecord> {
    const record = await this.db.permission.update({
      where: { id },
      data,
    });
    return this.toDomain(record);
  }

  async hardDelete(id: string): Promise<void> {
    await this.db.permission.delete({ where: { id } });
  }
}
