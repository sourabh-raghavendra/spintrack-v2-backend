// src/http/routes/permission.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermission } from "../middleware/permission.middleware";
import { permissionAdapter } from "../../di/container";

const router = Router();

// ── Get all permissions in the system ─────────────────────────────
router.get(
  "/",
  authMiddleware,
  requirePermission("users:assign_permissions"),
  permissionAdapter.getAllPermissions,
);

// ── Get permissions for a specific user ───────────────────────────
router.get(
  "/users/:userId",
  authMiddleware,
  requirePermission("users:assign_permissions"),
  permissionAdapter.getUserPermissions,
);

// ── Assign a permission to a user ─────────────────────────────────
router.post(
  "/assign",
  authMiddleware,
  requirePermission("users:assign_permissions"),
  permissionAdapter.assignPermission,
);

// ── Revoke a permission from a user ──────────────────────────────
router.post(
  "/revoke",
  authMiddleware,
  requirePermission("users:assign_permissions"),
  permissionAdapter.revokePermission,
);

// ── Sync user permissions in bulk ────────────────────────────────
router.put(
  "/user/sync",
  authMiddleware,
  requirePermission("users:assign_permissions"),
  permissionAdapter.syncUserPermissions,
);

export default router;
