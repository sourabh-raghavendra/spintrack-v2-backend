-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "reportName" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notes_orderId_reportName_idx" ON "notes"("orderId", "reportName");

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
