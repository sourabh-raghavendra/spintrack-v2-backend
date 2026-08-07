import { Router } from "express";
import healthRouter from "./health.routes";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import permissionRouter from "./permission.routes";
import taperRouter from "./taper.routes";
import customerRouter from "./customer.routes";
import spindleRouter from "./spindle.routes";
import orderRouter from "./order.routes";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/permissions", permissionRouter);
router.use("/tapers", taperRouter);
router.use("/customers", customerRouter);
router.use("/spindles", spindleRouter);
router.use("/orders", orderRouter);

export default router;
