// src/domain/customerContact/CustomerContactService.ts
import { ICustomerContactRepository, CustomerContactListFilters } from "./ICustomerContactRepository";
import { CustomerContact } from "../../generated/prisma/client";
import { hashPassword } from "../../utils/hash";
import { ConflictError, NotFoundError } from "../../errors/HttpError";

export class CustomerContactService {
  constructor(private repository: ICustomerContactRepository) {}

  async createContact(data: {
    customerId: string;
    email: string;
    password: string;
    name?: string | null;
    phone?: string | null;
  }): Promise<CustomerContact> {
    const hashedPassword = await hashPassword(data.password);
    try {
      return await this.repository.create({
        ...data,
        password: hashedPassword,
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictError(`A contact with email "${data.email}" already exists`);
      }
      if (error.code === "P2003") {
        throw new NotFoundError(`Customer "${data.customerId}" does not exist`);
      }
      throw error;
    }
  }

  async updateContact(
    id: string,
    data: Partial<{
      email: string;
      name: string | null;
      phone: string | null;
    }>
  ): Promise<CustomerContact> {
    const contact = await this.repository.findById(id);
    if (!contact) {
      throw new NotFoundError(`Customer contact not found`);
    }

    try {
      return await this.repository.update(id, data);
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictError(`A contact with email "${data.email}" already exists`);
      }
      throw error;
    }
  }

  async getById(id: string): Promise<CustomerContact> {
    const contact = await this.repository.findById(id);
    if (!contact) {
      throw new NotFoundError(`Customer contact not found`);
    }
    return contact;
  }

  async list(filters: CustomerContactListFilters) {
    const result = await this.repository.findAll(filters);
    return {
      items: result.items,
      total: result.total,
      page: filters.page,
      pageSize: filters.pageSize,
    };
  }

  async deactivate(id: string): Promise<void> {
    const contact = await this.repository.findById(id);
    if (!contact) {
      throw new NotFoundError(`Customer contact not found`);
    }
    await this.repository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    const contact = await this.repository.findByEmail(
      (await this.dbContactEmail(id)) || "",
      true
    );
    if (!contact) {
      throw new NotFoundError(`Customer contact not found`);
    }
    await this.repository.restore(id);
  }

  private async dbContactEmail(id: string): Promise<string | null> {
    const contact = await this.repository.findById(id, true);
    return contact ? contact.email : null;
  }
}
