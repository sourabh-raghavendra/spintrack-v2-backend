import { OrderReportLog, ReportStatus } from "../../generated/prisma/client";

export interface OrderReportLogWithRelations extends OrderReportLog {
  openedBy: { id: string; name: string } | null;
  closedBy: { id: string; name: string } | null;
}

export interface IOrderReportLogRepository {
  findAllForOrder(orderId: string): Promise<OrderReportLogWithRelations[]>;
  findOne(orderId: string, reportName: string): Promise<OrderReportLog | null>;
  create(data: {
    orderId: string;
    reportName: string;
    status: ReportStatus;
    openedAt: Date;
    openedById: string;
  }): Promise<OrderReportLog>;
  markClosed(
    orderId: string,
    reportName: string,
    data: { closedAt: Date; closedById: string },
  ): Promise<OrderReportLog>;
}
