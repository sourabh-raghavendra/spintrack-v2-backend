// Path: server/src/http/adapters/NoteAdapter.ts
import { Request, Response, NextFunction } from "express";
import { NoteController } from "../../domain/note/NoteController";
import { success } from "../../utils/response";
import { ValidationError } from "../../errors/HttpError";
import { createNoteSchema, updateNoteSchema } from "../validation/note.schema";
import { REPORTS } from "../../domain/permission/permissions";
import { z } from "zod";

const paramsSchema = z.object({
  orderId: z.string().min(1),
  reportName: z.enum(REPORTS as unknown as [string, ...string[]]),
});

const noteIdSchema = z.object({
  id: z.string().min(1),
});

export class NoteAdapter {
  constructor(private readonly controller: NoteController) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = paramsSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const result = await this.controller.listForReport(
        parsed.data.orderId,
        parsed.data.reportName
      );
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedParams = paramsSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      const parsedBody = createNoteSchema.safeParse(req);
      if (!parsedBody.success) {
        return next(new ValidationError(parsedBody.error.issues[0].message));
      }
      const result = await this.controller.createNote(
        parsedParams.data.orderId,
        parsedParams.data.reportName,
        parsedBody.data.body.content,
        req.user!.id
      );
      res.status(201).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  edit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedParams = noteIdSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      const parsedBody = updateNoteSchema.safeParse(req);
      if (!parsedBody.success) {
        return next(new ValidationError(parsedBody.error.issues[0].message));
      }
      const result = await this.controller.editNote(
        parsedParams.data.id,
        parsedBody.data.body.content
      );
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedParams = noteIdSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      await this.controller.deleteNote(parsedParams.data.id);
      res.status(200).json(success({ success: true }));
    } catch (error) {
      next(error);
    }
  };

  listAllForOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = req.params.orderId;
      if (!orderId) {
        return next(new ValidationError("Order ID is required"));
      }
      const result = await this.controller.listAllForOrder(orderId);
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  };
}
