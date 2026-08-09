// src/http/adapters/customerContact.adapter.ts
import { Request, Response, NextFunction } from "express";
import { CustomerContactController } from "../../domain/customerContact/CustomerContactController";
import { CustomerRepository } from "../../infrastructure/database/CustomerRepository";
import { success } from "../../utils/response";
import { ValidationError, ForbiddenError } from "../../errors/HttpError";
import { z } from "zod";
import { createCustomerContactSchema, updateCustomerContactSchema } from "../validation/customerContact.schema";

const contactIdParamSchema = z.object({
  id: z.string().min(1, "Contact ID is required"),
});

function toSafeContact(contact: any) {
  if (!contact) return null;
  const { password, ...safe } = contact;
  return safe;
}

export class CustomerContactAdapter {
  constructor(
    private readonly contactController: CustomerContactController,
    private readonly customerRepository: CustomerRepository
  ) {}

  private async checkZoneAccess(req: Request, customerId: string): Promise<void> {
    if (req.user!.isAdmin) return;
    const customer = await this.customerRepository.findById(customerId);
    if (!customer || customer.zone !== req.user!.zone) {
      throw new ForbiddenError("You are not authorized to access this zone");
    }
  }

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 20;
      const customerId = req.query.customerId as string | undefined;
      const search = req.query.search as string | undefined;

      if (customerId) {
        await this.checkZoneAccess(req, customerId);
      } else if (!req.user!.isAdmin) {
        // If not admin, they can only list contacts if they specify a customerId they own.
        // Or we block it if customerId is missing.
        throw new ForbiddenError("Customer ID is required for non-admin users");
      }

      const result = await this.contactController.list({
        page,
        pageSize,
        customerId,
        search,
      });

      res.status(200).json(
        success({
          ...result,
          items: result.items.map(toSafeContact),
        })
      );
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = contactIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const contact = await this.contactController.getById(parsed.data.id);
      await this.checkZoneAccess(req, contact.customerId);
      res.status(200).json(success(toSafeContact(contact)));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = createCustomerContactSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      await this.checkZoneAccess(req, parsed.data.customerId);
      const payload = {
        ...parsed.data,
        password: parsed.data.password || parsed.data.email,
      };
      const result = await this.contactController.create(payload);
      res.status(201).json(success(toSafeContact(result)));
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedParams = contactIdParamSchema.safeParse(req.params);
      if (!parsedParams.success) {
        return next(new ValidationError(parsedParams.error.issues[0].message));
      }
      const parsedBody = updateCustomerContactSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return next(new ValidationError(parsedBody.error.issues[0].message));
      }

      const contact = await this.contactController.getById(parsedParams.data.id);
      await this.checkZoneAccess(req, contact.customerId);

      const result = await this.contactController.update(parsedParams.data.id, parsedBody.data);
      res.status(200).json(success(toSafeContact(result)));
    } catch (error) {
      next(error);
    }
  };

  deactivate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = contactIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      const contact = await this.contactController.getById(parsed.data.id);
      await this.checkZoneAccess(req, contact.customerId);

      await this.contactController.deactivate(parsed.data.id);
      res.status(200).json(success(null));
    } catch (error) {
      next(error);
    }
  };

  restore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = contactIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      // Force loading even if soft-deleted
      const contact = await this.contactController.getById(parsed.data.id).catch(async () => {
        // If not found standard, search directly via repository to do zone check
        return null;
      });
      
      // If we couldn't load it (because getById throws NotFound for deleted), we fetch it directly or bypass check if admin
      if (req.user!.isAdmin) {
        await this.contactController.restore(parsed.data.id);
        return void res.status(200).json(success(null));
      }
      
      throw new ForbiddenError("Only administrators can restore contacts");
    } catch (error) {
      next(error);
    }
  };
}
