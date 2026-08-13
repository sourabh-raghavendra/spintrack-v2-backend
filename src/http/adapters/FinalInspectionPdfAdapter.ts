// Path: server/src/http/adapters/FinalInspectionPdfAdapter.ts
import { Request, Response, NextFunction } from "express";
import { FinalInspectionPdfService } from "../../domain/finalInspectionPdf/FinalInspectionPdfService";
import { buildFinalInspectionDoc, renderFinalInspectionPdf } from "../../domain/finalInspectionPdf/buildFinalInspectionDoc";
import { z } from "zod";
import { ValidationError } from "../../errors/HttpError";

const paramsSchema = z.object({
  id: z.string().min(1),
});

export class FinalInspectionPdfAdapter {
  constructor(private readonly service: FinalInspectionPdfService) {}

  generatePdf = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = paramsSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }

      const orderId = parsed.data.id;
      const data = await this.service.assembleData(orderId);
      const docDef = buildFinalInspectionDoc(data);
      const pdfBuffer = await renderFinalInspectionPdf(docDef);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="final-inspection-${data.jobNumber || orderId}.pdf"`
      );
      res.status(200).send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  };
}
