-- AlterTable
ALTER TABLE "drawbar_details" RENAME COLUMN "arrangement" TO "drawBarArrangement";
ALTER TABLE "drawbar_details" RENAME COLUMN "beforeDismantlingClampingForce" TO "clampingForceBeforeAssembly";

ALTER TABLE "drawbar_details" ADD COLUMN     "drawBarArrangementAfterAssembly" TEXT,
ADD COLUMN     "drawBarArrangementOdAfterAssembly" TEXT,
ADD COLUMN     "drawBarArrangementIdAfterAssembly" TEXT,
ADD COLUMN     "drawBarArrangementThicknessAfterAssembly" TEXT,
ADD COLUMN     "drawBarArrangementHeightAfterAssembly" TEXT,
ADD COLUMN     "drawBarArrangementQuantityAfterAssembly" TEXT,
ADD COLUMN     "drawBarArrangementLengthAfterAssembly" TEXT,
ADD COLUMN     "clampingForceAfterAssembly" TEXT;
