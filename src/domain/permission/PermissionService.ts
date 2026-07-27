// src/domain/permission/PermissionService.ts
import {
  IPermissionRepository,
  PermissionRecord,
} from "./IPermissionRepository";
import { Permission } from "./permissions";
import { NotFoundError } from "../../errors/HttpError";
import { ErrorCodes } from "../../errors/errorCodes";

export class PermissionService {
  constructor(
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  // ── Check if a user has a permission ─────────────────────────────
  async hasPermission(
    userId: string,
    isAdmin: boolean,
    permission: Permission,
  ): Promise<boolean> {
    // Admins bypass all permission checks
    if (isAdmin) return true;

    const permissions = await this.getUserPermissions(userId);
    return permissions.includes(permission);
  }

  // ── Get all permissions in the system ─────────────────────────────
  async getAllPermissions(): Promise<PermissionRecord[]> {
    return this.permissionRepository.findAllPermissions();
  }

  // ── Get permissions for a specific user ───────────────────────────
  async getUserPermissions(userId: string): Promise<Permission[]> {
    return this.permissionRepository.findUserPermissions(userId);
  }

  // ── Assign a permission to a user ─────────────────────────────────
  async assignPermission(
    userId: string,
    permissionKey: Permission,
  ): Promise<void> {
    // Verify permission exists
    const permission = await this.permissionRepository.findByKey(permissionKey);
    if (!permission) {
      throw new NotFoundError(
        `Permission ${permissionKey} not found`,
        ErrorCodes.NOT_FOUND,
      );
    }

    await this.permissionRepository.assignPermission(userId, permission.id);
  }

  // ── Revoke a permission from a user ──────────────────────────────
  async revokePermission(
    userId: string,
    permissionKey: Permission,
  ): Promise<void> {
    const permission = await this.permissionRepository.findByKey(permissionKey);
    if (!permission) {
      throw new NotFoundError(
        `Permission ${permissionKey} not found`,
        ErrorCodes.NOT_FOUND,
      );
    }

    await this.permissionRepository.revokePermission(userId, permission.id);
  }
}
