// Path: server/src/http/routes/warranty.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermission } from "../middleware/permission.middleware";
import { warrantyAdapter } from "../../di/container";

const router = Router();

router.use(authMiddleware);

router.get("/:orderId/warranty", requirePermission("orders:read"), warrantyAdapter.getStatus);
router.get("/:orderId/warranty/certificate", requirePermission("orders:read"), warrantyAdapter.getCertificate);

export default router;
