// src/domain/order/IOrderRepository.ts
import { Order, OrderStage } from "../../generated/prisma/client";

export type OrderWithRelations = Order & {
  customer: { id: string; customerName: string };
  spindle: { id: string; make: string; type: string; serialNumber: string };
  createdBy: { id: string; name: string; employeeCode: string };
};

export interface OrderListFilters {
  orderType?: string;
  orderStage?: string;
  zone?: string;
  search?: string;
  page: number;
  pageSize: number;
}

export interface IOrderRepository {
  findAll(
    filters: OrderListFilters,
    visibleZones: string[] | "ALL",
  ): Promise<{ items: OrderWithRelations[]; total: number }>;
  findById(id: string): Promise<OrderWithRelations | null>;
  create(data: {
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
  }): Promise<Order>;
  update(
    id: string,
    data: Partial<{
      rma: string;
      so: string;
      jo: string;
      quotation: string;
      spindleReceivedDate: Date | null;
      customerId: string;
      spindleId: string;
    }>,
  ): Promise<Order>;
  setStage(id: string, stage: OrderStage): Promise<Order>;
  hardDelete(id: string): Promise<void>;
  isSpindleInOpenOrder(spindleId: string, excludeOrderId?: string): Promise<boolean>;
}
