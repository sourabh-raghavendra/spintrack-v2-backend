// src/http/routes/order.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermission } from "../middleware/permission.middleware";
import { orderAdapter } from "../../di/container";

const router = Router();

router.use(authMiddleware);

router.get("/", requirePermission("orders:read"), orderAdapter.list);
router.get("/:id", requirePermission("orders:read"), orderAdapter.getById);
router.get("/:id/qr", requirePermission("orders:read"), orderAdapter.getQrCode);
router.post("/", requirePermission("orders:create"), orderAdapter.create);
router.patch("/:id", requirePermission("orders:update"), orderAdapter.update);
router.post("/:id/archive", orderAdapter.archive);
router.post("/:id/unarchive", orderAdapter.unarchive);
router.delete("/:id", orderAdapter.remove);

export default router;
