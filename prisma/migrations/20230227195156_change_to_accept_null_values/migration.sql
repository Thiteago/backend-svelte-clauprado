-- DropForeignKey
ALTER TABLE "Aluguel" DROP CONSTRAINT "Aluguel_pagamentoId_fkey";

-- AlterTable
ALTER TABLE "Aluguel" ALTER COLUMN "pagamentoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Aluguel" ADD CONSTRAINT "Aluguel_pagamentoId_fkey" FOREIGN KEY ("pagamentoId") REFERENCES "Pagamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;
