/*
  Warnings:

  - You are about to drop the column `pagamentoId` on the `Aluguel` table. All the data in the column will be lost.
  - You are about to drop the column `data_venda` on the `Venda` table. All the data in the column will be lost.
  - You are about to drop the column `pagamentoId` on the `Venda` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Venda` table. All the data in the column will be lost.
  - You are about to drop the `_AluguelToProduto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProdutoToVenda` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[produtoId]` on the table `Aluguel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pedidoId]` on the table `Pagamento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[produtoId]` on the table `Venda` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `produtoId` to the `Aluguel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pedidoId` to the `Pagamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `produtoId` to the `Venda` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Aluguel" DROP CONSTRAINT "Aluguel_pagamentoId_fkey";

-- DropForeignKey
ALTER TABLE "Venda" DROP CONSTRAINT "Venda_pagamentoId_fkey";

-- DropForeignKey
ALTER TABLE "Venda" DROP CONSTRAINT "Venda_userId_fkey";

-- DropForeignKey
ALTER TABLE "_AluguelToProduto" DROP CONSTRAINT "_AluguelToProduto_A_fkey";

-- DropForeignKey
ALTER TABLE "_AluguelToProduto" DROP CONSTRAINT "_AluguelToProduto_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProdutoToVenda" DROP CONSTRAINT "_ProdutoToVenda_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProdutoToVenda" DROP CONSTRAINT "_ProdutoToVenda_B_fkey";

-- AlterTable
ALTER TABLE "Aluguel" DROP COLUMN "pagamentoId",
ADD COLUMN     "produtoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Pagamento" ADD COLUMN     "pedidoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Venda" DROP COLUMN "data_venda",
DROP COLUMN "pagamentoId",
DROP COLUMN "userId",
ADD COLUMN     "produtoId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_AluguelToProduto";

-- DropTable
DROP TABLE "_ProdutoToVenda";

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "data_pedido" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'Pendente',
    "valor" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Aluguel_produtoId_key" ON "Aluguel"("produtoId");

-- CreateIndex
CREATE UNIQUE INDEX "Pagamento_pedidoId_key" ON "Pagamento"("pedidoId");

-- CreateIndex
CREATE UNIQUE INDEX "Venda_produtoId_key" ON "Venda"("produtoId");

-- AddForeignKey
ALTER TABLE "Aluguel" ADD CONSTRAINT "Aluguel_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
