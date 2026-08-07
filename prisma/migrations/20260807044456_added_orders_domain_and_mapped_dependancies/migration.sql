-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('REPAIR_ISR', 'REPAIR_SSR', 'MANUFACTURING');

-- CreateEnum
CREATE TYPE "OrderStage" AS ENUM ('RECEIVED', 'ONGOING', 'COMPLETED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "rma" TEXT NOT NULL,
    "so" TEXT NOT NULL,
    "jo" TEXT NOT NULL,
    "quotation" TEXT NOT NULL,
    "orderType" "OrderType" NOT NULL,
    "orderStage" "OrderStage" NOT NULL DEFAULT 'RECEIVED',
    "spindleReceivedDate" TIMESTAMP(3),
    "zone" "Zone" NOT NULL,
    "customerId" TEXT NOT NULL,
    "spindleId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_rma_key" ON "orders"("rma");

-- CreateIndex
CREATE UNIQUE INDEX "orders_so_key" ON "orders"("so");

-- CreateIndex
CREATE UNIQUE INDEX "orders_jo_key" ON "orders"("jo");

-- CreateIndex
CREATE UNIQUE INDEX "orders_quotation_key" ON "orders"("quotation");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_spindleId_fkey" FOREIGN KEY ("spindleId") REFERENCES "spindles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
