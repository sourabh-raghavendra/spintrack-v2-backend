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
    fields: Record<string, any>
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

    const whereClause = this.buildWhere(orderId, reportName, recordKey);
    const createData = this.buildCreateData(orderId, reportName, recordKey, fields);

    return prisma[config.prismaModel as any].upsert({
      where: whereClause,
      update: fields,
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
        deviationStatus: {
          in: ["PENDING", "APPROVED"],
        },
      },
      include: {
        flaggedBy: { select: { id: true, name: true } },
        decidedBy: { select: { id: true, name: true } },
      },
    });
  }

  async flagDeviation(
    orderId: string,
    measurementKey: string,
    userId: string
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

    if (measurement.deviationStatus !== "NONE") {
      throw new ConflictError(
        `Measurement "${measurementKey}" is already flagged or approved as a deviation`
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
        deviationStatus: "PENDING",
        flaggedById: userId,
        flaggedAt: new Date(),
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

    if (measurement.deviationStatus !== "PENDING") {
      throw new ValidationError(
        `Measurement "${measurementKey}" must be in PENDING status before it can be approved`
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
        deviationStatus: "APPROVED",
        decidedById: userId,
        decidedAt: new Date(),
        deviationRemark: deviationRemark ?? null,
      },
    });
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
