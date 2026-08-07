// src/domain/order/OrderService.ts
import { IOrderRepository, OrderListFilters, OrderWithRelations } from "./IOrderRepository";
import { Order, OrderStage } from "../../generated/prisma/client";
import { NotFoundError, ConflictError, ValidationError } from "../../errors/HttpError";
import { ErrorCodes } from "../../errors/errorCodes";
import { RequestUser } from "../../types/common";

export class OrderService {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async list(
    filters: OrderListFilters,
    requestingUser: RequestUser,
  ): Promise<{
    items: OrderWithRelations[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    let visibleZones: string[] | "ALL" = "ALL";

    if (!requestingUser.isAdmin) {
      const prefix = "orders:view_zone_";
      visibleZones = requestingUser.permissions
        .filter((p) => p.startsWith(prefix))
        .map((p) => p.substring(prefix.length).toUpperCase());

      if (visibleZones.length === 0) {
        return {
          items: [],
          total: 0,
          page: filters.page,
          pageSize: filters.pageSize,
        };
      }
    }

    const { items, total } = await this.orderRepository.findAll(filters, visibleZones);
    return {
      items,
      total,
      page: filters.page,
      pageSize: filters.pageSize,
    };
  }

  async getById(id: string): Promise<OrderWithRelations> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError(
        `Order with ID "${id}" not found`,
        ErrorCodes.NOT_FOUND,
      );
    }
    return order;
  }

  async createOrder(
    input: {
      rma: string;
      so: string;
      jo: string;
      quotation: string;
      orderType: string;
      spindleReceivedDate: Date;
      customerId: string;
      spindleId: string;
    },
    requestingUser: RequestUser,
  ): Promise<Order> {
    const zone = requestingUser.zone;

    // Check if spindle is already in open order
    const isAttached = await this.orderRepository.isSpindleInOpenOrder(input.spindleId);
    if (isAttached) {
      throw new ConflictError(
        "This spindle is already attached to an open order",
        ErrorCodes.USER_ALREADY_EXISTS,
      );
    }

    try {
      return await this.orderRepository.create({
        ...input,
        zone,
        createdById: requestingUser.id,
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        const target = Array.isArray(error.meta?.target)
          ? error.meta.target[0]
          : typeof error.meta?.target === "string"
          ? error.meta.target
          : "field";
        throw new ConflictError(
          `Order with this ${target} already exists`,
          ErrorCodes.USER_ALREADY_EXISTS,
        );
      }
      if (error.code === "P2003") {
        throw new NotFoundError(
          "Customer or Spindle does not exist",
          ErrorCodes.NOT_FOUND,
        );
      }
      throw error;
    }
  }

  async updateOrder(
    id: string,
    input: Partial<{
      rma: string;
      so: string;
      jo: string;
      quotation: string;
      spindleReceivedDate: Date | null;
      customerId: string;
      spindleId: string;
    }>,
    requestingUser: RequestUser,
  ): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError(
        `Order with ID "${id}" not found`,
        ErrorCodes.NOT_FOUND,
      );
    }

    if (input.spindleId && input.spindleId !== order.spindleId) {
      if (order.orderStage !== OrderStage.RECEIVED) {
        throw new ValidationError(
          "Spindle can only be changed while the order is in RECEIVED stage",
          ErrorCodes.VALIDATION_ERROR,
        );
      }
      const isAttached = await this.orderRepository.isSpindleInOpenOrder(input.spindleId, id);
      if (isAttached) {
        throw new ConflictError(
          "This spindle is already attached to an open order",
          ErrorCodes.USER_ALREADY_EXISTS,
        );
      }
    }

    try {
      return await this.orderRepository.update(id, input);
    } catch (error: any) {
      if (error.code === "P2002") {
        const target = Array.isArray(error.meta?.target)
          ? error.meta.target[0]
          : typeof error.meta?.target === "string"
          ? error.meta.target
          : "field";
        throw new ConflictError(
          `Order with this ${target} already exists`,
          ErrorCodes.USER_ALREADY_EXISTS,
        );
      }
      if (error.code === "P2003") {
        throw new NotFoundError(
          "Customer or Spindle does not exist",
          ErrorCodes.NOT_FOUND,
        );
      }
      throw error;
    }
  }

  async archiveOrder(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError(
        `Order with ID "${id}" not found`,
        ErrorCodes.NOT_FOUND,
      );
    }

    if (order.orderStage === OrderStage.COMPLETED) {
      throw new ValidationError(
        "Completed orders cannot be archived",
        ErrorCodes.VALIDATION_ERROR,
      );
    }

    return this.orderRepository.setStage(id, OrderStage.ARCHIVED);
  }

  async unarchiveOrder(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError(
        `Order with ID "${id}" not found`,
        ErrorCodes.NOT_FOUND,
      );
    }

    if (order.orderStage !== OrderStage.ARCHIVED) {
      throw new ValidationError(
        "Only archived orders can be unarchived",
        ErrorCodes.VALIDATION_ERROR,
      );
    }

    return this.orderRepository.setStage(id, OrderStage.ONGOING);
  }

  async deleteOrder(id: string): Promise<void> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError(
        `Order with ID "${id}" not found`,
        ErrorCodes.NOT_FOUND,
      );
    }

    if (order.orderStage !== OrderStage.ARCHIVED) {
      throw new ValidationError(
        "Only archived orders can be deleted",
        ErrorCodes.VALIDATION_ERROR,
      );
    }

    await this.orderRepository.hardDelete(id);
  }

  // ── Internal-only methods (called from Reports domain later) ──────────
  async markOngoingFromIncomingAlert(orderId: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (order && order.orderStage === OrderStage.RECEIVED) {
      await this.orderRepository.setStage(orderId, OrderStage.ONGOING);
    }
  }

  async markCompletedFromClosure(orderId: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (order) {
      await this.orderRepository.setStage(orderId, OrderStage.COMPLETED);
    }
  }
}
