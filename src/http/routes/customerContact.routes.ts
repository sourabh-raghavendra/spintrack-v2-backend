// src/http/routes/customerContact.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermission } from "../middleware/permission.middleware";
import { customerContactAdapter } from "../../di/container";

const router = Router();

router.use(authMiddleware);

router.get("/", requirePermission("customer_contacts:read"), customerContactAdapter.list);
router.get("/:id", requirePermission("customer_contacts:read"), customerContactAdapter.getById);
router.post("/", requirePermission("customer_contacts:create"), customerContactAdapter.create);
router.patch("/:id", requirePermission("customer_contacts:update"), customerContactAdapter.update);
router.delete("/:id", requirePermission("customer_contacts:deactivate"), customerContactAdapter.deactivate);
router.post("/:id/restore", requirePermission("customer_contacts:update"), customerContactAdapter.restore);

export default router;
