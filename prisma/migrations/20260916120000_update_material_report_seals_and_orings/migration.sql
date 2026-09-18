-- Data & Schema Migration: Add SEAL and O_RING, add JSON columns, migrate MECHANICAL_SEAL rows

ALTER TYPE "BearingPosition" ADD VALUE IF NOT EXISTS 'SEAL';
ALTER TYPE "BearingPosition" ADD VALUE IF NOT EXISTS 'O_RING';

ALTER TABLE "bearings" ADD COLUMN IF NOT EXISTS "seals" JSONB;
ALTER TABLE "bearings" ADD COLUMN IF NOT EXISTS "oRings" JSONB;

-- Migrate existing MECHANICAL_SEAL records into seals JSON array
UPDATE "bearings"
SET "seals" = jsonb_build_array(
  jsonb_build_object(
    'id', gen_random_uuid()::text,
    'seal', 'Mechanical Seal',
    'details', COALESCE("details", ''),
    'quantity', COALESCE("quantity", '')
  )
),
"position" = 'SEAL',
"details" = NULL,
"quantity" = NULL
WHERE "position" = 'MECHANICAL_SEAL';
