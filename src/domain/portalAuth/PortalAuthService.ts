// src/domain/portalAuth/PortalAuthService.ts
import { ICustomerContactRepository } from "../customerContact/ICustomerContactRepository";
import { CustomerContact } from "../../generated/prisma/client";
import { comparePassword } from "../../utils/hash";
import { signCustomerToken } from "../../utils/customerJwt";
import { UnauthorizedError } from "../../errors/HttpError";

export class PortalAuthService {
  constructor(private readonly contactRepository: ICustomerContactRepository) {}

  async login(email: string, plainPassword: string): Promise<{ token: string; contact: CustomerContact }> {
    const contact = await this.contactRepository.findByEmail(email);
    if (!contact || !contact.isActive) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const matches = await comparePassword(plainPassword, contact.password);
    if (!matches) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = signCustomerToken({
      contactId: contact.id,
      customerId: contact.customerId,
    });

    const updatedContact = await this.contactRepository.update(contact.id, {
      lastLoginAt: new Date(),
    });

    return {
      token,
      contact: updatedContact,
    };
  }
}
