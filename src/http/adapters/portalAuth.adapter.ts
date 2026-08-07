// src/http/adapters/portalAuth.adapter.ts
import { Request, Response, NextFunction } from "express";
import { PortalAuthController } from "../../domain/portalAuth/PortalAuthController";
import { ICustomerContactRepository } from "../../domain/customerContact/ICustomerContactRepository";
import { CustomerRepository } from "../../infrastructure/database/CustomerRepository";
import { success } from "../../utils/response";
import { ValidationError, NotFoundError } from "../../errors/HttpError";
import { portalLoginSchema } from "../validation/portalAuth.schema";

function toSafeContact(contact: any) {
  if (!contact) return null;
  const { password, ...safe } = contact;
  return safe;
}

export class PortalAuthAdapter {
  constructor(
    private readonly portalAuthController: PortalAuthController,
    private readonly contactRepository: ICustomerContactRepository,
    private readonly customerRepository: CustomerRepository
  ) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = portalLoginSchema.safeParse(req.body);
      if (!parsed.success) {
        return next(new ValidationError(parsed.error.issues[0].message));
      }
      
      const { email, password } = parsed.data;
      const result = await this.portalAuthController.login(email, password);
      
      res.status(200).json(
        success({
          token: result.token,
          contact: toSafeContact(result.contact),
        })
      );
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const contactId = req.customerAuth!.contactId;
      const contact = await this.contactRepository.findById(contactId);
      if (!contact) {
        throw new NotFoundError("Customer contact not found");
      }
      
      const customer = await this.customerRepository.findById(contact.customerId);
      const safeContact = toSafeContact(contact);
      
      res.status(200).json(
        success({
          ...safeContact,
          customerName: customer ? customer.customerName : null,
          customer: customer ? { customerName: customer.customerName } : null,
        })
      );
    } catch (error) {
      next(error);
    }
  };
}
