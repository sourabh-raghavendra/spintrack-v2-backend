import { CustomerContact } from "../../generated/prisma/client";

export interface CustomerContactListFilters {
  customerId?: string;
  search?: string; // partial match on email or name
  page: number;
  pageSize: number;
}

export interface ICustomerContactRepository {
  findAll(filters: CustomerContactListFilters): Promise<{ items: CustomerContact[]; total: number }>;
  findById(id: string, includeDeleted?: boolean): Promise<CustomerContact | null>;
  findByEmail(email: string, includeDeleted?: boolean): Promise<CustomerContact | null>;
  create(data: {
    customerId: string;
    email: string;
    password: string; // already hashed by the service before this is called
    name?: string | null;
    phone?: string | null;
  }): Promise<CustomerContact>;
  update(id: string, data: Partial<{
    email: string;
    name: string | null;
    phone: string | null;
    password: string;
    lastLoginAt: Date;
  }>): Promise<CustomerContact>;
  softDelete(id: string): Promise<void>;
  restore(id: string): Promise<void>;
}
