// src/domain/permission/PermissionController.ts
import { PermissionService } from "./PermissionService";
import { Permission, Permissions } from "./permissions";
import { PermissionRecord } from "./IPermissionRepository";
import { BadRequestError } from "../../errors/HttpError";
import { ErrorCodes } from "../../errors/errorCodes";

export interface AssignRevokePermissionInput {
  userId: string;
  permissionKey: Permission;
}

export interface GetUserPermissionsInput {
  userId: string;
}

export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  // ── Get all permissions in the system ─────────────────────────────
  async getAllPermissions(): Promise<PermissionRecord[]> {
    return this.permissionService.getAllPermissions();
  }

  // ── Get permissions for a specific user ───────────────────────────
  async getUserPermissions(
    input: GetUserPermissionsInput,
  ): Promise<Permission[]> {
    return this.permissionService.getUserPermissions(input.userId);
  }

  // ── Assign a permission to a user ─────────────────────────────────
  async assignPermission(input: AssignRevokePermissionInput): Promise<void> {
    const validKeys = Object.values(Permissions) as Permission[];
    if (!validKeys.includes(input.permissionKey)) {
      throw new BadRequestError(
        `Invalid permission key: ${input.permissionKey}`,
        ErrorCodes.BAD_REQUEST,
      );
    }
    return this.permissionService.assignPermission(
      input.userId,
      input.permissionKey,
    );
  }

  // ── Revoke a permission from a user ──────────────────────────────
  async revokePermission(input: AssignRevokePermissionInput): Promise<void> {
    const validKeys = Object.values(Permissions) as Permission[];
    if (!validKeys.includes(input.permissionKey)) {
      throw new BadRequestError(
        `Invalid permission key: ${input.permissionKey}`,
        ErrorCodes.BAD_REQUEST,
      );
    }
    return this.permissionService.revokePermission(
      input.userId,
      input.permissionKey,
    );
  }
}
