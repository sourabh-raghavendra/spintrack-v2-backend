import { IOrderReportLogRepository } from "./IOrderReportLogRepository";
import { IReportRecordRepository } from "./IReportRecordRepository";
import { OrderService } from "../order/OrderService";
import { REPORTS } from "../permission/permissions";
import { ConflictError, ValidationError } from "../../errors/HttpError";
import logger from "../../observability/logger";
import { OrderReportLog } from "../../generated/prisma/client";

export class OrderReportLogService {
  constructor(
    private readonly repository: IOrderReportLogRepository,
    private readonly orderService: OrderService,
    private readonly reportRecordRepository: IReportRecordRepository,
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

    // Record creation hook
    try {
      await this.runCreationHook(orderId, reportName);
    } catch (err: any) {
      logger.error(
        { err, orderId, reportName },
        "Report creation hook failed"
      );
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
    if (reportName === "order_closure") {
      const order = await this.orderService.getById(orderId);
      if (order.orderStage !== "ONGOING") {
        throw new ValidationError("Order must be ongoing before it can be closed");
      }
    }

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

  private async runCreationHook(orderId: string, reportName: string): Promise<void> {
    switch (reportName) {
      case "incoming_alert":
        await this.reportRecordRepository.createBlankIncomingAlert(orderId);
        break;
      case "checksheet":
        await this.reportRecordRepository.createBlankChecksheet(orderId);
        break;
      case "damage_report":
        await this.reportRecordRepository.createBlankDamageReport(orderId);
        break;
      case "old_bearing_report":
        await this.reportRecordRepository.createBlankBearings(orderId, false);
        break;
      case "new_bearing_report":
        await this.reportRecordRepository.createBlankBearings(orderId, true);
        break;
      case "electrical_test":
        await this.reportRecordRepository.createBlankElectricalTest(orderId);
        break;
      case "drawbar_details":
        await this.reportRecordRepository.createBlankDrawbarDetails(orderId);
        break;
      case "final_inspection":
        await this.reportRecordRepository.createBlankFinalInspection(orderId);
        break;
      case "testing_balancing":
        await this.reportRecordRepository.createBlankTestingBalancing(orderId);
        break;
      case "remarks_for_customer":
        await this.reportRecordRepository.createBlankRemarksForCustomer(orderId);
        break;
      case "order_closure":
        await this.reportRecordRepository.createBlankOrderClosure(orderId);
        break;
      default:
        break;
    }
  }
}
