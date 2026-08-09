-- CreateEnum
CREATE TYPE "BearingPosition" AS ENUM ('FRONT_1', 'FRONT_2', 'REAR_1', 'REAR_2', 'MECHANICAL_SEAL');

-- CreateEnum
CREATE TYPE "DeviationStatus" AS ENUM ('NONE', 'PENDING', 'APPROVED');

-- CreateTable
CREATE TABLE "bearings" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "isNew" BOOLEAN NOT NULL,
    "position" "BearingPosition" NOT NULL,
    "arrangement" TEXT,
    "details" TEXT,
    "quantity" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bearings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checksheet" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "spindleCondition" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checksheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "damage_report" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "bearingDamage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "damage_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deviations" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "deviationApprovalStatus" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deviations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drawbar_details" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "arrangement" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drawbar_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "electrical_test" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "electrical_test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "final_inspection" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "blueMatching" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "final_inspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "in_process_inspection" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "measurementKey" TEXT NOT NULL,
    "dia" JSONB,
    "permissibleValues" JSONB,
    "actualValue" JSONB,
    "remark" TEXT,
    "valueAfterRework" JSONB,
    "remarkAfterRework" TEXT,
    "deviationStatus" "DeviationStatus" NOT NULL DEFAULT 'NONE',
    "flaggedById" TEXT,
    "flaggedAt" TIMESTAMP(3),
    "decidedById" TEXT,
    "decidedAt" TIMESTAMP(3),
    "deviationRemark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "in_process_inspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incoming_alert" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "spindleIssue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incoming_alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_closure" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "closureDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_closure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "remarks_for_customer" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "remarks_for_customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testing_balancing" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "stabilizedTemperature" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testing_balancing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testing_balancing_trials" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "trialRunNumber" TEXT,
    "rpm" TEXT,
    "temp" TEXT,
    "vibrationFront" TEXT,
    "vibrationRear" TEXT,
    "amp" TEXT,
    "voltage" TEXT,
    "time" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "testing_balancing_trials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bearings_orderId_isNew_position_key" ON "bearings"("orderId", "isNew", "position");

-- CreateIndex
CREATE UNIQUE INDEX "checksheet_orderId_key" ON "checksheet"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "damage_report_orderId_key" ON "damage_report"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "deviations_orderId_key" ON "deviations"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "drawbar_details_orderId_key" ON "drawbar_details"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "electrical_test_orderId_key" ON "electrical_test"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "final_inspection_orderId_key" ON "final_inspection"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "in_process_inspection_orderId_measurementKey_key" ON "in_process_inspection"("orderId", "measurementKey");

-- CreateIndex
CREATE UNIQUE INDEX "incoming_alert_orderId_key" ON "incoming_alert"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "order_closure_orderId_key" ON "order_closure"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "remarks_for_customer_orderId_key" ON "remarks_for_customer"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "testing_balancing_orderId_key" ON "testing_balancing"("orderId");

-- AddForeignKey
ALTER TABLE "bearings" ADD CONSTRAINT "bearings_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checksheet" ADD CONSTRAINT "checksheet_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "damage_report" ADD CONSTRAINT "damage_report_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deviations" ADD CONSTRAINT "deviations_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "drawbar_details" ADD CONSTRAINT "drawbar_details_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "electrical_test" ADD CONSTRAINT "electrical_test_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "final_inspection" ADD CONSTRAINT "final_inspection_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "in_process_inspection" ADD CONSTRAINT "in_process_inspection_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "in_process_inspection" ADD CONSTRAINT "in_process_inspection_flaggedById_fkey" FOREIGN KEY ("flaggedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "in_process_inspection" ADD CONSTRAINT "in_process_inspection_decidedById_fkey" FOREIGN KEY ("decidedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incoming_alert" ADD CONSTRAINT "incoming_alert_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_closure" ADD CONSTRAINT "order_closure_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "remarks_for_customer" ADD CONSTRAINT "remarks_for_customer_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testing_balancing" ADD CONSTRAINT "testing_balancing_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testing_balancing_trials" ADD CONSTRAINT "testing_balancing_trials_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
