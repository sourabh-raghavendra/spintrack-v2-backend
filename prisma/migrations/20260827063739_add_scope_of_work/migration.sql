-- CreateTable
CREATE TABLE "order_scope_of_work" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "statementId" TEXT NOT NULL,
    "addedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_scope_of_work_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scope_of_work_statements" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scope_of_work_statements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_scope_of_work_orderId_statementId_key" ON "order_scope_of_work"("orderId", "statementId");

-- CreateIndex
CREATE UNIQUE INDEX "scope_of_work_statements_text_key" ON "scope_of_work_statements"("text");

-- AddForeignKey
ALTER TABLE "order_scope_of_work" ADD CONSTRAINT "order_scope_of_work_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_scope_of_work" ADD CONSTRAINT "order_scope_of_work_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "scope_of_work_statements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_scope_of_work" ADD CONSTRAINT "order_scope_of_work_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
