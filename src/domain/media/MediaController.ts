// Path: server/src/domain/media/MediaController.ts
import { MediaService } from "./MediaService";

export class MediaController {
  constructor(private readonly service: MediaService) {}

  async getPresignedUpload(orderId: string, reportName: string, fileName: string, contentType: string) {
    return this.service.getPresignedUpload(orderId, reportName, fileName, contentType);
  }

  async confirmUpload(orderId: string, reportName: string, objectKey: string, mediaType: "PHOTO" | "VIDEO" | "AUDIO" | "FILE", userId: string) {
    return this.service.confirmUpload(orderId, reportName, objectKey, mediaType, userId);
  }

  async listForReport(orderId: string, reportName: string) {
    return this.service.listForReport(orderId, reportName);
  }

  async listForOrder(orderId: string) {
    return this.service.listForOrder(orderId);
  }

  async deleteMedia(id: string) {
    await this.service.deleteMedia(id);
  }
}
