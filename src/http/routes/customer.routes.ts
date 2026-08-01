// src/http/routes/customer.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermission } from "../middleware/permission.middleware";
import { customerAdapter } from "../../di/container";

const router = Router();

router.use(authMiddleware);

router.get("/", requirePermission("customers:read"), customerAdapter.list);
router.get("/:id", requirePermission("customers:read"), customerAdapter.getById);
router.post("/", requirePermission("customers:create"), customerAdapter.create);
router.patch("/:id", requirePermission("customers:update"), customerAdapter.update);
router.delete("/:id", requirePermission("customers:deactivate"), customerAdapter.deactivate);
router.post("/:id/restore", requirePermission("customers:update"), customerAdapter.restore);

export default router;
