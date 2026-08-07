// src/http/routes/portal.routes.ts
import { Router } from "express";
import { customerAuthMiddleware } from "../middleware/customerAuth.middleware";
import { portalAuthAdapter } from "../../di/container";

const router = Router();

router.post("/auth/login", portalAuthAdapter.login);
router.get("/me", customerAuthMiddleware, portalAuthAdapter.getMe);

export default router;
