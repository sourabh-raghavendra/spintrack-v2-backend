// Path: server/src/http/routes/reportPersonnel.routes.ts
import { Router } from "express";
import { requirePermission } from "../middleware/permission.middleware";
import { reportPersonnelAdapter } from "../../di/container";

const router = Router();

router.get(
  "/:orderId/reports/:reportName/personnel",
  requirePermission("orders:read"),
  reportPersonnelAdapter.list
);

router.post(
  "/:orderId/reports/:reportName/personnel",
  (req, res, next) => {
    const reportName = req.params.reportName;
    requirePermission(`${reportName}:write` as any)(req, res, next);
  },
  reportPersonnelAdapter.add
);

router.delete(
  "/:orderId/reports/:reportName/personnel/:id",
  (req, res, next) => {
    const reportName = req.params.reportName;
    requirePermission(`${reportName}:write` as any)(req, res, next);
  },
  reportPersonnelAdapter.remove
);

export default router;
