// src/domain/customerContact/CustomerContactController.ts
import { CustomerContactService } from "./CustomerContactService";
import { CustomerContactListFilters } from "./ICustomerContactRepository";
import { CustomerContact } from "../../generated/prisma/client";

export class CustomerContactController {
  constructor(private readonly contactService: CustomerContactService) {}

  async list(filters: CustomerContactListFilters): Promise<{
    items: CustomerContact[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    return this.contactService.list(filters);
  }

  async getById(id: string): Promise<CustomerContact> {
    return this.contactService.getById(id);
  }

  async create(input: {
    customerId: string;
    email: string;
    password: string;
    name?: string | null;
    phone?: string | null;
  }): Promise<CustomerContact> {
    return this.contactService.createContact(input);
  }

  async update(
    id: string,
    input: Partial<{
      email: string;
      name: string | null;
      phone: string | null;
    }>
  ): Promise<CustomerContact> {
    return this.contactService.updateContact(id, input);
  }

  async deactivate(id: string): Promise<void> {
    return this.contactService.deactivate(id);
  }

  async restore(id: string): Promise<void> {
    return this.contactService.restore(id);
  }
}
