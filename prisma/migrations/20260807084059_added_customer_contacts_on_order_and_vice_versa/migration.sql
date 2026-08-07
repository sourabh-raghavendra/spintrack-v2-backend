-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "customerContactId" TEXT;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerContactId_fkey" FOREIGN KEY ("customerContactId") REFERENCES "customer_contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
