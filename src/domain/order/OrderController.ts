import { OrderService } from "./OrderService";
import { OrderListFilters } from "./IOrderRepository";
import { CreateOrderInput, UpdateOrderInput } from "../../http/validation/order.schema";
import { Order } from "../../generated/prisma/client";
import { RequestUser } from "../../types/common";
import { generateOrderOnePagerPdf } from "../../utils/pdfGenerator";

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  async list(filters: OrderListFilters, requestingUser: RequestUser) {
    return this.orderService.list(filters, requestingUser);
  }

  async getById(id: string) {
    return this.orderService.getById(id);
  }

  async create(input: CreateOrderInput, requestingUser: RequestUser): Promise<Order> {
    return this.orderService.createOrder(input, requestingUser);
  }

  async update(id: string, input: UpdateOrderInput, requestingUser: RequestUser): Promise<Order> {
    return this.orderService.updateOrder(id, input, requestingUser);
  }

  async archive(id: string): Promise<Order> {
    return this.orderService.archiveOrder(id);
  }

  async unarchive(id: string): Promise<Order> {
    return this.orderService.unarchiveOrder(id);
  }

  async remove(id: string): Promise<void> {
    return this.orderService.deleteOrder(id);
  }

  async getOnePagerPdf(id: string): Promise<Buffer> {
    return this.orderService.getById(id).then((order) => {
      return generateOrderOnePagerPdf(order);
    });
  }
}
