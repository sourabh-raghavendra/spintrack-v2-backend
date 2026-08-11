import { Router } from "express";
import { customerAuthMiddleware } from "../middleware/customerAuth.middleware";
import { portalAuthAdapter, portalOrderAdapter } from "../../di/container";

const router = Router();

router.post("/auth/login", portalAuthAdapter.login);
router.get("/me", customerAuthMiddleware, portalAuthAdapter.getMe);
router.patch("/me/password", customerAuthMiddleware, portalAuthAdapter.changePassword);

// Orders
router.get("/orders", customerAuthMiddleware, portalOrderAdapter.list);
router.get("/orders/:id", customerAuthMiddleware, portalOrderAdapter.get);
router.get("/orders/:id/media", customerAuthMiddleware, portalOrderAdapter.getMedia);
router.get("/orders/:id/remarks", customerAuthMiddleware, portalOrderAdapter.getRemarks);

export default router;
