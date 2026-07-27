// src/http/routes/auth.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { authAdapter } from "../../di/container";

const router = Router();

// ── Public routes ─────────────────────────────────────────────────────
router.post("/login", authAdapter.login);

// ── Protected routes ──────────────────────────────────────────────────
router.post("/logout", authMiddleware, authAdapter.logout);

export default router;
