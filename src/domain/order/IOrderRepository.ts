// src/domain/order/IOrderRepository.ts
import { Order, OrderStage } from "../../generated/prisma/client";

export type OrderWithRelations = Order & {
  customer: { id: string; customerName: string };
  spindle: { id: string; make: string; type: string; serialNumber: string };
  createdBy: { id: string; name: string; employeeCode: string };
  customerContact: { id: string; email: string; name: string | null } | null;
};

export interface OrderListFilters {
  orderType?: string;
  orderStage?: string;
  zone?: string;
  search?: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  customerId?: string;
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
    customerContactId?: string | null;
    isUnderWarranty?: boolean;
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
      customerContactId: string | null;
      isUnderWarranty: boolean;
    }>,
  ): Promise<Order>;
  setStage(id: string, stage: OrderStage): Promise<Order>;
  hardDelete(id: string): Promise<void>;
  isSpindleInOpenOrder(spindleId: string, excludeOrderId?: string): Promise<boolean>;
}
