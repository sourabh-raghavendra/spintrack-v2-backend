-- CreateTable
CREATE TABLE "tapers" (
    "id" TEXT NOT NULL,
    "taperType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tapers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taper_specs" (
    "id" TEXT NOT NULL,
    "taperId" TEXT NOT NULL,
    "specKey" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "min" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "max" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL DEFAULT '',
    "include" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "taper_specs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tapers_taperType_key" ON "tapers"("taperType");

-- CreateIndex
CREATE UNIQUE INDEX "taper_specs_taperId_specKey_key" ON "taper_specs"("taperId", "specKey");

-- AddForeignKey
ALTER TABLE "taper_specs" ADD CONSTRAINT "taper_specs_taperId_fkey" FOREIGN KEY ("taperId") REFERENCES "tapers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
