// src/domain/customer/CustomerService.ts
import { ICustomerRepository, CustomerListFilters } from "./ICustomerRepository";
import { Customer } from "../../generated/prisma/client";
import { NotFoundError, ConflictError } from "../../errors/HttpError";
import { ErrorCodes } from "../../errors/errorCodes";

export class CustomerService {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async list(filters: CustomerListFilters): Promise<{
    items: Customer[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const { items, total } = await this.customerRepository.findAll(filters);
    return {
      items,
      total,
      page: filters.page,
      pageSize: filters.pageSize,
    };
  }

  async getById(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(id, false);
    if (!customer) {
      throw new NotFoundError(
        `Customer with ID "${id}" not found`,
        ErrorCodes.NOT_FOUND,
      );
    }
    return customer;
  }

  async createCustomer(data: {
    customerId: string;
    customerName: string;
    customerState: string;
    customerCity: string;
    postalCode?: string | null;
    zone: string;
  }): Promise<Customer> {
    try {
      return await this.customerRepository.create(data);
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictError(
          `Customer ID "${data.customerId}" already exists`,
          ErrorCodes.USER_ALREADY_EXISTS,
        );
      }
      throw error;
    }
  }

  async updateCustomer(
    id: string,
    data: Partial<{
      customerName: string;
      customerState: string;
      customerCity: string;
      postalCode: string | null;
      zone: string;
    }>,
  ): Promise<Customer> {
    const customer = await this.customerRepository.findById(id, false);
    if (!customer) {
      throw new NotFoundError(
        `Customer with ID "${id}" not found`,
        ErrorCodes.NOT_FOUND,
      );
    }

    return this.customerRepository.update(id, data);
  }

  async deactivate(id: string): Promise<void> {
    const customer = await this.customerRepository.findById(id, false);
    if (!customer) {
      throw new NotFoundError(
        `Customer with ID "${id}" not found`,
        ErrorCodes.NOT_FOUND,
      );
    }
    await this.customerRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    const customer = await this.customerRepository.findById(id, true);
    if (!customer) {
      throw new NotFoundError(
        `Customer with ID "${id}" not found`,
        ErrorCodes.NOT_FOUND,
      );
    }

    // Only restore if currently deleted
    if (customer.deletedAt !== null) {
      await this.customerRepository.restore(id);
    }
  }
}
