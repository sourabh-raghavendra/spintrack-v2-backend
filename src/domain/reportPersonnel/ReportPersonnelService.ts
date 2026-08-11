// Path: server/src/domain/reportPersonnel/ReportPersonnelService.ts
import { ValidationError, ConflictError } from "../../errors/HttpError";
import prisma from "../../config/database";
import { REPORT_PERSONNEL_ROLES } from "./reportPersonnelRoles";

export class ReportPersonnelService {
  async listForReport(orderId: string, reportName: string) {
    return prisma.reportPersonnel.findMany({
      where: { orderId, reportName },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "asc" },
    });
  }

  async addPersonnel(orderId: string, reportName: string, userId: string, role: string) {
    const validRoles = REPORT_PERSONNEL_ROLES[reportName];
    if (!validRoles) {
      throw new ValidationError(`No personnel roles defined for report: ${reportName}`);
    }
    const roleConfig = validRoles.find((r) => r.key === role);
    if (!roleConfig) {
      throw new ValidationError(`Invalid role "${role}" for report ${reportName}`);
    }

    if (!roleConfig.multiple) {
      const existing = await prisma.reportPersonnel.findFirst({
        where: { orderId, reportName, role },
      });
      if (existing) {
        throw new ConflictError(
          `This role already has a person assigned — remove them first, or this role does not allow multiple people`
        );
      }
    }

    try {
      return await prisma.reportPersonnel.create({
        data: { orderId, reportName, role, userId },
        include: { user: { select: { id: true, name: true } } },
      });
    } catch (err: any) {
      if (err.code === "P2002") {
        throw new ConflictError(`This person is already assigned this role on this report`);
      }
      throw err;
    }
  }

  async removePersonnel(id: string) {
    await prisma.reportPersonnel.delete({ where: { id } });
  }

  async getInspectionHistoryForUser(userId: string) {
    const entries = await prisma.reportPersonnel.findMany({
      where: { userId, reportName: "in_process_inspection", role: "inspected_by" },
      include: {
        order: {
          select: {
            id: true,
            rma: true,
            jo: true,
            spindle: { select: { serialNumber: true, make: true, type: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return entries.map((e) => ({
      orderId: e.order.id,
      rma: e.order.rma,
      jo: e.order.jo,
      spindleSerial: e.order.spindle.serialNumber,
      spindleMake: e.order.spindle.make,
      inspectedAt: e.createdAt,
    }));
  }
}
