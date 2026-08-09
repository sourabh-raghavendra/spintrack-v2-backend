import { IOrderReportLogRepository, OrderReportLogWithRelations } from "../../domain/reportLog/IOrderReportLogRepository";
import { OrderReportLog, ReportStatus } from "../../generated/prisma/client";
import prisma from "../../config/database";

export class OrderReportLogRepository implements IOrderReportLogRepository {
  async findAllForOrder(orderId: string): Promise<OrderReportLogWithRelations[]> {
    return prisma.orderReportLog.findMany({
      where: { orderId },
      include: {
        openedBy: { select: { id: true, name: true } },
        closedBy: { select: { id: true, name: true } },
      },
    }) as any;
  }

  async findOne(orderId: string, reportName: string): Promise<OrderReportLog | null> {
    return prisma.orderReportLog.findUnique({
      where: {
        orderId_reportName: {
          orderId,
          reportName,
        },
      },
    });
  }

  async create(data: {
    orderId: string;
    reportName: string;
    status: ReportStatus;
    openedAt: Date;
    openedById: string;
  }): Promise<OrderReportLog> {
    return prisma.orderReportLog.create({
      data,
    });
  }

  async markClosed(
    orderId: string,
    reportName: string,
    data: { closedAt: Date; closedById: string }
  ): Promise<OrderReportLog> {
    return prisma.orderReportLog.update({
      where: {
        orderId_reportName: {
          orderId,
          reportName,
        },
      },
      data: {
        status: "COMPLETED",
        closedAt: data.closedAt,
        closedById: data.closedById,
      },
    });
  }
}
