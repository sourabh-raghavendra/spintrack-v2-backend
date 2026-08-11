-- CreateTable
CREATE TABLE "report_personnel" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "reportName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_personnel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "report_personnel_orderId_reportName_role_userId_key" ON "report_personnel"("orderId", "reportName", "role", "userId");

-- AddForeignKey
ALTER TABLE "report_personnel" ADD CONSTRAINT "report_personnel_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_personnel" ADD CONSTRAINT "report_personnel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
