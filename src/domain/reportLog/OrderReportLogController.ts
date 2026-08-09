import { OrderReportLogService } from "./OrderReportLogService";

export class OrderReportLogController {
  constructor(private readonly service: OrderReportLogService) {}

  async getTimeline(orderId: string) {
    return this.service.getTimelineForOrder(orderId);
  }

  async initiate(orderId: string, reportName: string, userId: string) {
    return this.service.initiateReport(orderId, reportName, userId);
  }

  async close(orderId: string, reportName: string, userId: string) {
    return this.service.closeReport(orderId, reportName, userId);
  }
}
