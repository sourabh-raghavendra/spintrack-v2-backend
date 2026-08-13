// Path: server/src/http/routes/analytics.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermission } from "../middleware/permission.middleware";
import { analyticsAdapter } from "../../di/container";

const router = Router();

router.use(authMiddleware);

router.get("/technician-activity", requirePermission("analytics:manage"), analyticsAdapter.technicianActivity);
router.get("/customer-repairs", requirePermission("analytics:manage"), analyticsAdapter.customerWiseRepairs);
router.get("/top-customers", requirePermission("analytics:manage"), analyticsAdapter.top10Customers);
router.get("/machine-spindles", requirePermission("analytics:manage"), analyticsAdapter.machineWiseSpindles);
router.get("/order-type-breakdown", requirePermission("analytics:manage"), analyticsAdapter.orderTypeBreakdown);
router.get("/spindle-make-repairs", requirePermission("analytics:manage"), analyticsAdapter.spindleMakeWiseRepairs);
router.get("/taper-report", requirePermission("analytics:manage"), analyticsAdapter.taperWiseReport);
router.get("/warranty-repairs", requirePermission("analytics:manage"), analyticsAdapter.underWarrantyRepairs);

export default router;
