// Path: server/src/domain/finalInspectionPdf/FinalInspectionPdfService.ts
import prisma from "../../config/database";
import { NotFoundError } from "../../errors/HttpError";

export class FinalInspectionPdfService {
  async assembleData(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: { select: { customerName: true } },
        spindle: { select: { make: true, serialNumber: true } },
      },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // Taper: sourced from the inspection team's recorded reading in
    // in_process_inspection, NOT the spindle's master taperId.
    const taperMeasurement = await prisma.inspectionMeasurement.findUnique({
      where: { orderId_measurementKey: { orderId, measurementKey: "taperType" } },
    });
    const taperId = taperMeasurement?.actualValue as string | undefined;

    const taperSpecs = taperId
      ? await prisma.taperSpec.findMany({ where: { taperId, include: true } })
      : [];

    const finalInspection = await prisma.finalInspection.findUnique({
      where: { orderId },
    });

    // Match: only specs marked include=true AND with a non-null/non-empty value in final_inspection
    const matchedFields = taperSpecs
      .map((spec) => ({
        key: spec.specKey,
        label: spec.label,
        unit: spec.unit,
        min: spec.min,
        max: spec.max,
        value: finalInspection?.[spec.specKey as keyof typeof finalInspection] ?? null,
      }))
      .filter((f) => f.value !== null && f.value !== undefined && f.value !== "");

    const trials = await prisma.testingBalancingTrial.findMany({
      where: { orderId },
      orderBy: { createdAt: "asc" },
    });

    const remarksRaw = (
      await prisma.remarksForCustomer.findUnique({ where: { orderId } })
    )?.remark;
    const remarksList = remarksRaw
      ? remarksRaw.split("\n").filter((line) => line.trim().length > 0)
      : [];

    const taperTypeLabel = taperId
      ? (await prisma.taper.findUnique({ where: { id: taperId } }))?.taperType
      : "—";

    return {
      customerName: order.customer.customerName,
      spindleModel: order.spindle.make,
      serialNumber: order.spindle.serialNumber,
      jobNumber: order.jo || "—",
      taperTypeLabel: taperTypeLabel || "—",
      matchedFields,
      trials,
      remarksList,
    };
  }
}
