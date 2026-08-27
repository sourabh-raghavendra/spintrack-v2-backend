-- AlterEnum
BEGIN;

ALTER TYPE "OrderType" RENAME TO "OrderType_old";

CREATE TYPE "OrderType" AS ENUM ('REPAIR_ISR', 'REPAIR_SSR', 'MANUFACTURING_SIM', 'MANUFACTURING_STM');

ALTER TABLE "orders" ALTER COLUMN "orderType" TYPE "OrderType" USING "orderType"::text::"OrderType";

DROP TYPE "OrderType_old";

COMMIT;
