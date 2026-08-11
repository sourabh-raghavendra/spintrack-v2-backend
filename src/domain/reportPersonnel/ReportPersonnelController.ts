// Path: server/src/domain/reportPersonnel/ReportPersonnelController.ts
import { ReportPersonnelService } from "./ReportPersonnelService";

export class ReportPersonnelController {
  constructor(private readonly service: ReportPersonnelService) {}

  async listForReport(orderId: string, reportName: string) {
    return this.service.listForReport(orderId, reportName);
  }

  async addPersonnel(orderId: string, reportName: string, userId: string, role: string) {
    return this.service.addPersonnel(orderId, reportName, userId, role);
  }

  async removePersonnel(id: string) {
    await this.service.removePersonnel(id);
  }

  async getInspectionHistoryForUser(userId: string) {
    return this.service.getInspectionHistoryForUser(userId);
  }
}
