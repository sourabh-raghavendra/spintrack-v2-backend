-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('NOT_STARTED', 'ONGOING', 'COMPLETED');

-- CreateTable
CREATE TABLE "order_report_log" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "reportName" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "openedAt" TIMESTAMP(3),
    "openedById" TEXT,
    "closedAt" TIMESTAMP(3),
    "closedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_report_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_report_log_orderId_reportName_key" ON "order_report_log"("orderId", "reportName");

-- AddForeignKey
ALTER TABLE "order_report_log" ADD CONSTRAINT "order_report_log_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_report_log" ADD CONSTRAINT "order_report_log_openedById_fkey" FOREIGN KEY ("openedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_report_log" ADD CONSTRAINT "order_report_log_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
