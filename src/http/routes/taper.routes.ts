// src/http/routes/taper.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermission } from "../middleware/permission.middleware";
import { taperAdapter } from "../../di/container";

const router = Router();

router.use(authMiddleware, requirePermission("tapers:manage"));

router.get("/", taperAdapter.list);
router.get("/:id", taperAdapter.getById);
router.post("/", taperAdapter.create);
router.patch("/:id", taperAdapter.update);
router.delete("/:id", taperAdapter.remove);

router.patch("/:id/specs/:specKey", taperAdapter.updateSpec);

export default router;
