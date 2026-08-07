// src/http/routes/spindle.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermission } from "../middleware/permission.middleware";
import { spindleAdapter } from "../../di/container";

const router = Router();

router.use(authMiddleware);

router.get("/lookup", requirePermission("spindles:read"), spindleAdapter.lookupBySerialNumber);
router.get("/", requirePermission("spindles:read"), spindleAdapter.list);
router.get("/:id", requirePermission("spindles:read"), spindleAdapter.getById);
router.post("/", requirePermission("spindles:create"), spindleAdapter.create);
router.patch("/:id", requirePermission("spindles:update"), spindleAdapter.update);

export default router;
