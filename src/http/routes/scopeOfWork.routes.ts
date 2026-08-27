import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermission } from "../middleware/permission.middleware";
import { scopeOfWorkAdapter } from "../../di/container";

const router = Router();

router.use(authMiddleware);

router.get(
  "/orders/:orderId/reports/scope_of_work/data",
  requirePermission("orders:read"),
  scopeOfWorkAdapter.list
);

router.get(
  "/scope-of-work/search",
  requirePermission("scope_of_work:write"),
  scopeOfWorkAdapter.search
);

router.post(
  "/orders/:orderId/reports/scope_of_work/data",
  requirePermission("scope_of_work:write"),
  scopeOfWorkAdapter.add
);

router.delete(
  "/orders/:orderId/reports/scope_of_work/data/:id",
  requirePermission("scope_of_work:write"),
  scopeOfWorkAdapter.remove
);

export default router;
