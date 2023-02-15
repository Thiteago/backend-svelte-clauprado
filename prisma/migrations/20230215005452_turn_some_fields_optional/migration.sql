-- DropForeignKey
ALTER TABLE "Venda" DROP CONSTRAINT "Venda_pagamentoId_fkey";

-- AlterTable
ALTER TABLE "Venda" ALTER COLUMN "data_venda" DROP NOT NULL,
ALTER COLUMN "pagamentoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_pagamentoId_fkey" FOREIGN KEY ("pagamentoId") REFERENCES "Pagamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
