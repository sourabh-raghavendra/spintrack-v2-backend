/*
  Warnings:

  - The values [MECHANICAL_SEAL] on the enum `BearingPosition` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BearingPosition_new" AS ENUM ('FRONT_1', 'FRONT_2', 'REAR_1', 'REAR_2', 'SEAL', 'O_RING');
ALTER TABLE "bearings" ALTER COLUMN "position" TYPE "BearingPosition_new" USING ("position"::text::"BearingPosition_new");
ALTER TYPE "BearingPosition" RENAME TO "BearingPosition_old";
ALTER TYPE "BearingPosition_new" RENAME TO "BearingPosition";
DROP TYPE "public"."BearingPosition_old";
COMMIT;
