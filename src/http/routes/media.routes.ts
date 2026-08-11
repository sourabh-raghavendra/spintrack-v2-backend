// Path: server/src/http/routes/media.routes.ts
import { Router } from "express";
import { requirePermission } from "../middleware/permission.middleware";
import { mediaAdapter } from "../../di/container";

const router = Router();

router.get(
  "/:orderId/media",
  requirePermission("orders:read"),
  mediaAdapter.listAll
);

router.get(
  "/:orderId/reports/:reportName/media",
  requirePermission("orders:read"),
  mediaAdapter.list
);

router.post(
  "/:orderId/reports/:reportName/media/presign",
  requirePermission("media:upload"),
  mediaAdapter.presign
);

router.post(
  "/:orderId/reports/:reportName/media",
  requirePermission("media:upload"),
  mediaAdapter.confirm
);

router.delete(
  "/:orderId/reports/:reportName/media/:id",
  requirePermission("media:delete"),
  mediaAdapter.remove
);

export default router;
