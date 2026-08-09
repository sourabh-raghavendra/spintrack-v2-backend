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
router.use("/customer-contacts", customerContactRouter);
router.use("/portal", portalRouter);

export default router;
