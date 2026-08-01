// src/infrastructure/database/CustomerRepository.ts
import { ICustomerRepository, CustomerListFilters } from "../../domain/customer/ICustomerRepository";
import { Customer, Zone } from "../../generated/prisma/client";
import prisma from "../../config/database";

export class CustomerRepository implements ICustomerRepository {
  async findAll(
    filters: CustomerListFilters,
  ): Promise<{ items: Customer[]; total: number }> {
    const where: any = {
      deletedAt: null,
    };

    if (filters.zone) {
      where.zone = filters.zone as Zone;
    }

    if (filters.search) {
      const searchStr = filters.search.trim();
      where.OR = [
        { customerName: { contains: searchStr, mode: "insensitive" } },
        { customerId: { equals: searchStr, mode: "insensitive" } },
      ];
    }

    const skip = (filters.page - 1) * filters.pageSize;
    const take = filters.pageSize;

    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take,
        orderBy: { customerName: "asc" },
      }),
      prisma.customer.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string, includeDeleted = false): Promise<Customer | null> {
    return prisma.customer.findFirst({
      where: { id, ...(!includeDeleted && { deletedAt: null }) },
    });
  }

  async findByCustomerId(customerId: string): Promise<Customer | null> {
    return prisma.customer.findFirst({
      where: { customerId, deletedAt: null },
    });
  }

  async create(data: {
    customerId: string;
    customerName: string;
    customerState: string;
    customerCity: string;
    postalCode?: string | null;
    zone: string;
  }): Promise<Customer> {
    return prisma.customer.create({
      data: {
        customerId: data.customerId,
        customerName: data.customerName,
        customerState: data.customerState,
        customerCity: data.customerCity,
        postalCode: data.postalCode ?? null,
        zone: data.zone as Zone,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      customerName: string;
      customerState: string;
      customerCity: string;
      postalCode: string | null;
      zone: string;
    }>,
  ): Promise<Customer> {
    return prisma.customer.update({
      where: { id },
      data: {
        ...data,
        zone: data.zone ? (data.zone as Zone) : undefined,
      },
    });
  }

  async softDelete(id: string): Promise<void> {
    await prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string): Promise<void> {
    await prisma.customer.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
