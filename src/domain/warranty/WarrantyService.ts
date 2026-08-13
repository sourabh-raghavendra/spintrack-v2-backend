// Path: server/src/domain/warranty/WarrantyService.ts
import prisma from "../../config/database";

export class WarrantyService {
  async getWarrantyStatus(orderId: string) {
    const order = await prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      select: { jo: true },
    });
    const closure = await prisma.orderClosure.findUnique({ where: { orderId } });

    if (!closure?.closureDate || !closure?.warrantyValidTill) {
      return {
        status: "pending" as const,
        closureDate: "",
        warantyValidTill: "",
        jo: order.jo,
        daysRemaining: 0,
        totalDays: 0,
      };
    }

    const now = new Date();
    const closureDate = closure.closureDate;
    const validTill = closure.warrantyValidTill;
    const totalDays = Math.round((validTill.getTime() - closureDate.getTime()) / 86400000);
    const daysRemaining = Math.round((validTill.getTime() - now.getTime()) / 86400000);

    return {
      status: (daysRemaining > 0 ? "active" : "expired") as "active" | "expired",
      closureDate: closureDate.toLocaleDateString("en-GB"),
      warantyValidTill: validTill.toLocaleDateString("en-GB"),
      jo: order.jo,
      daysRemaining: Math.max(0, daysRemaining),
      totalDays,
    };
  }
}
