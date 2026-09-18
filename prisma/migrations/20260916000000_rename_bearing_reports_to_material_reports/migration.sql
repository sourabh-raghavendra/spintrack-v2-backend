-- Data Migration: Rename old_bearing_report and new_bearing_report to old_material_report and new_material_report

-- Update order_report_log table
UPDATE "order_report_log"
SET "reportName" = 'old_material_report'
WHERE "reportName" = 'old_bearing_report';

UPDATE "order_report_log"
SET "reportName" = 'new_material_report'
WHERE "reportName" = 'new_bearing_report';

-- Update permissions table
UPDATE "permissions"
SET "key" = 'old_material_report:write',
    "description" = 'Write access to the Old Material Report report'
WHERE "key" = 'old_bearing_report:write';

UPDATE "permissions"
SET "key" = 'new_material_report:write',
    "description" = 'Write access to the New Material Report report'
WHERE "key" = 'new_bearing_report:write';
