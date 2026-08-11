/*
  Warnings:

  - You are about to drop the column `deviationStatus` on the `in_process_inspection` table. All the data in the column will be lost.
  - You are about to drop the column `flaggedAt` on the `in_process_inspection` table. All the data in the column will be lost.
  - You are about to drop the column `flaggedById` on the `in_process_inspection` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "in_process_inspection" DROP CONSTRAINT "in_process_inspection_flaggedById_fkey";

-- AlterTable
ALTER TABLE "in_process_inspection" DROP COLUMN "deviationStatus",
DROP COLUMN "flaggedAt",
DROP COLUMN "flaggedById",
ADD COLUMN     "deviationApproved" BOOLEAN;

-- DropEnum
DROP TYPE "DeviationStatus";
