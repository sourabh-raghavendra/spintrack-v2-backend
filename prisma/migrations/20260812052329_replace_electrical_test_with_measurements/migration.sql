/*
  Warnings:

  - You are about to drop the `electrical_test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "electrical_test" DROP CONSTRAINT "electrical_test_orderId_fkey";

-- DropTable
DROP TABLE "electrical_test";

-- CreateTable
CREATE TABLE "electrical_test_measurements" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "testKey" TEXT NOT NULL,
    "specValue" TEXT,
    "beforeRework" TEXT,
    "afterRework" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "electrical_test_measurements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "electrical_test_measurements_orderId_testKey_key" ON "electrical_test_measurements"("orderId", "testKey");

-- AddForeignKey
ALTER TABLE "electrical_test_measurements" ADD CONSTRAINT "electrical_test_measurements_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
