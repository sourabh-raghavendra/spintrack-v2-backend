/*
  Warnings:

  - The `remark` column on the `in_process_inspection` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `remarkAfterRework` column on the `in_process_inspection` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "in_process_inspection" DROP COLUMN "remark",
ADD COLUMN     "remark" BOOLEAN,
DROP COLUMN "remarkAfterRework",
ADD COLUMN     "remarkAfterRework" BOOLEAN;
