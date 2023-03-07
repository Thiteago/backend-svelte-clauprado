-- CreateTable
CREATE TABLE "Cartao" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "validade" TEXT NOT NULL,
    "bandeira" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "data_criado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pagamentoId" INTEGER NOT NULL,

    CONSTRAINT "Cartao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cartao_pagamentoId_key" ON "Cartao"("pagamentoId");

-- AddForeignKey
ALTER TABLE "Cartao" ADD CONSTRAINT "Cartao_pagamentoId_fkey" FOREIGN KEY ("pagamentoId") REFERENCES "Pagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
