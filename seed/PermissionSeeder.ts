// src/infrastructure/database/prisma/seeders/PermissionSeeder.ts
//
// Seeds every permission key from src/domain/permission/permissions.ts.
// Idempotent — safe to re-run. Uses `update: {}` on upsert so re-seeding
// never overwrites anything (there's nothing mutable on a Permission row
// besides description, and we don't want re-seeds to clobber a
// hand-edited description either).

import { PrismaClient } from "../src/generated/prisma/client";
import { PERMISSIONS } from "../src/domain/permission/permissions";

const DESCRIPTIONS: Record<string, string> = {
  "spindles:create": "Create a new spindle master record",
  "spindles:read": "View spindle records and history",
  "spindles:update": "Update spindle details",

  "orders:create": "Log a new order (sales entry)",
  "orders:read": "View order details",
  "orders:update": "Update order-level fields",
  "orders:cancel": "Cancel an order",
  "orders:generate_pdf": "Generate the final report summary PDF",

  "media:upload": "Upload media/documents to an order",
  "media:delete": "Delete uploaded media/documents",

  "notes:write": "Add internal notes to an order/report",

  "tapers:manage": "Create/update taper types and taper specs",

  "users:create": "Create a new employee user",
  "users:read": "View employee user records",
  "users:update": "Update employee user details",
  "users:deactivate": "Deactivate an employee user",
  "users:reset_password": "Reset any user's password directly",
  "users:assign_permissions": "Assign or revoke permissions for a user",

  "customers:create": "Create a new customer",
  "customers:read": "View customer records",
  "customers:update": "Update customer details",
  "customers:view_analytics": "View top customers / customer-count analytics",

  "customer_contacts:create": "Create a new customer contact (portal login)",
  "customer_contacts:read": "View customer contact records",
  "customer_contacts:update": "Update customer contact details",
  "customer_contacts:deactivate": "Deactivate a customer contact",

  "email_logs:read": "View the log of emails sent by the system",

  "notifications:send": "Send an in-app notification to users/zones",
};

// Human-readable descriptions for the derived zone-view and report-write
// permissions, generated the same way the keys themselves were derived.
for (const zone of ["WISC", "SISC", "NISC"]) {
  DESCRIPTIONS[`orders:view_zone_${zone.toLowerCase()}`] =
    `View orders belonging to the ${zone} zone`;
}

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
for (const [key, label] of Object.entries(REPORT_LABELS)) {
  DESCRIPTIONS[`${key}:write`] = `Write access to the ${label} report`;
}

export async function seedPermissions(prisma: PrismaClient): Promise<void> {
  const keys = Object.values(PERMISSIONS);

  for (const key of keys) {
    await prisma.permission.upsert({
      where: { key },
      create: {
        key,
        description: DESCRIPTIONS[key] ?? null,
      },
      update: {}, // never overwrite on re-seed
    });
  }

  console.log(`Seeded ${keys.length} permissions.`);
}
