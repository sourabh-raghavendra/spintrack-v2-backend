import { Router } from "express";
import healthRouter from "./health.routes";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import permissionRouter from "./permission.routes";
import taperRouter from "./taper.routes";
import customerRouter from "./customer.routes";
import spindleRouter from "./spindle.routes";
import orderRouter from "./order.routes";
import customerContactRouter from "./customerContact.routes";
import portalRouter from "./portal.routes";
import reportLogRouter from "./reportLog.routes";
import reportFieldRouter from "./reportField.routes";
import reportPersonnelRouter from "./reportPersonnel.routes";
import noteRouter from "./note.routes";
import mediaRouter from "./media.routes";
import { authMiddleware } from "../middleware/auth.middleware";
import { requirePermission } from "../middleware/permission.middleware";
import { reportFieldAdapter } from "../../di/container";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/permissions", permissionRouter);
router.use("/tapers", taperRouter);
router.use("/customers", customerRouter);
router.use("/spindles", spindleRouter);
router.use("/orders", orderRouter);
router.use("/orders", reportLogRouter);
router.use("/orders", reportFieldRouter);
router.use("/orders", reportPersonnelRouter);
router.use("/orders", noteRouter);
router.use("/orders", mediaRouter);
router.use("/customer-contacts", customerContactRouter);
router.use("/portal", portalRouter);

router.get(
  "/deviations/orders",
  authMiddleware,
  requirePermission("deviations:write"),
  reportFieldAdapter.listPendingApprovals
);

export default router;
