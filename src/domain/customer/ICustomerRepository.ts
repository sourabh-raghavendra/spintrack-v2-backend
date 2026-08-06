// src/domain/customer/ICustomerRepository.ts
import { Customer } from "../../generated/prisma/client";

export interface CustomerListFilters {
  zone?: string;
  zones?: string[];
  search?: string; // matches against customerName or customerId
  page: number;
  pageSize: number;
}

export interface ICustomerRepository {
  findAll(
    filters: CustomerListFilters,
  ): Promise<{ items: Customer[]; total: number }>;
  findById(id: string, includeDeleted?: boolean): Promise<Customer | null>;
  findByCustomerId(customerId: string): Promise<Customer | null>;
  create(data: {
    customerId: string;
    customerName: string;
    customerState: string;
    customerCity: string;
    postalCode?: string | null;
    zone: string;
  }): Promise<Customer>;
  update(
    id: string,
    data: Partial<{
      customerName: string;
      customerState: string;
      customerCity: string;
      postalCode: string | null;
      zone: string;
    }>,
  ): Promise<Customer>;
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<void>;
}
