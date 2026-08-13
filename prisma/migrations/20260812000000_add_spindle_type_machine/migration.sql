CREATE TYPE "SpindleType" AS ENUM ('BELT_DRIVEN', 'DIRECT_DRIVEN', 'GEAR_DRIVEN', 'INTEGRATED');
ALTER TABLE "spindles" ALTER COLUMN "type" TYPE "SpindleType" USING type::"SpindleType";
ALTER TABLE "spindles" ADD COLUMN "machine" TEXT;