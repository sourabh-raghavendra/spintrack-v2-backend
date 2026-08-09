import { IOrderReportLogRepository } from "./IOrderReportLogRepository";
import { OrderService } from "../order/OrderService";
import { REPORTS } from "../permission/permissions";
import { ConflictError, ValidationError } from "../../errors/HttpError";
import logger from "../../observability/logger";
import { OrderReportLog } from "../../generated/prisma/client";

export class OrderReportLogService {
  constructor(
    private readonly repository: IOrderReportLogRepository,
    private readonly orderService: OrderService
  ) {}

  async getTimelineForOrder(orderId: string): Promise<any[]> {
    const existingLogs = await this.repository.findAllForOrder(orderId);
    const logMap = new Map<string, OrderReportLog>();
    
    for (const log of existingLogs) {
      logMap.set(log.reportName, log);
    }

    return REPORTS.map((reportName) => {
      const existing = logMap.get(reportName);
      if (existing) {
        return existing;
      }
      return {
        id: "",
        orderId,
        reportName,
        status: "NOT_STARTED",
        openedAt: null,
        openedById: null,
        closedAt: null,
        closedById: null,
      };
    });
  }

  async initiateReport(orderId: string, reportName: string, userId: string): Promise<OrderReportLog> {
    let result: OrderReportLog;
    try {
      result = await this.repository.create({
        orderId,
        reportName,
        status: "ONGOING",
        openedAt: new Date(),
        openedById: userId,
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new ConflictError(`"${reportName}" has already been initiated for this order`);
      }
      throw error;
    }

    if (reportName === "incoming_alert") {
      try {
        await this.orderService.markOngoingFromIncomingAlert(orderId);
      } catch (err: any) {
        logger.error(
          { orderId, error: err.message, stack: err.stack },
          "Failed to sync order stage to ONGOING from incoming_alert hook"
        );
      }
    }

    return result;
  }

  async closeReport(orderId: string, reportName: string, userId: string): Promise<OrderReportLog> {
    const log = await this.repository.findOne(orderId, reportName);
    if (!log || log.status !== "ONGOING") {
      throw new ValidationError(`"${reportName}" must be initiated before it can be closed`);
    }

    const result = await this.repository.markClosed(orderId, reportName, {
      closedAt: new Date(),
      closedById: userId,
    });

    if (reportName === "order_closure") {
      try {
        await this.orderService.markCompletedFromClosure(orderId);
      } catch (err: any) {
        logger.error(
          { orderId, error: err.message, stack: err.stack },
          "Failed to sync order stage to COMPLETED from order_closure hook"
        );
      }
    }

    return result;
  }
}
