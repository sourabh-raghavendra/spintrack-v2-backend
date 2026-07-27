import { Router } from "express";
import { adminOnlyMiddleware } from "../middleware/adminOnly.middleware";
import { authMiddleware } from "../../http/middleware/auth.middleware";

const router = Router();

// ── Auth + Admin check on all admin routes ────────────────────────────
router.use(authMiddleware);
router.use(adminOnlyMiddleware);

// ── Mount admin routers ───────────────────────────────────────────────
// (None mounted yet)

export default router;
