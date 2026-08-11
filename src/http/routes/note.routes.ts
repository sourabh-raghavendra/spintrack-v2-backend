// Path: server/src/http/routes/note.routes.ts
import { Router } from "express";
import { requirePermission } from "../middleware/permission.middleware";
import { noteAdapter } from "../../di/container";

const router = Router();

router.get(
  "/:orderId/reports/:reportName/notes",
  requirePermission("orders:read"),
  noteAdapter.list
);

router.post(
  "/:orderId/reports/:reportName/notes",
  requirePermission("notes:write"),
  noteAdapter.create
);

router.patch(
  "/:orderId/reports/:reportName/notes/:id",
  requirePermission("notes:edit"),
  noteAdapter.edit
);

router.delete(
  "/:orderId/reports/:reportName/notes/:id",
  requirePermission("notes:delete"),
  noteAdapter.remove
);

router.get(
  "/:orderId/notes",
  requirePermission("orders:read"),
  noteAdapter.listAllForOrder
);

export default router;
