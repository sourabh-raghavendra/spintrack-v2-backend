-- CreateTable
CREATE TABLE "spindles" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "taperId" TEXT NOT NULL,
    "maxRpm" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spindles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "spindles_serialNumber_key" ON "spindles"("serialNumber");

-- AddForeignKey
ALTER TABLE "spindles" ADD CONSTRAINT "spindles_taperId_fkey" FOREIGN KEY ("taperId") REFERENCES "tapers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
