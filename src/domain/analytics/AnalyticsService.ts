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
    const rawGrouped = await prisma.reportPersonnel.groupBy({
      by: ["userId", "role"],
      where: { order: { orderType: { in: ["REPAIR_ISR", "REPAIR_SSR"] }, ...dateFilter(range) } },
      _count: { id: true },
    });

    const userIds = [...new Set(rawGrouped.map((r) => r.userId))];

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { id: { in: userIds } },
          { userType: "TECHNICIAN", isActive: true },
        ],
      },
      select: { id: true, name: true, department: true },
      orderBy: { name: "asc" },
    });

    const roleKeysInDb = [...new Set(rawGrouped.map((r) => r.role))];
    const knownRoleKeys = [
      "cleaned_by",
      "checked_by",
      "dismantled_by",
      "dismantle_supported_by",
      "assembly_done_by",
      "assembly_supported_by",
      "testing_checked_by",
      "testing_approved_by",
      "inspected_by",
    ];

    const allRoleKeys = [...new Set([...knownRoleKeys, ...roleKeysInDb])];

    const getRoleLabel = (role: string) => {
      const known: Record<string, string> = {
        cleaned_by: "Cleaned By",
        checked_by: "Checked By",
        dismantled_by: "Dismantled By",
        dismantle_supported_by: "Dismantle Supported By",
        assembly_done_by: "Assembly Done By",
        assembly_supported_by: "Assembly Supported By",
        testing_checked_by: "Testing Checked By",
        testing_approved_by: "Testing Approved By",
        inspected_by: "Inspected By",
      };
      return known[role] || role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const columns = [
      { key: "technicianName", label: "Technician" },
      { key: "department", label: "Department" },
      ...allRoleKeys.map((role) => ({ key: role, label: getRoleLabel(role) })),
      { key: "total", label: "Total" },
    ];

    const countsMap = new Map<string, Map<string, number>>();
    for (const r of rawGrouped) {
      if (!countsMap.has(r.userId)) {
        countsMap.set(r.userId, new Map());
      }
      countsMap.get(r.userId)!.set(r.role, r._count.id);
    }

    const rows = users.map((u) => {
      const userCounts = countsMap.get(u.id);
      const rowObj: Record<string, unknown> = {
        technicianName: u.name,
        department: u.department,
      };

      let total = 0;
      for (const role of allRoleKeys) {
        const count = userCounts?.get(role) ?? 0;
        rowObj[role] = count;
        total += count;
      }

      rowObj.total = total;
      return rowObj;
    });

    return { columns, rows };
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
