-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('PHOTO', 'VIDEO', 'AUDIO', 'FILE');

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "reportName" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "mediaType" "MediaType" NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "media_orderId_reportName_idx" ON "media"("orderId", "reportName");

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
