-- AlterTable
ALTER TABLE "checksheet" ADD COLUMN     "box" TEXT,
ADD COLUMN     "cylinder" TEXT,
ADD COLUMN     "drawbar" TEXT,
ADD COLUMN     "proxySwitch" TEXT,
ADD COLUMN     "pulley" TEXT,
ADD COLUMN     "speedSensor" TEXT,
ADD COLUMN     "tenon" TEXT,
ADD COLUMN     "toolHolder" TEXT;

-- AlterTable
ALTER TABLE "damage_report" ADD COLUMN     "drawbarColletes" TEXT,
ADD COLUMN     "encoderDamage" TEXT,
ADD COLUMN     "mechanicalSeal" TEXT,
ADD COLUMN     "oRings" TEXT,
ADD COLUMN     "pulleyDamage" TEXT,
ADD COLUMN     "rotaryUnion" TEXT,
ADD COLUMN     "sensorsDamage" TEXT,
ADD COLUMN     "shaftOdDamage" TEXT,
ADD COLUMN     "shaftTaper" TEXT,
ADD COLUMN     "spacerDistanceSleeve" TEXT,
ADD COLUMN     "springDamage" TEXT,
ADD COLUMN     "tenonDamage" TEXT;

-- AlterTable
ALTER TABLE "drawbar_details" ADD COLUMN     "beforeDismantlingClampingForce" TEXT,
ADD COLUMN     "drawBarArrangementHeight" TEXT,
ADD COLUMN     "drawBarArrangementId" TEXT,
ADD COLUMN     "drawBarArrangementLength" TEXT,
ADD COLUMN     "drawBarArrangementOd" TEXT,
ADD COLUMN     "drawBarArrangementQuantity" TEXT,
ADD COLUMN     "drawBarArrangementThickness" TEXT;

-- AlterTable
ALTER TABLE "final_inspection" ADD COLUMN     "afterGrindingROofShaft" TEXT,
ADD COLUMN     "axialFloat" TEXT,
ADD COLUMN     "axialPlay" TEXT,
ADD COLUMN     "bearingStackLength" TEXT,
ADD COLUMN     "boreRO" TEXT,
ADD COLUMN     "clampingForceFinal" TEXT,
ADD COLUMN     "faceROHSK" TEXT,
ADD COLUMN     "frontBearingTool" TEXT,
ADD COLUMN     "goNoGo" TEXT,
ADD COLUMN     "housingDepth" TEXT,
ADD COLUMN     "mandrelRO300WithDrawbar" JSONB,
ADD COLUMN     "mandrelRO300WithStud" JSONB,
ADD COLUMN     "preloadOfCover" TEXT,
ADD COLUMN     "radialPlay" TEXT,
ADD COLUMN     "rearBearingTolerance" TEXT,
ADD COLUMN     "rearSideRO" TEXT,
ADD COLUMN     "spacerSizeOfNNBearing" TEXT,
ADD COLUMN     "taperOdRunout" TEXT,
ADD COLUMN     "totalShaftHeightAfterRework" TEXT;

-- AlterTable
ALTER TABLE "incoming_alert" ADD COLUMN     "customerPaymentPending" BOOLEAN,
ADD COLUMN     "dispatchWithoutClearance" BOOLEAN,
ADD COLUMN     "dispatchWithoutClearanceReason" TEXT,
ADD COLUMN     "financeApproval" BOOLEAN,
ADD COLUMN     "firstTimeCustomer" BOOLEAN,
ADD COLUMN     "salesApproval" BOOLEAN;

-- AlterTable
ALTER TABLE "order_closure" ADD COLUMN     "financeApprovalClosure" BOOLEAN,
ADD COLUMN     "invoiceDate" TIMESTAMP(3),
ADD COLUMN     "invoiceNo" TEXT,
ADD COLUMN     "outstandingBalanceClosure" TEXT,
ADD COLUMN     "packId" TEXT,
ADD COLUMN     "warrantyValidTill" TIMESTAMP(3);
