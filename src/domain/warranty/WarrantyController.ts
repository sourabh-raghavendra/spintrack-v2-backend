// Path: server/src/domain/warranty/WarrantyController.ts
import { WarrantyService } from "./WarrantyService";
import { WarrantyCertificateService } from "./WarrantyCertificateService";
import prisma from "../../config/database";
import { NotFoundError } from "../../errors/HttpError";

export class WarrantyController {
  constructor(
    private readonly service: WarrantyService,
    private readonly certService: WarrantyCertificateService
  ) {}

  async getStatus(orderId: string) {
    return this.service.getWarrantyStatus(orderId);
  }

  async getCertificate(orderId: string) {
    return this.certService.generateCertificatePdf(orderId);
  }

  async getPortalStatus(orderId: string, customerId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.customerId !== customerId) {
      throw new NotFoundError("Order not found or access denied");
    }
    return this.service.getWarrantyStatus(orderId);
  }

  async getPortalCertificate(orderId: string, customerId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.customerId !== customerId) {
      throw new NotFoundError("Order not found or access denied");
    }
    return this.certService.generateCertificatePdf(orderId);
  }
}
