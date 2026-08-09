import { IReportRecordRepository } from "../../domain/reportLog/IReportRecordRepository";
import { BearingPosition } from "../../generated/prisma/client";
import prisma from "../../config/database";

export class ReportRecordRepository implements IReportRecordRepository {
  async createBlankIncomingAlert(orderId: string): Promise<any> {
    return prisma.incomingAlert.create({
      data: { orderId },
    });
  }

  async createBlankChecksheet(orderId: string): Promise<any> {
    return prisma.checksheet.create({
      data: { orderId },
    });
  }

  async createBlankDamageReport(orderId: string): Promise<any> {
    return prisma.damageReport.create({
      data: { orderId },
    });
  }

  async createBlankBearings(orderId: string, isNew: boolean): Promise<any> {
    const positions: BearingPosition[] = [
      "FRONT_1",
      "FRONT_2",
      "REAR_1",
      "REAR_2",
      "MECHANICAL_SEAL",
    ];
    return prisma.bearing.createMany({
      data: positions.map((position) => ({
        orderId,
        isNew,
        position,
      })),
      skipDuplicates: true,
    });
  }

  async createBlankElectricalTest(orderId: string): Promise<any> {
    return prisma.electricalTest.create({
      data: { orderId },
    });
  }

  async createBlankDrawbarDetails(orderId: string): Promise<any> {
    return prisma.drawbarDetails.create({
      data: { orderId },
    });
  }

  async createBlankFinalInspection(orderId: string): Promise<any> {
    return prisma.finalInspection.create({
      data: { orderId },
    });
  }

  async createBlankTestingBalancing(orderId: string): Promise<any> {
    return prisma.testingBalancing.create({
      data: { orderId },
    });
  }

  async createBlankRemarksForCustomer(orderId: string): Promise<any> {
    return prisma.remarksForCustomer.create({
      data: { orderId },
    });
  }

  async createBlankOrderClosure(orderId: string): Promise<any> {
    return prisma.orderClosure.create({
      data: { orderId },
    });
  }
}
