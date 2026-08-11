// Path: server/src/domain/media/MediaService.ts
import { NotFoundError } from "../../errors/HttpError";
import prisma from "../../config/database";
import { IStorageService } from "../../infrastructure/storage/IStorageService";
import crypto from "crypto";

export class MediaService {
  constructor(private readonly storage: IStorageService) {}

  async getPresignedUpload(orderId: string, reportName: string, fileName: string, contentType: string) {
    const objectKey = `orders/${orderId}/${reportName}/${crypto.randomUUID()}-${fileName}`;
    const uploadUrl = await this.storage.getPresignedUploadUrl(objectKey, contentType);
    return { uploadUrl, objectKey };
  }

  async confirmUpload(orderId: string, reportName: string, objectKey: string, mediaType: "PHOTO" | "VIDEO" | "AUDIO" | "FILE", userId: string) {
    return prisma.media.create({
      data: { orderId, reportName, objectKey, mediaType, uploadedById: userId },
      include: { uploadedBy: { select: { id: true, name: true } } },
    });
  }

  async listForReport(orderId: string, reportName: string) {
    const items = await prisma.media.findMany({
      where: { orderId, reportName },
      include: { uploadedBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });
    return this.attachViewUrls(items);
  }

  async listForOrder(orderId: string) {
    const items = await prisma.media.findMany({
      where: { orderId },
      include: { uploadedBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });
    return this.attachViewUrls(items);
  }

  private async attachViewUrls(items: any[]) {
    return Promise.all(
      items.map(async (item) => ({
        ...item,
        viewUrl: await this.storage.getPresignedDownloadUrl(item.objectKey),
      }))
    );
  }

  async deleteMedia(id: string) {
    const existing = await prisma.media.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Media not found");
    await this.storage.deleteObject(existing.objectKey);
    await prisma.media.delete({ where: { id } });
  }
}
