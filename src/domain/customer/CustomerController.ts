// src/domain/customer/CustomerController.ts
import { CustomerService } from "./CustomerService";
import { CustomerListFilters } from "./ICustomerRepository";
import { CreateCustomerInput, UpdateCustomerInput } from "../../http/validation/customer.schema";
import { Customer } from "../../generated/prisma/client";

export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  async list(filters: CustomerListFilters): Promise<{
    items: Customer[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    return this.customerService.list(filters);
  }

  async getById(id: string): Promise<Customer> {
    return this.customerService.getById(id);
  }

  async create(input: CreateCustomerInput): Promise<Customer> {
    return this.customerService.createCustomer(input);
  }

  async update(id: string, input: UpdateCustomerInput): Promise<Customer> {
    return this.customerService.updateCustomer(id, input);
  }

  async deactivate(id: string): Promise<void> {
    return this.customerService.deactivate(id);
  }

  async restore(id: string): Promise<void> {
    return this.customerService.restore(id);
  }
}
