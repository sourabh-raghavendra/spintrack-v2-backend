interface ReportTableConfig {
  prismaModel: string;       // Accessor on prisma client, e.g. "checksheet"
  recordKeyFields: string[]; // key columns beyond orderId identifying a single row
  allowedFields: string[];   // whitelisted columns for writes
  multiRow: boolean;         // true for bearings and inspection measurements
}

export const REPORT_TABLE_CONFIG: Record<string, ReportTableConfig> = {
  incoming_alert: {
    prismaModel: "incomingAlert",
    recordKeyFields: [],
    allowedFields: ["spindleIssue"],
    multiRow: false,
  },
  checksheet: {
    prismaModel: "checksheet",
    recordKeyFields: [],
    allowedFields: ["spindleCondition"],
    multiRow: false,
  },
  damage_report: {
    prismaModel: "damageReport",
    recordKeyFields: [],
    allowedFields: ["bearingDamage"],
    multiRow: false,
  },
  electrical_test: {
    prismaModel: "electricalTest",
    recordKeyFields: [],
    allowedFields: ["remark"],
    multiRow: false,
  },
  drawbar_details: {
    prismaModel: "drawbarDetails",
    recordKeyFields: [],
    allowedFields: ["arrangement"],
    multiRow: false,
  },
  final_inspection: {
    prismaModel: "finalInspection",
    recordKeyFields: [],
    allowedFields: ["blueMatching"],
    multiRow: false,
  },
  remarks_for_customer: {
    prismaModel: "remarksForCustomer",
    recordKeyFields: [],
    allowedFields: ["remark"],
    multiRow: false,
  },
  order_closure: {
    prismaModel: "orderClosure",
    recordKeyFields: [],
    allowedFields: ["closureDate"],
    multiRow: false,
  },
  testing_balancing: {
    prismaModel: "testingBalancing",
    recordKeyFields: [],
    allowedFields: ["stabilizedTemperature"],
    multiRow: false,
  },

  old_bearing_report: {
    prismaModel: "bearing",
    recordKeyFields: ["position"],
    allowedFields: ["arrangement", "details", "quantity"],
    multiRow: true,
  },
  new_bearing_report: {
    prismaModel: "bearing",
    recordKeyFields: ["position"],
    allowedFields: ["arrangement", "details", "quantity"],
    multiRow: true,
  },
  in_process_inspection: {
    prismaModel: "inspectionMeasurement",
    recordKeyFields: ["measurementKey"],
    allowedFields: [
      "dia",
      "permissibleValues",
      "actualValue",
      "remark",
      "valueAfterRework",
      "remarkAfterRework",
    ],
    multiRow: true,
  },
};
