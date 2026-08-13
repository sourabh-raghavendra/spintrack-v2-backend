// Path: server/src/domain/analytics/AnalyticsService.ts
import prisma from "../../config/database";

interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

function dateFilter({ startDate, endDate }: DateRange) {
  if (!startDate && !endDate) return {};
  return {
    spindleReceivedDate: {
      ...(startDate && { gte: startDate }),
      ...(endDate && { lte: endDate }),
    },
  };
}

export class AnalyticsService {
  async technicianActivity(range: DateRange) {
    const rows = await prisma.reportPersonnel.groupBy({
      by: ["userId", "role"],
      where: { order: { orderType: { in: ["REPAIR_ISR", "REPAIR_SSR"] }, ...dateFilter(range) } },
      _count: { id: true },
    });
    const userIds = [...new Set(rows.map((r) => r.userId))];
    const users = await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true } });
    const nameById = new Map(users.map((u) => [u.id, u.name]));
    return rows.map((r) => ({
      technicianName: nameById.get(r.userId) ?? "Unknown",
      activity: r.role,
      activityCount: r._count.id,
    }));
  }

  async customerWiseRepairs(range: DateRange) {
    const rows = await prisma.order.groupBy({
      by: ["customerId"],
      where: { orderType: { in: ["REPAIR_ISR", "REPAIR_SSR"] }, ...dateFilter(range) },
      _count: { id: true },
    });
    const customerIds = rows.map((r) => r.customerId);
    const customers = await prisma.customer.findMany({ where: { id: { in: customerIds } }, select: { id: true, customerName: true } });
    const nameById = new Map(customers.map((c) => [c.id, c.customerName]));
    return rows
      .map((r) => ({ customerName: nameById.get(r.customerId) ?? "Unknown", repairCount: r._count.id }))
      .sort((a, b) => b.repairCount - a.repairCount);
  }

  async top10Customers(range: DateRange) {
    const rows = await prisma.order.groupBy({
      by: ["customerId"],
      where: dateFilter(range),
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    });
    const customerIds = rows.map((r) => r.customerId);
    const customers = await prisma.customer.findMany({ where: { id: { in: customerIds } }, select: { id: true, customerName: true } });
    const nameById = new Map(customers.map((c) => [c.id, c.customerName]));
    return rows.map((r) => ({ customerName: nameById.get(r.customerId) ?? "Unknown", orderCount: r._count.id }));
  }

  async machineWiseSpindles(range: DateRange) {
    const orders = await prisma.order.findMany({
      where: dateFilter(range),
      select: { spindle: { select: { machine: true } } },
    });
    const counts = new Map<string, number>();
    for (const o of orders) {
      const key = o.spindle.machine?.trim() || "Not Specified";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([machine, count]) => ({ machine, spindleCount: count }))
      .sort((a, b) => b.spindleCount - a.spindleCount);
  }

  async orderTypeBreakdown(range: DateRange) {
    const rows = await prisma.order.groupBy({
      by: ["orderType"],
      where: dateFilter(range),
      _count: { id: true },
    });
    return rows.map((r) => ({ orderType: r.orderType, count: r._count.id }));
  }

  async spindleMakeWiseRepairs(range: DateRange) {
    const orders = await prisma.order.findMany({
      where: { orderType: { in: ["REPAIR_ISR", "REPAIR_SSR"] }, ...dateFilter(range) },
      select: { spindle: { select: { make: true } } },
    });
    const counts = new Map<string, number>();
    for (const o of orders) {
      const key = o.spindle.make || "Unknown";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([make, count]) => ({ make, repairCount: count }))
      .sort((a, b) => b.repairCount - a.repairCount);
  }

  async taperWiseReport(range: DateRange) {
    const orders = await prisma.order.findMany({
      where: dateFilter(range),
      select: { spindle: { select: { taper: { select: { taperType: true } } } } },
    });
    const counts = new Map<string, number>();
    for (const o of orders) {
      const key = o.spindle.taper?.taperType ?? "Unspecified";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([taperType, count]) => ({ taperType, orderCount: count }))
      .sort((a, b) => b.orderCount - a.orderCount);
  }

  async underWarrantyRepairs(range: DateRange) {
    const orders = await prisma.order.findMany({
      where: { isUnderWarranty: true, orderType: { in: ["REPAIR_ISR", "REPAIR_SSR"] }, ...dateFilter(range) },
      select: { id: true, jo: true, rma: true, spindle: { select: { serialNumber: true, make: true } } },
    });
    return orders.map((o) => ({
      orderId: o.id,
      jo: o.jo,
      rma: o.rma,
      spindleSerial: o.spindle.serialNumber,
      spindleMake: o.spindle.make,
    }));
  }
}
