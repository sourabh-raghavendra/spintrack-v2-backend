// src/infrastructure/database/prisma/seeders/PermissionSeeder.ts
import prisma from "../../../../config/database";
import {
  PERMISSIONS,
  REPORTS,
  ZONES,
} from "../../../../domain/permission/permissions";
import logger from "../../../../observability/logger";

const permissionDescriptions: Record<string, string> = {
  [PERMISSIONS.SPINDLES_MANAGE]:
    "Frontend visibility gate for the Spindles section",
  [PERMISSIONS.SPINDLES_CREATE]: "Create a new spindle master record",
  [PERMISSIONS.SPINDLES_READ]: "View spindle records and history",
  [PERMISSIONS.SPINDLES_UPDATE]: "Update spindle details",

  [PERMISSIONS.ORDERS_MANAGE]:
    "Frontend visibility gate for the Orders section",
  [PERMISSIONS.ORDERS_CREATE]: "Log a new order (sales entry)",
  [PERMISSIONS.ORDERS_READ]: "View order details",
  [PERMISSIONS.ORDERS_UPDATE]: "Update order-level fields",
  [PERMISSIONS.ORDERS_CANCEL]: "Cancel an order",
  [PERMISSIONS.ORDERS_GENERATE_PDF]: "Generate the final report summary PDF",

  [PERMISSIONS.REPORTS_MANAGE]:
    "Frontend visibility gate for the Reports section",

  [PERMISSIONS.MEDIA_MANAGE]: "Frontend visibility gate for the Media section",
  [PERMISSIONS.MEDIA_UPLOAD]: "Upload media/documents to an order",
  [PERMISSIONS.MEDIA_DELETE]: "Delete uploaded media/documents",

  [PERMISSIONS.NOTES_MANAGE]: "Frontend visibility gate for the Notes section",
  [PERMISSIONS.NOTES_WRITE]: "Add internal notes to an order/report",

  [PERMISSIONS.TAPERS_MANAGE]: "Create/update taper types and taper specs",

  [PERMISSIONS.USERS_MANAGE]: "Frontend visibility gate for the Users section",
  [PERMISSIONS.USERS_CREATE]: "Create a new employee user",
  [PERMISSIONS.USERS_READ]: "View employee user records",
  [PERMISSIONS.USERS_UPDATE]: "Update employee user details",
  [PERMISSIONS.USERS_DEACTIVATE]: "Deactivate an employee user",
  [PERMISSIONS.USERS_RESET_PASSWORD]: "Reset any user's password directly",
  [PERMISSIONS.USERS_ASSIGN_PERMISSIONS]:
    "Assign or revoke permissions for a user",

  [PERMISSIONS.CUSTOMERS_MANAGE]:
    "Frontend visibility gate for the Customers section",
  [PERMISSIONS.CUSTOMERS_CREATE]: "Create a new customer",
  [PERMISSIONS.CUSTOMERS_READ]: "View customer records",
  [PERMISSIONS.CUSTOMERS_UPDATE]: "Update customer details",
  [PERMISSIONS.CUSTOMERS_DEACTIVATE]: "Deactivate (soft-delete) a customer",

  [PERMISSIONS.CUSTOMER_CONTACTS_MANAGE]:
    "Frontend visibility gate for the Customer Contacts section",
  [PERMISSIONS.CUSTOMER_CONTACTS_CREATE]:
    "Create a new customer contact (portal login)",
  [PERMISSIONS.CUSTOMER_CONTACTS_READ]: "View customer contact records",
  [PERMISSIONS.CUSTOMER_CONTACTS_UPDATE]: "Update customer contact details",
  [PERMISSIONS.CUSTOMER_CONTACTS_DEACTIVATE]: "Deactivate a customer contact",

  [PERMISSIONS.EMAIL_LOGS_MANAGE]:
    "Frontend visibility gate for the Email Logs section",
  [PERMISSIONS.EMAIL_LOGS_READ]: "View the log of emails sent by the system",

  [PERMISSIONS.NOTIFICATIONS_MANAGE]:
    "Frontend visibility gate for the Notifications section",
  [PERMISSIONS.NOTIFICATIONS_SEND]:
    "Send an in-app notification to users/zones",

  [PERMISSIONS.ANALYTICS_MANAGE]:
    "Frontend visibility gate for the Analytics section",
  [PERMISSIONS.ANALYTICS_VIEW_CUSTOMERS]:
    "View top customers / customer-count analytics",
};

// Derived descriptions for zone-view permissions
for (const zone of ZONES) {
  const key =
    PERMISSIONS[`ORDERS_VIEW_ZONE_${zone}` as keyof typeof PERMISSIONS];
  permissionDescriptions[key] = `View orders belonging to the ${zone} zone`;
}

// Derived descriptions for report-write permissions
const REPORT_LABELS: Record<string, string> = {
  incoming_alert: "Incoming Alert",
  checksheet: "Checksheet",
  damage_report: "Damage Report",
  old_bearing_report: "Old Bearing Report",
  new_bearing_report: "New Bearing Report",
  electrical_test: "Electrical Test",
  drawbar_details: "Drawbar Details",
  in_process_inspection: "In-Process Inspection",
  final_inspection: "Final Inspection",
  testing_balancing: "Testing & Balancing",
  remarks_for_customer: "Remarks for Customer",
  deviations: "Deviations",
  order_closure: "Order Closure",
};
for (const report of REPORTS) {
  const key =
    PERMISSIONS[
      `REPORT_${report.toUpperCase()}_WRITE` as keyof typeof PERMISSIONS
    ];
  permissionDescriptions[key] =
    `Write access to the ${REPORT_LABELS[report]} report`;
}

export async function seedPermissions(): Promise<void> {
  logger.info("Seeding permissions...");

  const permissionKeys = Object.values(PERMISSIONS);

  for (const key of permissionKeys) {
    await prisma.permission.upsert({
      where: { key },
      update: {}, // never overwrite existing
      create: {
        key,
        description: permissionDescriptions[key] ?? null,
      },
    });
  }

  logger.info(`Permissions seeded — ${permissionKeys.length} permissions`);
}
