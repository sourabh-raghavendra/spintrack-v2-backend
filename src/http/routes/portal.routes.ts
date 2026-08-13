import { Router } from "express";
import { customerAuthMiddleware } from "../middleware/customerAuth.middleware";
import { portalAuthAdapter, portalOrderAdapter, warrantyAdapter } from "../../di/container";

const router = Router();

router.post("/auth/login", portalAuthAdapter.login);
router.get("/me", customerAuthMiddleware, portalAuthAdapter.getMe);
router.patch("/me/password", customerAuthMiddleware, portalAuthAdapter.changePassword);

// Orders
router.get("/orders", customerAuthMiddleware, portalOrderAdapter.list);
router.get("/orders/:id", customerAuthMiddleware, portalOrderAdapter.get);
router.get("/orders/:id/media", customerAuthMiddleware, portalOrderAdapter.getMedia);
router.get("/orders/:id/remarks", customerAuthMiddleware, portalOrderAdapter.getRemarks);
router.get("/orders/:id/final-inspection/pdf", customerAuthMiddleware, portalOrderAdapter.getFinalInspectionPdf);
router.get("/orders/:orderId/warranty", customerAuthMiddleware, warrantyAdapter.getPortalStatus);
router.get("/orders/:orderId/warranty/certificate", customerAuthMiddleware, warrantyAdapter.getPortalCertificate);

export default router;
