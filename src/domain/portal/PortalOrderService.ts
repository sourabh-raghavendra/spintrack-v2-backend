// Path: server/src/domain/portal/PortalOrderService.ts
import prisma from "../../config/database";
import { NotFoundError } from "../../errors/HttpError";
import { IStorageService } from "../../infrastructure/storage/IStorageService";
import { FinalInspectionPdfService } from "../finalInspectionPdf/FinalInspectionPdfService";

export class PortalOrderService {
  constructor(private readonly storage: IStorageService) {}

  async listOrders(customerId: string) {
    return prisma.order.findMany({
      where: {
        customerId,
        orderStage: { in: ["RECEIVED", "ONGOING", "COMPLETED"] },
      },
      include: {
        spindle: { select: { serialNumber: true, make: true, type: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getOrderDetails(orderId: string, customerId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId,
        orderStage: { in: ["RECEIVED", "ONGOING", "COMPLETED"] },
      },
      include: {
        spindle: { select: { serialNumber: true, make: true, type: true } },
        customer: true,
      },
    });
    if (!order) throw new NotFoundError("Order not found");
    return order;
  }

  async getOrderMedia(orderId: string, customerId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId,
        orderStage: { in: ["RECEIVED", "ONGOING", "COMPLETED"] },
      },
    });
    if (!order) throw new NotFoundError("Order not found");

    const mediaList = await prisma.media.findMany({
      where: { orderId },
      include: { uploadedBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });

    return Promise.all(
      mediaList.map(async (item) => ({
        ...item,
        viewUrl: await this.storage.getPresignedDownloadUrl(item.objectKey),
      }))
    );
  }

  async getOrderRemarks(orderId: string, customerId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId,
        orderStage: { in: ["RECEIVED", "ONGOING", "COMPLETED"] },
      },
    });
    if (!order) throw new NotFoundError("Order not found");

    return prisma.remarksForCustomer.findUnique({
      where: { orderId },
    });
  }

  async getFinalInspectionPdf(orderId: string, customerId: string) {
    // Ensures ownership/access verification
    await this.getOrderDetails(orderId, customerId);
    const finalInspectionService = new FinalInspectionPdfService();
    return finalInspectionService.assembleData(orderId);
  }
}
