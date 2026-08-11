import { Router } from "express";
import { requirePermission } from "../middleware/permission.middleware";
import { reportFieldAdapter } from "../../di/container";

const router = Router();

// Generic Report Fields
router.get(
  "/:orderId/reports/:reportName/data",
  requirePermission("orders:read"),
  reportFieldAdapter.read
);

router.patch(
  "/:orderId/reports/:reportName/data",
  (req, res, next) => {
    const reportName = req.params.reportName;
    requirePermission(`${reportName}:write` as any)(req, res, next);
  },
  reportFieldAdapter.write
);

// Testing Balancing Trials (dedicated routes)
router.get(
  "/:orderId/reports/testing_balancing/trials",
  requirePermission("orders:read"),
  reportFieldAdapter.listTrials
);

router.post(
  "/:orderId/reports/testing_balancing/trials",
  requirePermission("testing_balancing:write"),
  reportFieldAdapter.createTrial
);

router.patch(
  "/:orderId/reports/testing_balancing/trials/:trialId",
  requirePermission("testing_balancing:write"),
  reportFieldAdapter.updateTrial
);

router.delete(
  "/:orderId/reports/testing_balancing/trials/:trialId",
  requirePermission("testing_balancing:write"),
  reportFieldAdapter.deleteTrial
);

// Deviations (dedicated routes)
router.get(
  "/:orderId/reports/deviations/data",
  requirePermission("orders:read"),
  reportFieldAdapter.listDeviations
);


router.post(
  "/:orderId/reports/deviations/approve",
  requirePermission("deviations:write"),
  reportFieldAdapter.approveDeviation
);

export default router;
