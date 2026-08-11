// src/http/routes/user.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermission } from "../middleware/permission.middleware";
import { userAdapter, reportPersonnelAdapter } from "../../di/container";

const router = Router();

// ── Own account routes ────────────────────────────────────────────────
router.get("/me", authMiddleware, userAdapter.getMe);
router.patch("/me", authMiddleware, userAdapter.updateMe);
router.patch("/me/password", authMiddleware, userAdapter.changePassword);

// ── Admin routes ──────────────────────────────────────────────────────
router.post(
  "/",
  authMiddleware,
  requirePermission("users:create"),
  userAdapter.create,
);
router.get(
  "/",
  authMiddleware,
  requirePermission("users:read"),
  userAdapter.getAll,
);
router.get(
  "/:id",
  authMiddleware,
  requirePermission("users:read"),
  userAdapter.getById,
);
router.patch(
  "/:id",
  authMiddleware,
  requirePermission("users:update"),
  userAdapter.update,
);
router.delete(
  "/:id",
  authMiddleware,
  requirePermission("users:deactivate"),
  userAdapter.softDelete,
);
router.post(
  "/:id/restore",
  authMiddleware,
  requirePermission("users:update"),
  userAdapter.restore,
);
router.patch(
  "/:id/password",
  authMiddleware,
  requirePermission("users:reset_password"),
  userAdapter.adminResetPassword,
);

router.get(
  "/:userId/inspection-history",
  authMiddleware,
  reportPersonnelAdapter.getInspectionHistory,
);

export default router;
