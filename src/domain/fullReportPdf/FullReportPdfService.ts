// Path: server/src/domain/fullReportPdf/FullReportPdfService.ts
import prisma from "../../config/database";
import { ReportFieldService } from "../reportLog/ReportFieldService";
import { REPORT_FIELD_LABELS, REPORT_DISPLAY_TITLES } from "./reportFieldLabels";

const reportFieldService = new ReportFieldService();

export class FullReportPdfService {
  async assembleFullReportData(orderId: string) {
    const order = await prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      include: {
        customer: { select: { customerName: true } },
        spindle: {
          select: {
            make: true,
            type: true,
            serialNumber: true,
            taper: { select: { taperType: true } },
          },
        },
      },
    });

    const sections: {
      reportName: string;
      title: string;
      kind: "flat" | "multiRow";
      rows: { label: string; value: string }[][];
    }[] = [];

    for (const reportName of [
      "incoming_alert",
      "checksheet",
      "damage_report",
      "drawbar_details",
      "final_inspection",
      "testing_balancing",
      "order_closure",
      "remarks_for_customer",
    ]) {
      const record = await reportFieldService.readReport(orderId, reportName);
      const labels = REPORT_FIELD_LABELS[reportName] ?? {};
      const rows = Object.entries(labels).map(([key, label]) => ({
        key,
        label,
        value: formatValue(record?.[key]),
      }));
      sections.push({
        reportName,
        title: REPORT_DISPLAY_TITLES[reportName] ?? reportName,
        kind: "flat",
        rows: [rows],
      });
    }

    for (const reportName of ["old_bearing_report", "new_bearing_report"]) {
      const records = await reportFieldService.readReport(orderId, reportName);
      const rows = (records ?? []).map((r: any) => [
        { key: "position", label: "Position", value: formatValue(r.position) },
        { key: "arrangement", label: "Arrangement", value: formatValue(r.arrangement) },
        { key: "details", label: "Details", value: formatValue(r.details) },
        { key: "quantity", label: "Quantity", value: formatValue(r.quantity) },
      ]);
      sections.push({
        reportName,
        title: REPORT_DISPLAY_TITLES[reportName] ?? reportName,
        kind: "multiRow",
        rows,
      });
    }

    const measurements = await reportFieldService.readReport(orderId, "in_process_inspection");
    const taperEntry = (measurements ?? []).find((m: any) => m.measurementKey === "taperType");
    let taperName: string | null = null;
    if (taperEntry?.actualValue) {
      const taper = await prisma.taper.findUnique({ where: { id: taperEntry.actualValue as string } });
      taperName = taper?.taperType ?? null;
    }

    sections.push({
      reportName: "in_process_inspection",
      title: "In Process Inspection",
      kind: "multiRow",
      rows: (measurements ?? []).map((m: any) => [
        { key: "measurementKey", label: "Key", value: formatKeyLabel(m.measurementKey) },
        { key: "dia", label: "Dia", value: formatValue(m.dia) },
        { key: "permissibleValues", label: "Permissible Values", value: formatArrayValue(m.permissibleValues) },
        {
          key: "actualValue",
          label: "Before R/W",
          value: m.measurementKey === "taperType" && taperName ? taperName : formatArrayValue(m.actualValue),
        },
        { key: "remark", label: "Remark", value: formatValue(m.remark) },
        { key: "valueAfterRework", label: "After R/W", value: formatArrayValue(m.valueAfterRework) },
        { key: "remarkAfterRework", label: "Remark After R/W", value: formatValue(m.remarkAfterRework) },
      ]),
    });

    const electrical = await reportFieldService.readReport(orderId, "electrical_test");
    sections.push({
      reportName: "electrical_test",
      title: "Electrical Test",
      kind: "multiRow",
      rows: (electrical ?? []).map((e: any) => [
        { label: "Test", value: formatValue(e.testKey) },
        { label: "Spec", value: formatValue(e.specValue) },
        { label: "Before Rework", value: formatValue(e.beforeRework) },
        { label: "After Rework", value: formatValue(e.afterRework) },
      ]),
    });

    const trials = await prisma.testingBalancingTrial.findMany({
      where: { orderId },
      orderBy: { createdAt: "asc" },
    });
    sections.push({
      reportName: "testing_balancing_trials",
      title: "Testing and Balancing — Trial Rows",
      kind: "multiRow",
      rows: trials.map((t) => [
        { label: "Trial Run", value: formatValue(t.trialRunNumber) },
        { label: "RPM", value: formatValue(t.rpm) },
        { label: "Temp", value: formatValue(t.temp) },
        { label: "Vibration Front", value: formatValue(t.vibrationFront) },
        { label: "Vibration Rear", value: formatValue(t.vibrationRear) },
        { label: "Amp", value: formatValue(t.amp) },
        { label: "Voltage", value: formatValue(t.voltage) },
        { label: "Time", value: formatValue(t.time) },
      ]),
    });

    const deviationRows = (measurements ?? []).filter(
      (m: any) => m.remark === false || m.remarkAfterRework === false
    );
    sections.push({
      reportName: "deviations",
      title: "Deviations",
      kind: "multiRow",
      rows: deviationRows.map((m: any) => [
        { label: "Key", value: formatValue(m.measurementKey) },
        { label: "Approved", value: m.deviationApproved === true ? "Yes" : "Pending" },
        { label: "Remark", value: formatValue(m.deviationRemark) },
      ]),
    });

    const personnelSections: { title: string; rows: { role: string; name: string }[] }[] = [];
    for (const reportName of [
      "checksheet",
      "damage_report",
      "final_inspection",
      "testing_balancing",
      "electrical_test",
      "in_process_inspection",
    ]) {
      const entries = await prisma.reportPersonnel.findMany({
        where: { orderId, reportName },
        include: { user: { select: { name: true } } },
      });
      if (entries.length > 0) {
        personnelSections.push({
          title: `${REPORT_DISPLAY_TITLES[reportName] ?? reportName} — Personnel`,
          rows: entries.map((e) => ({ role: e.role, name: e.user.name })),
        });
      }
    }

    const notes = await prisma.note.findMany({
      where: { orderId },
      include: { createdBy: { select: { name: true } } },
      orderBy: { createdAt: "asc" },
    });

    return {
      orderMeta: {
        jo: order.jo,
        rma: order.rma,
        so: order.so,
        quotation: order.quotation,
        customerName: order.customer.customerName,
        spindleMake: order.spindle.make,
        spindleSerial: order.spindle.serialNumber,
        taperType: order.spindle.taper?.taperType ?? "—",
      },
      sections,
      personnelSections,
      notes: notes.map((n) => ({
        reportName: n.reportName,
        reportTitle: REPORT_DISPLAY_TITLES[n.reportName] ?? n.reportName,
        content: n.content,
        author: n.createdBy.name,
        createdAt: n.createdAt.toLocaleDateString("en-GB") + " " + n.createdAt.toLocaleTimeString("en-GB", { hour: "numeric", minute: "2-digit" }),
      })),
    };
  }
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (v instanceof Date) return v.toLocaleDateString("en-GB"); // DD/MM/YYYY
  return String(v);
}

function formatArrayValue(v: unknown): string {
  if (!Array.isArray(v)) return formatValue(v);
  const nonEmpty = v.filter((x) => x !== null && x !== undefined && x !== "");
  return nonEmpty.length > 0 ? nonEmpty.join(", ") : "—";
}

function formatKeyLabel(key: string): string {
  if (!key) return "—";
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .trim();
}
