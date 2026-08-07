/*
  Warnings:

  - Added the required column `createdById` to the `spindles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "spindles" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "spindles" ADD CONSTRAINT "spindles_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
