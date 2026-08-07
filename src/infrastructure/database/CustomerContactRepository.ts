// src/infrastructure/database/CustomerContactRepository.ts
import { ICustomerContactRepository, CustomerContactListFilters } from "../../domain/customerContact/ICustomerContactRepository";
import { CustomerContact } from "../../generated/prisma/client";
import prisma from "../../config/database";

export class CustomerContactRepository implements ICustomerContactRepository {
  async findById(id: string, includeDeleted = false): Promise<CustomerContact | null> {
    return prisma.customerContact.findFirst({
      where: {
        id,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
    });
  }

  async findByEmail(email: string, includeDeleted = false): Promise<CustomerContact | null> {
    return prisma.customerContact.findFirst({
      where: {
        email,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
    });
  }

  async findAll(filters: CustomerContactListFilters): Promise<{ items: CustomerContact[]; total: number }> {
    const where: any = {
      deletedAt: null,
      ...(filters.customerId && { customerId: filters.customerId }),
    };

    if (filters.search) {
      where.OR = [
        { email: { contains: filters.search, mode: "insensitive" } },
        { name: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const skip = (filters.page - 1) * filters.pageSize;
    const take = filters.pageSize;

    const [items, total] = await Promise.all([
      prisma.customerContact.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.customerContact.count({ where }),
    ]);

    return { items, total };
  }

  async create(data: {
    customerId: string;
    email: string;
    password: string;
    name?: string | null;
    phone?: string | null;
  }): Promise<CustomerContact> {
    return prisma.customerContact.create({
      data: {
        customerId: data.customerId,
        email: data.email,
        password: data.password,
        name: data.name ?? null,
        phone: data.phone ?? null,
        isActive: true,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      email: string;
      name: string | null;
      phone: string | null;
      password: string;
      lastLoginAt: Date;
      isActive: boolean;
    }>
  ): Promise<CustomerContact> {
    return prisma.customerContact.update({
      where: { id },
      data: {
        ...(data.email && { email: data.email }),
        ...(data.name !== undefined && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.password && { password: data.password }),
        ...(data.lastLoginAt && { lastLoginAt: data.lastLoginAt }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
  }

  async softDelete(id: string): Promise<void> {
    await prisma.customerContact.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }

  async restore(id: string): Promise<void> {
    await prisma.customerContact.update({
      where: { id },
      data: {
        deletedAt: null,
        isActive: true,
      },
    });
  }
}
