-- CreateTable
CREATE TABLE "Paypal" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "pagamentoId" INTEGER NOT NULL,

    CONSTRAINT "Paypal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Paypal_pagamentoId_key" ON "Paypal"("pagamentoId");

-- AddForeignKey
ALTER TABLE "Paypal" ADD CONSTRAINT "Paypal_pagamentoId_fkey" FOREIGN KEY ("pagamentoId") REFERENCES "Pagamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
