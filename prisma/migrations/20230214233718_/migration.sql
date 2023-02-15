/*
  Warnings:

  - You are about to drop the column `userId` on the `Venda` table. All the data in the column will be lost.
  - You are about to drop the `ProdutoAluguel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProdutoVenda` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProdutoAluguelToVenda` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProdutoVendaToVenda` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `valor` to the `Venda` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Venda" DROP CONSTRAINT "Venda_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ProdutoAluguelToVenda" DROP CONSTRAINT "_ProdutoAluguelToVenda_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProdutoAluguelToVenda" DROP CONSTRAINT "_ProdutoAluguelToVenda_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProdutoVendaToVenda" DROP CONSTRAINT "_ProdutoVendaToVenda_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProdutoVendaToVenda" DROP CONSTRAINT "_ProdutoVendaToVenda_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Ativo';

-- AlterTable
ALTER TABLE "Venda" DROP COLUMN "userId",
ADD COLUMN     "quantidadeEmEstoque" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "tipo" TEXT NOT NULL DEFAULT 'Venda',
ADD COLUMN     "valor" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "ProdutoAluguel";

-- DropTable
DROP TABLE "ProdutoVenda";

-- DropTable
DROP TABLE "_ProdutoAluguelToVenda";

-- DropTable
DROP TABLE "_ProdutoVendaToVenda";

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataFabricacao" TIMESTAMP(3) NOT NULL,
    "dataPublicacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "quantidadeEmEstoque" INTEGER NOT NULL DEFAULT 1,
    "peso" DOUBLE PRECISION NOT NULL,
    "altura" TEXT NOT NULL,
    "largura" TEXT NOT NULL,
    "comprimento" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "imagens" TEXT[],

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aluguel" (
    "id" SERIAL NOT NULL,
    "data_aluguel" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_disponibilidade" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_expiracao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status_aluguel" TEXT NOT NULL DEFAULT 'Disponivel',
    "dias_alugados" INTEGER NOT NULL DEFAULT 0,
    "valor" DOUBLE PRECISION NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'Aluguel',
    "pagamentoId" INTEGER NOT NULL,

    CONSTRAINT "Aluguel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProdutoToVenda" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AluguelToProduto" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProdutoToVenda_AB_unique" ON "_ProdutoToVenda"("A", "B");

-- CreateIndex
CREATE INDEX "_ProdutoToVenda_B_index" ON "_ProdutoToVenda"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AluguelToProduto_AB_unique" ON "_AluguelToProduto"("A", "B");

-- CreateIndex
CREATE INDEX "_AluguelToProduto_B_index" ON "_AluguelToProduto"("B");

-- AddForeignKey
ALTER TABLE "Aluguel" ADD CONSTRAINT "Aluguel_pagamentoId_fkey" FOREIGN KEY ("pagamentoId") REFERENCES "Pagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProdutoToVenda" ADD CONSTRAINT "_ProdutoToVenda_A_fkey" FOREIGN KEY ("A") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProdutoToVenda" ADD CONSTRAINT "_ProdutoToVenda_B_fkey" FOREIGN KEY ("B") REFERENCES "Venda"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AluguelToProduto" ADD CONSTRAINT "_AluguelToProduto_A_fkey" FOREIGN KEY ("A") REFERENCES "Aluguel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AluguelToProduto" ADD CONSTRAINT "_AluguelToProduto_B_fkey" FOREIGN KEY ("B") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
