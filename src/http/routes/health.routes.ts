import { Router, Request, Response } from "express";
import { asyncWrapper } from "../../utils/asyncWrapper";
import { success, failure } from "../../utils/response";
import { ErrorCodes } from "../../errors/errorCodes";
import prisma from "../../config/database";
import { requirePermission } from "../middleware/permission.middleware";

const healthRouter = Router();

// ── Liveness ─────────────────────────────────────────────────
healthRouter.get(
  "/",
  asyncWrapper(async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json(success({ status: "ok" }));
  }),
);

// ── Readiness ─────────────────────────────────────────────────
healthRouter.get(
  "/ready",
  asyncWrapper(async (_req: Request, res: Response): Promise<void> => {
    const [dbStatus] = await Promise.all([
      checkDatabase(),
    ]);

    const allHealthy = dbStatus === "ok";

    res.status(allHealthy ? 200 : 503).json(
      allHealthy
        ? success({
            status: "ok",
            services: {
              database: dbStatus,
            },
          })
        : failure(ErrorCodes.INTERNAL_SERVER_ERROR, "Service unavailable"),
    );
  }),
);

async function checkDatabase(): Promise<"ok" | "unavailable"> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return "ok";
  } catch {
    return "unavailable";
  }
}



export default healthRouter;
