import { REPORT_TABLE_CONFIG } from "./reportTableConfig";
import { NotFoundError, ValidationError, ConflictError } from "../../errors/HttpError";
import prisma from "../../config/database";

export class ReportFieldService {
  async readReport(orderId: string, reportName: string): Promise<any> {
    const config = REPORT_TABLE_CONFIG[reportName];
    if (!config) {
      throw new NotFoundError(`Unknown report: ${reportName}`);
    }

    if (config.multiRow) {
      const where = this.buildBaseWhere(orderId, reportName);
      return prisma[config.prismaModel as any].findMany({
        where,
      });
    }

    return prisma[config.prismaModel as any].findUnique({
      where: { orderId },
    });
  }

  async writeReportFields(
    orderId: string,
    reportName: string,
    recordKey: Record<string, any> | undefined,
    fields: Record<string, any>,
    userId: string
  ): Promise<any> {
    const config = REPORT_TABLE_CONFIG[reportName];
    if (!config) {
      throw new NotFoundError(`Unknown report: ${reportName}`);
    }

    // Whitelist check
    const invalidFields = Object.keys(fields).filter(
      (f) => !config.allowedFields.includes(f)
    );
    if (invalidFields.length > 0) {
      throw new ValidationError(
        `Fields not writable on ${reportName}: ${invalidFields.join(", ")}`
      );
    }

    // Automatically parse date strings (YYYY-MM-DD) into Date objects, mimicking date coercion
    const processedFields: any = { ...fields };
    for (const key of Object.keys(processedFields)) {
      const val = processedFields[key];
      if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
        processedFields[key] = new Date(val);
      }
    }

    const whereClause = this.buildWhere(orderId, reportName, recordKey);
    const createData = this.buildCreateData(orderId, reportName, recordKey, processedFields);

    return prisma[config.prismaModel as any].upsert({
      where: whereClause,
      update: processedFields,
      create: createData,
    });
  }

  // ── Testing Balancing Trials Helpers ──────────────────────────────────────
  async getTrials(orderId: string): Promise<any[]> {
    return prisma.testingBalancingTrial.findMany({
      where: { orderId },
      orderBy: { trialRunNumber: "asc" },
    });
  }

  async createTrial(orderId: string, data: any): Promise<any> {
    return prisma.testingBalancingTrial.create({
      data: {
        ...data,
        orderId,
      },
    });
  }

  async updateTrial(trialId: string, data: any): Promise<any> {
    return prisma.testingBalancingTrial.update({
      where: { id: trialId },
      data,
    });
  }

  async deleteTrial(trialId: string): Promise<any> {
    return prisma.testingBalancingTrial.delete({
      where: { id: trialId },
    });
  }

  // ── Deviations Helpers ────────────────────────────────────────────────────
  async getDeviations(orderId: string): Promise<any[]> {
    return prisma.inspectionMeasurement.findMany({
      where: {
        orderId,
        OR: [
          { deviationApproved: true },
          {
            OR: [{ remark: false }, { remarkAfterRework: false }],
            OR: [
              { deviationApproved: null },
              { deviationApproved: false },
            ],
          },
        ],
      },
      include: {
        decidedBy: { select: { id: true, name: true } },
      },
    });
  }

  async approveDeviation(
    orderId: string,
    measurementKey: string,
    userId: string,
    deviationRemark?: string
  ): Promise<any> {
    const measurement = await prisma.inspectionMeasurement.findUnique({
      where: {
        orderId_measurementKey: {
          orderId,
          measurementKey,
        },
      },
    });

    if (!measurement) {
      throw new NotFoundError(
        `Measurement "${measurementKey}" not found for order ${orderId}`
      );
    }

    const isPending =
      (measurement.remark === false || measurement.remarkAfterRework === false) &&
      measurement.deviationApproved !== true;

    if (!isPending) {
      throw new ValidationError(
        `Measurement "${measurementKey}" is not up for deviation review.`
      );
    }

    return prisma.inspectionMeasurement.update({
      where: {
        orderId_measurementKey: {
          orderId,
          measurementKey,
        },
      },
      data: {
        deviationApproved: true,
        decidedById: userId,
        decidedAt: new Date(),
        deviationRemark: deviationRemark ?? null,
      },
    });
  }

  async listOrdersPendingDeviationApproval(requestingUser: any): Promise<any[]> {
    let visibleZones: string[] | "ALL" = "ALL";

    if (!requestingUser.isAdmin) {
      const prefix = "orders:view_zone_";
      visibleZones = requestingUser.permissions
        .filter((p: string) => p.startsWith(prefix))
        .map((p: string) => p.substring(prefix.length).toUpperCase());

      if (visibleZones.length === 0) {
        return [];
      }
    }

    // 1. Find distinct orderIds matching derived pending deviation condition
    const measurements = await prisma.inspectionMeasurement.findMany({
      where: {
        OR: [{ remark: false }, { remarkAfterRework: false }],
        OR: [
          { deviationApproved: null },
          { deviationApproved: false },
        ],
      },
      select: { orderId: true },
      distinct: ["orderId"],
    });
    const orderIds = measurements.map((m) => m.orderId);

    // 2. Fetch those orders, filtered to orderStage = ONGOING, with customer name and matching zone
    const orderWhereClause: any = {
      id: { in: orderIds },
      orderStage: "ONGOING",
    };

    if (visibleZones !== "ALL") {
      orderWhereClause.zone = { in: visibleZones as any };
    }

    const orders = await prisma.order.findMany({
      where: orderWhereClause,
      include: { customer: { select: { customerName: true } } },
    });

    // 3. For each order, look up its "deviations" report_log status
    const reportLogs = await prisma.orderReportLog.findMany({
      where: {
        orderId: { in: orders.map((o) => o.id) },
        reportName: "deviations",
      },
    });
    const statusByOrderId = new Map(reportLogs.map((r) => [r.orderId, r.status]));

    // Filter out orders where the deviations report is already COMPLETED
    const pendingOrders = orders.filter(
      (o) => statusByOrderId.get(o.id) !== "COMPLETED"
    );

    return pendingOrders.map((order) => ({
      orderId: order.id,
      jo: order.jo,
      rma: order.rma,
      customerName: order.customer?.customerName || "—",
      deviationsReportStatus: statusByOrderId.get(order.id) ?? "NOT_STARTED",
    }));
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  private buildBaseWhere(orderId: string, reportName: string): any {
    const where: any = { orderId };
    if (reportName === "old_bearing_report") {
      where.isNew = false;
    } else if (reportName === "new_bearing_report") {
      where.isNew = true;
    }
    return where;
  }

  private buildWhere(
    orderId: string,
    reportName: string,
    recordKey?: Record<string, any>
  ): any {
    const config = REPORT_TABLE_CONFIG[reportName];
    if (!config) {
      throw new NotFoundError(`Unknown report: ${reportName}`);
    }

    if (!config.multiRow) {
      return { orderId };
    }

    if (!recordKey) {
      throw new ValidationError(
        `recordKey is required for multi-row report: ${reportName}`
      );
    }

    // Validate that recordKey contains all required keys
    for (const key of config.recordKeyFields) {
      if (recordKey[key] === undefined) {
        throw new ValidationError(`recordKey missing required field: ${key}`);
      }
    }

    if (config.prismaModel === "bearing") {
      const isNew = reportName === "new_bearing_report";
      return {
        orderId_isNew_position: {
          orderId,
          isNew,
          position: recordKey.position,
        },
      };
    }

    if (config.prismaModel === "inspectionMeasurement") {
      return {
        orderId_measurementKey: {
          orderId,
          measurementKey: recordKey.measurementKey,
        },
      };
    }

    if (config.prismaModel === "electricalTestMeasurement") {
      return {
        orderId_testKey: {
          orderId,
          testKey: recordKey.testKey,
        },
      };
    }

    throw new ValidationError(`Unknown mapping for model: ${config.prismaModel}`);
  }

  private buildCreateData(
    orderId: string,
    reportName: string,
    recordKey: Record<string, any> | undefined,
    fields: Record<string, any>
  ): any {
    const config = REPORT_TABLE_CONFIG[reportName];
    if (!config) {
      throw new NotFoundError(`Unknown report: ${reportName}`);
    }

    const data: any = {
      ...fields,
      orderId,
    };

    if (config.multiRow) {
      if (!recordKey) {
        throw new ValidationError(
          `recordKey is required for multi-row report: ${reportName}`
        );
      }
      for (const key of config.recordKeyFields) {
        data[key] = recordKey[key];
      }
    }

    if (config.prismaModel === "bearing") {
      data.isNew = reportName === "new_bearing_report";
    }

    return data;
  }
}
