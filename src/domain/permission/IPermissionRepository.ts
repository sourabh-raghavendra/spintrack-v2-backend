// src/domain/permission/IPermissionRepository.ts
import { Permission } from "./permissions";

export interface IPermissionRepository {
  findAllPermissions(): Promise<PermissionRecord[]>;
  findByKey(key: Permission): Promise<PermissionRecord | null>;
  findUserPermissions(userId: string): Promise<Permission[]>;
  assignPermission(userId: string, permissionId: string): Promise<void>;
  revokePermission(userId: string, permissionId: string): Promise<void>;
  syncUserPermissions(userId: string, permissionIds: string[]): Promise<void>;
}

export interface PermissionRecord {
  id: string;
  key: Permission;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}
