import { Router, Request, Response, NextFunction } from "express";
import { orderReportLogAdapter } from "../../di/container";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermission } from "../middleware/permission.middleware";

const router = Router();

function requireDynamicReportPermission() {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const reportName = req.params.reportName;
    const permission = `${reportName}:write` as any;
    const middleware = requirePermission(permission);
    return middleware(req, res, next);
  };
}

router.use(authMiddleware);

router.get("/:orderId/reports", requirePermission("orders:read"), orderReportLogAdapter.getTimeline);
router.post("/:orderId/reports/:reportName/initiate", requireDynamicReportPermission(), orderReportLogAdapter.initiate);
router.post("/:orderId/reports/:reportName/close", requireDynamicReportPermission(), orderReportLogAdapter.close);

export default router;
