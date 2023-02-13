/*
  Warnings:

  - You are about to drop the column `boleto` on the `Pagamento` table. All the data in the column will be lost.
  - You are about to drop the column `cartao` on the `Pagamento` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Venda` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pagamento" DROP COLUMN "boleto",
DROP COLUMN "cartao";

-- AlterTable
ALTER TABLE "Venda" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Boleto" (
    "id" SERIAL NOT NULL,
    "data_venc" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "nomePDF" TEXT NOT NULL,
    "pagamentoId" INTEGER NOT NULL,

    CONSTRAINT "Boleto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Boleto_pagamentoId_key" ON "Boleto"("pagamentoId");

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boleto" ADD CONSTRAINT "Boleto_pagamentoId_fkey" FOREIGN KEY ("pagamentoId") REFERENCES "Pagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
