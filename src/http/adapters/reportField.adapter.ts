import { Request, Response, NextFunction } from "express";
import { ReportFieldService } from "../../domain/reportLog/ReportFieldService";
import {
  reportFieldParamSchema,
  writeReportFieldsSchema,
  testingBalancingTrialParamSchema,
  testingBalancingTrialUpdateParamSchema,
  createTestingBalancingTrialSchema,
  updateTestingBalancingTrialSchema,
} from "../validation/reportField.schema";
import { ValidationError } from "../../errors/HttpError";
import { z } from "zod";

export class ReportFieldAdapter {
  constructor(private readonly service: ReportFieldService) {}

  read = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parsedParams = reportFieldParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      const data = await this.service.readReport(
        parsedParams.data.orderId,
        parsedParams.data.reportName
      );
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  write = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parsedParams = reportFieldParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      const parsedBody = writeReportFieldsSchema.safeParse(req);
      if (!parsedBody.success) {
        return next(new ValidationError(parsedBody.error.issues[0].message));
      }
      const data = await this.service.writeReportFields(
        parsedParams.data.orderId,
        parsedParams.data.reportName,
        parsedBody.data.body.recordKey,
        parsedBody.data.body.fields,
        req.user!.id
      );
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  // ── Testing Balancing Trials ──────────────────────────────────────────────
  listTrials = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parsedParams = testingBalancingTrialParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      const data = await this.service.getTrials(parsedParams.data.orderId);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  createTrial = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parsedParams = testingBalancingTrialParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      const parsedBody = createTestingBalancingTrialSchema.safeParse(req);
      if (!parsedBody.success) {
        return next(new ValidationError(parsedBody.error.issues[0].message));
      }
      const data = await this.service.createTrial(
        parsedParams.data.orderId,
        parsedBody.data.body
      );
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  updateTrial = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parsedParams = testingBalancingTrialUpdateParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      const parsedBody = updateTestingBalancingTrialSchema.safeParse(req);
      if (!parsedBody.success) {
        return next(new ValidationError(parsedBody.error.issues[0].message));
      }
      const data = await this.service.updateTrial(
        parsedParams.data.trialId,
        parsedBody.data.body
      );
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  deleteTrial = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parsedParams = testingBalancingTrialUpdateParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      await this.service.deleteTrial(parsedParams.data.trialId);
      res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  };

  // ── Deviations ────────────────────────────────────────────────────────────
  listDeviations = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parsedParams = testingBalancingTrialParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      const data = await this.service.getDeviations(parsedParams.data.orderId);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };



  approveDeviation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const parsedParams = testingBalancingTrialParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      const approveSchema = z.object({
        body: z.object({
          measurementKey: z.string().min(1),
          remark: z.string().optional(),
        }),
      });
      const parsedBody = approveSchema.safeParse(req);
      if (!parsedBody.success) {
        return next(new ValidationError(parsedBody.error.issues[0].message));
      }
      const userId = req.user!.id;
      const data = await this.service.approveDeviation(
        parsedParams.data.orderId,
        parsedBody.data.body.measurementKey,
        userId,
        parsedBody.data.body.remark
      );
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  listPendingApprovals = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = await this.service.listOrdersPendingDeviationApproval(req.user);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };
}
