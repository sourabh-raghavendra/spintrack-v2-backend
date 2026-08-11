// Path: server/src/domain/portal/PortalOrderController.ts
import { PortalOrderService } from "./PortalOrderService";

export class PortalOrderController {
  constructor(private readonly service: PortalOrderService) {}

  async listOrders(customerId: string) {
    return this.service.listOrders(customerId);
  }

  async getOrderDetails(orderId: string, customerId: string) {
    return this.service.getOrderDetails(orderId, customerId);
  }

  async getOrderMedia(orderId: string, customerId: string) {
    return this.service.getOrderMedia(orderId, customerId);
  }

  async getOrderRemarks(orderId: string, customerId: string) {
    return this.service.getOrderRemarks(orderId, customerId);
  }
}
