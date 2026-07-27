// src/http/middleware/compression.middleware.ts
import compression from "compression";
import { Request, Response } from "express";

export const compressionMiddleware = compression({
  filter: (req: Request, res: Response): boolean => {
    if (req.headers["x-no-compression"]) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // balanced between speed and compression ratio (1-9)
});
