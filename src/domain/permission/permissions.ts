// src/domain/permission/permissions.ts
//
// Single source of truth for every permission key in the system.
// Seed-only — there is no admin-editable permission list, matching the
// ADR decision carried over from societyPlus (see 002-pbac-over-rbac).
//
// Zone-view permissions are derived from the Zone enum below rather than
// hardcoded twice, so adding a zone later (still a migration either way)
// only means updating ZONES in one place.
//
// `<domain>:manage` permissions are a FRONTEND VISIBILITY GATE ONLY —
// holding `<domain>:manage` is what makes that section appear in
// navigation at all. It does not replace the finer create/read/update
// permissions below it, which still individually gate the actual
// backend actions. Backend routes do not need to check `<domain>:manage`
// — it's consumed purely from the permission list already returned at
// login, by the frontend.

// ── Reports ───────────────────────────────────────────────────────────
// This is the authoritative list of report sections, taken directly from
// the legacy Mongo `reportCompletionStatus` breakdown. This same array
// drives:
//   - the permission key per report (`<report>:write`)
//   - the allowed values for `order_report_log.report_name`
// Keep these two usages in sync — if a report is added/removed here, both
// derive from this one array automatically.

export const REPORTS = [
  "incoming_alert",
  "checksheet",
  "damage_report",
  "old_bearing_report",
  "new_bearing_report",
  "electrical_test",
  "drawbar_details",
  "in_process_inspection",
  "final_inspection",
  "testing_balancing",
  "remarks_for_customer",
  "deviations",
  "order_closure",
] as const;

export type ReportName = (typeof REPORTS)[number];

// ── Zones ─────────────────────────────────────────────────────────────
// Mirrors the Zone enum in enums.prisma. Kept as a plain string array
// here (rather than importing the generated Prisma enum) so this file
// has no dependency on the generated client — it needs to be importable
// by the seeder before/independently of client generation timing.

export const ZONES = ["WISC", "SISC", "NISC"] as const;

// ── Permission keys ───────────────────────────────────────────────────

export const PERMISSIONS = {
  // Spindles — no delete; physical asset records are never removed
  SPINDLES_MANAGE: "spindles:manage",
  SPINDLES_CREATE: "spindles:create",
  SPINDLES_READ: "spindles:read",
  SPINDLES_UPDATE: "spindles:update",

  // Orders (Job Order / sales entry)
  ORDERS_MANAGE: "orders:manage",
  ORDERS_CREATE: "orders:create",
  ORDERS_READ: "orders:read",
  ORDERS_UPDATE: "orders:update",
  ORDERS_CANCEL: "orders:cancel",
  ORDERS_GENERATE_PDF: "orders:generate_pdf",

  // Zone-scoped order visibility — one per zone, derived below
  ...Object.fromEntries(
    ZONES.map((zone) => [
      `ORDERS_VIEW_ZONE_${zone}`,
      `orders:view_zone_${zone.toLowerCase()}`,
    ]),
  ),

  // Reports — umbrella visibility gate, plus one write permission per
  // report section (derived below)
  REPORTS_MANAGE: "reports:manage",
  ...Object.fromEntries(
    REPORTS.map((report) => [
      `REPORT_${report.toUpperCase()}_WRITE`,
      `${report}:write`,
    ]),
  ),

  // Media (internal upload/delete — read is implied by order visibility)
  MEDIA_MANAGE: "media:manage",
  MEDIA_UPLOAD: "media:upload",
  MEDIA_DELETE: "media:delete",

  // Notes (internal, per order/report)
  NOTES_MANAGE: "notes:manage",
  NOTES_WRITE: "notes:write",

  // Tapers — admin config screen, single permission covers manage
  TAPERS_MANAGE: "tapers:manage",

  // Users (employee management)
  USERS_MANAGE: "users:manage",
  USERS_CREATE: "users:create",
  USERS_READ: "users:read",
  USERS_UPDATE: "users:update",
  USERS_DEACTIVATE: "users:deactivate",
  USERS_RESET_PASSWORD: "users:reset_password",
  USERS_ASSIGN_PERMISSIONS: "users:assign_permissions",

  // Customers (CRM)
  CUSTOMERS_MANAGE: "customers:manage",
  CUSTOMERS_CREATE: "customers:create",
  CUSTOMERS_READ: "customers:read",
  CUSTOMERS_UPDATE: "customers:update",
  CUSTOMERS_DEACTIVATE: "customers:deactivate",

  // Customer contacts (also the customer-portal login identity)
  CUSTOMER_CONTACTS_MANAGE: "customer_contacts:manage",
  CUSTOMER_CONTACTS_CREATE: "customer_contacts:create",
  CUSTOMER_CONTACTS_READ: "customer_contacts:read",
  CUSTOMER_CONTACTS_UPDATE: "customer_contacts:update",
  CUSTOMER_CONTACTS_DEACTIVATE: "customer_contacts:deactivate",

  // Email logs — system writes these automatically; this permission
  // gates viewing the log, not sending
  EMAIL_LOGS_MANAGE: "email_logs:manage",
  EMAIL_LOGS_READ: "email_logs:read",

  // Notifications — sending a notification is a deliberate action;
  // reading your own notifications requires no permission
  NOTIFICATIONS_MANAGE: "notifications:manage",
  NOTIFICATIONS_SEND: "notifications:send",

  // Analytics — separate domain, not nested under customers/orders/etc.
  ANALYTICS_MANAGE: "analytics:manage",
  ANALYTICS_VIEW_CUSTOMERS: "analytics:view_customers", // top-10, 3yr count
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
