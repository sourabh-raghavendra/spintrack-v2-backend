// src/infrastructure/database/OrderRepository.ts
import { IOrderRepository, OrderListFilters, OrderWithRelations } from "../../domain/order/IOrderRepository";
import { Order, OrderStage, OrderType, Zone } from "../../generated/prisma/client";
import prisma from "../../config/database";

const orderIncludes = {
  customer: {
    select: {
      id: true,
      customerName: true,
    },
  },
  spindle: {
    select: {
      id: true,
      make: true,
      type: true,
      serialNumber: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      name: true,
      employeeCode: true,
    },
  },
  customerContact: {
    select: {
      id: true,
      email: true,
      name: true,
    },
  },
};

export class OrderRepository implements IOrderRepository {
  async findAll(
    filters: OrderListFilters,
    visibleZones: string[] | "ALL",
  ): Promise<{ items: OrderWithRelations[]; total: number }> {
    const where: any = {};

    if (filters.orderType) {
      where.orderType = filters.orderType as OrderType;
    }
    if (filters.orderStage) {
      where.orderStage = filters.orderStage as OrderStage;
    }
    if (filters.customerId) {
      where.customerId = filters.customerId;
    }

    if (visibleZones !== "ALL") {
      where.zone = { in: visibleZones as Zone[] };
    } else if (filters.zone) {
      where.zone = filters.zone as Zone;
    }

    if (filters.search) {
      const searchStr = filters.search.trim();
      where.OR = [
        { rma: { contains: searchStr, mode: "insensitive" } },
        { so: { contains: searchStr, mode: "insensitive" } },
        { jo: { contains: searchStr, mode: "insensitive" } },
        { quotation: { contains: searchStr, mode: "insensitive" } },
        { customer: { customerName: { contains: searchStr, mode: "insensitive" } } },
        { spindle: { make: { contains: searchStr, mode: "insensitive" } } },
      ];
    }

    const skip = (filters.page - 1) * filters.pageSize;
    const take = filters.pageSize;

    let orderBy: any = { createdAt: "desc" };
    if (filters.sortBy) {
      orderBy = { [filters.sortBy]: filters.sortOrder || "asc" };
    }

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        include: orderIncludes,
        orderBy,
      }) as Promise<OrderWithRelations[]>,
      prisma.order.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string): Promise<OrderWithRelations | null> {
    return prisma.order.findUnique({
      where: { id },
      include: orderIncludes,
    }) as Promise<OrderWithRelations | null>;
  }

  async create(data: {
    rma: string;
    so: string;
    jo: string;
    quotation: string;
    orderType: string;
    spindleReceivedDate: Date;
    zone: string;
    customerId: string;
    spindleId: string;
    createdById: string;
    customerContactId?: string | null;
  }): Promise<Order> {
    return prisma.order.create({
      data: {
        rma: data.rma,
        so: data.so,
        jo: data.jo,
        quotation: data.quotation,
        orderType: data.orderType as OrderType,
        spindleReceivedDate: data.spindleReceivedDate,
        zone: data.zone as Zone,
        customerId: data.customerId,
        spindleId: data.spindleId,
        createdById: data.createdById,
        customerContactId: data.customerContactId,
        orderStage: OrderStage.RECEIVED,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      rma: string;
      so: string;
      jo: string;
      quotation: string;
      spindleReceivedDate: Date | null;
      customerId: string;
      spindleId: string;
      customerContactId: string | null;
    }>,
  ): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async setStage(id: string, stage: OrderStage): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data: {
        orderStage: stage,
      },
    });
  }

  async hardDelete(id: string): Promise<void> {
    await prisma.order.delete({
      where: { id },
    });
  }

  async isSpindleInOpenOrder(spindleId: string, excludeOrderId?: string): Promise<boolean> {
    const result = await prisma.order.findFirst({
      where: {
        spindleId,
        orderStage: { in: [OrderStage.RECEIVED, OrderStage.ONGOING] },
        id: excludeOrderId ? { not: excludeOrderId } : undefined,
      },
    });
    return !!result;
  }
}
